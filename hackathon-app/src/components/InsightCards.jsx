import React from 'react';

//import { insightsEngine } from '../utils/insightsEngine'

export default function InsightCards({ level, quarter, metric }) {
	const placeholders = [
		'Top area (placeholder)',
		'Bottom area (placeholder)',
		'Biggest change (placeholder)',
		'Most volatile (placeholder)',
	];

	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<div className='flex items-baseline justify-between mb-3'>
				<h2 className='font-semibold'>Insights</h2>
				<div className='text-xs opacity-60'>
					{level} • Q{quarter} • {metric}
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
				{placeholders.map((t) => (
					<div key={t} className='bg-white rounded-xl border p-3'>
						<div className='text-sm font-semibold'>{t}</div>
						<div className='text-xs opacity-70 mt-1'>To be implemented</div>
					</div>
				))}
			</div>
		</div>
	);
}
