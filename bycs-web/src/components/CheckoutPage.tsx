'use client';

import { OrderResponseType } from '@/components/Orders/types/order.type';
import Invoice from '@/components/shared/Invoice';
import PrimaryButton from '@/components/shared/PrimaryButton';
import { SHIPPING_METHODS } from '@/constants/common';
import { PaymentMethod } from '@/enums/payment-method.enum';
import useCartStore from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';

import {
	Alert,
	Col,
	Empty,
	Form,
	Input,
	message,
	Modal,
	Row,
	Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';

const CheckoutPage = () => {
	const { cart, loadCart } = useCartStore();
	const [delivaryCharge, setDelivaryCharge] = useState<number>(80);
	const [shippingMethod, setShippingMethod] = useState(
		SHIPPING_METHODS.INSIDE_DHAKA
	);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [division, setDivision] = useState('Dhaka (Only City)');
	const [orderResponse, setOrderResponse] = useState<OrderResponseType>();

	const { clearCart } = useCartStore();
	const { createOrder } = useOrderStore();

	useEffect(() => {
		loadCart();
	}, [loadCart]);

	const handleSubmit = async (values: any) => {
		Modal.confirm({
			title: 'Confirm Order',
			content: 'Are you sure you want to place this order?',
			okText: 'Yes',
			cancelText: 'No',
			async onOk() {
				try {
					const items = cart.map((c) => ({
						productId: c.id,
						quantity: c.quantity,
						color: c.color ?? '',
						image: c.image,
					}));

					const payload = {
						items,
						deliveryAddress: {
							country: 'Bangladesh',
							division: values.division,
							subDivision: values.subDivision,
							postalCode: values.postalCode,
							details: values.details,
						},
						customerName: values.customerName,
						shippingMethod,
						email: values.email ?? '',
						phone_1: values.phone1,
						phone_2: values.phone2 ?? '',
						paymentMethod: PaymentMethod.CashOnDelivery,
						date: new Date().toISOString(),
					};

					const response = await createOrder(payload);
					setOrderResponse(response);

					clearCart();
					message.success('Order Placed Successfully! 🎉🎉');

					setShowInvoiceModal(true);
				} catch (error: any) {
					message.error(
						error?.response?.data?.message ||
							'Failed to process order. Please try again later.'
					);
				}
			},
			onCancel() {
				// No action on cancel
			},
		});
	};

	const calculateTotal = (): number => {
		const subtotal = cart.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
		return subtotal;
	};

	const handleShippingMethodChange = (selectedDivision: string) => {
		console.log('DIVISION: ', division);
		setDelivaryCharge(
			selectedDivision !== 'Dhaka (Only City)'
				? parseInt(
						String(process.env.NEXT_PUBLIC_OUTSIDE_DHAKA_SHIPPING_CHARGE)
				  )
				: parseInt(String(process.env.NEXT_PUBLIC_INSIDE_DHAKA_SHIPPING_CHARGE))
		);
		setShippingMethod(
			selectedDivision !== 'Dhaka (Only City)'
				? SHIPPING_METHODS.OUTSIDE_DHAKA
				: SHIPPING_METHODS.INSIDE_DHAKA
		);
	};

	const divisions = [
		{ key: 1, name: 'Dhaka (Only City)' },
		{ key: 2, name: 'Dhaka (Other Districts)' },
		{ key: 3, name: 'Chattogram' },
		{ key: 4, name: 'Rajshahi' },
		{ key: 5, name: 'Khulna' },
		{ key: 6, name: 'Barishal' },
		{ key: 7, name: 'Sylhet' },
		{ key: 8, name: 'Rangpur' },
		{ key: 9, name: 'Mymensingh' },
	];

	return (
		<div>
			<div className='relative w-full h-24'>
				<Image
					src='/images/shop-cover.jpg'
					alt='Product Banner'
					layout='fill'
					objectFit='cover'
					priority
				/>
				<div className='absolute inset-0 bg-black opacity-50'></div>
			</div>
			<div className='container mx-auto p-6 mt-14'>
				<h1 className='text-2xl font-bold mb-6'>Place Your Order</h1>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Order Summary */}
					<div className='bg-gray-50 p-3'>
						{cart.length > 0 ? (
							<h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
						) : (
							''
						)}

						<div
							className='border p-4 rounded-lg'
							style={{ maxHeight: '600px', overflowY: 'auto' }}
						>
							{cart.length > 0 ? (
								cart.map((item, index) => (
									<div key={index} className='mb-4'>
										<div className='flex justify-between gap-2'>
											<div className='flex flex-row justify-start items-start gap-3'>
												<Image
													src={item.image ?? '/images/default-product.png'}
													alt={item.name}
													loading='lazy'
													width={100}
													height={100}
													style={{ border: '3px solid black' }}
												/>
												<div>
													<p
														className={`text-wrap ${
															item.name.length > 20 ? 'text-lg' : 'text-xl'
														} font-semibold`}
													>
														{item.name}
													</p>
													<p className='text-sm text-gray-600'>
														Tk {item.price}/-
													</p>
													<p className='text-xs text-gray-600'>
														Color: {item.color}
													</p>
													<p className='text-sm text-gray-600 mt-4'>
														Quantity: {item.quantity}
													</p>
												</div>
											</div>
											<div>
												<p className='text-md text-gray-800 font-medium'>
													৳{item.price * item.quantity}
												</p>
											</div>
										</div>
									</div>
								))
							) : (
								<Empty description={'Your cart is empty'} />
							)}
						</div>

						{cart.length > 0 ? (
							<div className='ml-5'>
								<div>
									<div className='flex flex-row justify-between items-center'>
										<p className='font-bold text-md mt-3 text-gray-600'>
											SubTotal:{' '}
										</p>
										<p className='font-bold text-md mt-3 text-gray-600'>
											৳{calculateTotal()}
										</p>
									</div>

									<div className='flex flex-row justify-between items-center'>
										<p className='font-bold text-md mt-3 text-gray-600'>
											Delivery Charge:{' '}
										</p>
										<p className='font-bold text-md mt-3 text-gray-600'>
											৳{delivaryCharge}
										</p>
									</div>
								</div>

								<hr className='border-dashed mt-2' />

								<div className='flex flex-row justify-between items-center'>
									<p className='font-bold text-xl mt-3'>Total: </p>
									<p className='font-bold text-xl mt-3'>
										৳{(calculateTotal() + delivaryCharge).toFixed(2)}
									</p>
								</div>
							</div>
						) : (
							''
						)}
					</div>

					{/* order contact form */}
					<div>
						<Form onFinish={handleSubmit} layout='vertical'>
							<h2 className='text-xl font-semibold mb-4'>Contact Details</h2>
							<Row gutter={16} className='bg-gray-100 p-2 my-2'>
								<Col xs={24} sm={12}>
									<Form.Item label='Contact Email' name='email'>
										<Input
											placeholder='eg. ratul@gmail.com'
											className='!border-slate-300'
										/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={12}>
									<Form.Item
										label='Phone No.'
										name='phone1'
										rules={[
											{
												required: true,
												message: 'Please input your primary phone number!',
											},
										]}
									>
										<Input
											placeholder='eg. 01766610058'
											className='!border-slate-300'
										/>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item
								label='Name'
								name='customerName'
								rules={[{ required: true }]}
							>
								<Input
									placeholder='eg. Afia Siddiqa'
									className='!border-slate-300'
								/>
							</Form.Item>
							<Form.Item label='Country' name='country'>
								<Alert message='Bangladesh' className='!rounded-none' />
							</Form.Item>
							<Row gutter={16}>
								<Col xs={24} sm={8}>
									<Form.Item
										label='Division / Area'
										name='division'
										rules={[
											{
												required: true,
												message: 'Please input your division!',
											},
										]}
									>
										<Select
											placeholder='Select a division'
											onChange={(value) => {
												setDivision(value);
												handleShippingMethodChange(value);
											}}
											defaultActiveFirstOption
											className='h-11 border-1 '
										>
											{divisions.map((division) => (
												<Select.Option key={division.key} value={division.name}>
													{division.name}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col xs={24} sm={8}>
									<Form.Item
										label='City'
										name='subDivision'
										rules={[
											{
												required: true,
												message: 'Please input your sub-division!',
											},
										]}
									>
										<Input
											placeholder='eg. Gulshan'
											className='!border-slate-300'
										/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={8}>
									<Form.Item label='Postal Code' name='postalCode'>
										<Input
											placeholder='eg. 1100'
											className='!border-slate-300'
										/>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item
								label='Address Details'
								name='details'
								rules={[
									{
										required: true,
										message: 'Please input your address details!',
									},
								]}
							>
								<TextArea
									placeholder='eg. House#23 Road#5 Banani, Dhaka'
									className='!border-slate-300'
								/>
							</Form.Item>

							<Form.Item label='Alternative Phone No.' name='phone2'>
								<Input
									placeholder='eg. 01766610058'
									className='!border-slate-300'
								/>
							</Form.Item>

							<Row gutter={16} className='bg-gray-100 p-2 my-2'>
								<Col xs={24} sm={12}>
									<Form.Item
										label='Payment Method'
										name='paymentMethod'
										initialValue='Cash on Delivery'
									>
										<Alert
											message={'Cash on Delivery'}
											className='!rounded-none'
										/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={12}>
									<Form.Item
										label='Shipping Method'
										initialValue='Cash on Delivery'
									>
										<Alert
											message={shippingMethod}
											className='!rounded-none font-bold'
										/>
									</Form.Item>
								</Col>
							</Row>

							<div className='mb-6'>
								<p>
									For further details, please contact us on WhatsApp:{' '}
									<span className='font-bold'>+880 1877-820057</span>
								</p>
							</div>
							<PrimaryButton
								type='submit'
								disabled={cart.length <= 0}
								label={'Confirm Order'}
								icon={<ShoppingBagIcon className='w-5 h-5' />}
							/>
						</Form>
					</div>
				</div>
			</div>
			<Modal
				title='Order Invoice'
				open={showInvoiceModal}
				onCancel={() => setShowInvoiceModal(false)}
				footer={null}
			>
				{orderResponse && <Invoice order={orderResponse} />}
			</Modal>
		</div>
	);
};

export default CheckoutPage;
