import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

interface QuantityBoxProps {
	quantity: any;
	onIncrement: () => void;
	onDecrement: () => void;
}

const QuantityBox: React.FC<QuantityBoxProps> = ({
	quantity,
	onIncrement,
	onDecrement,
}) => {
	return (
		<div className='flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 w-2/4 max-w-sm h-6 justify-between rounded-md shadow-md'>
			<button
				onClick={onDecrement}
				className='flex items-center justify-center font-bold w-10 h-full text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
			>
				<MinusOutlined size={20} />
			</button>
			<div className='text-gray-200 dark:text-gray-100 text-lg flex-1 text-center'>
				{quantity}
			</div>
			<button
				onClick={onIncrement}
				className='flex items-center justify-center w-10 h-full text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
			>
				<PlusOutlined size={30} />
			</button>
		</div>
	);
};

export default QuantityBox;
