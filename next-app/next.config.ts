import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl) : null;

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/admin", destination: "/admin.html", permanent: false }];
  },
  images: {
    remotePatterns: supabaseOrigin ? [{
      protocol: supabaseOrigin.protocol.slice(0, -1) as "http" | "https",
      hostname: supabaseOrigin.hostname,
      ...(supabaseOrigin.port ? { port: supabaseOrigin.port } : {}),
      pathname: "/storage/v1/object/public/confession-images/**",
    }] : [],
  },
};

export default nextConfig;
