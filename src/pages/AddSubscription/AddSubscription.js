import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddSubscription.css';

const AddSubscription = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [period, setPeriod] = useState('');
    const [engagementDuration, setEngagementDuration] = useState('');
    const [engagementUnit, setEngagementUnit] = useState('mois'); // Par défaut : mois
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSubscription = { name, price, date, category, period, engagementDuration, engagementUnit };

        try {
            await axios.post('http://localhost:5000/subscriptions', newSubscription);
            alert('Abonnement ajouté avec succès');
            navigate('/view-subscriptions');
        } catch (err) {
            console.error('Erreur lors de l\'ajout de l\'abonnement:', err);
        }
    };

    return (
        <div className="form-container">
            <h1>Ajouter un Abonnement</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom de l'abonnement :</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Prix :</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Date de souscription :</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Catégorie :</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="Divertissements">Divertissement</option>
                        <option value="Transports">Transport</option>
                        <option value="Sports">Sports</option>
                        <option value="Nourriture">Nourriture</option>
                        <option value="Vie courante">Vie Courante</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Période :</label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} required>
                        <option value="">Sélectionnez une période</option>
                        <option value="journalier">Journalier</option>
                        <option value="hebdomadaire">Hebdomadaire</option>
                        <option value="mensuel">Mensuel</option>
                        <option value="annuel">Annuel</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Durée d'engagement :</label>
                    <input type="number" value={engagementDuration} onChange={(e) => setEngagementDuration(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Unité de la durée d'engagement :</label>
                    <select value={engagementUnit} onChange={(e) => setEngagementUnit(e.target.value)} required>
                        <option value="jour">Jour(s)</option>
                        <option value="semaine">Semaine(s)</option>
                        <option value="mois">Mois</option>
                        <option value="annee">Année(s)</option>
                    </select>
                </div>
                <div className="button-group">
                    <button type="submit">Ajouter Abonnement</button>
                    <button type="button" onClick={() => navigate('/view-subscriptions')}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default AddSubscription;
