import React from 'react';
import { metricNiceName } from '../utils/metricHelpers';

export default function FiltersPanel({
	level,
	quarter,
	onQuarterChange,
	metric,
	onMetricChange,
	geography,
	onGeographyChange,
	quarters = [],
	geographies = [],
	metrics = [
		'wellbeing_index',
		'life_satisfaction',
		'worthwhile',
		'happiness',
		'anxiety',
		'lonely_at_least_occasionally_pct',
		'lonely_often_or_sometimes_pct',
	],
}) {
	return (
		<div className='bg-white/70 rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4'>
			<div>
				<label className='block text-xs font-semibold mb-1'>Level</label>
				<div className='text-sm'>{level}</div>
			</div>

			<div>
				<label className='block text-xs font-semibold mb-1'>Quarter</label>
				<select
					className='w-full border rounded-lg px-2 py-2'
					value={quarter ?? ''}
					onChange={(e) => onQuarterChange?.(Number(e.target.value))}
				>
					{quarters.map((q) => (
						<option key={q} value={q}>
							Q{q}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className='block text-xs font-semibold mb-1'>Metric</label>
				<select
					className='w-full border rounded-lg px-2 py-2'
					value={metric ?? ''}
					onChange={(e) => onMetricChange?.(e.target.value)}
				>
					{metrics.map((m) => (
						<option key={m} value={m}>
							{metricNiceName(m)}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className='block text-xs font-semibold mb-1'>Geography</label>
				<select
					className='w-full border rounded-lg px-2 py-2'
					value={geography ?? ''}
					onChange={(e) => onGeographyChange?.(e.target.value)}
				>
					{geographies.map((g) => (
						<option key={g} value={g}>
							{g}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
