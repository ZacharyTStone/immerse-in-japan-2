import Link from "next/link";
import { Suspense } from "react";
import SocialMediaSection from "./social-media-section";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult, SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";
import { highlightWords } from "../utils";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between bg-black text-white rounded-lg p-8">
      <h1 className="text-balance text-5xl font-bold leading-tight tracking-tighter text-center lg:text-left lg:pr-8 lg:text-7xl mb-4 lg:mb-0">
        {highlightWords(title || demo.title, ["Japan"])}
      </h1>
      <h2 className="text-2xl text-center lg:text-left lg:text-4xl lg:w-1/2 lg:pl-8 lg:mt-0 lg:mb-0">
        <PortableText
          className="prose-lg text-white"
          value={description?.length ? description : demo.description}
        />
      </h2>
      <h2 className="mb-12 mt-8 text-xl font-bold leading-tight tracking-tight md:text-2xl md:tracking-tighter">
        <Link href="/search" className="hover:underline text-red-500">
          Search Posts
        </Link>
      </h2>
    </section>
  );
}
function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article className="lg:px-24">
      <h2
        className="text-2xl font-bold mb-4 text-gray-500 lg:text-4xl lg:mb-8
      "
      >
        Recent Article
      </h2>

      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={date} />
          </div>
        </div>
        <div>
          {excerpt && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          {author && (
            <Avatar
              name={author.name}
              picture={author.picture}
              jlptLevel={author.jlptLevel}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
    sanityFetch<HeroQueryResult>({ query: heroQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <Intro title={settings?.title} description={settings?.description} />
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside>
          <h2 className="mb-8 text-5xl font-bold leading-tight tracking-tighter text-center md:text-left md:text-6xl">
            More Articles
          </h2>
          <Suspense>
            <MoreStories skip={heroPost._id} limit={100} />
          </Suspense>
          <SocialMediaSection />
        </aside>
      )}
    </div>
  );
}
