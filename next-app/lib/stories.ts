import { STORY_CATEGORIES } from "@/lib/categories";

export type Story = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  createdAt: string;
  tags: string[];
  coverImageUrl: string | null;
  coverImageAlt: string;
};

type StoryRow = {
  id: string;
  title: string;
  category: string | null;
  body: string;
  created_at: string;
  tags: string[] | null;
  story_summary: string | null;
  image_path: string | null;
  image_alt: string | null;
};

function slugify(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function categoryLabel(value: string | null) {
  return STORY_CATEGORIES.find((category) => category.label.toLowerCase() === value?.toLowerCase())?.label
    ?? STORY_CATEGORIES.find((category) => category.slug === value)?.label
    ?? value
    ?? "Confessions & Regrets";
}

function seoSummary(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 155) return normalized;
  const shortened = normalized.slice(0, 152);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 100 ? lastSpace : 152).trimEnd()}…`;
}

function storySlug(title: string, id: string) {
  return `${slugify(title) || "dating-confession"}-${id.slice(0, 8)}`;
}

export function getCoverImageUrl(path: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !path) return null;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/confession-images/${encodedPath}`;
}

export async function getStories(): Promise<Story[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  const query = new URLSearchParams({
    select: "id,title,category,body,created_at,tags,story_summary,image_path,image_alt",
    status: "eq.approved",
    order: "created_at.desc",
  });
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/confessions?${query}`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Approved stories could not be loaded.", response.status);
      return [];
    }
    const rows = await response.json() as StoryRow[];
    return rows.map((row) => {
      // Include a stable ID suffix so a newly approved story can never change
      // another story's URL when titles match or are edited later.
      const slug = storySlug(row.title, row.id);
      const body = row.body ?? "";
      const summary = seoSummary(row.story_summary?.trim() || body);
      return {
        id: row.id,
        slug,
        title: row.title,
        category: categoryLabel(row.category),
        summary,
        body,
        createdAt: row.created_at,
        tags: row.tags ?? [],
        coverImageUrl: getCoverImageUrl(row.image_path),
        coverImageAlt: row.image_alt?.trim() || row.title,
      };
    });
  } catch (error) {
    console.error("Approved stories could not be loaded.", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}

export async function getStory(slug: string) {
  const stories = await getStories();
  const exact = stories.find((story) => story.slug === slug);
  if (exact) return exact;

  // Keep previously published title-only URLs working. If titles collide, the
  // newest matching story was the one that previously owned the bare slug.
  return stories.find((story) => {
    const titleSlug = slugify(story.title) || `story-${story.id.slice(0, 8)}`;
    return slug === titleSlug || slug === `${titleSlug}-${story.id.slice(0, 8)}`;
  });
}

export function getCategorySlug(label: string) {
  return STORY_CATEGORIES.find((category) => category.label.toLowerCase() === label.toLowerCase())?.slug
    ?? "confessions-regrets";
}

export function storyPath(story: Story) {
  return `/confessions/${story.slug}.html`;
}
