import type { APIRoute } from "astro";
import type { BlogType } from "../../type";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query: string | null = url.searchParams.get("query");

  // Handle missing query

  if (!query)
    return new Response(JSON.stringify({ error: "Query param is missing" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });

  const searchedBlogArticles: BlogType[] = (await getCollection("blog")).filter(
    (e) => {
      const titleMatch: boolean = e.data.title
        .toLowerCase()
        .includes(query!.toLowerCase());
      const bodyMatch: boolean = e.body
        .toLowerCase()
        .includes(query!.toLowerCase());

      const slugMatch: boolean = e.slug
        .toLowerCase()
        .includes(query!.toLowerCase());
      const tagMatch: boolean = e.data.tags.includes(query!.toLowerCase());

      return titleMatch || bodyMatch || slugMatch || tagMatch;
    }
  );

  const sortedArticles: BlogType[] = searchedBlogArticles.sort(
    (a: BlogType, b: BlogType) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return new Response(JSON.stringify(sortedArticles), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
