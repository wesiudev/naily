export type Product = {
  id: number | string;
  title: string;
  handle?: string;
  vendor?: string;
  productType?: string;
  description?: string | null;
  tags?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  price?: string | number | null;
  compareAtPrice?: string | number | null;
  variantId?: string | number | null;
};

async function fetchProducts(
  params: {
    limit?: number;
    product_type?: string;
    vendor?: string;
    title?: string;
    collection_id?: string | number;
    fetch_all?: boolean;
  } = {}
): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params.limit && !params.fetch_all)
    query.set("limit", String(params.limit));
  if (params.product_type) query.set("product_type", params.product_type);
  if (params.vendor) query.set("vendor", params.vendor);
  if (params.title) query.set("title", params.title);
  if (params.collection_id)
    query.set("collection_id", String(params.collection_id));
  if (params.fetch_all) query.set("fetch_all", "true");

  const base = process.env.NEXT_PUBLIC_URL || "";
  const endpoint = `${base ? base : ""}/api/shopify/products${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const res = await fetch(endpoint, { next: { revalidate: 60 } });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { products?: Product[] };
  return Array.isArray(data.products) ? data.products : [];
}

import ProductGrid from "./ProductGrid";

export default async function ShopSection({
  title = "Polecane przez ekspertki",
  subtitle = "Produkty rekomendowane przez profesjonalne stylistki paznokci",
  limit = 8,
  product_type,
  vendor,
  collection_id,
  fetch_all = false,
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  product_type?: string;
  vendor?: string;
  collection_id?: string | number;
  fetch_all?: boolean;
}) {
  // Server-side data fetching - happens once at build/request time
  const products = await fetchProducts({
    limit,
    product_type,
    vendor,
    collection_id,
    fetch_all,
  });

  return (
    <section className="py-12 pb-24 lg:pb-12 w-full bg-white">
      <div className="container-professional">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Client component that handles interactivity */}
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
