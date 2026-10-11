import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CollectionCard from "@/components/CollectionCard";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import RecommendedProducts from "@/components/RecommendedProducts";
import { cn } from "@/lib/utils";
import { neutralLink, productGrid, sectionTitle } from "@/lib/Store";
import useCollections from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";

/** Things the store actually does today — no shipping, returns or discount promises. */
const features = [
  {
    title: "Your cart, saved",
    description: "Items stay in your cart when you sign in on another device.",
  },
  {
    title: "Order history",
    description: "Every order and its status in one place in your account.",
  },
  {
    title: "Reviews with summaries",
    description: "Read customer reviews, with an AI summary of what they say.",
  },
  {
    title: "Shopping assistant",
    description: "Ask our AI assistant about products once you're signed in.",
  },
] as const;

const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <h2 className={sectionTitle}>{title}</h2>
      <Link
        to={href}
        className={cn(
          neutralLink,
          "flex h-11 shrink-0 items-center text-sm font-medium underline decoration-1 underline-offset-4 hover:decoration-2",
        )}
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default function Home() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
  });
  const { data: collectionsData, isLoading: collectionsLoading } =
    useCollections();

  const products = productsData?.data.results.slice(0, 8) ?? [];
  const collections = collectionsData?.data?.slice(0, 4) ?? [];
  const heroProducts = (productsData?.data.results ?? [])
    .filter((product) => product.images.length > 0)
    .slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b">
        <div
          className={cn(
            container,
            "grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20",
          )}
        >
          <div>
            <h1 className="font-display text-[3.25rem] leading-[0.88] font-extrabold uppercase [font-stretch:68%] sm:text-7xl lg:text-[5.5rem]">
              Discover quality products at DexShop
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Browse curated collections, find everyday essentials, and shop
              with confidence from a store built for modern retail.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-none bg-signal px-8 text-base text-signal-foreground hover:bg-signal/85"
              >
                <Link to="/products" className={neutralLink}>
                  Shop products
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-none border-foreground bg-transparent px-8 text-base hover:bg-muted dark:border-foreground dark:bg-transparent"
              >
                <Link to="/collections" className={neutralLink}>
                  View collections
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
            {productsLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      "aspect-[3/4] rounded-none bg-tile",
                      i === 1 && "mt-10",
                    )}
                  />
                ))
              : heroProducts.map((product, i) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={cn(
                      neutralLink,
                      "block aspect-[3/4] overflow-hidden bg-tile",
                      i === 1 && "mt-10",
                    )}
                  >
                    <img
                      src={product.images[0].image}
                      alt={product.title}
                      className="size-full object-cover"
                    />
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <div className={cn(container, "space-y-20 py-16 sm:space-y-24 sm:py-20")}>
        {/* Collections */}
        <section>
          <SectionHeader
            title="Featured collections"
            href="/collections"
            linkLabel="All collections"
          />

          {collectionsLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/5] rounded-none bg-tile" />
                  <Skeleton className="h-6 w-1/2 rounded-none" />
                </div>
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <p className="border-y py-10 text-center text-muted-foreground">
              Collections will appear here once they are available.
            </p>
          )}
        </section>

        {/* Products */}
        <section>
          <SectionHeader
            title="Featured products"
            href="/products"
            linkLabel="View catalog"
          />

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className={productGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="border-y py-10 text-center text-muted-foreground">
              Products will appear here once they are available.
            </p>
          )}
        </section>

        <RecommendedProducts />

        {/* Account */}
        <section className="grid border bg-tile lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
            <h2 className={sectionTitle}>Create an account</h2>
            <p className="max-w-md text-muted-foreground">
              Save your cart, track your orders and get recommendations picked
              for you.
            </p>
            <Button asChild className="h-12 w-full rounded-none px-8 sm:w-fit">
              <Link to="/register" className={neutralLink}>
                Create account
              </Link>
            </Button>
          </div>
          <dl className="grid grid-cols-1 border-t sm:grid-cols-2 lg:border-t-0 lg:border-l">
            {features.map(({ title, description }, i) => (
              <div
                key={title}
                className={cn(
                  "p-6 sm:p-8",
                  i > 0 && "border-t",
                  i === 1 && "sm:border-t-0 sm:border-l",
                  i === 3 && "sm:border-l",
                )}
              >
                <dt className="font-display text-lg font-semibold [font-stretch:112%]">
                  {title}
                </dt>
                <dd className="mt-1.5 text-sm text-muted-foreground">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
