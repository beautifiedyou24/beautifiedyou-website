import { Input } from 'antd';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';

interface SearchBarProps {
	placeholder: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
	placeholder,
	onChange,
	isLoading,
}) => {
	const debouncedOnChange = useCallback(debounce(onChange, 300), [onChange]);

	useEffect(() => {
		return () => {
			debouncedOnChange.cancel();
		};
	}, [debouncedOnChange]);

	return (
		<Input.Search
			placeholder={placeholder}
			onChange={debouncedOnChange}
			style={{ maxWidth: 280, minWidth: 100 }}
			allowClear
			loading={isLoading}
		/>
	);
};

export default SearchBar;
