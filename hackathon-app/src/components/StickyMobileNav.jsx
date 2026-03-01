import React, { useEffect, useState } from 'react';

export default function StickyMobileNav({ children, title = 'Filters' }) {
	const [open, setOpen] = useState(false);

	// Optional: stop body scrolling when menu is open
	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => (document.body.style.overflow = '');
	}, [open]);

	// Optional: close on Escape
	useEffect(() => {
		const onKeyDown = (e) => e.key === 'Escape' && setOpen(false);
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<div className='sticky top-0 z-50'>
			{/* Top bar */}
			<div className='bg-white/80 backdrop-blur border-b'>
				<div className='px-4 py-3 flex items-center justify-between'>
					<div className='font-semibold text-sm'>{title}</div>

					<button
						type='button'
						className='p-2 rounded-lg border bg-white'
						aria-label='Open menu'
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
					>
						{/* Simple hamburger / close icon */}
						<span className='block w-5 h-0.5 bg-black mb-1' />
						<span className='block w-5 h-0.5 bg-black mb-1' />
						<span className='block w-5 h-0.5 bg-black' />
					</button>
				</div>
			</div>

			{/* Backdrop */}
			{open && (
				<button
					aria-label='Close menu'
					className='fixed inset-0 bg-black/30'
					onClick={() => setOpen(false)}
				/>
			)}

			{/* Dropdown panel (anchored to bar) */}
			<div className='relative'>
				<div
					className={[
						'absolute left-0 right-0 top-0', 
						'bg-white border-b shadow',
						'transition-transform duration-200',
						open ? 'translate-y-0' : '-translate-y-[200%]',
					].join(' ')}
				>
					<div className='p-4'>
						{children}

						<div className='mt-3 flex justify-end'>
							<button
								className='px-3 py-2 rounded-lg border bg-white'
								onClick={() => setOpen(false)}
							>
								Done
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
