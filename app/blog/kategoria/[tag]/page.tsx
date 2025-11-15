import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "";
    const res = await fetch(`${baseUrl}/api/posts/list`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [] as any[];
  }
}

async function fetchProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "";
    const res = await fetch(`${baseUrl}/api/shopify/products?limit=8`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.products) ? data.products : [];
  } catch {
    return [] as any[];
  }
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const tagLower = decodeURIComponent(tag).toLowerCase();
  const [posts, products] = await Promise.all([fetchPosts(), fetchProducts()]);

  const taggedPosts = Array.isArray(posts)
    ? posts.filter((p: any) =>
        Array.isArray(p?.tags)
          ? p.tags.some((t: string) => String(t).toLowerCase() === tagLower)
          : false
      )
    : [];

  return (
    <div className="pt-24 min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Artykuły w kategorii: {decodeURIComponent(tag)}
        </h1>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {taggedPosts.map((post: any) => (
            <Link
              href={`/blog/${post.slug || post.url || post.id}`}
              key={post.postId || post.id}
              className="block bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition"
            >
              {post.mainImage && (
                <div className="relative h-44 w-full">
                  <Image
                    src={post.mainImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
                  {post.title}
                </h3>
                {Array.isArray(post.tags) && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
          {taggedPosts.length === 0 && (
            <p className="text-neutral-600">
              Brak artykułów dla tej kategorii.
            </p>
          )}
        </div>

        {/* Products strip */}
        {products.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Produkty polecane</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p: any) => (
                <a
                  key={p.id}
                  href={`https://${
                    process.env.SHOPIFY_STORE_DOMAIN ||
                    "jheetu-7a.myshopify.com"
                  }/products/${p.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {p.image && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-medium text-sm line-clamp-2">
                      {p.title}
                    </p>
                    {p.price && (
                      <p className="text-primary-700 font-semibold text-sm mt-1">
                        {p.price} zł
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const t = decodeURIComponent(tag);
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const url = `${baseUrl}/blog/kategoria/${encodeURIComponent(tag)}`;
  return {
    title: `Blog – ${t}`,
    description: `Artykuły na temat: ${t}. Porady, inspiracje i wiedza o manicure i pedicure.`,
    alternates: { canonical: url },
    openGraph: { title: `Blog – ${t}`, description: `Artykuły: ${t}`, url },
  };
}
