'use client';

import { ProductStatsType } from '@/models/product.model';
import { useOrderStore } from '@/store/orderStore';
import useProductStore from '@/store/productStore';
import {
	BarChart as BarGraph,
	Card,
	DonutChart,
	Legend as GraphLegend,
	Title,
} from '@tremor/react';
import { useEffect, useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const DashboardSalesChart = () => {
	const { fetchOrderStats, orderStats } = useOrderStore();
	const { fetchProductStats, productStats } = useProductStore();
	const [topSoldProducts, setTopSoldProducts] = useState<
		ProductStatsType | {}
	>();
	const [divisionWiseSales, setDivisionWiseSales] = useState<
		{ division: string; Sales: number }[]
	>([]);
	const [divisions, setDivisions] = useState<string[]>([]);

	const handleProductDataFetch = async () => {
		const productResponse = await fetchProductStats();
		setTopSoldProducts(productResponse);
	};

	const handleOrderDataFetch = async () => {
		await fetchOrderStats();
	};

	useEffect(() => {
		handleProductDataFetch();
		handleOrderDataFetch();
	}, []);

	useEffect(() => {
		if (orderStats) {
			const divisionWiseSalesData = orderStats.divisionWiseSalesStats?.map(
				(item) => ({
					division: item.division,
					Sales: item.Sales as number,
				})
			);

			setDivisions(
				orderStats.divisionWiseSalesStats?.map((item) => item.division) || []
			);
			setDivisionWiseSales(divisionWiseSalesData);
		}
	}, [orderStats]);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-5'>
			{/* Monthly order status */}
			{orderStats && (
				<Card className='w-full'>
					<h2 className='font-semibold text-cyan-700 text-lg md:text-xl'>
						Monthly Devlivery Status
					</h2>
					<ResponsiveContainer width='100%' height={400}>
						<BarChart
							data={orderStats.monthlyDeliveryStats}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='month' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey='Processing' stackId='a' fill='#FFD700' />
							<Bar dataKey='Dispatched' stackId='a' fill='#1E90FF' />
							<Bar dataKey='Delivered' stackId='a' fill='#32CD32' />
							<Bar dataKey='Cancelled' stackId='a' fill='#FF4500' />
						</BarChart>
					</ResponsiveContainer>
				</Card>
			)}

			{/* Top Sales chart */}
			{productStats && (
				<Card className='w-full'>
					<Title className='font-semibold text-cyan-700 text-lg md:text-xl'>
						Top 5 most sold Products
					</Title>

					<BarGraph
						data={productStats?.top5SoldProducts}
						index='product'
						categories={['Sales']}
						colors={['emerald']}
						yAxisWidth={120}
						xAxisLabel='Total Sold Count'
						yAxisLabel='Product Name'
						className='mt-4 h-80'
						layout='vertical'
					/>
				</Card>
			)}

			{/* Sales by Division */}
			{orderStats && (
				<Card className='w-full'>
					<Title className='font-semibold text-cyan-700 text-lg md:text-xl'>
						Top 5 Sales by Division
					</Title>
					<DonutChart
						data={divisionWiseSales}
						variant='pie'
						category='Sales'
						index='division'
						valueFormatter={(number) => `${number.toFixed(2)}%`}
						className='mt-4 h-80'
						colors={['blue', 'green', 'yellow', 'red', 'purple']}
						showLabel={true}
						label='division'
						showTooltip={true}
					/>

					<GraphLegend
						categories={divisions}
						className='mt-4'
						colors={['blue', 'green', 'yellow', 'red', 'purple']}
					/>
				</Card>
			)}

			{/* Sales by Monthly data */}
			{orderStats && (
				<Card className='w-full'>
					<h2 className='font-semibold text-cyan-700 text-lg md:text-xl'>
						Monthly Sales
					</h2>
					<ResponsiveContainer width='100%' height={400}>
						<BarChart
							width={650}
							height={400}
							data={orderStats.monthlySalesStats}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='month' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey='sales' fill='#8884d8'>
								<LabelList dataKey='sales' position='top' />
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</Card>
			)}
		</div>
	);
};

export default DashboardSalesChart;
