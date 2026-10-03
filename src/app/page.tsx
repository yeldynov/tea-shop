import { BrewingRitual, GardenStory, Journal, Newsletter } from "@/components/home/editorial";
import { CategoryPills, FeaturedCollections } from "@/components/home/featured-collections";
import { Hero } from "@/components/home/hero";
import { Bestsellers, NewArrivals, ProductSpotlight, TeawareRow } from "@/components/home/product-sections";

// Catalog sections read from the database on every request.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryPills />
      <FeaturedCollections />
      <Bestsellers />
      <ProductSpotlight />
      <NewArrivals />
      <GardenStory />
      <BrewingRitual />
      <TeawareRow />
      <Journal />
      <Newsletter />
    </>
  );
}
