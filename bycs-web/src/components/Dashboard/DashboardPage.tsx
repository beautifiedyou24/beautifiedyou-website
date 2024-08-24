import DashboardSalesChart from './elements/dashboardSalesChart';
import DashboardSummaryCard from './elements/dashboardSummaryCard';

const DashboardPage = () => {
	return (
		<div>
			<DashboardSummaryCard />
			<DashboardSalesChart />
		</div>
	);
};

export default DashboardPage;
