import { renderStoryShareImage, storyShareImageSize } from "@/lib/story-share-image";

export const alt = "Almost. dating confession story card";
export const size = storyShareImageSize;
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderStoryShareImage(slug);
}
