import { BrewingRitual, GardenStory, Journal, Newsletter } from "@/components/home/editorial";
import { CategoryPills, FeaturedCollections } from "@/components/home/featured-collections";
import { Hero } from "@/components/home/hero";
import { Bestsellers, ProductSpotlight, TeawareRow } from "@/components/home/product-sections";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryPills />
      <FeaturedCollections />
      <Bestsellers />
      <ProductSpotlight />
      <GardenStory />
      <BrewingRitual />
      <TeawareRow />
      <Journal />
      <Newsletter />
    </>
  );
}
