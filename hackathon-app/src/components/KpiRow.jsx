import React from 'react';

export default function KpiRow({ level, quarter, geography }) {
	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
			{[
				'Wellbeing',
				'Anxiety',
				'Lonely ≥ occasionally',
				'Lonely often/sometimes',
			].map((title) => (
				<div key={title} className='bg-white/70 rounded-2xl shadow p-4'>
					<div className='text-xs font-semibold opacity-70'>{title}</div>
					<div className='text-2xl font-bold mt-2'>—</div>
					<div className='text-xs mt-2 opacity-60'>
						{level} • Q{quarter} • {geography || '—'}
					</div>
				</div>
			))}
		</div>
	);
}
