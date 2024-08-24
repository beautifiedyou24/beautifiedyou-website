import { DELIVERYSTATUS } from '@/enums/delivery-status.enum';
import { Tag } from 'antd';

const CustomTag = ({ color, children }: any) => (
	<span className='text-warning'>
		<Tag color={color} style={{ fontWeight: 'bold' }}>
			{children}
		</Tag>
	</span>
);

export const renderStatusTag = (status: string) => {
	switch (status) {
		case DELIVERYSTATUS.Processing:
			return <CustomTag color='yellow'>Processing</CustomTag>;
		case DELIVERYSTATUS.Dispatched:
			return <CustomTag color='blue'>Dispatched</CustomTag>;
		case DELIVERYSTATUS.Delivered:
			return <CustomTag color='green'>Delivered</CustomTag>;
		case DELIVERYSTATUS.Cancelled:
			return <CustomTag color='red'>Cancelled</CustomTag>;
		default:
			return <CustomTag color='gray'>N/A</CustomTag>;
	}
};
