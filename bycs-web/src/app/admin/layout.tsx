'use client';

import { USER_ROLE } from '@/constants/common';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore, useTokenStore } from '@/store/userStore';
import '@/styles/globals.css';
import { Badge, Button, Layout, Menu, MenuProps } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import {
	ChevronLeft,
	ChevronRight,
	DollarSign,
	Home,
	LogOut,
	ShoppingBasket,
	Tags,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from './loading';

const { Header, Sider, Content, Footer } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const pathname = usePathname();

	const { user, clearAuth } = useAuthStore();
	const { accessToken, clearToken } = useTokenStore();
	const [loading, setLoading] = useState<boolean>(true);
	const [collapsed, setCollapsed] = useState(false);

	const { orderStats } = useOrderStore();

	const processingCount = orderStats?.Processing;

	const items: MenuItem[] = [
		{
			key: 'dashboard',
			icon: <Home size={15} color='#42183F' />,
			label: 'Dashboard',
		},
		{
			key: 'products',
			icon: <ShoppingBasket size={15} color='#42183F' />,
			label: 'Products',
		},
		{
			key: 'categories',
			icon: <Tags size={15} color='#42183F' />,
			label: 'Categories',
		},
		{
			key: 'orders',
			icon: (
				<Badge size='small' count={processingCount} offset={[-25, -5]}>
					<DollarSign size={15} color='#42183F' />
				</Badge>
			),
			label: 'Orders',
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <LogOut size={15} color='red' />,
			label: 'Logout',
		},
	];

	useEffect(() => {
		setLoading(false);

		if (!loading && (!user || !user.roles.includes(USER_ROLE.ADMIN))) {
			const currentUrl = pathname;
			router.push(`/auth/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
		}
	}, [loading, user, router]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className='h-screen'>
			{user?.roles.includes(USER_ROLE.ADMIN) ? (
				<Layout style={{ minHeight: '100vh' }}>
					<Sider
						trigger={null}
						collapsible
						collapsed={collapsed}
						onCollapse={(value) => setCollapsed(value)}
						style={{ background: '#fff' }}
					>
						<div className='mt-5 mb-10 flex justify-center items-center'>
							<Image
								src='/images/bycs-image-logo.png'
								alt='Logo'
								width={40}
								height={40}
								onClick={() => router.push('/')}
								className='cursor-pointer'
							/>
						</div>
						<Menu
							mode='inline'
							defaultSelectedKeys={['/admin/dashboard']}
							selectedKeys={[
								pathname ? pathname.split('/')[2] : '/admin/dashboard',
							]}
							items={items}
							style={{
								margin: 0,
								padding: 0,
								color: 'black',
								border: 'none',
							}}
							onClick={({ key }) => {
								if (key != 'logout') {
									router.push(`/admin/${key}`);
								} else {
									setTimeout(() => {
										clearAuth();
										clearToken();
										router.push('/');
									}, 500);
								}
							}}
						/>
					</Sider>
					<Layout>
						<Header
							style={{
								padding: 0,
								background: '#f5f5f5',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start', // Change this line
								position: 'relative', // Add this line
								height: '2rem',
							}}
						>
							<div className='absolute top-[80%] left-[-1%]'>
								<Button
									type='text'
									icon={
										collapsed ? (
											<ChevronRight size={20} />
										) : (
											<ChevronLeft size={20} />
										)
									}
									onClick={() => setCollapsed(!collapsed)}
									style={{ fontSize: '12px' }}
									className='bg-slate-200 rounded-full'
								/>
							</div>
						</Header>
						<Content
							style={{ margin: '24px 16px', padding: '0 12px', minHeight: 280 }}
						>
							<div className='min-h-screen'>{children}</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
							All right reserved ©{new Date().getFullYear()} by Beautified-You
						</Footer>
					</Layout>
				</Layout>
			) : (
				''
			)}
		</div>
	);
}
