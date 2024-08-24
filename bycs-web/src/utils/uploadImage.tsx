const uploadToCloudinary = async (files: any[]): Promise<string[]> => {
	const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

	return Promise.all(
		files.map((fileData: { originFileObj: any }) => {
			const file = fileData.originFileObj || fileData;
			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', String(uploadPreset));

			return fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				{
					method: 'POST',
					body: formData,
				}
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							'Network response was not ok ' + response.statusText
						);
					}
					return response.json();
				})
				.then((uploadedImageData) => uploadedImageData.secure_url)
				.catch((error) => {
					console.error('Error uploading image:', error);
					throw error;
				});
		})
	);
};

export default uploadToCloudinary;
