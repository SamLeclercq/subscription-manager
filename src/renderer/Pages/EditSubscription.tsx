import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSubscription.css';

interface Subscription {
    name: string;
    price: number;
    date: string;
    category: string;
    period: string;
    engagementDuration: number;
    engagementUnit: string;
}

const EditSubscription: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [price, setPrice] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [period, setPeriod] = useState<string>('');
    const [engagementDuration, setEngagementDuration] = useState<string>('');
    const [engagementUnit, setEngagementUnit] = useState<string>('mois');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await axios.get<Subscription>(`http://localhost:5000/subscriptions/${id}`);
                const { price, date, category, period, engagementDuration, engagementUnit, name } = response.data;
                setSubscription({ name, price, date, category, period, engagementDuration, engagementUnit });
                setPrice(price.toString());
                setDate(new Date(date).toISOString().split('T')[0]);
                setCategory(category);
                setPeriod(period);
                setEngagementDuration(engagementDuration.toString());
                setEngagementUnit(engagementUnit);
            } catch (err) {
                console.error("Erreur lors de la récupération de l'abonnement:", err);
            }
        };

        fetchSubscription();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedSubscription = {
            price: parseFloat(price),
            date,
            category,
            period,
            engagementDuration: parseInt(engagementDuration),
            engagementUnit,
        };

        try {
            await axios.put(`http://localhost:5000/subscriptions/${id}`, updatedSubscription);
            alert('Abonnement mis à jour avec succès');
            navigate('/view-subscriptions');
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'abonnement:", err);
        }
    };

    if (!subscription) return <p>Chargement...</p>;

    return (
        <div className="form-container">
            <h1>Modifier Abonnement : {subscription.name}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom de l'abonnement :</label>
                    <input type="text" value={subscription.name} disabled />
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
                    <button type="submit">Valider la modification</button>
                    <button type="button" onClick={() => navigate('/view-subscriptions')}>Retour</button>
                </div>
            </form>
        </div>
    );
};

export default EditSubscription;
