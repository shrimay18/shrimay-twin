import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Next.js injects your pages (like /chat) here via the children prop */}
        {children}
      </body>
    </html>
  );
}