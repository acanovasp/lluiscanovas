'use client';

import { useEffect, useRef, useState } from 'react';
import ImageSlider from '@/components/ImageSlider';
import ContactInfo from '@/components/ContactInfo';
import { PortfolioImage } from '@/sanity/queries';

type FilterType = 'photography' | 'graphic-design' | 'all';

interface PortfolioClientProps {
  initialImages: PortfolioImage[];
}

export default function PortfolioClient({ initialImages }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const underlineRootRef = useRef<HTMLDivElement | null>(null);

  // Filter images on the client side
  const getFilteredImages = (filter: FilterType): PortfolioImage[] => {
    if (filter === 'all') {
      return initialImages;
    }
    return initialImages.filter(image => image.category === filter);
  };

  const filteredImages = getFilteredImages(activeFilter);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentImageIndex(0); // Reset to first image when filter changes
  };

  const handleIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Animated underline logic
  useEffect(() => {
    const root = underlineRootRef.current;
    if (!root) return;
    const links = Array.from(root.querySelectorAll<HTMLButtonElement>('.filter-link'));
    const move = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const p = root.getBoundingClientRect();
      root.style.setProperty('--u-left', `${r.left - p.left}px`);
      root.style.setProperty('--u-width', `${r.width}px`);
    };
    const active = links.find(l => l.classList.contains('active')) || links[0];
    if (active) move(active);
    const handlers: Array<() => void> = [];
    links.forEach(l => {
      const fn = () => move(l);
      l.addEventListener('mouseenter', fn);
      handlers.push(() => l.removeEventListener('mouseenter', fn));
    });
    const leave = () => active && move(active);
    root.addEventListener('mouseleave', leave);
    handlers.push(() => root.removeEventListener('mouseleave', leave));
    return () => handlers.forEach(h => h());
  }, [activeFilter]);

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-section header-left">
          <h1>Lluís Canovas</h1>
          <p>Photography and Graphic Design</p>
        </div>
        
        <div ref={underlineRootRef} className="header-section header-center">
          <button 
            className={`filter-link ${activeFilter === 'photography' ? 'active' : ''}`}
            onClick={() => handleFilterChange('photography')}
          >
            Photography
          </button>
          <span className="filter-comma">, </span>
          <button 
            className={`filter-link ${activeFilter === 'graphic-design' ? 'active' : ''}`}
            onClick={() => handleFilterChange('graphic-design')}
          >
            Graphic Design
          </button>
          <span className="filter-comma">, </span>
          <button 
            className={`filter-link ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
        </div>
        
        <div className="header-section header-right">
          <ContactInfo />
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <ImageSlider 
          key={activeFilter} 
          images={filteredImages} 
          onIndexChange={handleIndexChange}
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="slider-counter">
            {String(currentImageIndex + 1).padStart(2, '0')}
          </div>
          <div className="footer-contact">
            <ContactInfo />
          </div>
        </div>
      </footer>
    </div>
  );
}
