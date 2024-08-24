import useProductStore from '@/store/productStore';
import axiosInstance from '@/utils/axiosConfig';
import { Alert, Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';

const DiscountModal = ({ visible, onClose }: any) => {
	const [form] = Form.useForm();
	const [discount, setDiscount] = useState(0);
	const [discountedPrice, setDiscountedPrice] = useState<number>(0);
	const { selectedProduct, fetchProducts } = useProductStore();

	const product = selectedProduct;

	const handleDiscountChange = (event: { target: { value: any } }) => {
		const value = event.target.value;
		setDiscountedPrice(value);

		if (product) {
			const discountPercentage = parseFloat(
				String(((product?.price - value) / product?.price) * 100)
			).toFixed(2);
			setDiscount(parseFloat(discountPercentage));
		}
	};

	const handleOk = async () => {
		form.validateFields().then(async (values) => {
			const formData = {
				startAt: new Date().toISOString(),
				endAt: new Date().toISOString(),
				percentage: discount / 100,
				details: values.details ?? '',
			};

			try {
				await axiosInstance.put(
					`/v1/products/${product?.slug}/discount`,
					formData
				);
				fetchProducts();
				message.success('Discount Added Successfully!');
			} catch (error) {
				console.log('Failed to add Discount');
			}

			onClose();
		});
	};

	useEffect(() => {
		if (product?.price) {
			const initialDiscount = product?.discount
				? parseFloat(product.discount.percentage)
				: 0;

			const discountedPrice = product.price - initialDiscount * product.price;

			form.setFieldsValue({
				discountedPrice: product?.discount ? discountedPrice : 0,
			});

			setDiscountedPrice(discountedPrice);
			setDiscount(initialDiscount * 100);
		}
	}, [visible]);

	return (
		<Modal
			open={visible}
			title='Manage Product Discount'
			onCancel={onClose}
			footer={[
				<Button key='cancel' onClick={onClose}>
					Cancel
				</Button>,
				<Button key='ok' type='primary' onClick={handleOk}>
					Save
				</Button>,
			]}
		>
			<Form form={form} layout='vertical' className='mt-5'>
				<Form.Item label='Product Name'>
					<Alert
						message={`${product?.name}`}
						type='info'
						className='text-xs !rounded-none font-semibold h-10'
					/>
				</Form.Item>

				<Form.Item label='Category'>
					<Alert
						message={`${product?.categories[0]}`}
						type='info'
						className='text-xs !rounded-none font-semibold h-10'
					/>
				</Form.Item>

				<Form.Item label='Price'>
					<Alert
						message={`৳${product?.price.toFixed(2)}`}
						type='info'
						className='text-sm !rounded-none font-semibold h-10'
					/>
				</Form.Item>

				{/* <Row gutter={16}>
					<Col span={12}>
					</Col>
					<Col span={12}>
						<Form.Item
							name='dates'
							label='Discount Dates'
							rules={[
								{ required: true, message: 'Please select the discount dates' },
							]}
						>
							<RangePicker format='YYYY-MM-DD' />
						</Form.Item>
					</Col>
				</Row> */}

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='discountedPrice'
							label='Discounted Price'
							rules={[
								{
									required: true,
									message: 'Please enter a discount price',
								},
							]}
						>
							<Input
								type='number'
								style={{ width: '100%' }}
								onChange={handleDiscountChange}
								className='!rounded-none h-10 text-sm'
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Discount (%)' name='discount'>
							{discountedPrice && (
								<Alert
									message={`~ ${discount}%`}
									className='!rounded-none font-bold text-red-500 text-center h-10'
									type='warning'
								/>
							)}
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='details' label='Additional Details'>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DiscountModal;
