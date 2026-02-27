import React from 'react';

export default function ChoroplethMap({ level, quarter, metric }) {
	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<h2 className='font-semibold mb-2'>Map</h2>
			<div className='text-xs opacity-60 mb-4'>
				{level} • Q{quarter} • {metric}
			</div>
			<div className='h-105 rounded-xl border flex items-center justify-center'>
				<span className='text-sm opacity-70'>
					Plotly choropleth placeholder
				</span>
			</div>
		</div>
	);
}
