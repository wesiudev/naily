import { Metadata } from "next";
import { getPost } from "@/utils/getPost";
import BlogLayout, {
  BlogHeader,
  BlogContent,
  BlogSidebar,
} from "@/components/Blog/BlogLayout";
import ShareButtons from "@/components/ShareButtons";
import { renderMarkdown } from "@/utils/parseMarkdown";
import ProductCarousel from "@/components/Shopify/ProductCarousel";
import CommentsSection from "@/components/CommentsSection";
import Image from "next/image";
import type { Section } from "@/types";
import FAQ from "@/components/Blog/FAQ";
import { createLinkFromText } from "@/utils/createLinkFromText";
import RecentPosts from "@/components/Blog/RecentPosts";

type Params = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || post?.error) {
    return (
      <BlogLayout>
        <div className="text-center text-neutral-600">
          Nie znaleziono wpisu.
        </div>
      </BlogLayout>
    );
  }

  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];
  const readTime =
    post?.statistics?.readingTimeMinutes ||
    Math.max(
      3,
      Math.round(
        ((post?.intro || "").length +
          (post?.sections || []).reduce(
            (a: number, s: Section) => a + String(s?.content || "").length,
            0
          )) /
          900
      )
    );

  return (
    <BlogLayout>
      <BlogHeader
        title={post.title}
        subtitle={(post.metaDescription || post.intro) ?? ""}
        author={post?.author?.name || "Redakcja Naily"}
        date={new Date(post.creationTime || Date.now()).toLocaleDateString(
          "pl-PL"
        )}
        readTime={readTime}
        tags={tags}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6 w-full overflow-x-hidden">
          <div className="h-[500px] w-full relative overflow-hidden flex items-center justify-center rounded-lg">
            <Image
              src={post?.mainImage || ""}
              alt={post?.title || ""}
              width={1000}
              height={1000}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <BlogContent>
            <div
              className="prose max-w-none w-full break-words text-overflow-safe"
              dangerouslySetInnerHTML={renderMarkdown(post?.intro || "")}
            />
            {(post?.sections || []).map((s: Section, idx: number) => {
              const sectionId = createLinkFromText(
                s?.title || `sekcja-${idx + 1}`
              );
              return (
                <section
                  key={idx}
                  id={sectionId}
                  className="mt-10 w-full overflow-x-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 px-4 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
                        {idx + 1}
                      </span>
                      {s?.title && (
                        <h2 className="text-2xl font-bold text-neutral-900">
                          {s.title}
                        </h2>
                      )}
                    </div>
                    <a
                      href={`#${sectionId}`}
                      aria-label="Link do sekcji"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      #
                    </a>
                  </div>
                  <div className="px-4 pb-6 pt-3">
                    <div
                      className="prose max-w-none w-full break-words text-overflow-safe"
                      dangerouslySetInnerHTML={renderMarkdown(
                        String(s?.content || "")
                      )}
                    />
                  </div>
                  {Array.isArray(post?.images) && post.images[idx] && (
                    <div className="h-[400px] w-full relative overflow-hidden flex items-center justify-center rounded-b-xl border-t border-neutral-100">
                      <Image
                        src={post.images[idx]}
                        alt={s?.title || `image-${idx}`}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </section>
              );
            })}
            {post?.outro && (
              <section className="mt-6 w-full overflow-x-hidden">
                <div
                  className="prose max-w-none w-full break-words text-overflow-safe"
                  dangerouslySetInnerHTML={{ __html: post.outro }}
                />
              </section>
            )}
          </BlogContent>

          {/* Comments */}
          <CommentsSection slug={slug} />
          {Array.isArray(post?.faq) && post.faq.length > 0 && (
            <div className="mt-12">
              <FAQ items={post.faq} />
            </div>
          )}
        </div>
        <div className="lg:col-span-1 space-y-6 w-full self-start overflow-visible">
          <BlogSidebar className="w-full break-words sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto">
            {(post?.sections || []).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Spis treści</h3>
                <nav className="space-y-2">
                  {(post?.sections || []).map((s: Section, idx: number) => {
                    const id = createLinkFromText(
                      s?.title || `sekcja-${idx + 1}`
                    );
                    return (
                      <a
                        key={id}
                        href={`#${id}`}
                        className="block text-sm text-neutral-700 hover:text-primary-700"
                      >
                        {idx + 1}. {s?.title || `Sekcja ${idx + 1}`}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}
            <h3 className="font-semibold mb-2">Udostępnij</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Jednym kliknięciem udostępnij swoim obserwującym.
            </p>
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_URL ?? ""}/blog/${slug}`}
              title={post.title}
            />
          </BlogSidebar>
        </div>
      </div>
      {/* Recent posts below article */}
      <RecentPosts limit={6} columns={3} />
    </BlogLayout>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const title = post?.metaTitle || `${post?.title ?? "Artykuł"} – Blog`;
  const description =
    post?.metaDescription ||
    (post?.intro
      ? String(post.intro)
          .replace(/<[^>]*>/g, "")
          .slice(0, 160)
      : "");
  const url = `${baseUrl}/blog/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
