'use client';
import {
	RiFacebookBoxFill,
	RiInstagramFill,
	RiWhatsappFill,
} from '@remixicon/react';
import { Footer } from 'antd/es/layout/layout';
import { Merriweather } from 'next/font/google';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import ResponsiveMenu from './ResponsiveMenu';

interface AppLayoutProps {
	children: React.ReactNode;
}

const merriWeather_init = Merriweather({
	subsets: ['latin'],
	weight: '300',
});

const AppLayout = ({ children }: AppLayoutProps) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, []);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className={`min-h-screen flex flex-col box-border m-0 `}>
			<header className='fixed top-0 left-0 right-0 z-50'>
				<ResponsiveMenu />
			</header>
			<main className={`flex-grow box-border ${merriWeather_init.className}`}>
				{children}
			</main>
			<Footer style={{ padding: '4rem 0' }} className='bg-coreLightPink'>
				<div className='container mx-auto px-4 '>
					<div className='flex flex-wrap justify-center items-center'>
						<div className='w-full md:w-1/3 mb-4 md:mb-0 flex flex-col justify-center items-center'>
							<h2 className='text-2xl font-bold text-coreDarkBrown'>
								Beautified You
							</h2>
							<p className='mt-2 flex justify-center items-center text-center text-wrap'>
								Your one-stop shop for all things beauty
							</p>
						</div>
						<div className='w-full md:w-1/3 mb-4 md:mb-0 flex flex-col justify-center items-center'>
							<h3 className='text-lg font-semibold mb-2 text-coreDarkBrown'>
								Contact Us
							</h3>
							<p>Email: info@beautified-you.com</p>
							<p>Phone: +880 1877-820057</p>
						</div>
						<div className='w-full md:w-1/3 flex flex-col justify-center items-center'>
							<h3 className='text-lg font-semibold mb-2 text-coreDarkBrown'>
								Follow Us
							</h3>
							<div className='flex space-x-4'>
								<a
									href='https://www.facebook.com/people/Beautified-You/100092096476223/?mibextid=ZbWKwL'
									className='text-2xl hover:text-pink-500'
									target='_blank'
								>
									<RiFacebookBoxFill />
								</a>
								<a
									href='https://www.instagram.com/beautifiedyou4?igsh=dDA2OTk3emV4ZnNw'
									className='text-2xl hover:text-pink-500'
									target='_blank'
								>
									<RiInstagramFill />
								</a>
								<a
									href='+880 1877-820057'
									className='text-2xl hover:text-pink-500'
								>
									<RiWhatsappFill />
								</a>
							</div>
						</div>
					</div>
					{/* <div className='mt-8 text-center'>
						<p>
							All rights reserved ©{new Date().getFullYear()} by Beautified-You
						</p>
					</div> */}
				</div>
			</Footer>
		</div>
	);
};

export default AppLayout;
