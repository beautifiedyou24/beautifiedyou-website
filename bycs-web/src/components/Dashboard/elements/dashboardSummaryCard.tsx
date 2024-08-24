'use client';

import Loader from '@/components/shared/Loader';
import { DELIVERYSTATUS } from '@/enums/delivery-status.enum';
import { useOrderStore } from '@/store/orderStore';
import useProductStore from '@/store/productStore';
import {
	RiMoneyDollarCircleLine,
	RiShoppingBag3Line,
	RiShoppingBasketFill,
} from '@remixicon/react';
import { Card, Icon } from '@tremor/react';
import { InfoIcon } from 'lucide-react';
import { useEffect } from 'react';

const DashboardSummaryCard = () => {
	const { orders, orderStats, fetchOrders, fetchOrderStats, orderMeta } =
		useOrderStore();
	const { fetchProducts, fetchProductStats, productMeta } = useProductStore();

	const totalOrders = orderStats?.totalOrders;
	const productCount = productMeta?.totalFilteredItemCount;
	const totalSales = orderStats?.totalSales;

	const summaryData = [
		{
			title: 'Total Orders',
			count: totalOrders,
			icon: RiShoppingBag3Line,
			color: 'yellow',
		},
		{
			title: 'Total Products',
			count: productCount,
			icon: RiShoppingBasketFill,
			color: 'blue',
		},
		{
			title: 'Total Sales',
			count: `${totalSales?.toFixed(2)} BDT`,
			icon: RiMoneyDollarCircleLine,
			color: 'green',
			helpMessage: 'Only the Delivered Orders are counted',
		},
	];

	useEffect(() => {
		fetchOrders(1, '', '', '', DELIVERYSTATUS.Delivered, 15);
		fetchProducts();
		fetchOrderStats();
	}, []);

	if (!orders && !orderStats) return <Loader />;

	return (
		<div className='w-full'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				{summaryData.map((item, index) => (
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
								<p
									className={`text-tremor-default text-${item.color}-700 flex flex-row gap-2 items-center`}
								>
									<span>{item.title}</span>
									<span>{item.helpMessage && <InfoIcon size={15} />}</span>
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

export default DashboardSummaryCard;
