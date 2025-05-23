import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import Avatar from "../avatar";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Author } from "@/sanity.types";

const authorsQuery = groq`*[_type == "author"]{
  _id,
  name,
  "slug": slug.current,
  picture,
  jlptLevel,
  bio,
  featuredLinks,
  donationLink
}`;

export default async function AuthorsPage() {
  const allAuthors = await sanityFetch<Author[]>({ query: authorsQuery });

  console.log(allAuthors);

  return (
    <div className="container mx-auto px-5 min-h-screen">
      <h2 className="mb-12 mt-8 text-xl font-bold leading-tight tracking-tight md:text-2xl md:tracking-tighter">
        <div className="flex items-center gap-2">
          <FaArrowLeft className="text-red-500 text-2xl" />
          <Link href="/" className="hover:underline text-red-500">
            Back Home
          </Link>
        </div>
      </h2>
      <h1 className="mb-8 text-4xl font-bold">Blog Authors</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allAuthors.map((author) => (
          <div
            key={author._id}
            className="flex flex-col items-center space-x-4"
          >
            <Avatar
              name={author.name || ""}
              picture={author.picture as any}
              jlptLevel={author.jlptLevel}
            />
            <Link
              href={`/authors/${author.slug}`}
              className="mt-2 text-blue-500 hover:underline"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
