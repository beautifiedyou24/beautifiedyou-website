import LoginPage from '@/components/LoginPage';

import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Login',
};

export default function Login() {
	return <LoginPage />;
}
