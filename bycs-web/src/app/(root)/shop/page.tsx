import AppLayout from '@/components/shared/AppLayout';
import ShopPage from '@/components/ShopPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Shop',
};

export default function Shop() {
	return (
		<AppLayout>
			<ShopPage />
		</AppLayout>
	);
}
