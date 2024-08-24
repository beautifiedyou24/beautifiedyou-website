'use client';

import axiosInstance from '@/utils/axiosConfig';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Item: FormItem } = Form;

const RegisterPage = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const onFinish = async (payload: any) => {
		setLoading(true);

		try {
			await axiosInstance.post('/v1/auth/signup', {
				name: payload.name,
				email: payload.email,
				password: payload.password,
			});

			message.success('Registration Successful!');
		} catch (error: any) {
			message.error(error?.response?.data?.message);
		}

		setLoading(false);
		router.push('/auth/login');
	};

	return (
		<div className='flex justify-center items-center min-h-screen sm:bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600'>
			<div className='w-full max-w-md bg-white p-8 rounded-lg sm:shadow-lg'>
				<h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>
					Register Here!
				</h2>
				<Form layout='vertical' onFinish={onFinish} style={{ width: '100%' }}>
					<FormItem
						label='Name'
						name='name'
						rules={[
							{
								required: true,
								message: 'Please input your name!',
							},
						]}
					>
						<Input
							placeholder='Enter name'
							type='text'
							className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600'
						/>
					</FormItem>
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
							className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600'
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
							className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600'
						/>
					</FormItem>
					<FormItem>
						<Button
							type='primary'
							htmlType='submit'
							loading={loading}
							block
							className='bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition duration-200 flex justify-center items-center'
						>
							Register
						</Button>
					</FormItem>
				</Form>
				<div className='text-center mt-4'>
					<Button
						type='link'
						onClick={() => router.push('/auth/login')}
						className='text-violet-600 hover:text-violet-800'
					>
						Already have an account? Login here
					</Button>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
