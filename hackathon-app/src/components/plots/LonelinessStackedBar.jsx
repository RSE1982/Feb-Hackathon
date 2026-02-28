import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

export default function LonelinessStackedBar({
	title = 'Loneliness distribution',
	level,
	quarter,
	data,
}) {
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
			<div className='h-90 rounded-xl border'>
				<Plot
					data={lonelinessData.traces}
					layout={{
						barmode: 'group',
						title: '',
						xaxis: { title: 'Geography' },
						yaxis: { title: 'Percentage (%)' },
						autosize: true,
						margin: { t: 20, r: 20, b: 60, l: 60 },
						legend: { orientation: 'h', y: -0.2 }
					}}
					style={{ width: '100%', height: '100%' }}
					config={{ responsive: true }}
				/>
			</div>
		</div>
	);
}
