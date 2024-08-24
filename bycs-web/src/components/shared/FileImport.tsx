import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import { DownloadIcon, ImportIcon } from 'lucide-react';
import { useState } from 'react';

const ImportButton = ({
	handleImportProducts,
}: {
	handleImportProducts: (file: File) => void;
}) => {
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [file, setFile] = useState<File | undefined>();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		if (file) {
			handleImportProducts(file);
			setFile(undefined);
		}
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setFile(undefined);
		setIsModalVisible(false);
	};

	const uploadProps: {
		onRemove: () => void;
		beforeUpload: (newFile: File) => boolean;
	} = {
		onRemove: () => {
			setFile(undefined);
		},
		beforeUpload: (newFile: File) => {
			setFile(newFile);
			return false; // Prevent automatic upload
		},
	};

	const downloadTemplate = () => {
		const link = document.createElement('a');
		link.href = '/product_list_template.csv';
		link.download = 'product-list-template.csv';
		link.click();
	};

	return (
		<>
			<Button
				type='primary'
				className='flex flex-row gap-2 justify-center items-center text-white w-full'
				id='import-button'
				onClick={showModal}
			>
				<span>
					<ImportIcon size={20} />
				</span>
				<span>Import</span>
			</Button>

			<Modal
				title='Import File'
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key='back' onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key='submit' type='primary' onClick={handleOk}>
						Upload
					</Button>,
				]}
			>
				<Button
					type='primary'
					className='flex flex-row gap-2 justify-center items-center text-white w-full my-2'
					onClick={downloadTemplate}
				>
					<span>
						<DownloadIcon size={20} />
					</span>
					<span>Download Template</span>
				</Button>

				<Upload.Dragger {...uploadProps} className='mt-5'>
					<p className='ant-upload-drag-icon'>
						<InboxOutlined />
					</p>
					<p className='ant-upload-text'>
						Click or drag file to this area to upload
					</p>
					<p className='ant-upload-hint'>Upload only CSV Files</p>
				</Upload.Dragger>
			</Modal>
		</>
	);
};

export default ImportButton;
