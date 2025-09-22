import { client } from "./client";
import { urlFor } from "./image";

// TypeScript interface for our portfolio items from Sanity
export interface SanityPortfolioItem {
  _id: string;
  title: string;
  category: 'photography' | 'graphic-design';
  position: number;
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
}

// Interface that matches our existing portfolio structure
export interface PortfolioImage {
  id: string;
  title: string;
  category: 'photography' | 'graphic-design';
  src: string;
  alt: string;
}

// GROQ query to fetch all portfolio items ordered by position
const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(position asc) {
  _id,
  title,
  category,
  position,
  image
}`;

// Function to fetch and transform portfolio data
export async function getPortfolioImages(): Promise<PortfolioImage[]> {
  try {
    const sanityItems: SanityPortfolioItem[] = await client.fetch(PORTFOLIO_QUERY);
    
    return sanityItems.map((item) => ({
      id: item._id,
      title: item.title,
      category: item.category,
      src: urlFor(item.image).quality(90).url() || '',
      alt: item.title,
    }));
  } catch (error) {
    console.error('Error fetching portfolio images:', error);
    return [];
  }
}

// Function to get filtered images (same as before, but with Sanity data)
export type FilterType = 'all' | 'photography' | 'graphic-design';

export async function getFilteredImages(filter: FilterType): Promise<PortfolioImage[]> {
  const allImages = await getPortfolioImages();
  
  if (filter === 'all') {
    return allImages;
  }
  
  return allImages.filter(image => image.category === filter);
}
