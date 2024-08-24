// components/Invoice.tsx
import { getShippingCharge } from '@/config/utils';
import { Modal } from 'antd';
import html2canvas from 'html2canvas';
import { DownloadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { OrderResponseType } from '../Orders/types/order.type';
import PrimaryButton from './PrimaryButton';

interface InvoiceProps {
	order: OrderResponseType;
}

const Invoice: React.FC<InvoiceProps> = ({ order }) => {
	const router = useRouter();

	const handleDownloadInvoice = () => {
		const invoiceElement = document.getElementById('invoice');
		if (invoiceElement) {
			html2canvas(invoiceElement).then((canvas) => {
				const imgData = canvas.toDataURL('image/jpeg');
				const link = document.createElement('a');
				link.download = `invoice_${order.orderNumber}.jpg`;
				link.href = imgData;
				link.click();
			});
		}
	};

	const getProductPrice = () => {
		let productPrice = 0;
		order?.items.forEach((item: any) => {
			productPrice += item?.product?.finalPrice * item.quantity;
		});
		return productPrice;
	};

	const onClose = () => {
		router.push('/shop');
	};

	return (
		<Modal
			title='Order Invoice'
			open={true}
			onCancel={onClose}
			footer={
				<div className='invoice-footer'>
					<PrimaryButton
						label={'Download'}
						icon={<DownloadIcon size={20} />}
						onClick={handleDownloadInvoice}
					/>
				</div>
			}
			width={750}
		>
			<div id='invoice' className=' w-[700px]'>
				<div
					style={{
						padding: '20px',
						fontFamily: 'Arial, sans-serif',
						color: '#333',
						margin: 'auto',
					}}
					className='border-2 border-coreLightPink w-full max-w-[1000px]'
				>
					{/* header */}
					<div className='text-center mb-5 bg-pink-100 p-5'>
						<h1 className='text-coreBrown font-bold uppercase m-0 text-4xl'>
							BEAUTIFIED YOU
						</h1>
						<p className='text-pink-500 font-medium'>
							647-444-1234 | beautifiedyoua@email.com | beautifiedyoubd.com
						</p>
						<p className='text-lg mt-3 text-black'>
							Invoice:{' '}
							<span className='font-extrabold text-coreDarkBrown'>
								#{order?.orderNumber}
							</span>
						</p>
					</div>

					{/* 2nd row: billing address and invoice total*/}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: '20px',
						}}
					>
						<div>
							<h1>
								<strong className='text-pink-500'>Billed To:</strong>
							</h1>
							<p>{order?.deliveryAddress.details}</p>
							<p>
								{order?.deliveryAddress.subDivision},{' '}
								{order?.deliveryAddress.division}
							</p>
							<p>
								{order?.deliveryAddress.country},{' '}
								{order?.deliveryAddress.postalCode}
							</p>
						</div>
						<div>
							<div>
								<h1 className='text-pink-500 font-bold'>Date Of Issue:</h1>
								<p>{new Date(order?.date).toLocaleDateString()}</p>
							</div>

							<div>
								<h1 className='text-pink-500 font-bold'>Shipping Method:</h1>
								<div className='flex flex-row gap-1'>
									<span className='capitalize'>{order?.shippingMethod}</span>
								</div>
							</div>
						</div>
						<div style={{ textAlign: 'right', marginBottom: '20px' }}>
							<h1>
								<strong className='font-bold text-pink-500'>
									Invoice Total
								</strong>
							</h1>
							<p className='text-4xl text-coreBrown font-extrabold m-0'>
								৳{order?.totalPrice.toFixed(2)}
							</p>
						</div>
					</div>

					{/* 3rd row: product details */}
					<table
						style={{
							width: '100%',
							borderCollapse: 'collapse',
							marginBottom: '20px',
						}}
					>
						<thead>
							<tr>
								<th
									className='border-b-4 border-coreLightPink text-left'
									style={{ padding: '10px 0 10px 0px' }}
								>
									Description
								</th>
								<th
									className='border-b-4 border-coreLightPink text-right'
									style={{ padding: '10px 0 10px 0px' }}
								>
									Unit Cost
								</th>
								<th
									className='border-b-4 border-coreLightPink text-right'
									style={{ padding: '10px 0 10px 0px' }}
								>
									Quantity
								</th>
								<th
									className='border-b-4 border-coreLightPink text-right'
									style={{ padding: '10px 0 10px 0px' }}
								>
									Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{order?.items.map((item: any, index: number) => (
								<tr key={index}>
									<td className='border-b-2 border-pink-100 py-2 px-0 text-left'>
										<p style={{ margin: 0 }}>{item?.product.name}</p>
										<p style={{ margin: 0, fontSize: '12px', color: '#555' }}>
											Color: {item?.color}
										</p>
									</td>
									{item?.product.discount ? (
										<td className='border-b-2 border-pink-100 py-2 px-0 text-right'>
											৳{item?.product.finalPrice.toFixed(2)}
										</td>
									) : (
										<td className='border-b-2 border-pink-100 py-2 px-0 text-right'>
											৳{item?.product.price.toFixed(2)}
										</td>
									)}
									<td className='border-b-2 border-pink-100 py-2 px-0 text-right'>
										{item?.quantity}
									</td>
									{item?.product.discount ? (
										<td className='border-b-2 border-pink-100 py-2 px-0 text-right'>
											৳{(item?.product.finalPrice * item.quantity).toFixed(2)}
										</td>
									) : (
										<td className='border-b-2 border-pink-100 py-2 px-0 text-right'>
											৳{(item?.product.price * item.quantity).toFixed(2)}
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>

					{/* 4th row: payment details */}
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<table style={{ width: '300px', borderCollapse: 'collapse' }}>
							<tbody>
								<tr>
									<td style={{ padding: '5px 0' }}>
										<strong>Subtotal:</strong>
									</td>
									<td style={{ padding: '5px 0', textAlign: 'right' }}>
										৳{getProductPrice()}
									</td>
								</tr>
								<tr>
									<td style={{ padding: '5px 0' }}>
										<strong>Shipping Charge:</strong>
									</td>
									<td style={{ padding: '5px 0', textAlign: 'right' }}>
										৳{getShippingCharge(order?.shippingMethod)}
									</td>
								</tr>
								<tr>
									<td className='border-t-2 border-pink-100 py-1 px-0 text-left'>
										<strong>Total:</strong>
									</td>
									<td className='border-t-2 border-pink-100 py-1 px-0 text-right'>
										৳{order?.totalPrice.toFixed(2)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default Invoice;
