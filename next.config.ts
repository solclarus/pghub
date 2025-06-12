import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "klrdsriygrrnmytfqylu.supabase.co",
			},
		],
	},
};

export default nextConfig;
