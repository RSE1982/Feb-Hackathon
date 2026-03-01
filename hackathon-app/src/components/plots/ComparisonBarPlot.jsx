import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

import {
	metricNiceName,
	formatDeltaLabel,
	deltaStatus,
	formatMetricValue,
} from '../../utils/metricHelpers';

export default function ComparisonBarPlot({
	title = 'Comparison',
	level,
	quarter,
	geography,
	metric,
	getComparison,
}) {
	// Hide for national level (nothing to compare against)
	if (level === 'national') return null;

	const { ukAvg, selected, delta } = getComparison({
		level,
		quarter,
		geography,
		metric,
	});

	// Debug (remove once happy)
	// console.log('COMPARE', { level, quarter, geography, metric, ukAvg, selected, delta });

	if (ukAvg == null || selected == null) {
		return (
			<div className='bg-white/70 rounded-2xl shadow p-4'>
				<h2 className='font-semibold mb-2'>{title}</h2>
				<div className='text-sm opacity-70'>No comparison data available.</div>
			</div>
		);
	}

	const status = deltaStatus(metric, delta);
	const deltaText = formatDeltaLabel(metric, delta, { baselineLabel: 'UK' });

	const traces = useMemo(
		() => [
			{
				type: 'bar',
				name: geography,
				x: [geography],
				y: [selected],
				hovertemplate: `${geography}<br>${metricNiceName(metric)}: ${formatMetricValue(
					metric,
					selected,
				)}<extra></extra>`,
			},
			{
				type: 'bar',
				name: 'UK average',
				x: [geography],
				y: [ukAvg],
				hovertemplate: `UK average<br>${metricNiceName(metric)}: ${formatMetricValue(
					metric,
					ukAvg,
				)}<extra></extra>`,
			},
		],
		[geography, selected, ukAvg, metric],
	);

	const layout = useMemo(
		() => ({
			barmode: 'group',
			height: 320,
			margin: { l: 50, r: 10, t: 10, b: 45 },
			legend: { orientation: 'h', y: -0.2 },
			yaxis: {
				title: metricNiceName(metric),
				tickformat: '.1f',
				rangemode: 'tozero',
			},
			annotations: [
				{
					x: geography,
					y: Math.max(selected, ukAvg),
					text: deltaText,
					showarrow: false,
					yanchor: 'bottom',
					font: { size: 12 },
				},
			],
		}),
		[metric, geography, selected, ukAvg, deltaText],
	);

	const badgeClass =
		status === 'better'
			? 'bg-green-50 text-green-700 border-green-200'
			: status === 'worse'
				? 'bg-red-50 text-red-700 border-red-200'
				: 'bg-gray-50 text-gray-700 border-gray-200';

	// ✅ Critical: force Plotly to update
	const plotKey = `${level}-${quarter}-${metric}-${geography}`;

	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<div className='flex items-center justify-between mb-2'>
				<h2 className='font-semibold'>{title}</h2>

				<div className={`text-xs px-2 py-1 rounded-full border ${badgeClass}`}>
					{status === 'better'
						? 'Better than UK'
						: status === 'worse'
							? 'Worse than UK'
							: 'About the same'}{' '}
					· {deltaText}
				</div>
			</div>

			<div className='text-xs opacity-60 mb-4'>
				{metricNiceName(metric)} · Q{quarter} · {geography}
			</div>

			<Plot
				key={plotKey} // ✅ remount on slicer change (most reliable)
				data={traces}
				layout={layout}
				revision={plotKey} // ✅ extra nudge to update if needed
				useResizeHandler // ✅ helps responsive layouts
				config={{ displayModeBar: false, responsive: true }}
				style={{ width: '100%', height: '320px' }}
			/>
		</div>
	);
}
