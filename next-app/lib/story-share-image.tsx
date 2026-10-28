import { ImageResponse } from "next/og";
import { getStory } from "@/lib/stories";

export const storyShareImageSize = { width: 1200, height: 630 };

export async function renderStoryShareImage(routeSlug: string) {
  const slug = routeSlug.replace(/\.html$/, "");
  const story = await getStory(slug);
  const title = story?.title ?? "An unfiltered dating confession";
  const category = story?.category ?? "Dating confession";
  const summary = story?.summary ?? "Read the confession at Almost.";

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "54px 66px", color: "#f3edf9", background: "linear-gradient(135deg,#100d16 0%,#21162b 58%,#39213f 100%)",
        fontFamily: "Georgia, serif", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -110, top: -170, width: 470, height: 470, borderRadius: 235, border: "1px solid #d98bc933", boxShadow: "0 0 0 40px #d98bc90b,0 0 0 80px #d98bc908" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 34, fontWeight: 700, letterSpacing: "-1.5px" }}>
            <span style={{ color: "#fff8ff" }}>Almost</span><span style={{ color: "#d178ca" }}>.</span>
          </div>
          <div style={{ display: "flex", padding: "10px 16px", border: "1px solid #8f6398", borderRadius: 999, color: "#e8c8e9", fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: "2px" }}>UNFILTERED DATING</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1010, zIndex: 1 }}>
          <div style={{ display: "flex", color: "#db8bcf", fontSize: 16, fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: "3px", textTransform: "uppercase" }}>{category}</div>
          <div style={{ display: "flex", maxHeight: 210, overflow: "hidden", color: "#f7effb", fontSize: 58, lineHeight: 1.08, letterSpacing: "-1.5px" }}>{title}</div>
          <div style={{ display: "flex", maxHeight: 70, overflow: "hidden", color: "#c9bbd1", fontSize: 23, lineHeight: 1.4 }}>{summary}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ffffff26", paddingTop: 18, color: "#dbc8e0", fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif", zIndex: 1 }}>
          <span>Read the confession</span><span>almostunfiltereddating.com</span>
        </div>
      </div>
    ),
    { ...storyShareImageSize },
  );
}
