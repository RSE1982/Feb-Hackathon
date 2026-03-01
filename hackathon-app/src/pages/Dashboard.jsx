import React, { useEffect, useMemo, useState } from 'react';

import LevelTabs from '../components/LevelTabs';
import FiltersPanel from '../components/FiltersPanel';
import KpiRow from '../components/KpiRow';
import InsightCards from '../components/InsightCards';
import DashboardHeader from '../components/DashboardHeader';
import StickyMobileNav from '../components/StickyMobileNav';

import TrendLinePlot from '../components/plots/TrendLinePlot';
import ComparisonBarPlot from '../components/plots/ComparisonBarPlot';
import LonelinessStackedBar from '../components/plots/LonelinessStackedBar';
import ChoroplethMap from '../components/plots/ChoroplethMap';

import { useWellbeingData } from '../hooks/useWellbeingData';
	


export default function Dashboard() {
	const {
		data,
		loading,
		error,
		quarters,
		metrics,
		getGeographies,
		getComparison,	
	} = useWellbeingData();

	// --- UI state (single source of truth) ---
	const [level, setLevel] = useState('national'); // national | country | region
	const [quarter, setQuarter] = useState(1);
	const [metric, setMetric] = useState('wellbeing_index');
	const [geography, setGeography] = useState('');

	// --- Derived lists from loaded data ---
	const geographies = useMemo(
		() => getGeographies(level),
		[getGeographies, level],
	);

	// Ensure quarter stays valid once data loads
	useEffect(() => {
		if (!quarters?.length) return;
		if (!quarters.includes(quarter)) setQuarter(quarters[0]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quarters]);

	// Ensure geography stays valid when level changes / data loads
	useEffect(() => {
		if (!geographies.length) return;
		if (!geography || !geographies.includes(geography)) {
			// sensible defaults
			if (level === 'national' && geographies.includes('Great Britain')) {
				setGeography('Great Britain');
			} else {
				setGeography(geographies[0]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [geographies, level]);

	// --- Derived datasets (do NOT store in state) ---
	const levelQuarterData = useMemo(() => {
		return data.filter(
			(d) => d.geography_level === level && d.quarter === quarter,
		);
	}, [data, level, quarter]);

	const geoQuarterRow = useMemo(() => {
		return data.find(
			(d) =>
				d.geography_level === level &&
				d.quarter === quarter &&
				d.geography === geography,
		);
	}, [data, level, quarter, geography]);

	const geoTrendData = useMemo(() => {
		return data
			.filter((d) => d.geography_level === level && d.geography === geography)
			.sort((a, b) => a.quarter - b.quarter);
	}, [data, level, geography]);

	// --- Render states ---
	if (loading) {
		return (
			<div className='min-h-screen bg-linear-to-br from-pink-50 to-blue-50'>
				<div className='max-w-6xl mx-auto p-6'>Loading data…</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-linear-to-br from-pink-50 to-blue-50'>
				<div className='max-w-6xl mx-auto p-6 text-red-700'>
					<div className='bg-white/70 rounded-2xl shadow p-4'>
						<div className='font-semibold mb-1'>Failed to load data</div>
						<div className='text-sm'>{error}</div>
						<div className='text-xs mt-2 opacity-70'>
							Check that <code>public/data/wellbeing_master.json</code> exists
							and is reachable.
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-pink-50 to-blue-50'>
			<div className='max-w-6xl mx-auto p-6 space-y-6'>
				{/* Header */}
				<DashboardHeader
					level={level}
					quarter={quarter}
					metric={metric}
					geography={geography}
				/>
				{/* Filters and level selection */}
				{/* Mobile: hamburger */}
				<div className='md:hidden sticky top-0 z-50 bg-white'>
					<StickyMobileNav title='Filters'>
						{/* Level selection */}
						<LevelTabs level={level} onChange={setLevel} />
						<div className='mt-4 mb-4'></div>
						{/* Filters */}
						<FiltersPanel
							level={level}
							quarter={quarter}
							onQuarterChange={setQuarter}
							metric={metric}
							onMetricChange={setMetric}
							geography={geography}
							onGeographyChange={setGeography}
							quarters={quarters?.length ? quarters : [1, 2, 3, 4]}
							geographies={geographies}
							metrics={metrics}
						/>
					</StickyMobileNav>
				</div>

				{/* Desktop: normal sticky filters (or whatever you already have) */}
				<div className='hidden md:block sticky top-0 z-40 bg-white'>
					{/* Level selection */}
					<LevelTabs level={level} onChange={setLevel} />
					<div className='mt-4 mb-4'></div>
					{/* Filters */}
					<FiltersPanel
						level={level}
						quarter={quarter}
						onQuarterChange={setQuarter}
						metric={metric}
						onMetricChange={setMetric}
						geography={geography}
						onGeographyChange={setGeography}
						quarters={quarters?.length ? quarters : [1, 2, 3, 4]}
						geographies={geographies}
						metrics={metrics}
					/>
				</div>

				{/* KPIs (placeholder component can ignore data for now) */}
				<KpiRow
					level={level}
					quarter={quarter}
					geography={geography}
					row={geoQuarterRow}
				/>

				{/* Charts */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					<TrendLinePlot
						title='Trend over time'
						metric={metric}
						level={level}
						geography={geography}
						data={geoTrendData}
					/>
					<ComparisonBarPlot
						title='Comparison (selected quarter)'
						metric={metric}
						level={level}
						quarter={quarter}
						geography={geography}
						getComparison={getComparison}
					/>
				</div>

				<LonelinessStackedBar
					title='Loneliness distribution (selected quarter)'
					level={level}
					quarter={quarter}
					data={levelQuarterData}
				/>

				{/* Map (placeholder for now, but props are correct) */}
				<ChoroplethMap
					level={level}
					quarter={quarter}
					metric={metric}
					rows={data}
				/>

				{/* Insights */}
				<InsightCards
					level={level}
					quarter={quarter}
					metric={metric}
					allData={data}
				/>

				<footer className='text-xs text-gray-500 mt-10 border-t pt-4'>
					<p>
						Data © Office for National Statistics. Boundary data © Crown
						copyright. Licensed under Open Government Licence v3.0.
					</p>
					<p>Full attribution available in the project repository.</p>
				</footer>
			</div>
		</div>
	);
}
