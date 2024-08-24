'use client';

import { ProductType } from '@/components/Products/types/product.type';
import AppLayout from '@/components/shared/AppLayout';
import CustomBanner from '@/components/shared/CustomBanner';
import CustomCarousel from '@/components/shared/CustomCarousel';
import Loader from '@/components/shared/Loader';
import PrimaryButton from '@/components/shared/PrimaryButton';
import SecondaryButton from '@/components/shared/SecondaryButton';
import useCartStore from '@/store/cartStore';

import { Breadcrumb } from 'antd';
import { CreditCard, ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import ColorChips from './Products/elements/ColorChips';
import RelatedProductCard from './Products/RelatedProductCard';

const ProductDetailsPage = ({
	fetchedProduct,
	fetchedMostSoldProducts,
}: {
	fetchedProduct: ProductType;
	fetchedMostSoldProducts: ProductType[];
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentImage, setCurrentImage] = useState<string>('');
	const [currentStock, setCurrentStock] = useState<number>(0);
	const [currentColorName, setCurrentColorName] = useState<string>('');
	const [smallPreviewImage, setSmallPreviewImages] = useState<string[]>([]);

	const { addToCart } = useCartStore();
	const router = useRouter();

	const getStockAmount = (colorName: string) => {
		if (fetchedProduct?.meta?.imageObj) {
			console.log('first', fetchedProduct.meta.imageObj);

			const keys = Object.keys(fetchedProduct.meta.imageObj);

			const colors = fetchedProduct?.meta?.imageObj.map((obj) => {
				const [colorName] = Object.keys(obj);
				return colorName;
			});

			let idx: number = 0;

			colors.map((item, id) => {
				if (colorName === item) {
					idx = id;
				}
			});

			const values = fetchedProduct.meta.imageObj[idx];
			const stockCount = Object.values(values)[0][2];

			return stockCount;
		}

		return 0;
	};

	const handleAddToCart = (product: any) => {
		addToCart({
			id: String(product.id),
			name: product.name,
			price: product.discount ? product.finalPrice : product.price,
			quantity: 1,
			color: currentColorName,
			stock: getStockAmount(currentColorName),
			image: currentImage,
		});
	};

	const handleColorClick = (imageUrl: string, color: string, stock: number) => {
		setCurrentImage(imageUrl);
		setCurrentColorName(color);
		setCurrentStock(stock);
		const newImages = [...smallPreviewImage];
		newImages[0] = imageUrl;
		setSmallPreviewImages(newImages);
	};

	const handleBuyNow = (product: any) => {
		handleAddToCart(product);
		router.push('/checkout');
	};

	const handleSlideChange = (index: any) => {
		setCurrentIndex(index);
	};

	const handleProductView = (slug: string) => {
		router.push(`/products/${slug}`);
	};

	useEffect(() => {
		if (fetchedProduct?.meta?.imageObj) {
			const keys = Object.keys(fetchedProduct?.meta?.imageObj);
			const colors = fetchedProduct?.meta?.imageObj.map((obj) => {
				const [colorName] = Object.keys(obj);
				return colorName;
			});

			const imageUrls = fetchedProduct?.meta?.imageObj.map((obj: any) => {
				const color: string = Object.keys(obj)[0];
				const [url] = obj[color];
				return url;
			});

			const filteredImageUrls = imageUrls.slice(1, colors.length);

			setSmallPreviewImages(
				fetchedProduct.images.filter(
					(item) => !filteredImageUrls.includes(item)
				)
			);

			if (colors.length > 0) {
				const firstColorKey: string = keys[0];
				const [imageUrl, colorCode, stock] = Object.values(
					fetchedProduct?.meta?.imageObj[parseInt(firstColorKey)]
				)[0];

				setCurrentImage(imageUrl);
				setCurrentColorName(colors[0]);
				setCurrentStock(stock);
			}
		}
	}, [fetchedProduct]);

	if (!fetchedProduct && !fetchedMostSoldProducts) {
		return <Loader />;
	}

	return (
		<AppLayout>
			<div>
				{/* Add banner here */}
				<CustomBanner />

				{/* content */}
				<div className='flex flex-col items-center justify-center gap-6 bg-fuchsia-100 min-h-screen'>
					<div className='flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 mt-0'>
						{/* Image carousel */}
						<div className='w-full md:w-[90%] lg:w-[40%] xl:w-[50%] 2xl:w-[40%] 3xl:w-[40%] aspect-video m-auto p-10 lg:my-auto lg:mx-0'>
							{fetchedProduct?.images && fetchedProduct.images.length > 0 ? (
								<>
									{/* carousel main */}
									<div className='w-full'>
										<CustomCarousel
											images={fetchedProduct.images}
											externalIndex={currentIndex}
											selectedImage={currentImage}
											showHandlers={false}
										/>
									</div>

									{/* small view of images */}
									<div
										className='flex gap-2 justify-center lg:justify-start items-center mt-4 overflow-x-auto min-w-20 min-h-20'
										style={{ scrollbarColor: 'pink' }}
									>
										{smallPreviewImage.length > 0 &&
											smallPreviewImage.map((image, index) => (
												<Image
													key={index}
													src={image}
													loading='lazy'
													alt={`Preview ${index + 1}`}
													className='object-cover cursor-pointer p-1'
													width={80}
													height={80}
													style={{
														border:
															currentIndex === index
																? '2px solid brown'
																: '2px solid black',
													}}
													onClick={() => handleSlideChange(index)}
												/>
											))}
									</div>
								</>
							) : (
								<div className='w-full h-48 sm:h-56 md:h-64 lg:h-72'>
									<Image
										src={'/images/default-product.png'}
										alt={'No Product Image'}
										width={400}
										height={300}
										loading='lazy'
										className='w-full h-48 sm:h-56 md:h-64 lg:h-72 object-contain'
									/>
								</div>
							)}
						</div>

						{/* Product details */}
						<div className='w-10/12 min-w-[40%] lg:w-[20%] xl:w-[45%] 2xl:w-[40%] mx-auto lg:mx-0 p-5 flex flex-col justify-center'>
							{/* Product name and price */}
							<div className='flex flex-col justify-between items-start text-xl md:text-2xl mt-4'>
								{/* category name */}
								<div className='font-extralight text-gray-600 text-sm mt-2 lg:mt-8'>
									<Breadcrumb
										items={[
											{
												title: <Link href='/shop'>Home</Link>,
											},
											{
												title: (
													<Link
														href={`/categories/${slugify(
															String(fetchedProduct?.categories[0]),
															{
																lower: true,
																strict: true,
															}
														)}`}
													>
														{fetchedProduct?.categories[0]}
													</Link>
												),
											},
											{
												title: <span>{fetchedProduct?.name}</span>,
											},
										]}
									/>
								</div>

								<p className='font-bold text-3xl my-2 md:mb-0 uppercase'>
									{fetchedProduct?.name}
								</p>

								{fetchedProduct?.discount ? (
									<div>
										<div className='flex items-center'>
											<p className='font-light text-lg text-gray-500 line-through mr-2'>
												Tk. {fetchedProduct?.price} BDT
											</p>
											<p className='font-semibold text-xl text-red-600'>
												Tk. {fetchedProduct?.finalPrice} BDT
											</p>
										</div>
										<p className='text-sm text-green-600'>
											Save{' '}
											<span className='font-bold'>
												{Math.round(
													fetchedProduct?.price *
														parseFloat(fetchedProduct.discount?.percentage)
												)}{' '}
												BDT (
												{Math.round(
													parseFloat(fetchedProduct.discount?.percentage) * 100
												)}
											</span>
											% off)
										</p>
									</div>
								) : (
									<div className='flex items-center mt-2'>
										<p className='font-semibold text-xl text-gray-500 mr-2'>
											Tk. {fetchedProduct?.price} BDT
										</p>
									</div>
								)}
							</div>

							{/* Colors */}
							<div className='flex flex-col justify-start items-start my-6 md:my-10 w-10/12'>
								<p className='font-bold text-coreDarkBrown'>Shades</p>
								<div className='flex flex-wrap justify-start items-center gap-1 mt-2'>
									{fetchedProduct?.meta?.imageObj.map((obj, index: number) => {
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
													currentColorName={currentColorName}
													className='text-sm py-3 px-4'
													onClick={() =>
														handleColorClick(imageUrl, colorKey, stock)
													}
												/>
											</div>
										);
									})}
								</div>
							</div>

							{/* Product description */}
							<div className='flex flex-col justify-start items-start my-6'>
								<p className='font-bold text-coreDarkBrown'>Description</p>
								<p className='text-sm text-gray-700 mt-2'>
									{fetchedProduct?.details}
								</p>
							</div>

							{/* Add to Cart and Buy Now buttons */}
							<div className='flex flex-col md:flex-row items-center justify-center gap-2 mt-6'>
								<SecondaryButton
									icon={<ShoppingBagIcon className='w-5 h-5' />}
									label='Add to Cart'
									disabled={currentStock == 0}
									onClick={() => handleAddToCart(fetchedProduct)}
								/>

								<PrimaryButton
									icon={<CreditCard className='w-5 h-5' />}
									label='Buy Now'
									disabled={currentStock == 0}
									onClick={() => handleBuyNow(fetchedProduct)}
								/>
							</div>

							{/* stock */}
							{fetchedProduct && (
								<div className='text-red-500 mt-2 font-light text-sm'>
									<p className='py-2 text-xs'>
										{currentStock == 0 ? (
											<span className='font-bold text-red-500'>
												* Out of Stock!
											</span>
										) : currentStock <= 5 && currentStock > 0 ? (
											<span className='font-bold text-blue-500'>
												* Only few items left!
											</span>
										) : null}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Related products */}
					<div className='container mx-auto px-8 py-8 pt-10 mb-8'>
						<hr className='mb-10' />
						<h2 className='text-2xl font-medium text-gray-900 mb-6'>
							Related Products
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 lg:gap-4 gap-10'>
							{fetchedMostSoldProducts.map((prod, idx) => (
								<div className='cursor-pointer h-[80%]' key={idx}>
									<RelatedProductCard
										key={idx}
										product={prod}
										handleProductView={() => handleProductView(prod.slug)}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default ProductDetailsPage;
