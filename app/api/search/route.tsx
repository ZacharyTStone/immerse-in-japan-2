import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("searchParams", searchParams);
  const query = searchParams.get("query") || "";
  console.log("query", query);

  // Adjust the query to return all posts if the query is empty
  const groqQuery = query
    ? `*[_type == "post" && title match $query] | order(_createdAt desc)`
    : `*[_type == "post"] | order(_createdAt desc)`;

  const posts = await sanityFetch({
    query: groqQuery,
    // @ts-ignore
    params: { query },
  });

  console.log("posts", posts);
  return NextResponse.json(posts);
}
