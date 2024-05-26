"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  slug: {
    current: string;
    _type: string;
  };
  title: string;
  excerpt: string;
  coverImage?: {
    _type: string;
    alt: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  _rev: string;
  date: string;
  author: {
    _ref: string;
    _type: string;
    name: string; // Added author name property
  };
  _createdAt: string;
  _updatedAt: string;
  content: Array<{
    children: Array<{
      _type: string;
      marks: string[];
      text: string;
      _key: string;
    }>;
    _type: string;
    style: string;
    _key: string;
    markDefs: any[];
  }>;
}

async function fetchPosts(query: string): Promise<Post[]> {
  const res = await fetch(`/api/search?query=${query}`);
  const posts: Post[] = await res.json();
  return posts;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function loadPosts() {
      const fetchedPosts = await fetchPosts(searchQuery);
      setPosts(fetchedPosts);
    }
    loadPosts();
  }, [searchQuery]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("query") as string;
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
    setSearchQuery(query);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-5 py-10">
        <form
          method="GET"
          action="/search"
          onSubmit={handleSearch}
          className="flex justify-center mb-10"
        >
          <input
            type="text"
            name="query"
            defaultValue={searchQuery}
            placeholder="Search by title"
            className="border p-2 w-1/2"
          />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white">
            Search
          </button>
        </form>
        <div className="mt-5 space-y-5">
          {posts.map((post) => {
            console.log("post", post);
            const picture = post.coverImage;
            return (
              <div key={post._id} className="border p-4 rounded shadow flex">
                {post.coverImage && (
                  <div className="mr-4">
                    <Image
                      alt={picture?.alt || ""}
                      className="h-full rounded-full object-cover"
                      height={100}
                      width={120}
                      src={
                        urlForImage(picture)
                          ?.height(200)
                          .width(200)
                          .fit("crop")
                          .url() as string
                      }
                    />
                  </div>
                )}
                <div>
                  <a
                    href={`/posts/${post.slug.current}`}
                    className="text-xl font-bold text-blue-600 hover:underline"
                    target="_blank"
                  >
                    {post.title}
                  </a>
                  <p className="text-gray-700 mt-2">{post.excerpt}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Posted on: {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Suspense>
  );
}
