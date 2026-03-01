import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useGeoJson } from '../../hooks/useGeoJson';
<<<<<<< Updated upstream
import { capitalizeString } from '../../utils/capitalizeString';
=======
import { metricNiceName } from '../../utils/metricHelpers';
import { useContainerWidth } from '../../hooks/useContainerWidth';
>>>>>>> Stashed changes

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
	const isMobile = plotWrapWidth > 0 && plotWrapWidth < 768;

	const bottomMargin = isMobile ? 55 : 75;
	const colorbarY = isMobile ? -0.06 : -0.08; // less negative on mobile
	const colorbarLen = isMobile ? 0.85 : 0.6; // wider on mobile
	const colorbarThickness = isMobile ? 12 : 15;

	// ✅ All memos ALWAYS called (order never changes)
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

			// support wide or long rows
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
		// ensures ALL regions/countries draw
		return geoLocations.map((name) => {
			const v = valueByName.get(name);
			return v ?? null; // or 0 if you want a default colour
		});
	}, [geoLocations, valueByName]);

	// ✅ Returns happen AFTER all hooks and memos
	if (!isMappableLevel) {
		return (
			<div className='rounded-xl border bg-white p-4 text-sm text-gray-700'>
				Map is available for <b>Country</b> and <b>Region</b>.
			</div>
		);
	}

	if (error) {
		return <div className='p-4 text-red-600'>GeoJSON error: {error}</div>;
	}

	if (loading || !geojson) {
		return <div className='p-4 text-gray-600'>Loading map…</div>;
	}

	if (geoLocations.length === 0) {
		return (
			<div className='p-4 text-sm text-gray-700'>
				GeoJSON loaded but has no features for level: <b>{level}</b>
			</div>
		);
	}

	return (
		<div className='bg-white/70 rounded-2xl shadow p-4 h-130 md:h-180 flex flex-col'>
			<h2 className='font-semibold mb-2'>Map</h2>
			<div className='text-xs opacity-60 mb-4'>
				{capitalizeString(level)} • Q{quarter} • {metric}
			</div>

			<div
				ref={plotWrapRef}
				className='rounded-xl border bg-white p-2 flex-1 min-h-0'
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
								': %{z:.1f}<extra></extra>',
							colorbar: {
								title: { text: metricNiceName(metric), side: 'top' },
								orientation: 'h',
								x: 0.5,
								xanchor: 'center',
								y: colorbarY,
								yanchor: 'bottom',
								len: colorbarLen,
								thickness: colorbarThickness,
								tickformat: '.1f',
							},
						},
					]}
					layout={{
						title: null, // avoid stealing vertical space
						dragmode: false,
						geo: { fitbounds: 'locations', visible: false },

						// Reserve space for the horizontal colorbar INSIDE the plot
						margin: { l: 10, r: 10, t: 10, b: bottomMargin },
						autosize: true,
					}}
					config={{
						displayModeBar: false,
						scrollZoom: false,
						doubleClick: false,
						responsive: true,
					}}
					style={{ width: '100%', height: '100%' }} // ✅ critical
					useResizeHandler
				/>
			</div>
		</div>
	);
}
