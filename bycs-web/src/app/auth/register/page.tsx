import RegisterPage from '@/components/RegisterPage';
import AppLayout from '@/components/shared/AppLayout';

import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Register',
};

export default function Register() {
	return (
		<AppLayout>
			<RegisterPage />
		</AppLayout>
	);
}
