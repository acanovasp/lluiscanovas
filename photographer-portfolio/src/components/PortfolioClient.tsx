'use client';

import { useState } from 'react';
import ImageSlider from '@/components/ImageSlider';
import { PortfolioImage, FilterType } from '@/sanity/queries';

interface PortfolioClientProps {
  initialImages: PortfolioImage[];
}

export default function PortfolioClient({ initialImages }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-section header-left">
          <h1>Lluís Canovas</h1>
          <p>Photography and Graphic Design</p>
        </div>
        
        <div className="header-section header-center">
          <button 
            className={`filter-link ${activeFilter === 'photography' ? 'active' : ''}`}
            onClick={() => handleFilterChange('photography')}
          >
            Photography
          </button>
          <button 
            className={`filter-link ${activeFilter === 'graphic-design' ? 'active' : ''}`}
            onClick={() => handleFilterChange('graphic-design')}
          >
            Graphic Design
          </button>
          <button 
            className={`filter-link ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
        </div>
        
        <div className="header-section header-right">
          <p>info@lluiscanovas.com</p>
          <p>ES +34 682 665 624</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <ImageSlider key={activeFilter} images={filteredImages} />
      </main>

      {/* Footer */}
      <footer className="footer">
        {/* Footer content will be handled by ImageSlider component */}
      </footer>
    </div>
  );
}
