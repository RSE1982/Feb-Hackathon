import React from 'react';
import {capitalizeString} from '../utils/capitalizeString';
/*
 * KpiRow - Key Performance Indicators
 */

export default function KpiRow({ level, quarter, geography, row }) {
	
	const kpis =[
		{ title:'Wellbeing', data_value:row?.wellbeing_index??  "--"},
		{ title:'Anxiety', data_value:row?.anxiety?? "--"},
		{ title:'Lonely ≥ occasionally',
			data_value:row?.lonely_at_least_occasionally_pct??  "--",
			suffix: "%"
		},
		{ title:'Lonely often/sometimes',
			data_value:row?.lonely_often_or_sometimes_pct??  "--",
			suffix: "%"
		},
	];
	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
			{kpis.map((kpi) => (
				<div key={kpi.title} className='bg-white/70 rounded-2xl shadow p-4'>
					<div className='text-xs font-semibold opacity-70'>{kpi.title}</div>
					<div className='text-2xl font-bold mt-2'>{kpi.data_value}{kpi.data_value != null && kpi.suffix ? kpi.suffix : ""}</div>
					<div className='text-xs mt-2 opacity-60'>
						{capitalizeString(level)} • Q{quarter} • {geography || '—'}
					</div>
				</div>
			))}
		</div>
	);
}
