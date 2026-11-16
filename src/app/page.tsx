import { connection } from "next/server";
import { BrewingRitual, GardenStory, Journal, Newsletter } from "@/components/home/editorial";
import { CategoryPills, FeaturedCollections } from "@/components/home/featured-collections";
import { Hero } from "@/components/home/hero";
import {
  Bestsellers,
  NewArrivals,
  ProductSpotlight,
  TeawareRow,
} from "@/components/home/product-sections";

// Reads cookies or the database before anything else, so the page may block
// instead of streaming from a static shell.
export const instant = false;

export default async function Home() {
  // Catalog sections read the database (and stock) per request, never at build.
  await connection();
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
