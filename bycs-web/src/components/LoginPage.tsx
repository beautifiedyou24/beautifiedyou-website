'use client';

import AppLayout from '@/components/shared/AppLayout';
import PrimaryButton from '@/components/shared/PrimaryButton';
import { useAuthStore, useTokenStore } from '@/store/userStore';
import axiosInstance from '@/utils/axiosConfig';

import { Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Item: FormItem } = Form;

const LoginPage = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const setUser = useAuthStore((state) => state.setUser);
	const setAccessToken = useTokenStore((state) => state.setAccessToken);

	const onFinish = async (payload: any) => {
		setLoading(true);

		try {
			const resp = await axiosInstance.post('/v1/auth/login', {
				email: payload.email,
				password: payload.password,
			});

			const data = resp.data.data;

			setUser(data.user);
			setAccessToken(data.accessToken);

			message.success('Login Successful!');

			// Get the redirectUrl from the URL search params
			const searchParams = new URLSearchParams(window.location.search);
			let redirectUrl = searchParams.get('redirectUrl');

			if(data.user.roles.includes('Admin')){
				redirectUrl = '/admin/dashboard'
			}

			// If redirectUrl is present, redirect the user to that URL
			// Otherwise, redirect to the home page
			router.push(redirectUrl || '/');
		} catch (error: any) {
			message.error(error?.response?.data?.message);
		}

		setLoading(false);
	};

	const navigateToRegister = () => {
		router.push('/auth/register');
	};

	return (
		<AppLayout>
			<div className='flex justify-center items-center min-h-screen sm:bg-gradient-to-r from-fuchsia-600 via-fuchsia-700 to-fuchsia-800 bg-pink-100'>
				<div className='w-full max-w-md bg-white p-8 rounded-lg sm:shadow-lg'>
					<h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>
						Login Here!
					</h2>
					<Form layout='vertical' onFinish={onFinish} style={{ width: '100%' }}>
						<FormItem
							label='Email'
							name='email'
							rules={[
								{
									required: true,
									message: 'Please input your email!',
								},
								{
									type: 'email',
									message: 'Please enter a valid email!',
								},
							]}
						>
							<Input
								placeholder='Enter email'
								type='email'
								className='p-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-coreBrown'
							/>
						</FormItem>
						<FormItem
							label='Password'
							name='password'
							rules={[
								{
									required: true,
									message: 'Please input your password!',
								},
							]}
						>
							<Input
								placeholder='Enter password'
								type='password'
								className='p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coreBrown rounded-none'
							/>
						</FormItem>
						<FormItem>
							<PrimaryButton label={'Login'} type='submit' />
						</FormItem>
					</Form>
					<div className='text-center text-sm mt-4 flex flex-row gap-1 justify-center'>
						<span>Don&apos;t have an account? Register</span>
						<p
							onClick={navigateToRegister}
							className='font-light hover:text-coreBrown text-coreDarkBrown underline cursor-pointer'
						>
							here
						</p>
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default LoginPage;
