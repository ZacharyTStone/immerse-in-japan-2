import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("searchParams", searchParams);
  const query = searchParams.get("query") || "";
  const jlptLevel =
    searchParams.get("jlptLevel") === "all"
      ? "N5"
      : searchParams.get("jlptLevel");
  console.log("query", query);
  console.log("jlptLevel", jlptLevel);

  // JLPTレベルに基づいてフィルターを調整
  const jlptFilter = jlptLevel
    ? `&& recommendedJLPTLevel in ["${["N5", "N4", "N3", "N2", "N1"].slice(0, ["N5", "N4", "N3", "N2", "N1"].indexOf(jlptLevel) + 1).join('", "')}"]`
    : "";

  // Adjust the query to return all posts if the query is empty
  // and filter by recommendedJLPTLevel if it's provided
  const groqQuery = query
    ? jlptLevel
      ? `*[_type == "post" && title match "*" + $query + "*" ${jlptFilter}] | order(_createdAt desc)`
      : `*[_type == "post" && title match "*" + $query + "*"] | order(_createdAt desc)`
    : jlptLevel
      ? `*[_type == "post" ${jlptFilter}] | order(_createdAt desc)`
      : `*[_type == "post"] | order(_createdAt desc)`;

  const posts = await sanityFetch({
    query: groqQuery,
    // @ts-ignore
    params: { query, jlptLevel },
  });

  console.log("posts", posts);
  return NextResponse.json(posts);
}
