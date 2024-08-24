import Link from 'next/link';

export default function Settings() {
	return (
		<div>
			<h1>Settings</h1>
			<h2>
				{' '}
				Go to <Link href={'/admin/inventory'}>Inventory</Link>{' '}
			</h2>
		</div>
	);
}
