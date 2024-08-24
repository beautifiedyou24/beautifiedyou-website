import CartDrawer from '@/components/shared/CartDrawer';
import SecondaryButton from '@/components/shared/SecondaryButton';
import useCartStore from '@/store/cartStore';
import { ShoppingCartOutlined } from '@ant-design/icons';

import { message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import ColorChips from './elements/ColorChips';
import { ProductType } from './types/product.type';

interface ProductCardInterface {
	product: ProductType;
	handleProductView: (id: string) => void;
}

const ProductCard: React.FC<ProductCardInterface> = ({
	product,
	handleProductView,
}) => {
	const [showCart, setShowCart] = useState(false);
	const { addToCart, cart } = useCartStore();
	const [selectedColor, setSelectedColor] = useState<string>('');
	const [currentImage, setCurrentImage] = useState<string>('');
	const [currentStock, setCurrentStock] = useState<number>(0);
	const router = useRouter();

	const getStockAmount = (colorName: string) => {
		if (product?.meta?.imageObj) {
			const colors = product?.meta?.imageObj.map((obj) => {
				const [colorName] = Object.keys(obj);
				return colorName;
			});

			let idx: number = 0;

			colors.map((item, id) => {
				if (colorName === item) {
					idx = id;
				}
			});

			const values = product.meta.imageObj[idx];
			const stockCount = Object.values(values)[0][2];

			return stockCount;
		}

		return 0;
	};

	const handleCart = () => {
		if (product.stockCount < 1) {
			message.error('Sorry, this product is out of stock');
			return;
		}

		addToCart({
			id: String(product.id),
			name: product.name,
			price: product.finalPrice,
			color: selectedColor,
			quantity: 1,
			stock: getStockAmount(selectedColor),
			image: currentImage,
		});
	};

	useEffect(() => {
		if (product?.meta?.imageObj) {
			const keys = Object.keys(product?.meta?.imageObj);
			const colors = product?.meta?.imageObj.map((obj) => {
				const [colorName] = Object.keys(obj);
				return colorName;
			});

			if (colors.length > 0) {
				const firstColorKey: string = keys[0];
				const [imageUrl, colorCode, stock] = Object.values(
					product?.meta?.imageObj[parseInt(firstColorKey)]
				)[0];

				setCurrentImage(imageUrl);
				setSelectedColor(colors[0]);
				setCurrentStock(stock);
			}
		}
	}, [product]);

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
						currentImage.length > 0
							? currentImage
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
						className='text-lg sm:text-xl font-bold cursor-pointer text-coreDarkBrown hover:text-coreBrown text-left text-wrap leading-tight uppercase'
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
				<div className='flex flex-col justify-start items-start my-4 md:my-6'>
					<p className='font-semibold text-gray-800'>Shades</p>
					<p className='font-extralight text-xs text-gray-600'>
						{selectedColor}
					</p>

					<div className='flex flex-wrap gap-1 mt-1'>
						{product?.meta?.imageObj && product?.meta?.imageObj?.length > 0
							? product?.meta?.imageObj.map((obj, index: number) => {
									const [colorKey, [imageUrl, colorCode, stock]] =
										Object.entries(obj)[0];

									return (
										<div
											key={index}
											style={{
												display: 'flex',
												alignItems: 'center',
												marginBottom: 8,
											}}
											className='flex-shrink-0'
										>
											<ColorChips
												colorCode={colorCode}
												colorName={colorKey}
												currentColorName={selectedColor}
												className='text-sm py-3 px-4'
												onClick={() => {
													setSelectedColor(colorKey);
													setCurrentImage(imageUrl);
													setCurrentStock(stock);
												}}
											/>
										</div>
									);
							  })
							: ''}
					</div>
				</div>
			</div>

			{/* add to cart button */}
			<div className='w-full mt-5'>
				<div>
					<p className='py-2 text-xs'>
						{currentStock == 0 ? (
							<span className='font-bold text-red-500'>Out of Stock!</span>
						) : currentStock <= 5 && currentStock > 0 ? (
							<span className='font-bold text-blue-500'>
								Only few items left!
							</span>
						) : null}
					</p>

					<SecondaryButton
						icon={<ShoppingCartOutlined className='w-5 h-5' />}
						label='Add to Cart'
						onClick={handleCart}
						disabled={currentStock === 0}
					/>
				</div>
			</div>

			<CartDrawer visible={showCart} onClose={() => setShowCart(false)} />
		</div>
	);
};

export default ProductCard;