import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import {capitalizeString} from '../../utils/capitalizeString';
export default function LonelinessStackedBar({
	title,
	level,
	quarter,
	data,
}) {
	// Set title
	title = 'Loneliness Distribution ('+capitalizeString(level)+', Q'+quarter+')';
	const lonelinessData = useMemo(() => {
		if (!data || !data.length) return null;

		// Group data by geography for the selected level and quarter
		const groupedData = {};
		data.forEach(item => {
			if (!groupedData[item.geography]) {
				groupedData[item.geography] = {
					often: 0,
					some_time: 0,
					occasionally: 0,
					hardly_ever: 0,
					never: 0
				};
			}
			groupedData[item.geography] = {
				often: item.often || 0,
				some_time: item.some_time || 0,
				occasionally: item.occasionally || 0,
				hardly_ever: item.hardly_ever || 0,
				never: item.never || 0
			};
		});

		const geographies = Object.keys(groupedData);
		
		return {
			geographies,
			traces: [
				{
					name: 'Often',
					x: geographies,
					y: geographies.map(geo => groupedData[geo].often),
					type: 'bar',
					marker: { color: '#ef4444' }
				},
				{
					name: 'Some time',
					x: geographies,
					y: geographies.map(geo => groupedData[geo].some_time),
					type: 'bar',
					marker: { color: '#f97316' }
				},
				{
					name: 'Occasionally',
					x: geographies,
					y: geographies.map(geo => groupedData[geo].occasionally),
					type: 'bar',
					marker: { color: '#eab308' }
				},
				{
					name: 'Hardly ever',
					x: geographies,
					y: geographies.map(geo => groupedData[geo].hardly_ever),
					type: 'bar',
					marker: { color: '#22c55e' }
				},
				{
					name: 'Never',
					x: geographies,
					y: geographies.map(geo => groupedData[geo].never),
					type: 'bar',
					marker: { color: '#3b82f6' }
				}
			]
		};
	}, [data]);

	if (!lonelinessData) {
		return (
			<div className='bg-white/70 rounded-2xl shadow p-4'>
				<h2 className='font-semibold mb-2'>{title}</h2>
				<div className='h-90 rounded-xl border flex items-center justify-center'>
					<span className='text-sm opacity-70'>No data available</span>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<h2 className='font-semibold mb-2'>{title}</h2>
			<div className='h-90 rounded-xl border flex items-center justify-center'>
				<Plot
					data={lonelinessData.traces}
					layout={{
						barmode: 'group',
						title: '',
						xaxis: {
							title: 'Geography',
							automargin: true,
							tickangle: -45, // helps on mobile
							tickfont: { size: 10 }, // helps on mobile
						},
						yaxis: { title: 'Percentage (%)', automargin: true },
						autosize: true,
						margin: { t: 85, r: 16, b: 85, l: 52 }, // more top space for legend
						legend: {
							orientation: 'h',
							x: 0,
							xanchor: 'left',
							y: 1.4, // lift slightly
							yanchor: 'top',
							font: { size: 9 },
							tracegroupgap: 6, // a bit more breathing room if it wraps
						},
						dragmode: false,
					}}
					style={{ width: '98%', height: '98%' }}
					config={{
						responsive: true,
						displayModeBar: false,
						scrollZoom: false,
						doubleClick: false,
					}}
				/>
			</div>
		</div>
	);
}
