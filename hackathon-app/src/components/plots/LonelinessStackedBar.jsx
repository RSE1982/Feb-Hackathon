import React from 'react';

export default function LonelinessStackedBar({
	title = 'Loneliness distribution',
}) {
	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<h2 className='font-semibold mb-2'>{title}</h2>
			<div className='h-90 rounded-xl border flex items-center justify-center'>
				<span className='text-sm opacity-70'>
					Plotly stacked bar placeholder
				</span>
			</div>
		</div>
	);
}
