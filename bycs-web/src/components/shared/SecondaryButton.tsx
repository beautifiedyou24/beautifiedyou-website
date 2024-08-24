import React from 'react';

interface SecondaryButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: React.ReactNode;
	disabled?: boolean;
	label: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
	icon,
	label,
	disabled,
	className,
	...props
}) => {
	return (
		<button
			className={`mt-2 flex items-center justify-center w-full px-4 py-3 text-sm border-2 transition-colors duration-300 uppercase relative overflow-hidden group ${
				disabled
					? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
					: 'bg-transparent hover:bg-coreLightPink hover:text-coreDarkBrown border-coreBrown text-coreBrown'
			} ${className}`}
			disabled={disabled}
			{...props}
		>
			<span
				className={`absolute left-0 w-0 h-full transition-all duration-300 ease-out ${
					disabled ? 'bg-gray-300' : 'bg-coreLightPink group-hover:w-full'
				} -z-1`}
			></span>
			{icon && !disabled && <span className='mr-2 relative z-10'>{icon}</span>}
			<span className='font-bold relative z-10'>{label}</span>
		</button>
	);
};

export default SecondaryButton;
