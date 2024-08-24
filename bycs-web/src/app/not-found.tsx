import AppLayout from '@/components/shared/AppLayout';
import { Undo2Icon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: '404 Not Found',
};

export default function NotFound() {
	return (
		<AppLayout>
			<div
				className='absolute inset-0 bg-cover bg-center'
				style={{ backgroundImage: `url(/images/hero-image.jpg)` }}
			></div>
			<div className='absolute inset-0 bg-black opacity-50'></div>
			<div className='relative text-center text-white z-10 px-4 flex flex-col items-center justify-center min-h-screen '>
				<h2 className='text-4xl font-bold text-white mb-4'>404: Not Found</h2>
				<p className='text-lg text-gray-100 mb-8'>
					Sorry, the page you are looking for could not be found.
				</p>
				<Link
					href='/shop'
					className='text-lg bg-coreBrown p-4 rounded-full text-white hover:bg-pink-500 flex flex-row gap-2 items-center justify-center'
				>
					<Undo2Icon size={18} />
					Back to Shop
				</Link>
			</div>
		</AppLayout>
	);
}
