import { Button, Input, Space, Tag } from 'antd';
import { useState } from 'react';

const ColorSelector = ({
	colors,
	setColorList,
}: {
	colors: any;
	setColorList: any;
}) => {
	const [inputValue, setInputValue] = useState('');
	const [hexValue, setHexValue] = useState('');

	const handleAddColor = () => {
		if (!inputValue) return;
		const newColor = { hex: hexValue, name: inputValue };

		if (colors) {
			setColorList([...colors, newColor]);
		} else {
			setColorList([newColor]);
		}
		setInputValue('');
		setHexValue('');
	};

	const handleRemoveColor = (colorToRemove: any) => {
		const updatedColors = colors.filter(
			(value: any) => value.name !== colorToRemove.name
		);
		setColorList(updatedColors);
	};

	return (
		<div>
			{colors?.map((color: { name: string; hex: string }, index: string) => (
				<Tag
					key={index}
					closable
					onClose={() => handleRemoveColor(color)}
					style={{ marginBottom: 8 }}
				>
					{color.name}
					{color.hex && (
						<span style={{ marginLeft: 8, color: color.hex }}>{color.hex}</span>
					)}
				</Tag>
			))}
			<Space>
				<Input
					placeholder='Enter color name'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<Input
					placeholder='Enter hex code (optional)'
					value={hexValue}
					onChange={(e) => setHexValue(e.target.value)}
				/>
				<Button type='primary' onClick={handleAddColor}>
					Add Color
				</Button>
			</Space>
		</div>
	);
};

export default ColorSelector;
