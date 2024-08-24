import useFilterStore from '@/store/filterStore';
import { Table } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

interface DataGridProps {
	columns: (ColumnGroupType<any> | ColumnType<any>)[];
	data: any;
	dataCount?: number;
	loading: boolean;
	expandable?: {};
}

const BaseTable: React.FC<DataGridProps> = ({
	columns,
	data,
	dataCount,
	loading,
	expandable,
}) => {
	const [updatedData, setUpdatedData] = useState();
	const { filterParams, setCurrentPage, setPageLimit } = useFilterStore();
	const { pageLimit, currentPage } = filterParams;

	const handleChange = (pagination: any) => {
		setPageLimit(pagination.pageSize);
		setCurrentPage(pagination.current);
	};

	useEffect(() => {
		if (data) {
			const newData = data.map((d: { id: any }, _i: any) => {
				return { ...d, key: _i };
			});
			setUpdatedData(newData);
		}
	}, [data]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={updatedData}
				rowHoverable={true}
				pagination={{
					total: dataCount,
					current: currentPage,
					defaultPageSize: pageLimit,
					pageSizeOptions: ['10', '20', '30', '50', '100'],
					showTotal: (total, _range) => `Total ${total} items`,
					// showSizeChanger: true,
					className: 'custom-pagination',
				}}
				rowClassName='antd-table-row'
				loading={loading}
				bordered
				scroll={{ x: 50 }}
				onChange={handleChange}
				expandable={expandable}
			/>
		</>
	);
};

export default BaseTable;
