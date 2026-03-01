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
	const { ukAvg, selected, delta } = getComparison({
		level,
		quarter,
		geography,
		metric,
	});

	const noData = ukAvg == null || selected == null;
	const isNational = level === 'national';

	const status = useMemo(
		() => (noData || isNational ? null : deltaStatus(metric, delta)),
		[noData, isNational, metric, delta],
	);

	const deltaText = useMemo(
		() =>
			noData || isNational
				? ''
				: formatDeltaLabel(metric, delta, { baselineLabel: 'UK' }),
		[noData, isNational, metric, delta],
	);

	const traces = useMemo(() => {
		if (noData || isNational) return [];

		const metricLabel = metricNiceName(metric);

		return [
			{
				type: 'bar',
				name: geography,
				x: [geography],
				y: [selected],
				hovertemplate: `${geography}<br>${metricLabel}: ${formatMetricValue(
					metric,
					selected,
				)}<extra></extra>`,
			},
			{
				type: 'bar',
				name: 'UK average',
				x: [geography],
				y: [ukAvg],
				hovertemplate: `UK average<br>${metricLabel}: ${formatMetricValue(
					metric,
					ukAvg,
				)}<extra></extra>`,
			},
		];
	}, [noData, isNational, geography, selected, ukAvg, metric]);

	const layout = useMemo(() => {
		const metricLabel = metricNiceName(metric);

		return {
			barmode: 'group',
			height: 320,
			margin: { l: 50, r: 10, t: 10, b: 45 },
			legend: { orientation: 'h', y: -0.2 },
			yaxis: {
				title: metricLabel,
				tickformat: '.2f', // ✅ keep 2dp
				rangemode: 'tozero',
			},
			annotations:
				noData || isNational
					? []
					: [
							{
								x: geography,
								y: Math.max(selected, ukAvg),
								text: deltaText,
								showarrow: false,
								yanchor: 'bottom',
								font: { size: 12 },
							},
						],
		};
	}, [metric, geography, selected, ukAvg, deltaText, noData, isNational]);

	const badgeClass = useMemo(() => {
		if (!status) return 'bg-gray-50 text-gray-700 border-gray-200';
		return status === 'better'
			? 'bg-green-50 text-green-700 border-green-200'
			: status === 'worse'
				? 'bg-red-50 text-red-700 border-red-200'
				: 'bg-gray-50 text-gray-700 border-gray-200';
	}, [status]);

	const badgeText = useMemo(() => {
		if (!status) return '';
		return status === 'better'
			? 'Better than UK'
			: status === 'worse'
				? 'Worse than UK'
				: 'About the same';
	}, [status]);

	// ✅ Remount on slicer change (most reliable)
	const plotKey = `${level}-${quarter}-${metric}-${geography}`;

	if (noData) {
		return (
			<div className='bg-white/70 rounded-2xl shadow p-4'>
				<h2 className='font-semibold mb-2'>{title}</h2>
				<div className='text-sm opacity-70'>No comparison data available.</div>
			</div>
		);
	}

	if (isNational) {
		return (
			<div className='bg-white/70 rounded-2xl shadow p-4'>
				<h2 className='font-semibold mb-2'>{title}</h2>
				<div className='text-sm opacity-70'>
					Cannot show comparison for national level.
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<div className='flex items-center justify-between mb-2'>
				<h2 className='font-semibold'>{title}</h2>

				<div className={`text-xs px-2 py-1 rounded-full border ${badgeClass}`}>
					{badgeText} · {deltaText}
				</div>
			</div>

			<div className='text-xs opacity-60 mb-4'>
				{metricNiceName(metric)} · Q{quarter} · {geography}
			</div>

			<Plot
				key={plotKey}
				data={traces}
				layout={layout}
				revision={plotKey}
				useResizeHandler
				config={{ displayModeBar: false, responsive: true }}
				style={{ width: '100%', height: '320px' }}
			/>
		</div>
	);
}
