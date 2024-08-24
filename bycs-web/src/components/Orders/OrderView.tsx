import { getShippingCharge } from '@/config/utils';
import { useOrderStore } from '@/store/orderStore';
import { renderStatusTag } from '@/utils/RenderStatusTag';
import {
	CreditCardOutlined,
	DollarOutlined,
	EnvironmentOutlined,
	GlobalOutlined,
	HomeOutlined,
	MailOutlined,
	PhoneOutlined,
	ShoppingCartOutlined,
	TagOutlined,
	TruckOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Col, Modal, Row } from 'antd';
import { useEffect } from 'react';
import Label from '../shared/Label';

interface OrderViewProps {
	visible: boolean;
	onClose: () => void;
}

const OrderView = ({ visible, onClose }: OrderViewProps) => {
	const selectedOrder = useOrderStore((state) => state.selectedOrder);
	const orderDetails = selectedOrder;

	useEffect(() => {
		console.log('ORder details: ', orderDetails);
	}, [orderDetails]);

	return (
		<div>
			<Modal
				title={
					<div style={{ fontSize: '24px', fontWeight: 'bold' }}>
						<Label
							icon={<ShoppingCartOutlined />}
							label={`Order #${orderDetails?.orderNumber}`}
						/>
					</div>
				}
				open={visible}
				onCancel={onClose}
				width={800}
				footer={[
					<Button key='back' onClick={onClose}>
						Close
					</Button>,
				]}
			>
				<div style={{ marginTop: 16 }}>
					<h4 className='font-bold flex justify-center bg-cyan-100 p-2 text-lg mt-4'>
						<Label icon={<UserOutlined />} label='Order Details' />
					</h4>
					<hr className='mb-3' />
					<Row gutter={16}>
						<Col span={12}>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<UserOutlined />}
									label='Customer:'
									className='font-bold'
								/>
								<span className='text-pink-800 font-extrabold'>
									{orderDetails?.customerName}
								</span>
							</p>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<MailOutlined />}
									label='Email:'
									className='font-bold'
								/>
								<span className='text-blue-600 font-extrabold'>
									{orderDetails?.email || 'N/A'}
								</span>
							</p>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<PhoneOutlined />}
									label='Phone:'
									className='font-bold'
								/>
								<span className='text-green-600 font-extrabold'>
									{orderDetails?.phone_1}
								</span>
							</p>
						</Col>
						<Col span={12}>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<TruckOutlined />}
									label='Shipping Method:'
									className='font-bold'
								/>
								<span className='text-blue-600 font-extrabold flex flex-row gap-2'>
									<span>{orderDetails?.shippingMethod}</span>
									{orderDetails?.shippingMethod && (
										<span className='text-coreBrown'>
											{'('}
											{getShippingCharge(orderDetails?.shippingMethod)}
											{'/-)'}
										</span>
									)}
								</span>
							</p>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<TagOutlined />}
									label='Status:'
									className='font-bold'
								/>
								<span className='text-blue-600 font-extrabold'>
									{orderDetails?.deliveryStatus
										? renderStatusTag(orderDetails?.deliveryStatus)
										: ''}
								</span>
							</p>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<CreditCardOutlined />}
									label='Payment Method:'
									className='font-bold'
								/>
								<span className='text-blue-600 font-extrabold'>
									{orderDetails?.paymentMethod}
								</span>
							</p>
						</Col>
					</Row>
					<h4 className='font-bold flex justify-center bg-blue-100 p-2 text-md my-2'>
						<Label icon={<EnvironmentOutlined />} label='Delivery Address' />
					</h4>
					<Row gutter={16}>
						<Col span={12}>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<GlobalOutlined />}
									label='Country:'
									className='font-bold'
								/>
								<span>{orderDetails?.deliveryAddress.country}</span>
							</p>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<EnvironmentOutlined />}
									label='Division:'
									className='font-bold'
								/>
								<span>{orderDetails?.deliveryAddress.division}</span>
							</p>
						</Col>
						<Col span={12}>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<EnvironmentOutlined />}
									label='Sub-Division:'
									className='font-bold'
								/>
								<span>{orderDetails?.deliveryAddress.subDivision}</span>
							</p>
							<p className='bg-slate-200 p-2 text-md'>
								<Label
									icon={<HomeOutlined />}
									label='Postal Code:'
									className='font-bold'
								/>
								<span>{orderDetails?.deliveryAddress.postalCode}</span>
							</p>
						</Col>
					</Row>
					<p className='bg-slate-200 p-2 text-md mt-2'>
						<Label
							icon={<HomeOutlined />}
							label='Address Details:'
							className='font-bold'
						/>
						<span>{orderDetails?.deliveryAddress.details}</span>
					</p>
					<h4 className='font-bold flex justify-center bg-blue-100 p-2 text-md mt-2'>
						<Label icon={<ShoppingCartOutlined />} label='Ordered Items' />
					</h4>
					<div className='flex flex-col gap-2 p-2'>
						{orderDetails?.items?.map((item: any, index: number) => (
							<div
								key={index}
								className='bg-gray-100 p-2 rounded flex justify-between items-center mb-2 overflow-y-auto'
							>
								<div className='flex items-center'>
									{/* <img
									src={item.image ?? '/images/default-product.png'}
									alt={item.product?.name}
									className='w-16 h-16 object-cover mr-4'
								/> */}
									<div>
										<p className='text-sm'>
											Product:{' '}
											<span className='capitalize text-coreBrown font-bold'>
												{item.product?.name}
											</span>
										</p>
										<p className='font-light text-xs '>
											Color:{' '}
											<span className='capitalize text-coreBrown'>
												{item.color}
											</span>{' '}
										</p>
										<p className='text-xs '>Quantity: {item.quantity}</p>
									</div>
								</div>
								<p className='font-bold'>
									{item.product?.finalPrice * item.quantity} /-
								</p>
							</div>
						))}
						<hr className='border-dashed' />
						<div className='mt-4 text-right'>
							<p className='font-bold text-lg flex justify-between items-center'>
								<span>
									<DollarOutlined /> Total (With Delivery Charge):
								</span>
								<span className='text-blue-600 font-extrabold'>
									{orderDetails?.totalPrice} /-
								</span>
							</p>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default OrderView;
