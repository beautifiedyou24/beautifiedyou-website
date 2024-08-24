'use client';

import Link from 'next/link';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const HeroSection = () => (
	<section className='relative h-screen flex items-center justify-center'>
		<div
			className='absolute inset-0 bg-cover bg-center'
			style={{ backgroundImage: `url(/images/hero-image.jpg)` }}
		></div>
		<div className='absolute inset-0 bg-black opacity-50'></div>
		<div className='relative text-center text-white z-10 px-4'>
			<h1 className='text-4xl md:text-6xl font-bold mb-4'>Beautified You</h1>
			<p className='text-xs md:text-sm'>
				Your one-stop shop for all things beauty
			</p>
			<p className='text-xs md:text-sm mb-8'>
				Discover the best in skincare and cosmetics
			</p>
			<Link
				href='/shop'
				className='no-underline flex justify-center items-center'
			>
				<span className='bg-pink-500 w-40 md:w-52 text-white py-2 md:py-3 px-4 md:px-6 rounded-full hover:bg-pink-600 transition duration-300 flex items-center justify-center'>
					Shop Now!
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-4 w-4 md:h-5 md:w-5 ml-2'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					</svg>
				</span>
			</Link>
		</div>
	</section>
);

const LandingPage = () => {
	return (
		<div className='overflow-x-hidden'>
			<HeroSection />
		</div>
	);
};

export default LandingPage;
