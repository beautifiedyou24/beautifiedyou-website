import useCartStore from '@/store/cartStore';
import useProductStore from '@/store/productStore';
import useQuantitySelectroStore from '@/store/quantitySelectorStore';
import { useState } from 'react';

const QuantitySelector = ({ min = 1, max = 10, initialQuantity = 1 }) => {
	const { quantity, setQuantity, loadQuantity } = useQuantitySelectroStore();
	const { selectedProduct } = useProductStore();
	const { updateCart } = useCartStore();

	const product = selectedProduct;

	// Load the initial quantity when the component mounts
	useState(() => {
		loadQuantity(initialQuantity);
	});

	const increment = () => {
		if (quantity < max) {
			setQuantity(quantity + 1);
		}

		if (selectedProduct) {
			updateCart(
				selectedProduct?.id,
				selectedProduct?.color,
				'quantity',
				quantity
			);
		}
	};

	const decrement = () => {
		if (quantity > min) {
			setQuantity(quantity - 1);
		}

		if (selectedProduct) {
			updateCart(
				selectedProduct?.id,
				selectedProduct?.color,
				'quantity',
				quantity
			);
		}
	};

	return (
		<div className='flex items-center  mt-1'>
			<div className='space-x-4 border-2 border-coreLightPink hover:border-pink-400'>
				<button
					onClick={decrement}
					className='px-3 py-2 bg-coreLightPink text-gray-700 hover:bg-pink-300 disabled:bg-gray-100 disabled:text-gray-400'
					disabled={quantity <= min}
				>
					-
				</button>
				<span className='text-sm text-center'>{quantity}</span>
				<button
					onClick={increment}
					className='px-3 py-2 bg-coreLightPink text-gray-700 hover:bg-pink-300 disabled:bg-gray-100 disabled:text-gray-400'
					disabled={quantity >= max}
				>
					+
				</button>
			</div>
		</div>
	);
};

export default QuantitySelector;
