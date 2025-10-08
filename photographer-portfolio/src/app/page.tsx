import PortfolioClient from '@/components/PortfolioClient';
import { getPortfolioImages } from '@/sanity/queries';

// Revalidate this page every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  // Fetch portfolio images from Sanity
  const portfolioImages = await getPortfolioImages();

  return <PortfolioClient initialImages={portfolioImages} />;
}