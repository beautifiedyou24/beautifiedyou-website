import { Cart } from '@/models/cart.model';
import useCartStore from '@/store/cartStore';
import { DeleteFilled } from '@ant-design/icons';
import { Drawer, Empty, InputNumber } from 'antd';
import { BadgeDollarSignIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface CartDrawerProps {
	visible: boolean;
	onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ visible, onClose }) => {
	const { cart, clearCart, loadCart, updateCart } = useCartStore();
	const removeFromCart = useCartStore((state) => state.removeFromCart);

	const router = useRouter();

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	//! [TODO: START]
	const handleQuantityChange = (
		id: string,
		color: string,
		quantity: number,
		stockCount: number
	) => {
		if (stockCount == 0) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[`${id}-${color}`]: `Stock out!`,
			}));
			updateCart(id, color, 'quantity', 0);
		} else if (quantity > stockCount) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[`${id}-${color}`]: `Quantity exceeds available stock (${stockCount}).`,
			}));
		} else {
			setErrors((prevErrors) => {
				const { [`${id}-${color}`]: _, ...rest } = prevErrors;
				return rest;
			});
			updateCart(id, color, 'quantity', quantity);
		}
	};

	const calculateTotal = () => {
		return cart
			.reduce((total, item) => total + item.price * item.quantity, 0)
			.toFixed(2);
	};

	const handleCheckout = () => {
		let hasErrors = false;
		cart.forEach((item) => {
			if (item.quantity > item.stock) {
				setErrors((prevErrors) => ({
					...prevErrors,
					[item.id]: `Quantity exceeds available stock (${item.stock}).`,
				}));
				hasErrors = true;
			}
		});

		if (!hasErrors) {
			router.push('/checkout');
		}
	};

	useEffect(() => {
		loadCart();
	}, [loadCart]);

	return (
		<Drawer
			title='Shopping Cart'
			placement='right'
			closable={true}
			onClose={onClose}
			open={visible}
			width={500}
		>
			<div className='flex flex-col h-full'>
				<div
					className='flex-grow'
					style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
				>
					{cart.length > 0 ? (
						cart.map((item: Cart) => (
							<div key={item.id} className='flex flex-col mb-4 p-3'>
								<div className='flex items-center justify-between'>
									<div className='flex flex-row gap-3 justify-start w-full'>
										<div>
											<Image
												src={item?.image ?? '/images/default-product.png'}
												alt={item.name}
												width={180}
												height={180}
												loading='lazy'
												style={{ border: '2px solid brown' }}
											/>
										</div>
										<div className='flex flex-row justify-around flex-grow w-full'>
											<div className='flex flex-col justify-between items-start h-full w-3/5'>
												<div>
													<p
														className={`font-bold ${
															item.name.length > 20 ? 'text-xs' : 'text-sm'
														}  uppercase`}
													>
														{item.name}
													</p>
													<p className='font-light text-gray-600 text-sm'>
														Tk. {item.price.toFixed(2)}
													</p>
													<p className='font-light text-gray-400 text-xs mt-1.5'>
														Color: {item.color}
													</p>
												</div>

												<div className=''>
													{item.stock > 0 && item.color ? (
														<InputNumber
															min={1}
															value={item.quantity}
															onChange={(value) =>
																handleQuantityChange(
																	item.id,
																	item.color,
																	value as number,
																	item.stock
																)
															}
															className=''
														/>
													) : (
														<p className='text-sm text-red-500'>Stock out!</p>
													)}
												</div>
											</div>
											<div className='flex flex-col justify-between items-center w-2/5 mb-3 mt-1'>
												<p className='ml-4 text-coreBrown font-semibold'>
													Tk {(item.price * item.quantity).toFixed(2)} /-
												</p>

												<button
													onClick={() => removeFromCart(item.id, item.color)}
													className='hover:cursor-pointer bg-red-50 rounded-md w-8 hover:bg-red-100 border-none text-white h-8 mt-2 flex flex-row justify-around items-center'
												>
													<span>
														{<DeleteFilled style={{ color: 'red' }} />}
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
								{errors[`${item.id}-${item.color}`] && (
									<p className='text-red-500 text-sm mt-1'>
										{errors[`${item.id}-${item.color}`]}
									</p>
								)}
							</div>
						))
					) : (
						<Empty
							description={
								<p>
									Your cart is empty
									<br />
									<p
										onClick={() => {
											const url = new URL(window.location.href);
											const path = url.pathname;

											if (path == '/shop') onClose();
											else {
												router.push('/shop');
											}
										}}
										className='text-blue-700 font-semibold text-lg capitalize underline cursor-pointer hover:text-blue-500'
									>
										continue shopping
									</p>
								</p>
							}
						/>
					)}
				</div>
				{cart.length > 0 && (
					<div className='flex flex-col justify-center items-center mt-4'>
						<p
							onClick={() => {
								const url = new URL(window.location.href);
								const path = url.pathname;

								if (path == '/shop') onClose();
								else {
									router.push('/shop');
								}
							}}
							className='text-coreBrown capitalize font-semibold text-lg underline cursor-pointer hover:text-coreDarkBrown'
						>
							continue shopping
						</p>
						<SecondaryButton
							label='Clear Cart'
							icon={<TrashIcon />}
							onClick={() => clearCart()}
							className='text-red-500'
						></SecondaryButton>
					</div>
				)}

				<div className='mt-4 border-t pt-4'>
					<div className='flex justify-between items-center mb-4'>
						<h4 className='font-extrabold text-lg'>Estimated Total:</h4>
						<p className='font-extrabold text-lg text-red-600'>
							Tk {calculateTotal()} BDT
						</p>
					</div>

					<PrimaryButton
						label={'Checkout'}
						onClick={() => handleCheckout()}
						disabled={cart.length == 0}
						icon={<BadgeDollarSignIcon className='w-5 h-5' />}
					/>
				</div>
			</div>
		</Drawer>
	);
};

export default CartDrawer;
