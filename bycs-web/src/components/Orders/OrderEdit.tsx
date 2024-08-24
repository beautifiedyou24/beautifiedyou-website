import { DELIVERYSTATUS } from '@/enums/delivery-status.enum';
import { PaymentMethod } from '@/enums/payment-method.enum';
import { useOrderStore } from '@/store/orderStore';
import { renderStatusTag } from '@/utils/RenderStatusTag';
import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect } from 'react';

const { Option } = Select;

interface OrderEditProps {
	visible: boolean;
	onClose: () => void;
}

const OrderEdit: React.FC<OrderEditProps> = ({ visible, onClose }) => {
	const [form] = Form.useForm();
	const { selectedOrder, updateOrder, fetchOrderStats } = useOrderStore();

	useEffect(() => {
		if (visible && selectedOrder) {
			form.setFieldsValue(selectedOrder);
		}
	}, [visible, selectedOrder, form]);

	const handleSubmit = async (values: any) => {
		const payload = { ...selectedOrder, ...values };

		try {
			if (selectedOrder) {
				await updateOrder(selectedOrder.id, values, payload);
				message.success('Order updated successfully');
				window.location.reload();
				onClose();
			}
		} catch (error) {
			message.error('Failed to update order');
		}
	};

	return (
		<Modal
			title='Edit Order'
			open={visible}
			onCancel={onClose}
			onOk={() => form.submit()}
			width={800}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='customerName' label='Customer Name'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='email' label='Email'>
							<Input />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='phone_1' label='Phone 1'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='phone_2' label='Phone 2'>
							<Input />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name={['deliveryAddress', 'country']} label='Country'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name={['deliveryAddress', 'division']} label='Division'>
							<Input />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name={['deliveryAddress', 'subDivision']} label='City'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name={['deliveryAddress', 'postalCode']}
							label='Postal Code'
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name={['deliveryAddress', 'details']}
					label='Address Details'
				>
					<Input.TextArea />
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='shippingMethod' label='Shipping Method'>
							<Select>
								<Option value='INSIDE_DHAKA'>Inside Dhaka</Option>
								<Option value='OUTSIDE_DHAKA'>Outside Dhaka</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='paymentMethod' label='Payment Method'>
							<Select>
								{Object.values(PaymentMethod).map((method) => (
									<Option key={method} value={method}>
										{method}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name='deliveryStatus'
					label='Delivery Status'
					className='bg-slate-200 p-2 rounded'
				>
					<Select>
						{Object.values(DELIVERYSTATUS).map((status) => (
							<Option key={status} value={status}>
								{renderStatusTag(status)}
							</Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default OrderEdit;
