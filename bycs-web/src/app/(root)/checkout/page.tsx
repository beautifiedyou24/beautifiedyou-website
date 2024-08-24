import CheckoutPage from '@/components/CheckoutPage';
import AppLayout from '@/components/shared/AppLayout';

import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Checkout',
};

export default function Shop() {
	return (
		<AppLayout>
			<CheckoutPage />
		</AppLayout>
	);
}
