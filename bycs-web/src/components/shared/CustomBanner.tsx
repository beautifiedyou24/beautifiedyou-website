import Image from 'next/image';

const CustomBanner = () => {
	return (
		<div className='relative w-full h-24'>
			<Image
				src='/images/shop-cover.jpg'
				alt='Product Banner'
				fill
				style={{ objectFit: 'cover' }}
				priority
			/>
			<div className='absolute inset-0 bg-black opacity-50'></div>
		</div>
	);
};

export default CustomBanner;
