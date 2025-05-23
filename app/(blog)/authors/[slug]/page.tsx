import { sanityFetch } from "@/sanity/lib/fetch";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import Avatar from "../../avatar";
import { Author } from "@/sanity.types";
import {
  FaArrowLeft,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaUserFriends,
} from "react-icons/fa";
import Link from "next/link";

const authorQuery = `*[_type == "author" && slug.current == $slug][0]{
  name,
  "slug": slug.current,
  "picture": picture,
  "jlptLevel": jlptLevel,
  bio,
  featuredLinks[]{
    _key,
    title,
    url
  },
  donationLink,
  socialMedia,

}`;

type Props = {
  params: { slug: string };
};

export default async function AuthorPage({ params }: Props) {
  const author: Author | undefined = await sanityFetch({
    query: authorQuery,
    params,
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="container mx-auto px-5 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="mb-12 mt-8 text-xl font-bold leading-tight tracking-tight md:text-2xl md:tracking-tighter">
            <div className="flex items-center gap-2">
              <FaArrowLeft className="text-red-500 text-2xl" />
              <Link href="/" className="hover:underline text-red-500">
                Back Home
              </Link>
            </div>
          </h2>
          <h2 className="mb-12 mt-8 text-xl font-bold leading-tight tracking-tight md:text-2xl md:tracking-tighter">
            <div className="flex items-center gap-2">
              <FaUserFriends className="text-red-500 text-2xl" />
              <Link href="/authors" className="hover:underline text-red-500">
                Back to All Authors
              </Link>
            </div>
          </h2>
        </div>
        {author?.picture && (
          <div className="flex justify-center mb-12">
            <Avatar
              name={author.name || ""}
              picture={author.picture}
              jlptLevel={author.jlptLevel}
              size="xl"
            />
          </div>
        )}

        <div className="prose lg:prose-xl mx-auto mb-16">
          <PortableText value={author.bio || []} />
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Featured Links</h2>
          <ul className="space-y-4">
            {author.featuredLinks?.map((link) => (
              <li key={link._key}>
                <a
                  href={link.url}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {author.socialMedia && (
          <div className="flex space-x-8 mb-16 items-center">
            <h2 className="text-3xl font-bold">Social Media</h2>
            <div className="flex justify-center space-x-8 items-center">
              {author.socialMedia.twitter && (
                <a
                  href={`https://twitter.com/${author.socialMedia.twitter}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <FaTwitter size={32} />
                </a>
              )}
              {author.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${author.socialMedia.instagram}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <FaInstagram size={32} />
                </a>
              )}
              {author.socialMedia.linkedin && (
                <a
                  href={`https://linkedin.com/in/${author.socialMedia.linkedin}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <FaLinkedin size={32} />
                </a>
              )}
            </div>
          </div>
        )}

        {author.donationLink && (
          <div className="text-center">
            <p className="text-lg mb-6">
              All authors are volunteers. If you found this content valuable,
              please consider supporting this author at{" "}
              <a
                href={author.donationLink}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {author.donationLink}
              </a>{" "}
              or by clicking the button below.
            </p>
            <a
              href={author.donationLink}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
            >
              Donate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
