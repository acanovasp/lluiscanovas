import PortfolioClient from '@/components/PortfolioClient';
import { getPortfolioImages } from '@/sanity/queries';

export default async function Home() {
  // Fetch portfolio images from Sanity
  const portfolioImages = await getPortfolioImages();

  return <PortfolioClient initialImages={portfolioImages} />;
}