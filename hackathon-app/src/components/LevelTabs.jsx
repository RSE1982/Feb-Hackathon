import React from 'react';

export default function LevelTabs({ level, onChange }) {
	return (
		<div className='bg-white/70 rounded-2xl shadow p-4 flex gap-2'>
			{['national', 'country', 'region'].map((lv) => (
				<button
					key={lv}
					type='button'
					onClick={() => onChange?.(lv)}
					className={`px-3 py-2 rounded-lg text-sm font-medium ${
						level === lv ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
					}`}
				>
					{lv[0].toUpperCase() + lv.slice(1)}
				</button>
			))}
		</div>
	);
}
