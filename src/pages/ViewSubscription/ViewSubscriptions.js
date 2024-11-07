import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewSubscriptions.css';

const ViewSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();

    const handleGoHome = () => navigate('/');

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/subscriptions');
                setSubscriptions(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des abonnements:', err);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleDelete = async (subscriptionId) => {
        try {
            await axios.delete(`http://localhost:5000/subscriptions/${subscriptionId}`);
            setSubscriptions((prev) => prev.filter((sub) => sub._id !== subscriptionId));
            alert('Abonnement supprimé avec succès.');
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'abonnement:', err);
        }
    };

    const handleEdit = (subscriptionId) => {
        navigate(`/edit-subscription/${subscriptionId}`);
    };

    // Fonction pour calculer la durée restante en jours
    const calculateRemainingDays = (subscription) => {
        const startDate = new Date(subscription.date);
        const now = new Date();
        const duration = subscription.engagementDuration;

        // Calculer la date de fin en fonction de l'unité de durée
        let endDate = new Date(startDate);
        switch (subscription.engagementUnit) {
            case 'jour':
                endDate.setDate(startDate.getDate() + duration);
                break;
            case 'semaine':
                endDate.setDate(startDate.getDate() + duration * 7);
                break;
            case 'mois':
                endDate.setMonth(startDate.getMonth() + duration);
                break;
            case 'annee':
                endDate.setFullYear(startDate.getFullYear() + duration);
                break;
            default:
                console.error('Unité de durée non valide:', subscription.engagementUnit);
                return null;
        }

        // Calculer la différence en jours entre la date actuelle et la date de fin
        const remainingTime = endDate - now;
        const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

        return remainingDays > 0 ? `${remainingDays} jour(s) restant(s)` : "Expiré";
    };

    const categorizedSubscriptions = subscriptions.reduce((acc, subscription) => {
        acc[subscription.category] = acc[subscription.category] || [];
        acc[subscription.category].push(subscription);
        return acc;
    }, {});

    const categories = Object.keys(categorizedSubscriptions);

    return (
        <div>
            <h1>Voir mes Abonnements en Cours</h1>
            {subscriptions.length === 0 ? (
                <p>Aucun abonnement à afficher.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {categories.map((category, index) => (
                                <th key={index}>{category}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Math.max(...categories.map(category => categorizedSubscriptions[category].length)) > 0 && (
                            [...Array(Math.max(...categories.map(category => categorizedSubscriptions[category].length)))].map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {categories.map((category, index) => {
                                        const subscription = categorizedSubscriptions[category][rowIndex];
                                        return (
                                            <td key={index} className={`subscription-cell ${subscription ? 'hoverable' : 'empty'}`}>
                                                {subscription ? (
                                                    <>
                                                        <div>
                                                            <strong>Service :</strong> {subscription.name}<br />
                                                            <strong>Prix :</strong> {subscription.price} €<br />
                                                            <strong>Date de souscription :</strong> {new Date(subscription.date).toLocaleDateString()}<br />
                                                            <strong>Période :</strong> {subscription.period}<br />
                                                            <strong>Durée d'engagement :</strong> {subscription.engagementDuration} {subscription.engagementUnit}(s)<br />
                                                            <strong>Durée restante :</strong> {calculateRemainingDays(subscription)}
                                                        </div>
                                                        <div className="button-container">
                                                            <button onClick={() => handleEdit(subscription._id)}>Modifier</button>
                                                            <button onClick={() => handleDelete(subscription._id)}>Supprimer</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span></span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <div className="button-container">
                <button onClick={handleGoHome}>Retour</button>
            </div>
        </div>
    );
};

export default ViewSubscriptions;
