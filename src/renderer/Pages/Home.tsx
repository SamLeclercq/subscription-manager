import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ExpenseChart from '../Graph/ExpenseChart';
import './Home.css';
import axios from 'axios';

interface Subscription {
    name: string;
    price: number;
    date: string; // Peut être de type `Date` si vous parsez la date lors de la récupération
    category: string;
    period: 'journalier' | 'hebdomadaire' | 'mensuel' | 'annuel';
    engagementDuration: number;
    engagementUnit: 'jour' | 'semaine' | 'mois' | 'annee';
}

interface ExpenseData {
    [key: string]: number;
}

const Home: React.FC = () => {
    const [expenseData, setExpenseData] = useState<ExpenseData>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryDetailData, setCategoryDetailData] = useState<ExpenseData>({});
    const [period, setPeriod] = useState<'semaine' | 'mois' | 'annee'>('mois');

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get<Subscription[]>('http://localhost:5000/subscriptions');
                calculateExpenses(response.data, period);
            } catch (err) {
                console.error('Erreur lors de la récupération des abonnements:', err);
            }
        };

        fetchSubscriptions();
    }, [period]);

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPeriod(e.target.value as 'semaine' | 'mois' | 'annee');
        setSelectedCategory(null);
        setCategoryDetailData({});
    };

    const calculateRemainingDays = (subscription: Subscription): number => {
        const startDate = new Date(subscription.date);
        const now = new Date();
        const duration = subscription.engagementDuration;
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
                return -1;
        }

        const remainingTime = endDate.getTime() - now.getTime();
        return Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    };

    const calculateDailyCost = (subscription: Subscription): number => {
        const price = subscription.price;
        switch (subscription.period) {
            case 'journalier':
                return price;
            case 'hebdomadaire':
                return price / 7;
            case 'mensuel':
                return price / 30;
            case 'annuel':
                return price / 365;
            default:
                return 0;
        }
    };

    const calculateExpenses = (subscriptions: Subscription[], period: 'semaine' | 'mois' | 'annee') => {
        const periodDays = {
            semaine: 7,
            mois: 30,
            annee: 365,
        };

        const expenses: ExpenseData = {};

        subscriptions.forEach(subscription => {
            const remainingDays = calculateRemainingDays(subscription);

            if (remainingDays <= 0) {
                return;
            }

            const dailyCost = calculateDailyCost(subscription);
            const adjustedCost = dailyCost * periodDays[period];

            expenses[subscription.category] = (expenses[subscription.category] || 0) + adjustedCost;
        });

        setExpenseData(expenses);
    };

    const handleCategoryClick = async (category: string | null) => {
        if (category === null) return;
        setSelectedCategory(category);

        try {
            const response = await axios.get<Subscription[]>('http://localhost:5000/subscriptions');
            const categorySubscriptions = response.data.filter(
                (subscription) => subscription.category === category && calculateRemainingDays(subscription) > 0
            );

            const periodDays = {
                semaine: 7,
                mois: 30,
                annee: 365,
            };

            const categoryData: ExpenseData = categorySubscriptions.reduce((acc: ExpenseData, subscription) => {
                const dailyCost = calculateDailyCost(subscription);
                const adjustedCost = dailyCost * periodDays[period];
                acc[subscription.name] = (acc[subscription.name] || 0) + adjustedCost;
                return acc;
            }, {});

            setCategoryDetailData(categoryData);
        } catch (err) {
            console.error('Erreur lors de la récupération des abonnements par catégorie:', err);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Tableau de Bord des Abonnements</h1>
            <div className="button-container">
                <Link to="/add-subscription" className="card-button">Ajouter un Abonnement</Link>
                <Link to="/view-subscriptions" className="card-button">Voir mes Abonnements</Link>
            </div>
            <div className="period-selector">
                <label htmlFor="period">Période : </label>
                <select id="period" value={period} onChange={handlePeriodChange}>
                    <option value="semaine">Semaine</option>
                    <option value="mois">Mois</option>
                    <option value="annee">An</option>
                </select>
            </div>
            <div className="chart-container">
                <ExpenseChart data={expenseData} onCategoryClick={handleCategoryClick} />
                {selectedCategory && (
                    <div className="chart-container">
                        <ExpenseChart data={categoryDetailData} onCategoryClick={function (category: string | null): void {
                            throw new Error('Function not implemented.');
                        } } />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
