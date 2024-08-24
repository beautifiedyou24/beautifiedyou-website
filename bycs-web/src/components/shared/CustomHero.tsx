import React from 'react';

interface CustomHeroProps {
	img: string;
	title: string;
}

const CustomHero: React.FC<CustomHeroProps> = ({ img, title }) => {
	return (
		<>
			<div
				className='absolute inset-0 bg-cover bg-center'
				style={{ backgroundImage: `url(${img})` }}
			></div>
			<div className='absolute inset-0 bg-black opacity-50'></div>
			<div className='absolute inset-0 flex items-center justify-center'>
				<h1 className='text-5xl font-bold text-white uppercase'>{title}</h1>
			</div>
		</>
	);
};

export default CustomHero;
