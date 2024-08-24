import CartDrawer from '@/components/shared/CartDrawer';
import useCartStore from '@/store/cartStore';
import { useAuthStore, useTokenStore } from '@/store/userStore';
import {
	SearchOutlined,
	ShoppingCartOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { RiHome2Line, RiMenu2Fill } from '@remixicon/react';
import { Badge, Drawer, Menu } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from './PrimaryButton';
import SearchDrawer from './SearchDrawer';
import SecondaryButton from './SecondaryButton';

const items = [
	{
		key: '',
		icon: <RiHome2Line size={15} color='#42183F' />,
		label: 'Home',
	},
	{
		key: 'shop',
		icon: <ShoppingCartOutlined size={15} color='#42183F' />,
		label: 'Shop',
	},
];

const ResponsiveMenu = () => {
	const [visible, setVisible] = useState(false);
	const [showCartDrawer, setShowCartDrawer] = useState(false);
	const { user, clearAuth } = useAuthStore();
	const { clearToken } = useTokenStore();
	const cart = useCartStore((state) => state.cart);
	const loadCart = useCartStore((state) => state.loadCart);
	const router = useRouter();
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const [showSearchDrawer, setShowSearchDrawer] = useState(false);

	const showDrawer = () => setVisible(true);
	const closeDrawer = () => setVisible(false);

	useEffect(() => {
		loadCart();
	}, [loadCart]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div
			className={`w-full transition-all duration-300 text-black fixed left-0 right-0 z-100 ${
				isScrolled ? 'bg-white p-4' : 'bg-transparent p-8'
			}`}
		>
			{/* menu bar */}
			<div className='flex items-center justify-between w-full mx-auto'>
				{/* menu icon */}
				<div className='flex items-center'>
					<RiMenu2Fill
						onClick={showDrawer}
						style={{ fontSize: 24, color: isScrolled ? 'black' : 'white' }}
						className='cursor-pointer transition-transform duration-200 hover:scale-110'
					/>
				</div>

				{/* Logo */}
				<div
					className='cursor-pointer text-center flex justify-center items-center'
					onClick={() => router.push('/shop')}
				>
					<Image
						src='/images/bycs-image-logo.png'
						alt='Logo'
						width={40}
						height={40}
						onClick={() => router.push('/')}
						className='cursor-pointer'
					/>
				</div>

				{/* search & cart */}
				<div className='flex items-center space-x-4'>
					<SearchOutlined
						style={{ fontSize: 24, color: isScrolled ? 'black' : 'white' }}
						className='cursor-pointer transition-transform duration-200 hover:scale-110'
						onClick={() => setShowSearchDrawer(true)}
					/>
					<Badge className='cursor-pointer' count={cart.length} size='small'>
						<ShoppingCartOutlined
							style={{ fontSize: 24, color: isScrolled ? 'black' : 'white' }}
							className='transition-transform duration-200 hover:scale-110'
							onClick={() => setShowCartDrawer(true)}
						/>
					</Badge>
					<SearchDrawer
						visible={showSearchDrawer}
						onClose={() => setShowSearchDrawer(false)}
					/>
				</div>
			</div>

			<Drawer placement='left' onClose={closeDrawer} open={visible}>
				<Menu
					mode='vertical'
					defaultSelectedKeys={['/']}
					selectedKeys={[pathname ? pathname.split('/')[1] : '']}
					items={items}
					onClick={({ key }) => {
						router.push(`/${key}`);
						closeDrawer();
					}}
					style={{
						margin: 0,
						padding: 0,
						color: 'black',
						border: 'none',
					}}
				/>
				<hr className='mt-4 mb-4' />
				<div className='mt-6 flex items-center space-x-4'>
					{user ? (
						<div className='w-full'>
							<SecondaryButton
								label={user.name}
								icon={<UserOutlined />}
								onClick={() => router.push('/profile')}
							/>
							<PrimaryButton
								label={'Logout'}
								onClick={() => {
									setTimeout(() => {
										clearAuth();
										clearToken();
										router.push('/');
									}, 500);
								}}
							/>
						</div>
					) : (
						<PrimaryButton
							label='Login'
							icon={<UserOutlined />}
							onClick={() => router.push('/auth/login')}
						/>
					)}
				</div>
			</Drawer>

			<CartDrawer
				visible={showCartDrawer}
				onClose={() => setShowCartDrawer(false)}
			/>
		</div>
	);
};

export default ResponsiveMenu;
