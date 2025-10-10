'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { PortfolioImage } from '@/sanity/queries';

interface ImageSliderProps {
  images: PortfolioImage[];
  onIndexChange?: (index: number) => void;
  onReachEnd?: () => void; // Callback when reaching the last image and trying to go next
}

export default function ImageSlider({ images, onIndexChange, onReachEnd }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldTriggerEnd, setShouldTriggerEnd] = useState(false);
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
    
    // Only pause and resume if not manually paused by user
    if (!isPausedByUser) {
      setIsAutoPlay(false);
      
      // Resume autoplay after 200ms of inactivity
      if (autoplayResumeTimerRef.current) {
        clearTimeout(autoplayResumeTimerRef.current);
      }
      autoplayResumeTimerRef.current = setTimeout(() => {
        setIsAutoPlay(true);
      }, 200);
    }
  }, [images.length, isPausedByUser]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      // Check if we're at the last image
      if (prev >= images.length - 1) {
        // Schedule callback to run outside render cycle
        setShouldTriggerEnd(true);
        return 0; // Reset to first image (will switch to other filter's first image)
      }
      return prev + 1;
    });
    
    // Only pause and resume if not manually paused by user
    if (!isPausedByUser) {
      setIsAutoPlay(false);
      
      // Resume autoplay after 200ms of inactivity
      if (autoplayResumeTimerRef.current) {
        clearTimeout(autoplayResumeTimerRef.current);
      }
      autoplayResumeTimerRef.current = setTimeout(() => {
        setIsAutoPlay(true);
      }, 200);
    }
  }, [images.length, isPausedByUser]);

  // Toggle play/pause on main image click
  const togglePlayPause = useCallback(() => {
    setIsPausedByUser(prev => !prev);
    setIsAutoPlay(prev => !prev);
    
    // Clear any pending resume timer when manually toggling
    if (autoplayResumeTimerRef.current) {
      clearTimeout(autoplayResumeTimerRef.current);
      autoplayResumeTimerRef.current = null;
    }
  }, []);

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
    
    // Check if it's a swipe or a tap
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      // It's a swipe - navigate
      if (dx < 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      // It's a tap - toggle play/pause
      togglePlayPause();
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
    if (!isAutoPlay || isPausedByUser || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        // Check if we're at the last image
        if (prev >= images.length - 1) {
          // Schedule callback to run outside render cycle
          setShouldTriggerEnd(true);
          return 0; // Reset to first image (will switch to other filter's first image)
        }
        return prev + 1;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, isPausedByUser, images.length]);

  // Notify parent of index changes
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  // Trigger onReachEnd callback outside render cycle
  useEffect(() => {
    if (shouldTriggerEnd && onReachEnd) {
      onReachEnd();
      setShouldTriggerEnd(false);
    }
  }, [shouldTriggerEnd, onReachEnd]);

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
        <div className="slider-current-wrapper">
          <div 
            className="slider-current"
            onClick={isTouch ? undefined : togglePlayPause}
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
                width: 'auto',
                height: 'auto',
                opacity: imageLoaded ? 1 : 0.7,
                transition: 'opacity 0.3s ease'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
              quality={90}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Play/Pause button */}
          <button 
            className="play-pause-btn"
            onClick={togglePlayPause}
            aria-label={isPausedByUser ? "Play slideshow" : "Pause slideshow"}
          >
            {isPausedByUser ? (
              // Play icon
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2L14 8L4 14V2Z" fill="currentColor" />
              </svg>
            ) : (
              // Pause icon
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="4" y="2" width="3" height="12" fill="currentColor" />
                <rect x="9" y="2" width="3" height="12" fill="currentColor" />
              </svg>
            )}
          </button>
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
