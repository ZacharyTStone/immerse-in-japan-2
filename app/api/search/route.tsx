import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const jlptLevel = searchParams.get("jlptLevel") || "all";
  const includeAllLowerLevels =
    searchParams.get("includeAllLowerLevels") === "true";
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "10", 10);
  const contentType = searchParams.get("contentType") || "";

  console.log("searchParams", searchParams);
  console.log("1.query", query);
  console.log("2.jlptLevel", jlptLevel);
  console.log("3.includeAllLowerLevels", includeAllLowerLevels);
  console.log("4.skip", skip);
  console.log("5.take", take);
  console.log("6.contentType", contentType);

  // JLPTレベルに基づいてフィルターを調整
  const jlptFilter = createJlptFilter(jlptLevel, includeAllLowerLevels);

  // Adjust the query to return all posts if the query is empty
  // and filter by recommendedJLPTLevel and contentType if provided
  const groqQuery = createGroqQuery(query, jlptFilter, contentType, skip, take);
  const groqQueryCount = createCountGroqQuery(query, jlptFilter, contentType);

  const posts = await sanityFetch({
    query: groqQuery,
    // @ts-ignore
    params: { query, jlptLevel, contentType, skip, take },
  });

  const totalCount = await sanityFetch({
    query: groqQueryCount,
    // @ts-ignore
    params: { query, jlptLevel, contentType },
  });

  return NextResponse.json({ posts, totalCount });
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

function createGroqQuery(
  query: string,
  jlptFilter: string,
  contentType: string,
  skip: number,
  take: number
): string {
  const contentTypeFilter = contentType
    ? `&& contentType == "${contentType}"`
    : "";
  const baseQuery = query
    ? `*[_type == "post" && title match "*" + $query + "*" ${jlptFilter} ${contentTypeFilter}]`
    : `*[_type == "post" ${jlptFilter} ${contentTypeFilter}]`;

  return `${baseQuery} | order(_createdAt desc) [${skip}...${skip + take}]`;
}

function createCountGroqQuery(
  query: string,
  jlptFilter: string,
  contentType: string
): string {
  const contentTypeFilter = contentType
    ? `&& contentType == "${contentType}"`
    : "";
  const baseQuery = query
    ? `*[_type == "post" && title match "*" + $query + "*" ${jlptFilter} ${contentTypeFilter}]`
    : `*[_type == "post" ${jlptFilter} ${contentTypeFilter}]`;

  return `count(${baseQuery})`;
}
