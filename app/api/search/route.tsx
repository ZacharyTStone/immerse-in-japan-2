import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const jlptLevel = searchParams.get("jlptLevel") || "all";
  const includeAllLowerLevels =
    searchParams.get("includeAllLowerLevels") === "true";

  console.log("searchParams", searchParams);
  console.log("1.query", query);
  console.log("2.jlptLevel", jlptLevel);
  console.log("3.includeAllLowerLevels", includeAllLowerLevels);

  // JLPTレベルに基づいてフィルターを調整
  const jlptFilter = createJlptFilter(jlptLevel, includeAllLowerLevels);

  // Adjust the query to return all posts if the query is empty
  // and filter by recommendedJLPTLevel if it's provided
  const groqQuery = createGroqQuery(query, jlptFilter);

  const posts = await sanityFetch({
    query: groqQuery,
    // @ts-ignore
    params: { query, jlptLevel },
  });

  console.log("posts", posts);
  return NextResponse.json(posts);
}

function createJlptFilter(
  jlptLevel: string,
  includeAllLowerLevels: boolean
): string {
  if (!jlptLevel || jlptLevel === "all") return "";

  const levels = ["N1", "N2", "N3", "N4", "N5"];
  const levelIndex = levels.indexOf(jlptLevel);
  const filteredLevels = levels.slice(levelIndex);

  return includeAllLowerLevels
    ? `&& recommendedJLPTLevel in ["${filteredLevels.join('", "')}"]`
    : `&& recommendedJLPTLevel in ["${jlptLevel}"]`;
}

function createGroqQuery(query: string, jlptFilter: string): string {
  if (query) {
    return `*[_type == "post" && title match "*" + $query + "*" ${jlptFilter}] | order(_createdAt desc)`;
  }
  return jlptFilter
    ? `*[_type == "post" ${jlptFilter}] | order(_createdAt desc)`
    : `*[_type == "post"] | order(_createdAt desc)`;
}
