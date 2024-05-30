"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import { formatContentTypeLabel } from "@/app/utils";

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
    name: string;
  };
  _createdAt: string;
  _updatedAt: string;
  contentType: string;
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

async function fetchPosts(
  query: string,
  jlptLevel: string,
  includeAllLowerLevels: boolean
): Promise<Post[]> {
  const res = await fetch(
    `/api/search?query=${query}&jlptLevel=${jlptLevel}&includeAllLowerLevels=${includeAllLowerLevels}`
  );
  const posts: Post[] = await res.json();
  return posts;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchQuery = searchParams.get("query") || "";
  const jlptLevel = searchParams.get("jlptLevel") || "";
  const includeAllLowerLevels =
    searchParams.get("includeAllLowerLevels") === "true" ?? "true";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      const fetchedPosts = await fetchPosts(
        searchQuery,
        jlptLevel,
        includeAllLowerLevels
      );
      setPosts(fetchedPosts);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(handler);
  }, [searchQuery, jlptLevel, includeAllLowerLevels]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleJlptLevelChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const level = event.target.value;
    const params = new URLSearchParams(searchParams);
    if (level) {
      params.set("jlptLevel", level);
    } else {
      params.delete("jlptLevel");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleIncludeAllLowerLevelsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const includeAllLowerLevels = event.target.checked;
    const params = new URLSearchParams(searchParams);
    if (includeAllLowerLevels) {
      params.set("includeAllLowerLevels", "true");
    } else {
      params.delete("includeAllLowerLevels");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row justify-center items-center mb-10 space-y-4 md:space-y-0 md:space-x-8">
          <label className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
            Post Title
            <input
              type="text"
              name="query"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by title"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
            Recommended JLPT Level
            <select
              name="jlptLevel"
              value={jlptLevel}
              onChange={handleJlptLevelChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Levels</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700 w-full md:w-1/3">
            Include All Lower Levels
            <input
              type="checkbox"
              checked={includeAllLowerLevels}
              onChange={handleIncludeAllLowerLevelsChange}
              className="mt-1 block"
            />
          </label>
        </div>
        <div className="mt-5 space-y-5">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border p-4 rounded shadow flex">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-slate-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-400">No posts found.</p>
          ) : (
            posts.map((post) => {
              const picture = post.coverImage;
              return (
                <div key={post._id} className="border p-4 rounded shadow flex">
                  {post.coverImage && (
                    <div className="mr-4">
                      <Image
                        alt={picture?.alt || ""}
                        className="h-full rounded-full object-cover"
                        style={{ minWidth: "120px" }}
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
                      <span className="text-gray-600">{post.title}</span>
                      <span className="text-sm text-gray-400 group-hover:text-gray-500">
                        {" "}
                        {formatContentTypeLabel(post.contentType)}
                      </span>
                    </a>
                    <p className="text-gray-700 mt-2">{post.excerpt}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Posted on: {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Suspense>
  );
}
