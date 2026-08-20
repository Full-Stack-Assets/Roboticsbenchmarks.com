import type { Metadata } from "next";
import "./globals.css";

const title = "RoboticsBenchmarks.com — Independent Robotics Benchmark Index";
const description = "Compare simulation, real-robot, and compute benchmarks with consistent schema, source links, verification dates, and practical selection guidance.";

export const metadata: Metadata = {
  metadataBase: new URL("https://roboticsbenchmarks.com"), title, description,
  applicationName: "RoboticsBenchmarks.com",
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://roboticsbenchmarks.com",
    images: [{
      url: "/og.jpg",
      width: 1200,
      height: 630,
      alt: "RoboticsBenchmarks.com — The independent index of robotics benchmarks",
    }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
