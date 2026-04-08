import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "KidsLearnPlay - Free Coloring Pages, Games & Worksheets",
    template: "%s | KidsLearnPlay",
  },
  description:
    "Free printable coloring pages, educational games, and worksheets for kids. Download and print instantly — no signup needed!",
  keywords: [
    "coloring pages",
    "kids games",
    "educational games",
    "worksheets",
    "printable coloring pages",
    "math games for kids",
    "free printables",
  ],
  openGraph: {
    siteName: "KidsLearnPlay",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
