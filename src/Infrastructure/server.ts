import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(`mongodb://localhost:27017/subscriptions`)
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err: Error) => console.error('Erreur de connexion à MongoDB:', err));

// Définition de l'interface pour le schéma d'abonnement
interface ISubscription extends Document {
    name: string;
    price: number;
    date: Date;
    category: string;
    period: string;
    engagementDuration: number;
    engagementUnit: string;
}

// Création du schéma et du modèle Subscription
const subscriptionSchema = new Schema<ISubscription>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    period: { type: String, required: true },
    engagementDuration: { type: Number, required: true },
    engagementUnit: { type: String, required: true },
});

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

// Routes
app.get('/subscriptions', async (req: Request, res: Response) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
});

app.post('/subscriptions', async (req: Request, res: Response) => {
    const { name, price, date, category, period, engagementDuration, engagementUnit } = req.body;
    const newSubscription = new Subscription({ name, price, date, category, period, engagementDuration, engagementUnit });

    try {
        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

app.get('/subscriptions/:id', async (req: Request, res: Response) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Abonnement non trouvé' });
        }
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
});

app.put('/subscriptions/:id', async (req: Request, res: Response) => {
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
        res.status(400).json({ message: (err as Error).message });
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
