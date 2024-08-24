import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });
const merriWeather_init = Merriweather({
	subsets: ['latin'],
	weight: '300',
});

export const metadata: Metadata = {
	title: {
		default: 'Beautified You',
		template: '%s - Beautified You',
	},
	description:
		'An online shop offering a curated selection of luxurious cosmetics, skincare essentials, and beauty tools to enhance your unique radiance. Empowering you to look and feel your absolute best, every day.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={merriWeather_init.className}>
				<ConfigProvider
					theme={{
						components: {
							Button: {
								colorPrimary: '#0000ff',
								algorithm: true, // Enable algorithm
							},
							Input: {
								colorPrimary: '#00ff00',
								algorithm: false, // Enable algorithm
								borderRadius: 0,
							},
							Table: {
								rowHoverBg: '#DDF3FF',
								headerBg: '#ccc',
							},
							Select: {
								borderRadius: 0,
							},
						},
						token: {
							fontFamily: merriWeather_init.style.fontFamily,
						},
					}}
				>
					{children}
				</ConfigProvider>
			</body>
		</html>
	);
}
