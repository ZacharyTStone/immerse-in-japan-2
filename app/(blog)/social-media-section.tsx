"use client";

import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";

export default function SocialMediaSection({
  // yotsuba
  instagramUrl = "https://www.instagram.com/p/C7hhts2RBAi",
  // netflix review
  tiktokUrl = "https://www.tiktok.com/@immerseinjapan/video/7373279234984398122",
  // netflix review
  youtubeUrl = "https://www.youtube.com/watch?v=uhHMHm5ZTLU",
  title = "Social Media",
}: {
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  title?: string;
}) {
  return (
    <section className="mt-16">
      <h2 className="mb-8 text-5xl font-bold leading-tight tracking-tighter text-center md:text-left md:text-6xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {/* <FacebookEmbed
          url="https://www.facebook.com/your-page/posts/your-post-id"
          width={500}
        /> */}
        <InstagramEmbed url={instagramUrl} width={328} />
        <TikTokEmbed url={tiktokUrl} width={325} />
        <YouTubeEmbed url={youtubeUrl} width={325} height={220} />
      </div>
    </section>
  );
}
