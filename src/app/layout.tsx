import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preorder Manager",
  description: "Manage and track preorders using Next.js, Prisma, and SQLite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
