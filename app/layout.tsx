// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TheStands — Football rants, on-chain.",
  description: "Post, mint, and own your football takes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
