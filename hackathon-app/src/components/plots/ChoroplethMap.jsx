import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useGeoJson } from '../../hooks/useGeoJson';
import { capitalizeString } from '../../utils/capitalizeString';
import { metricNiceName } from '../../utils/metricHelpers';
import { useContainerWidth } from '../../hooks/useContainerWidth';

const quarterToNumber = (q) => {
	if (typeof q === 'number') return q;
	const m = String(q).match(/Q(\d)/i);
	return m ? Number(m[1]) : q;
};

const normaliseRegionName = (name) => {
	if (!name) return name;
	if (name === 'East of England') return 'Eastern';
	return name;
};

export default function ChoroplethMap({ rows = [], level, quarter, metric }) {
	const { geojson, error, loading } = useGeoJson(level);
	const { ref: plotWrapRef, width: plotWrapWidth } = useContainerWidth();

	// ✅ Use a realistic breakpoint
	const isMobile = plotWrapWidth > 0 && plotWrapWidth < 640;

	// Mobile-first spacing
	const bottomMargin = isMobile ? 52 : 85;
	const colorbarY = isMobile ? -0.12 : -0.14; 
	const colorbarLen = isMobile ? 0.98 : 0.95;
	const colorbarThickness = isMobile ? 10 : 15;

	// Plot margins: truly edge-to-edge on mobile
	const margin = isMobile
		? { l: 0, r: 0, t: 0, b: bottomMargin }
		: { l: 10, r: 10, t: 10, b: bottomMargin };

	// Slight zoom-in on mobile to reduce “dead space”
	const projectionScale = isMobile ? 1.12 : 1;

	const qNum = useMemo(() => quarterToNumber(quarter), [quarter]);

	const isMappableLevel = useMemo(
		() => level === 'country' || level === 'region',
		[level],
	);

	const feature = useMemo(() => {
		if (level === 'country')
			return { idKey: 'properties.CTRY24NM', nameProp: 'CTRY24NM' };
		if (level === 'region')
			return { idKey: 'properties.EER13NM', nameProp: 'EER13NM' };
		return { idKey: 'id', nameProp: null };
	}, [level]);

	const slicedRows = useMemo(() => {
		if (!isMappableLevel) return [];
		return rows.filter((r) => {
			const rowLevel = r.geography_level ?? r.level;
			if (rowLevel !== level) return false;
			if (quarterToNumber(r.quarter) !== qNum) return false;
			return true;
		});
	}, [rows, level, qNum, isMappableLevel]);

	const valueByName = useMemo(() => {
		const map = new Map();
		for (const r of slicedRows) {
			let name = r.geography ?? r.name ?? r.code;
			if (!name) continue;
			if (level === 'region') name = normaliseRegionName(name);

			let v;
			if ('metric' in r && 'value' in r) {
				if (r.metric !== metric) continue;
				v = Number(r.value);
			} else {
				v = Number(r[metric]);
			}

			if (!Number.isFinite(v)) continue;
			map.set(name, v);
		}
		return map;
	}, [slicedRows, metric, level]);

	const geoLocations = useMemo(() => {
		if (!geojson?.features || !feature.nameProp) return [];
		return geojson.features
			.map((f) => f?.properties?.[feature.nameProp])
			.filter(Boolean);
	}, [geojson, feature.nameProp]);

	const zValues = useMemo(() => {
		return geoLocations.map((name) => valueByName.get(name) ?? null);
	}, [geoLocations, valueByName]);

	if (!isMappableLevel) {
		return (
			<div className='rounded-xl border bg-white p-4 text-sm text-gray-700'>
				Map is available for <b>Country</b> and <b>Region</b>.
			</div>
		);
	}

	if (error) return <div className='p-4 text-red-600'>GeoJSON error: {error}</div>;
	if (loading || !geojson) return <div className='p-4 text-gray-600'>Loading map…</div>;

	if (geoLocations.length === 0) {
		return (
			<div className='p-4 text-sm text-gray-700'>
				GeoJSON loaded but has no features for level: <b>{level}</b>
			</div>
		);
	}

	return (
		<div
			className={`
				bg-white/70 shadow flex flex-col
				${isMobile ? '-mx-4 rounded-none p-2' : 'rounded-2xl p-4'}
				h-[520px] sm:h-[600px] md:h-[720px]
			`}
		>
			<h2 className='font-semibold mb-2'>Map</h2>

			<div className='text-xs opacity-60 mb-3'>
				{capitalizeString(level)} • Q{quarter} • {metricNiceName(metric)}
			</div>

			<div
				ref={plotWrapRef}
				className={`
					flex-1 min-h-0 bg-white
					${isMobile ? 'p-0 border-0 rounded-none' : 'p-2 border rounded-xl'}
				`}
			>
				<Plot
					data={[
						{
							type: 'choropleth',
							geojson,
							featureidkey: feature.idKey,
							locations: geoLocations,
							z: zValues,
							hovertemplate:
								'%{location}<br>' +
								metricNiceName(metric) +
								': %{z:.2f}<extra></extra>',
							colorbar: {
								title: { text: metricNiceName(metric), side: 'bottom' },
								orientation: 'h',
								x: 0.5,
								xanchor: 'center',
								y: colorbarY,
								yanchor: 'bottom',
								len: colorbarLen,
								thickness: colorbarThickness,
								tickformat: '.2f', // ✅ keep .2f
							},
						},
					]}
					layout={{
						title: null,
						dragmode: false,
						geo: {
							fitbounds: 'locations',
							visible: false,
							projection: { type: 'mercator', scale: projectionScale },
						},
						margin,
						autosize: true,
					}}
					config={{
						displayModeBar: false,
						scrollZoom: false,
						doubleClick: false,
						responsive: true,
					}}
					style={{ width: '100%', height: '100%' }}
					useResizeHandler
				/>
			</div>
		</div>
	);
}