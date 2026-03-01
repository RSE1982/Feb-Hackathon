import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useGeoJson } from '../../hooks/useGeoJson';
import { capitalizeString } from '../../utils/capitalizeString';

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
	// ✅ Hook ALWAYS called (order never changes)
	const { geojson, error, loading } = useGeoJson(level);

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
		<div className='bg-white/70 rounded-2xl shadow p-4'>
			<h2 className='font-semibold mb-2'>Map</h2>
			<div className='text-xs opacity-60 mb-4'>
				{capitalizeString(level)} • Q{quarter} • {metric}
			</div>
			<div className='rounded-xl border bg-white p-2'>
				<Plot
					data={[
						{
							type: 'choropleth',
							geojson,
							featureidkey: feature.idKey,
							locations: geoLocations,
							z: zValues,
							hovertemplate: '%{location}<br>' + metric + ': %{z}<extra></extra>',
							marker: { line: { width: 0.6 } },
							colorbar: { title: metric },
						},
					]}
					layout={{
						dragmode: false,
						title: `${level} — Q${qNum} — ${metric}`,
						geo: { fitbounds: 'locations', visible: false },
						margin: { l: 10, r: 10, t: 60, b: 10 },
						height: 650,
					}}
					config={{
						displayModeBar: false, // hides toolbar
						scrollZoom: false, // disables scroll wheel zoom
						doubleClick: false, // disables double-click zoom
						responsive: true, // allows resizing with window size
					}}
					style={{ width: '100%' }}
					useResizeHandler
				/>
			</div>
		</div>
		
	);
}
