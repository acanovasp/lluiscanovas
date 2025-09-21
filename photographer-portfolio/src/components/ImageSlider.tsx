'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PortfolioImage } from '@/data/portfolio';

interface ImageSliderProps {
  images: PortfolioImage[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    setIsAutoPlay(false); // Stop autoplay on manual navigation
    setImageLoaded(false); // Reset loading state
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    setIsAutoPlay(false); // Stop autoplay on manual navigation
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    setIsAutoPlay(false); // Stop autoplay on manual navigation
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [goToPrevious, goToNext]);

  // Preload adjacent images for smooth navigation
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };

    // Preload next and previous images
    if (images.length > 1) {
      preloadImage(images[prevIndex].src);
      preloadImage(images[nextIndex].src);
    }
  }, [currentIndex, images, prevIndex, nextIndex]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

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
            sizes="150px"
            loading="lazy"
          />
        </div>

        {/* Main image */}
        <div className="slider-current">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={800}
            height={600}
            style={{ 
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0.7,
              transition: 'opacity 0.3s ease'
            }}
            sizes="(max-width: 768px) 90vw, 800px"
            priority
            quality={90}
            onLoad={() => setImageLoaded(true)}
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
            sizes="150px"
            loading="lazy"
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
