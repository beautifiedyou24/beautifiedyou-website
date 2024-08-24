import { MoonLoader } from 'react-spinners';

const Loader = () => {
	return (
		<div>
			<div className='flex justify-center items-center min-h-screen bg-pink-50'>
				{/* <Spin indicator={<LoadingOutlined spin />} size='large' /> */}
				<MoonLoader
					color={'#F21FC1'}
					size={30}
					aria-label='Loading Spinner'
					data-testid='loader'
				/>
			</div>
		</div>
	);
};

export default Loader;
