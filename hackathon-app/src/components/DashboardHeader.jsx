import React from 'react';
import { capitalizeString } from '../utils/capitalizeString';
import { metricNiceName } from '../utils/metricHelpers';
import wpLogo from '../../public/images/wpulse-gemini-red.png';

export default function DashboardHeader({ level, quarter, metric, geography }) {
	return (
		<header className='relative space-y-1'>
			<h1 className='text-2xl font-bold text-gray-900 text-outline'>
				Wellbeing & Loneliness Dashboard
			</h1>

			<p className='text-sm text-gray-700 text-outline'>
				Explore insights by <span className='font-semibold'>level</span>,{' '}
				<span className='font-semibold'>quarter</span>, and{' '}
				<span className='font-semibold'>metric</span>.
			</p>

			<div className='text-xs text-gray-600 text-outline'>
				Selected: <span className='font-semibold'>{capitalizeString(level)}</span> • Q
				<span className='font-semibold'>{quarter}</span> •{' '}
				<span className='font-semibold'>{metricNiceName(metric)}</span> •{' '}
				<span className='font-semibold'>{geography || '—'}</span>
			</div>
			<div className='absolute top-0 right-0 md:right-2 pt-6 md:pt-0 z-1'>
				{/* Image */}
				<img src={wpLogo}
					alt='wellbeing pulse logo'
					className='h-[3em] md:h-[4em] w-auto'
				/>
			</div>
		</header>
	);
}
