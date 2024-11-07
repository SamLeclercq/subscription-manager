const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/subscriptions')
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

const subscriptionSchema = new mongoose.Schema({
    name: String,
    price: Number,
    date: Date,
    category: String,
    period: String,
    engagementDuration: Number,
    engagementUnit: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

app.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/subscriptions', async (req, res) => {
    const { name, price, date, category, period, engagementDuration, engagementUnit } = req.body;
    const newSubscription = new Subscription({ name, price, date, category, period, engagementDuration, engagementUnit });

    try {
        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour obtenir un abonnement spécifique
app.get('/subscriptions/:id', async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Abonnement non trouvé' });
        }
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour mettre à jour un abonnement spécifique
app.put('/subscriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { price, date, category, period, engagementDuration, engagementUnit } = req.body;

    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            { price, date, category, period, engagementDuration, engagementUnit },
            { new: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Abonnement non trouvé' });
        }

        res.json(updatedSubscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
