import React from 'react';

interface LabelProps {
	icon: React.ReactNode;
	label: string;
	className?: string;
}

const Label: React.FC<LabelProps> = ({ icon, label, className = '' }) => {
	return (
		<span className={`flex items-center ${className}`}>
			{icon}
			<span className='ml-1'>{label}</span>
		</span>
	);
};

export default Label;
