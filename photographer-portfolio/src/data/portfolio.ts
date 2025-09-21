export interface PortfolioImage {
  id: string;
  title: string;
  category: 'photography' | 'graphic-design';
  src: string;
  alt: string;
}

export const portfolioImages: PortfolioImage[] = [
  {
    id: '1',
    title: 'Portrait Photography',
    category: 'photography',
    src: '/images/photo1.jpg',
    alt: 'Portrait photography work'
  },
  {
    id: '2',
    title: 'Brand Identity Design',
    category: 'graphic-design',
    src: '/images/design1.jpg',
    alt: 'Brand identity graphic design'
  },
  {
    id: '3',
    title: 'Street Photography',
    category: 'photography',
    src: '/images/photo2.jpg',
    alt: 'Street photography work'
  },
  {
    id: '4',
    title: 'Poster Design',
    category: 'graphic-design',
    src: '/images/design2.jpg',
    alt: 'Poster graphic design'
  },
  {
    id: '5',
    title: 'Landscape Photography',
    category: 'photography',
    src: '/images/photo3.jpg',
    alt: 'Landscape photography work'
  },
  {
    id: '6',
    title: 'Logo Design',
    category: 'graphic-design',
    src: '/images/design3.jpg',
    alt: 'Logo graphic design'
  },
  {
    id: '7',
    title: 'Fashion Photography',
    category: 'photography',
    src: '/images/photo4.jpg',
    alt: 'Fashion photography work'
  },
  {
    id: '8',
    title: 'Web Design',
    category: 'graphic-design',
    src: '/images/design4.jpg',
    alt: 'Web design work'
  }
];

export type FilterType = 'all' | 'photography' | 'graphic-design';

export const getFilteredImages = (filter: FilterType): PortfolioImage[] => {
  if (filter === 'all') {
    return portfolioImages;
  }
  return portfolioImages.filter(image => image.category === filter);
};
