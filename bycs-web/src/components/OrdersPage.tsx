'use client';

import OrderSummaryCard from '@/components/Orders/elements/orderSummaryCard';
import OrderTable from '@/components/Orders/OrderTable';
import SearchBar from '@/components/shared/SearchBar';
import { DATE_FORMAT } from '@/constants/common';
import { useOrderStore } from '@/store/orderStore';
import formatDate from '@/utils/helper';
import { Breadcrumb, Button, DatePicker, Radio, RadioChangeEvent } from 'antd';
import { ChevronDown, ChevronUp, RotateCcwIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const { RangePicker } = DatePicker;

const OrdersPage = () => {
	const [loading, setLoading] = useState(false);
	const [showCategoryFilter, setShowCategoryFilter] = useState(false);
	const [filteredStatus, setFilteredStatus] = useState();

	const [dateRange, setDateRange] = useState(null);

	const { fetchOrders, fetchOrderStats, orderStats } = useOrderStore();

	const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = event.target.value;
		setLoading(true);
		await fetchOrders(undefined, searchTerm);
		setLoading(false);
	};

	const handleDateRangeChange = async (dates: any) => {
		const formattedStartDate = formatDate(dates[0], DATE_FORMAT.FORMAT_1);
		const formattedEndDate = formatDate(dates[1], DATE_FORMAT.FORMAT_1);

		setDateRange(dates);
		await fetchOrderStats(formattedStartDate, formattedEndDate);
		await fetchOrders(
			undefined,
			undefined,
			formattedStartDate,
			formattedEndDate
		);
	};

	const handleReset = async () => {
		setLoading(true);
		setDateRange(null);
		await fetchOrders();
		await fetchOrderStats();
		setLoading(false);
		setFilteredStatus(undefined);
		setShowCategoryFilter(false);
	};

	const deliveryStatusOptions = [
		{ label: 'Processing', value: 'Processing' },
		{ label: 'Dispatched', value: 'Dispatched' },
		{ label: 'Delivered', value: 'Delivered' },
		{ label: 'Cancelled', value: 'Cancelled' },
	];

	return (
		<div className='p-3'>
			{/* Top Header */}

			<div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between'>
				<div className='w-full sm:w-auto'>
					<h2 className='font-bold text-xl sm:text-2xl mb-2'>Order Details</h2>
					<Breadcrumb
						items={[
							{
								title: <Link href='/admin/dashboard'>Dashboard</Link>,
							},
							{
								title: 'Order',
							},
						]}
					/>
				</div>
				<div className='w-full sm:w-auto mt-4 sm:mt-0 flex flex-col items-center gap-2'>
					<div>
						<RangePicker
							value={dateRange}
							onChange={handleDateRangeChange}
							placeholder={['Start Date', 'End Date']}
							style={{ maxWidth: 290 }}
						/>
					</div>
					<div className='flex flex-row gap-2'>
						<SearchBar
							placeholder={'Search Orders'}
							onChange={(event) => {
								handleSearch(event);
							}}
							isLoading={loading}
						/>
						<Button
							type='primary'
							onClick={handleReset}
							className='w-8 flex justify-center items-center px-2 bg-red-500'
						>
							<RotateCcwIcon size={15} />
						</Button>
					</div>

					{/* filter by delivery status */}
					<div className='relative'>
						<div className='flex flex-row gap-2'>
							<p>Filter By: </p>
							<button
								className='flex flex-1 justify-center items-center gap-1 font-medium'
								onClick={() => {
									setShowCategoryFilter(!showCategoryFilter);
								}}
							>
								<span className='hover:text-coreDarkBrown font-bold text-coreBrown'>
									Delivery Status
								</span>
								{!showCategoryFilter ? (
									<ChevronDown size={18} />
								) : (
									<ChevronUp size={18} />
								)}
							</button>
						</div>

						<div className='flex flex-row'>
							<div>
								{showCategoryFilter && (
									<div className='absolute top-full left-0 mt-2 bg-white border-2 border-coreBrown shadow-2xl shadow-coreLightPink rounded-lg p-4 z-10 w-40'>
										<Radio.Group
											options={deliveryStatusOptions}
											value={filteredStatus}
											onChange={(e: RadioChangeEvent) => {
												const checkedValues = e.target.value;
												setFilteredStatus(checkedValues);
												fetchOrders(
													undefined,
													undefined,
													undefined,
													undefined,
													checkedValues
												);
											}}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tremor Summary Card */}
			<div className='w-full sm360:w-1/2 my-2 p-2 flex flex-col justify-between items-center rounded-lg'>
				<OrderSummaryCard />
			</div>

			{/* Content */}
			<div className='bg-slate-200 min-h-screen rounded-lg'>
				<OrderTable />
			</div>
		</div>
	);
};

export default OrdersPage;
