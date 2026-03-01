import React, { useMemo } from 'react';
import { getInsights } from '../utils/insightsEngine';
import { capitalizeString } from '../utils/capitalizeString';

export default function InsightCards({ level, quarter, metric, allData }) {
	const insights = useMemo(() => {
		return getInsights({ allData: allData ?? [], level, quarter, metric });
	}, [allData, level, quarter, metric]);

	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<div className='flex items-baseline justify-between mb-3'>
				<h2 className='font-semibold'>Insights</h2>
				<div className='text-xs opacity-60'>
					{capitalizeString(level)} • Q{quarter} • {metric}
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
				{insights.map((ins) => (
					<div key={ins.id} className='bg-white rounded-xl border p-3'>
						<div className='text-sm font-semibold'>{ins.title}</div>
						<div className='text-sm mt-1'>{ins.value}</div>
						{ins.subtitle ? (
							<div className='text-xs opacity-70 mt-1'>{ins.subtitle}</div>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}
