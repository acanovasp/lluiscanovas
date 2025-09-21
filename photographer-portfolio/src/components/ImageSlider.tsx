'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortfolioImage } from '@/data/portfolio';

interface ImageSliderProps {
  images: PortfolioImage[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="slider-container">
        <p>No images to display</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
  const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(prevIndex);
  };

  const goToNext = () => {
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="slider-container">
      <div className="slider-main">
        {/* Previous thumbnail */}
        <div className="slider-thumbnail prev" onClick={goToPrevious}>
          <Image
            src={images[prevIndex].src}
            alt={images[prevIndex].alt}
            width={150}
            height={100}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Main image */}
        <div className="slider-current">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={800}
            height={600}
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Next thumbnail */}
        <div className="slider-thumbnail next" onClick={goToNext}>
          <Image
            src={images[nextIndex].src}
            alt={images[nextIndex].alt}
            width={150}
            height={100}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Slide counter */}
      <div className="slider-counter">
        {String(currentIndex + 1).padStart(2, '0')}
      </div>
    </div>
  );
}
