"use client";

import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";

export default function SocialMediaSection({
  youtubeUrl,
  instagramUrl,
  tiktokUrl,
  title = "Social Media",
}: {
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  title?: string;
}) {
  return (
    <section className="mt-16">
      {(instagramUrl || tiktokUrl || youtubeUrl) && (
        <h2 className="mb-8 text-5xl font-bold leading-tight tracking-tighter text-center md:text-left md:text-6xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {/* <FacebookEmbed
          url="https://www.facebook.com/your-page/posts/your-post-id"
          width={500}
        /> */}
        {instagramUrl && <InstagramEmbed url={instagramUrl} width={328} />}
        {tiktokUrl && <TikTokEmbed url={tiktokUrl} width={325} />}
        {youtubeUrl && (
          <YouTubeEmbed url={youtubeUrl} width={325} height={220} />
        )}
      </div>
    </section>
  );
}
