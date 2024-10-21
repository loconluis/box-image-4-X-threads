import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Box text images for X (formerly Twitter) or Threads",
  description: "Generate images for X (formerly Twitter) or Threads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
