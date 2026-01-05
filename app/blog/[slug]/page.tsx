import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BlogLayout, { BlogHeader, BlogContent } from "@/components/Blog/BlogLayout";
import { renderMarkdown } from "@/utils/parseMarkdown";
import { polishToEnglish } from "@/utils/polishToEnglish";
import FAQ from "@/components/Blog/FAQ";
import type { Post } from "@/types";

async function getBlogPost(slug: string): Promise<Post | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok || res.status === 404) {
      return null;
    }

    const data = await res.json();
    if (data.error) {
      return null;
    }

    return data as Post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post nie znaleziony | Naily",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.intro,
    keywords: post.metaKeywords || post.tags,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.intro,
      images: post.mainImage ? [post.mainImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.creationTime || Date.now()).toLocaleDateString(
    "pl-PL",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const readingTime = post.sections
    ? Math.ceil(
        (post.intro?.length || 0 +
          post.sections.reduce((acc, s) => acc + s.content.length, 0) +
          (post.outro?.length || 0)) /
          1000
      )
    : undefined;

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        {post.mainImage && (
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={post.mainImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Blog Header */}
        <BlogHeader
          title={post.title}
          subtitle={post.intro}
          author="Mentor Manicure"
          date={date}
          readTime={readingTime}
          tags={post.tags}
        />

        {/* Blog Content */}
        <BlogContent>
          {/* Intro */}
          {post.intro && (
            <div className="mb-8">
              <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed font-poppins">
                {post.intro}
              </p>
            </div>
          )}

          {/* Sections */}
          {post.sections && post.sections.length > 0 && (
            <div className="space-y-8 sm:space-y-10">
              {post.sections.map((section, idx) => (
                <div key={idx} id={polishToEnglish(section.title)}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 mb-4 sm:mb-6 font-baloo">
                    {section.title}
                  </h2>

                  {/* Section Image */}
                  {post.images && post.images[idx] && (
                    <div className="my-6 sm:my-8 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={post.images[idx]}
                        alt={section.title}
                        width={800}
                        height={500}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Section Content */}
                  <div
                    className="prose prose-lg sm:prose-xl max-w-none"
                    dangerouslySetInnerHTML={renderMarkdown(section.content)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Outro */}
          {post.outro && (
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-neutral-200">
              <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed font-poppins italic">
                {post.outro}
              </p>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-neutral-200">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="text-sm sm:text-base font-semibold text-neutral-700 mr-2 font-poppins">
                  Tagi:
                </span>
                {post.tags.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/blog/kategoria/${polishToEnglish(tag)}`}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm sm:text-base font-medium transition-colors font-poppins"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </BlogContent>

        {/* FAQ Section */}
        {post.faq && post.faq.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <BlogContent>
              <FAQ items={post.faq} />
            </BlogContent>
          </div>
        )}

        {/* Back to Blog Link */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base transition-colors font-poppins"
          >
            <span>←</span>
            <span>Powrót do bloga</span>
          </Link>
        </div>
      </div>
    </BlogLayout>
  );
}
