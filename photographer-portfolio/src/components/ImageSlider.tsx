'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { PortfolioImage } from '@/sanity/queries';

interface ImageSliderProps {
  images: PortfolioImage[];
  onIndexChange?: (index: number) => void;
}

export default function ImageSlider({ images, onIndexChange }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchActiveRef = useRef(false);
  const [isTouch, setIsTouch] = useState(false);
  const autoplayResumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate indices safely
  const currentImage = images[currentIndex] || images[0];
  const prevIndex = images.length > 0 ? (currentIndex > 0 ? currentIndex - 1 : images.length - 1) : 0;
  const nextIndex = images.length > 0 ? (currentIndex < images.length - 1 ? currentIndex + 1 : 0) : 0;

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    setIsAutoPlay(false); // Pause autoplay on manual navigation
    
    // Resume autoplay after 5 seconds of inactivity
    if (autoplayResumeTimerRef.current) {
      clearTimeout(autoplayResumeTimerRef.current);
    }
    autoplayResumeTimerRef.current = setTimeout(() => {
      setIsAutoPlay(true);
    }, 200);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    setIsAutoPlay(false); // Pause autoplay on manual navigation
    
    // Resume autoplay after 5 seconds of inactivity
    if (autoplayResumeTimerRef.current) {
      clearTimeout(autoplayResumeTimerRef.current);
    }
    autoplayResumeTimerRef.current = setTimeout(() => {
      setIsAutoPlay(true);
    }, 200);
  }, [images.length]);

  // Touch/Swipe handlers (mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartXRef.current = t.clientX;
    touchStartYRef.current = t.clientY;
    touchActiveRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchActiveRef.current || touchStartXRef.current === null || touchStartYRef.current === null) return;
    // prevent vertical scroll from being hijacked; allow small vertical movement
    const t = e.touches[0];
    const dx = t.clientX - touchStartXRef.current;
    const dy = t.clientY - touchStartYRef.current;
    // if horizontal swipe predominant, prevent default to get a crisp swipe
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartXRef.current;
    const dy = t.clientY - touchStartYRef.current;
    const SWIPE_THRESHOLD = 40; // px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchActiveRef.current = false;
  };

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

  // Detect touch-capable devices (mobile/tablets)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const set = () => setIsTouch(mq.matches);
    set();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', set);
      return () => mq.removeEventListener('change', set);
    }
    // Fallback for older browsers
    mq.addListener?.(set);
    return () => mq.removeListener?.(set);
  }, []);

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
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  // Notify parent of index changes
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  // Early return after hooks
  if (images.length === 0) {
    return (
      <div className="slider-container">
        <p>No images to display</p>
      </div>
    );
  }

  return (
    <div className="slider-container">
      <div className="slider-main">
        {/* Previous thumbnail */}
        <div className="slider-thumbnail prev" onClick={goToPrevious}>
          <Image
            src={images[prevIndex].src}
            alt={images[prevIndex].alt}
            width={120}
            height={80}
            style={{ objectFit: 'cover' }}
            sizes="120px"
            loading="lazy"
          />
        </div>

        {/* Main image */}
        <div 
          className="slider-current"
          onClick={isTouch ? goToNext : undefined}
          onTouchStart={isTouch ? handleTouchStart : undefined}
          onTouchMove={isTouch ? handleTouchMove : undefined}
          onTouchEnd={isTouch ? handleTouchEnd : undefined}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={1200}
            height={800}
            style={{ 
              opacity: imageLoaded ? 1 : 0.7,
              transition: 'opacity 0.3s ease'
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
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
            width={120}
            height={80}
            style={{ objectFit: 'cover' }}
            sizes="120px"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
