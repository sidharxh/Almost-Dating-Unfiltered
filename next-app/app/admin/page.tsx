import type { Metadata } from "next";
import AdminReview from "@/components/admin-review";

export const metadata: Metadata = {
  title: "Review submissions",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminReview />;
}
