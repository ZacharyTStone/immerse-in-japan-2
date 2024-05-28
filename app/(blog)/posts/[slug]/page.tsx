import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../avatar";
import CoverImage from "../../cover-image";
import DateComponent from "../../date";
import MoreStories from "../../more-stories";
import SocialMediaSection from "../../social-media-section";
import PortableText from "../../portable-text";
import { highlightWords } from "../../../utils";
import { FaArrowLeft } from "react-icons/fa";

import type {
  PostQueryResult,
  PostSlugsResult,
  SettingsQueryResult,
} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import { Image } from "next-sanity/image";

type Props = {
  params: { slug: string };
};

const postSlugs = groq`*[_type == "post"]{slug}`;

export async function generateStaticParams() {
  const params = await sanityFetch<PostSlugsResult>({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
  return params.map(({ slug }) => ({ slug: slug?.current }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await sanityFetch<PostQueryResult>({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const [post, settings] = await Promise.all([
    sanityFetch<PostQueryResult>({
      query: postQuery,
      params,
    }),
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      <h2 className="mb-12 mt-8 text-xl font-bold leading-tight tracking-tight md:text-2xl md:tracking-tighter">
        <div className="flex items-center gap-2">
          <FaArrowLeft color="red" size="1.5em" />
          <Link href="/" className="hover:underline text-red-500">
            Back Home
          </Link>
        </div>
      </h2>
      <article>
        <h1 className="text-balance mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-6xl md:leading-none lg:text-7xl">
          {post.title}
        </h1>
        <div className="mb-6 block md:mb-12">
          {post.author && (
            <Avatar
              name={post.author.name}
              picture={post.author.picture}
              jlptLevel={post.author.jlptLevel}
            />
          )}
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.coverImage} priority />
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-lg">
            <DateComponent dateString={post.date} />
          </div>
          {post.recommendedJLPTLevel && (
            <div className="mb-6 text-lg">
              <strong>Recommended JLPT Level: </strong>
              {post.recommendedJLPTLevel} or higher
            </div>
          )}
          {post.contentType !== "tool" && (
            <div className="mb-6 text-lg">
              <strong>Has Furigana? </strong>
              {post.hasFurigana ? "Yes" : "No"}
            </div>
          )}
          {post.exampleScreenshot && (
            <div className="mb-6">
              <img
                alt={post.exampleScreenshot?.alt || ""}
                className="w-full h-auto"
                width={200}
                height={200}
                src={urlForImage(post.exampleScreenshot)?.url() as string}
              />
            </div>
          )}
        </div>
        {post.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={post.content as PortableTextBlock[]}
          />
        )}
        {post.tags?.length && (
          <div className="mb-8">
            <strong>Tags: </strong>
            {post.tags.map((tag, index) => (
              <span key={tag}>
                {index > 0 && ", "}
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-accent-2 my-16" />
        <SocialMediaSection
          title={"Check out this post on our social media!"}
        />
      </article>
      <aside>
        <hr className="border-accent-2 my-16" />
        <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
          Recent Stories
        </h2>

        <Suspense>
          <MoreStories skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
