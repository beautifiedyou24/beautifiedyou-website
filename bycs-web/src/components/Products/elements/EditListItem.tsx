import uploadToCloudinary from '@/utils/uploadImage';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Modal, Upload, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import React, { useEffect, useState } from 'react';

interface EditListItemProps {
	visible: boolean;
	onCancel: () => void;
	onSave?: (
		updatedItem: {
			image: any;
			color: string;
			hex: string;
			stock: number;
		}[]
	) => void;
	initialValues?: { image: any; color: string; hex: any; stock: any };
	itemList?: { image: any; color: string; hex: any; stock: any }[];
}

const EditListItem: React.FC<EditListItemProps> = ({
	visible,
	onCancel,
	onSave,
	initialValues,
	itemList,
}) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const handleOk = () => {
		form.validateFields().then(async (values) => {
			let image;

			const newImageList = fileList.filter((file) => !file.url);
			if (newImageList.length > 0) {
				setLoading(true);
				const imageURL = await uploadToCloudinary(newImageList);
				image = imageURL[0];
				setLoading(false);
			} else {
				image = initialValues?.image;
			}

			const updatedItem = {
				image: image,
				color: values.color,
				hex: values.hex,
				stock: values.stock,
			};

			console.log('UPDAtE: ', updatedItem);

			// replace

			const updatedItemList = itemList?.map((item) => {
				if (item.color === initialValues?.color) {
					return updatedItem;
				} else {
					return item;
				}
			});

			console.log('UPDATED ITEM LIST: ', updatedItemList);

			if (onSave && updatedItemList) {
				onSave(updatedItemList);
			}

			onCancel();
			form.resetFields();
			setFileList([]);
		});
	};

	const handleCancel = () => {
		onCancel();
		form.resetFields();
		setFileList([]);
	};

	const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
		setFileList(info.fileList);
	};

	useEffect(() => {
		if (initialValues) {
			form.setFieldsValue(initialValues);
			const initialFileList = {
				uid: `${initialValues.color}`,
				name: `image-${initialValues.color}.png`,
				status: 'done',
				url: initialValues.image,
			};
			setFileList([initialFileList as UploadFile]);
		}
	}, [initialValues, form, visible]);

	return (
		<Modal
			title='Edit Item Details'
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText='Save'
			cancelText='Cancel'
			confirmLoading={loading}
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='image' label='Image'>
					<Upload
						listType='picture-card'
						fileList={fileList}
						onChange={handleFileChange}
						beforeUpload={() => false} // Prevent auto-upload
						maxCount={1}
					>
						<div>
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</div>
					</Upload>
				</Form.Item>
				<Form.Item
					name='color'
					label='Color'
					rules={[{ required: true, message: 'Please enter the color' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item name='hex' label='Hex Code'>
					<Input />
				</Form.Item>
				<Form.Item
					name='stock'
					label='Stock'
					rules={[{ required: true, message: 'Please enter the stock' }]}
				>
					<InputNumber min={0} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EditListItem;
