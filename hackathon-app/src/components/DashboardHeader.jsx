import React from 'react';
import {capitalizeString} from '../utils/capitalizeString';

export default function DashboardHeader({ level, quarter, metric, geography }) {
	return (
		<header className='space-y-1'>
			<h1 className='text-2xl font-bold text-gray-900'>
				Wellbeing & Loneliness Dashboard
			</h1>

			<p className='text-sm text-gray-700'>
				Explore insights by <span className='font-semibold'>level</span>,{' '}
				<span className='font-semibold'>quarter</span>, and{' '}
				<span className='font-semibold'>metric</span>.
			</p>

			<div className='text-xs text-gray-600'>
				Selected: <span className='font-semibold'>{capitalizeString(level)}</span> • Q
				<span className='font-semibold'>{quarter}</span> •{' '}
				<span className='font-semibold'>{metric}</span> •{' '}
				<span className='font-semibold'>{geography || '—'}</span>
			</div>
		</header>
	);
}
