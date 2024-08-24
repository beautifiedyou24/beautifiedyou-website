import useProductStore from '@/store/productStore';
import { Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import CustomCarousel from '../shared/CustomCarousel';
import ColorChips from './elements/ColorChips';

interface ProductViewProps {
	visible: boolean;
	onClose: () => void;
}

const ProductView = ({ visible, onClose }: ProductViewProps) => {
	const carouselRef = useRef<any>(null);
	const [currentImage, setCurrentImage] = useState<string>('');
	const [currentStock, setCurrentStock] = useState<number>(0);
	const [currentColorName, setCurrentColorName] = useState<string>('');

	// Handle color click to change the image
	const handleColorClick = (imageUrl: string, color: string, stock: number) => {
		setCurrentImage(imageUrl);
		setCurrentColorName(color);
		setCurrentStock(stock);
	};

	const selectedProduct = useProductStore((state) => state.selectedProduct);
	const productDetails = selectedProduct;

	useEffect(() => {
		if (productDetails?.meta?.imageObj) {
			const keys = Object.keys(productDetails?.meta?.imageObj);
			const colors = productDetails?.meta?.imageObj.map((obj) => {
				const [colorName] = Object.keys(obj);
				return colorName;
			});

			if (colors.length > 0) {
				const firstColorKey: string = keys[0];
				const [imageUrl, colorCode, stock] = Object.values(
					productDetails?.meta?.imageObj[parseInt(firstColorKey)]
				)[0];

				setCurrentImage(imageUrl);
				setCurrentColorName(colors[0]);
				setCurrentStock(stock);
			}
		}
	}, []);

	return (
		<Modal
			title={
				<div style={{ fontSize: '24px', fontWeight: 'bold' }}>
					{productDetails?.name}
				</div>
			}
			open={visible}
			onCancel={onClose}
			footer={[
				<Button key='back' onClick={onClose}>
					Close
				</Button>,
			]}
		>
			<div className='flex justify-center items-center'>
				<CustomCarousel
					images={productDetails?.images}
					customClass='w-[80%] h-auto'
					selectedImage={currentImage}
				/>
			</div>
			<div style={{ marginTop: 16 }}>
				<h3 className='text-xl font-extrabold'>Product Details</h3>
				<hr className='mb-3' />
				<p className='bg-slate-200 p-2 text-md'>
					<strong>Price: </strong>
					<span className='text-pink-800 font-extrabold'>
						{productDetails?.price} /-
					</span>
				</p>
				<p className='bg-slate-200 p-2 text-md mt-2'>
					<strong>Stock Count: </strong>
					{productDetails?.stockCount ? (
						<span className='text-violet-800 font-extrabold'>
							{currentStock !== 0 ? currentStock : productDetails?.stockCount}
						</span>
					) : (
						<span className='text-red-500 font-extrabold'>Out of Stock</span>
					)}
				</p>
				<h4 className='font-bold flex justify-center bg-blue-100 p-2 text-md mt-2'>
					Available Shades
				</h4>
				<div>
					{/* Display the color chips */}
					<div className='flex flex-wrap justify-center items-center gap-1 p-2'>
						{productDetails?.meta?.imageObj &&
							productDetails?.meta?.imageObj.map((obj, index: number) => {
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
											className='text-xs'
											onClick={() =>
												handleColorClick(imageUrl, colorKey, stock)
											}
										/>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ProductView;
