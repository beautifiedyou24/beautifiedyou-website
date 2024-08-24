import React from 'react';

interface ColorChipsProps {
	colorCode: string;
	colorName: string;
	currentColorName?: string;
	className?: string;
	onClick?: () => void;
}

const ColorChips: React.FC<ColorChipsProps> = ({
	colorCode,
	colorName,
	currentColorName,
	className,
	onClick,
}) => (
	<div
		className={`rounded-full px-2 font-light flex justify-center items-center h-6 cursor-pointer capitalize border-[${colorCode}] border-2 
            ${
							colorName == currentColorName
								? 'bg-coreBrown text-white'
								: 'bg-white'
						} ${className}`}
		style={{ borderColor: colorCode }}
		onClick={onClick}
	>
		{colorName}
	</div>
);

export default ColorChips;
