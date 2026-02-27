import React from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

const LonelinessChart = ({ data }) => {
	// Use REGIONS only
	const regionData = data.filter((d) => d.geography_level === 'region');

	// Build quarterly averages using integer quarters
	const quarterlyData = [1, 2, 3, 4]
		.map((q) => {
			const quarterItems = regionData.filter((item) => item.quarter === q);
			if (!quarterItems.length) return null;

			const avgLonely =
				quarterItems.reduce(
					(sum, item) => sum + (item.lonely_at_least_occasionally_pct ?? 0),
					0,
				) / quarterItems.length;

			const avgOften =
				quarterItems.reduce(
					(sum, item) => sum + (item.lonely_often_or_sometimes_pct ?? 0),
					0,
				) / quarterItems.length;

			return {
				quarter: `Q${q}`,
				lonely_at_least_occasionally_pct: Math.round(avgLonely),
				lonely_often_or_sometimes_pct: Math.round(avgOften),
			};
		})
		.filter(Boolean);

	if (!quarterlyData.length) {
		return (
			<div className='bg-white p-6 rounded-lg shadow-lg'>
				<p className='text-gray-600'>No regional data available.</p>
			</div>
		);
	}

	const chartData = {
		labels: quarterlyData.map((item) => item.quarter),
		datasets: [
			{
				label: 'Lonely at least occasionally (%)',
				data: quarterlyData.map(
					(item) => item.lonely_at_least_occasionally_pct,
				),
				borderColor: 'rgba(236, 72, 153, 1)',
				backgroundColor: 'rgba(236, 72, 153, 0.1)',
				borderWidth: 3,
				fill: true,
				tension: 0.4,
				pointRadius: 6,
			},
			{
				label: 'Lonely often or sometimes (%)',
				data: quarterlyData.map((item) => item.lonely_often_or_sometimes_pct),
				borderColor: 'rgba(168, 85, 247, 1)',
				backgroundColor: 'rgba(168, 85, 247, 0.1)',
				borderWidth: 3,
				fill: true,
				tension: 0.4,
				pointRadius: 6,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: 'top' },
			title: {
				display: true,
				text: 'Regional Average Loneliness Trends (2025)',
				font: { size: 16, weight: 'bold' },
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return `${context.dataset.label}: ${context.parsed.y}%`;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 60,
				title: {
					display: true,
					text: 'Percentage (%)',
				},
			},
			x: {
				title: {
					display: true,
					text: 'Quarter',
				},
			},
		},
		interaction: {
			intersect: false,
			mode: 'index',
		},
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-lg'>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default LonelinessChart;
