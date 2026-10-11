import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import useCollections from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useUserRecommendations } from "@/hooks/useRecommendations";
import type { Collection, Product } from "@/types";
import type { ProductRecommendation } from "@/types/recommendation";

/** Neutralizes Bootstrap's default blue/green anchor styles */
const neutralLink =
  "no-underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const benefits = [
  {
    icon: Truck,
    title: "Free shipping",
    description: "On orders over £100",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Protected payments",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "Expert support",
    description: "We're here to help",
  },
] as const;

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: ReactNode;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
          {title}
        </h2>
      </div>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="w-full shrink-0 sm:w-auto"
      >
        <Link to={href} className={neutralLink}>
          {linkLabel}
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function HomeProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.image || "/default.jpg";

  return (
    <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className={cn(neutralLink, "flex h-full flex-col")}
      >
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={product.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardHeader className="gap-1 px-4">
          <CardTitle className="line-clamp-2 text-sm font-medium sm:text-base">
            {product.title}
          </CardTitle>
          <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">
            {product.collection}
          </p>
        </CardHeader>

        <CardFooter className="mt-auto border-t-0 bg-transparent px-4 pt-0 pb-4">
          <span className="text-base font-semibold sm:text-lg">
            £{product.price}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}

function HomeCollectionCard({ collection }: { collection: Collection }) {
  const image = collection.featured_product?.image || "/default.jpg";

  return (
    <Link
      to={`/collections/${collection.id}`}
      className={cn(neutralLink, "group block h-full")}
    >
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
          <img
            src={image}
            alt={collection.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <p className="text-[10px] tracking-[0.15em] text-white/70 uppercase sm:text-xs">
              Collection
            </p>
            <h3 className="mt-1 text-base font-semibold sm:text-lg">
              {collection.title}
            </h3>
            {collection.featured_product && (
              <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:line-clamp-1 sm:text-sm">
                Featured: {collection.featured_product.title}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function CollectionGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="aspect-[4/5] w-full rounded-xl" />
      ))}
    </div>
  );
}

function HomeRecommendations() {
  const { user } = useAuth();
  const { data, isLoading } = useUserRecommendations();

  if (!user) return null;

  const recommendations = data?.data ?? [];

  if (!isLoading && recommendations.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Personalized"
        title="Recommended for you"
        href="/products"
        linkLabel="Browse all"
      />

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {recommendations.slice(0, 4).map((item: ProductRecommendation) => (
            <HomeProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </section>
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

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="size-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/70" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:gap-8 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <Badge
            variant="secondary"
            className="w-fit gap-1.5 bg-primary-foreground/10 text-primary-foreground"
          >
            <Sparkles className="size-3" />
            New season arrivals
          </Badge>

          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover quality products at DexShop
            </h1>
            <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base lg:text-lg">
              Browse curated collections, find everyday essentials, and shop
              with confidence from a store built for modern retail.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="h-11 w-full px-6 sm:w-auto"
            >
              <Link to="/products" className={neutralLink}>
                Shop products
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 w-full border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              <Link to="/collections" className={neutralLink}>
                View collections
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:space-y-16 sm:px-6 sm:py-16 lg:space-y-20 lg:px-8">
        {/* Benefits */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <Card key={title} size="sm" className="py-4">
              <CardContent className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium sm:text-base">{title}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Collections */}
        <section>
          <SectionHeader
            eyebrow="Curated"
            title="Featured collections"
            href="/collections"
            linkLabel="All collections"
          />

          {collectionsLoading ? (
            <CollectionGridSkeleton />
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {collections.map((collection) => (
                <HomeCollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground sm:text-base">
                Collections will appear here once they are available.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Products */}
        <section>
          <SectionHeader
            eyebrow={
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="size-3" />
                Popular
              </span>
            }
            title="Featured products"
            href="/products"
            linkLabel="View catalog"
          />

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground sm:text-base">
                Products will appear here once they are available.
              </CardContent>
            </Card>
          )}
        </section>

        <HomeRecommendations />

        {/* Promo */}
        <section className="overflow-hidden rounded-xl bg-primary text-primary-foreground sm:rounded-2xl">
          <div className="flex flex-col items-start justify-between gap-5 p-5 sm:gap-6 sm:p-8 md:flex-row md:items-center md:p-10">
            <div className="max-w-xl space-y-3">
              <Badge
                variant="secondary"
                className="bg-primary-foreground/10 text-primary-foreground"
              >
                Limited offer
              </Badge>
              <h3 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
                Get 15% off your first order
              </h3>
              <p className="text-sm text-primary-foreground/80 sm:text-base">
                Create an account and start shopping curated products with
                exclusive welcome savings.
              </p>
            </div>

            <Button
              size="lg"
              variant="secondary"
              asChild
              className="h-11 w-full shrink-0 md:w-auto"
            >
              <Link to="/register" className={neutralLink}>
                Create account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
