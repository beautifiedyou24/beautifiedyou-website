import { useOrderStore } from '@/store/orderStore';
import {
	RiCheckboxCircleLine,
	RiCloseCircleLine,
	RiCurrencyLine,
	RiShoppingBag3Line,
	RiTruckLine,
} from '@remixicon/react';
import { Card, Icon } from '@tremor/react';
import { useEffect } from 'react';

const OrderSummaryCard = () => {
	const { orderStats, fetchOrderStats } = useOrderStore();

	const processingCount = orderStats?.Processing;
	const dispatchCount = orderStats?.Dispatched;
	const deliveredCount = orderStats?.Delivered;
	const cancelledCount = orderStats?.Cancelled;
	const totalSales = orderStats?.totalSales;

	const orderData = [
		{
			title: 'Processing Orders',
			count: processingCount,
			icon: RiShoppingBag3Line,
			color: 'yellow',
		},
		{
			title: 'Orders on the Way',
			count: dispatchCount,
			icon: RiTruckLine,
			color: 'blue',
		},
		{
			title: 'Delivered Orders',
			count: deliveredCount,
			icon: RiCheckboxCircleLine,
			color: 'green',
		},
		{
			title: 'Cancelled Orders',
			count: cancelledCount,
			icon: RiCloseCircleLine,
			color: 'red',
		},
		{
			title: 'Total Sales',
			count: totalSales,
			icon: RiCurrencyLine,
			color: 'purple',
		},
	];

	useEffect(() => {
		fetchOrderStats();
	}, []);

	return (
		<div className='w-full'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
				{orderData.map((item, index) => (
					<Card key={index} className={`w-full bg-${item.color}-100`}>
						<div className='flex items-start space-x-6'>
							<Icon
								icon={item.icon}
								color={item.color as 'red' | 'blue' | 'green' | 'yellow'}
								variant='solid'
								tooltip={item.title}
								size='lg'
							/>
							<div>
								<p className={`text-tremor-default text-${item.color}-700`}>
									{item.title}
								</p>
								<p className={`text-xl text-${item.color}-900 font-semibold`}>
									{item.count}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default OrderSummaryCard;
