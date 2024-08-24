import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import slugify from 'slugify';
import { ProductType } from './types/product.type';

interface RelatedProductCardInterface {
	product: ProductType;
	handleProductView: (id: string) => void;
}

const RelatedProductCard: React.FC<RelatedProductCardInterface> = ({
	product,
	handleProductView,
}) => {
	const router = useRouter();

	return (
		<div
			key={product.id}
			className='bg-white drop-shadow-md p-4 text-center flex flex-col w-full transition-transform transform hover:scale-100 sm:min-h-[500px] sm:min-w-[250px] md:min-h-[600px] md:min-w-[300px]'
		>
			{/* image */}
			<div
				className='relative w-full h-[300px] sm:h-[350px] md:h-[400px] cursor-pointer'
				onClick={() => handleProductView(product.id)}
			>
				<Image
					src={
						product.images.length > 0
							? product.images[0]
							: '/images/default-product.png'
					}
					loading='lazy'
					alt={product.name}
					fill
					sizes='(min-width: 1024px) 1024px, 100vw'
					style={{ objectFit: 'cover' }}
					className='rounded-lg'
				/>
			</div>

			{/* product description */}
			<div className='flex flex-col justify-start items-start mt-4 flex-grow'>
				<div className='flex flex-col justify-center items-start'>
					<p
						className='text-gray-600 hover:text-gray-400 cursor-pointer text-xs sm:text-sm mb-0'
						onClick={() => {
							router.push(
								`/categories/${slugify(String(product?.categories[0]), {
									lower: true,
									strict: true,
								})}`
							);
						}}
					>
						{product.categories[0]}
					</p>
					<p
						className='text-lg sm:text-xl font-bold cursor-pointer text-coreDarkBrown hover:text-coreBrown text-left text-wrap leading-tight'
						onClick={() => handleProductView(product.id)}
					>
						{product.name}
					</p>
					<div className='flex items-center mt-1'>
						{product?.discount?.percentage ? (
							<div className='flex flex-row'>
								<p
									className='text-sm sm:text-base font-light text-gray-500 line-through mr-2'
									onClick={() => handleProductView(product.id)}
								>
									{product.price} /-
								</p>
								<p className='text-sm sm:text-base font-semibold text-red-600'>
									{product?.finalPrice} /-
								</p>
							</div>
						) : (
							<p
								className='text-sm sm:text-base font-light text-gray-500 mr-2'
								onClick={() => handleProductView(product.id)}
							>
								{product.price} /-
							</p>
						)}
					</div>
				</div>

				{/* colors */}
			</div>
		</div>
	);
};

export default RelatedProductCard;
