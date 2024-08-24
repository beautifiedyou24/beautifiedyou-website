import React from 'react';

interface PrimaryButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: React.ReactNode;
	label: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
	icon,
	label,
	className,
	disabled,
	...props
}) => {
	return (
		<button
			className={`mt-2 flex items-center justify-center w-full px-4 py-3 text-sm bg-coreBrown text-white transition-colors duration-300 uppercase relative overflow-hidden group shadow-md
            ${
							disabled
								? 'bg-gray-400 cursor-not-allowed'
								: 'hover:bg-coreDarkBrown'
						}
            ${className}`}
			disabled={disabled}
			{...props}
		>
			<span
				className={`absolute left-0 w-0 h-full transition-all duration-300 ease-out bg-coreDarkBrown
        ${disabled ? 'bg-gray-300' : 'bg-coreDarkBrown group-hover:w-full'}`}
			></span>
			{icon && <span className='mr-2 relative z-10'>{icon}</span>}
			<span className='font-bold relative z-10'>{label}</span>
		</button>
	);
};

export default PrimaryButton;
