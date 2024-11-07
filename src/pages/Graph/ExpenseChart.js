import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const ExpenseChart = ({ data, onCategoryClick }) => {
    const categories = Object.keys(data);
    const amounts = Object.values(data);

    const chartData = {
        labels: categories,
        datasets: [
            {
                label: 'Dépenses par catégorie',
                data: amounts,
                backgroundColor: [
                    '#4a90e2',
                    '#50e3c2',
                    '#f39c12',
                    '#e74c3c',
                    '#9b59b6'
                ],
                hoverOffset: 4
            }
        ]
    };

    const optionsChart = {
        plugins: {
            legend: { display: false },
            datalabels: {
                formatter: (value, context) => {
                    const formattedValue = value.toFixed(2);
                    return `${context.chart.data.labels[context.dataIndex]}: ${formattedValue} €`;
                },
                color: '#130c4d'
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selectedCategory = categories[index];
                onCategoryClick(selectedCategory);
            } else {
                onCategoryClick(null);  // Si aucun élément n'est cliqué
            }
        }
    };

    return (
        <div>
            <Pie data={chartData} options={optionsChart} width={300} height={200} />
        </div>
    );
};

export default ExpenseChart;
