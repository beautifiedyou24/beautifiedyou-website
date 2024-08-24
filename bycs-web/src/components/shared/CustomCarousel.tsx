import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CustomCarouselProps {
	images: string[] | undefined;
	externalIndex?: number;
	customClass?: string;
	selectedImage?: string;
	showHandlers?: boolean;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
	images,
	externalIndex,
	customClass,
	selectedImage,
	showHandlers = true,
}) => {
	const [current, setCurrent] = useState<number>(0);

	useEffect(() => {
		if (externalIndex !== undefined) {
			setCurrent(externalIndex);
		}
	}, [externalIndex]);

	useEffect(() => {
		if (selectedImage && images) {
			const index = images.indexOf(selectedImage);
			if (index !== -1) {
				setCurrent(index);
			}
		}
	}, [selectedImage, images]);

	const previousSlide = () => {
		if (images) {
			if (current === 0) {
				setCurrent(images.length - 1);
			} else {
				setCurrent(current - 1);
			}
		}
	};

	const nextSlide = () => {
		if (images) {
			if (current === images.length - 1) {
				setCurrent(0);
			} else {
				setCurrent(current + 1);
			}
		}
	};

	return (
		<div className={`overflow-hidden relative ${customClass}`}>
			{/* images */}
			<div
				className={`flex transition ease-out duration-40 ${
					images && images.length > 1 ? 'cursor-pointer' : ''
				} `}
				style={{
					transform: `translateX(-${current * 100}%)`,
				}}
			>
				{images && images.length > 0 ? (
					images.map((img, index) => (
						<img key={index} src={img} alt={`Slide ${index + 1}`} />
					))
				) : (
					<img src='/images/default-product.png' alt='Default Product' />
				)}
			</div>

			{/* buttons */}
			{images && images.length > 0 && showHandlers && (
				<div>
					<div className='absolute top-0 h-full w-full flex items-center justify-between z-10 text-black px-5'>
						<button onClick={previousSlide}>
							<ChevronLeft />
						</button>
						<button onClick={nextSlide}>
							<ChevronRight />
						</button>
					</div>

					{/* <div className='absolute bottom-0 py-2 flex justify-center gap-2 w-full min-w-3 min-h-3'>
						{images.map((_, i) => (
							<div
								key={i}
								className={`rounded-full w-3 h-3 cursor-pointer ${
									i === current ? 'bg-gray-600' : 'bg-gray-200'
								}`}
								onClick={() => setCurrent(i)}
							></div>
						))}
					</div> */}
				</div>
			)}
		</div>
	);
};

export default CustomCarousel;
