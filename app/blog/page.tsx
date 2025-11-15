import { Metadata, Viewport } from "next";
import BlogLayout, { BlogSidebar } from "@/components/Blog/BlogLayout";
import EnhancedPostSamples from "@/components/Blog/EnhancedPostSamples";
import ShareButtons from "@/components/ShareButtons";

export default async function Page() {
  return (
    <BlogLayout>
      <div className="space-y-10">
        {/* Featured + grid from current API */}
        <EnhancedPostSamples variant="featured" columns={3} showHeader />

        {/* Sidebar and additional sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3" />
          <div className="lg:col-span-1 space-y-6">
            <BlogSidebar>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Popularne kategorie
              </h3>
              <p className="text-sm text-gray-600">
                Przeglądaj wpisy według kategorii i tematów.
              </p>
            </BlogSidebar>
            <BlogSidebar>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Udostępnij blog
              </h3>
              <ShareButtons url={`${process.env.NEXT_PUBLIC_URL ?? ""}/blog`} />
            </BlogSidebar>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#d8b4fe",
};

export const metadata: Metadata = {
  publisher: "naily.pl",
  manifest: "/manifest.json",
  icons: [
    {
      url: "/fav/favicon.ico",
      sizes: "192x192",
      type: "image/png",
    },
  ],
  title: "Blog o manicure i pedicure – poradniki, inspiracje i nowości",
  description:
    "Profesjonalne porady, inspiracje i nowości ze świata paznokci. Odkryj techniki stylizacji, pielęgnację i rekomendacje produktów.",
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog o manicure i pedicure – poradniki, inspiracje i nowości",
    description:
      "Profesjonalne porady, inspiracje i nowości ze świata paznokci. Odkryj techniki stylizacji, pielęgnację i rekomendacje produktów.",
    siteName: "naily.pl",
  },
  alternates: {
    canonical: "/blog",
  },
};
