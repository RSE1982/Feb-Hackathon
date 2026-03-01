import React from 'react';
import {capitalizeString} from '../utils/capitalizeString';
/*
 * KpiRow - Key Performance Indicators
 */

export default function KpiRow({ level, quarter, geography, row, prev }) {
	
	const kpis =[
		{ title:'Wellbeing',
			data_value:row?.wellbeing_index??null,
			prev_value:prev?.wellbeing_index,
			higherIsBetter: true,
		},
		{ title:'Anxiety',
			data_value:row?.anxiety??null,
			prev_value:prev?.anxiety,
			higherIsBetter: false,
		},
		{ title:'Lonely ≥ occasionally',
			data_value:row?.lonely_at_least_occasionally_pct??null,
			prev_value:prev?.lonely_at_least_occasionally_pct,
			suffix: "%",
			higherIsBetter: false,
		},
		{ title:'Lonely often/sometimes',
			data_value:row?.lonely_often_or_sometimes_pct?? null,
			prev_value:prev?.lonely_often_or_sometimes_pct,
			suffix: "%",
			higherIsBetter: false,
		},
	];

	const getTrend = (value, prev, higherIsBetter = true) => {
    if (value == null || prev == null) return null;

    const diff = value - prev;

    if (diff === 0) {
      return { arrow: "→", color: "text-gray-400", diff: 0 };
    }

    const isHigher = diff > 0;
    const isPositive =
		(isHigher && higherIsBetter) || (!isHigher && !higherIsBetter);

    return {
      arrow: isHigher ? "↑" : "↓",
      color: isPositive ? "text-green-600" : "text-red-600",
      diff
    };
  };

	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
		{kpis.map((kpi) => {
			const trend = getTrend(kpi.data_value, kpi.prev_value, kpi.higherIsBetter);

			return (
				<div key={kpi.title} className='bg-white/70 rounded-2xl shadow p-4 hover:shadow-lg transition-shadow'>
				<div className='text-xs font-semibold opacity-70'>{kpi.title}</div>

				<div className='text-2xl font-bold mt-2'>
					{kpi.data_value ?? "--"}
					{kpi.data_value != null && kpi.suffix ? kpi.suffix : ""}
					{trend?.arrow && (
					<span className={`ml-2 ${trend.color}`}>
						{trend.arrow}
						<span className="text-sm">
						{typeof trend.diff === "number"	? trend.diff.toFixed(2) : trend.diff}
						</span>
					</span>
					)}
				</div>

				<div className='text-xs mt-2 opacity-60'>
					{capitalizeString(level)} • Q{quarter} • {geography || '—'}
				</div>
				</div>
			);
		})}
		</div>
	);
}
