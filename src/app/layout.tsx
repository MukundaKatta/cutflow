import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CutFlow — AI-Powered Video Editing Suite",
  description:
    "Professional browser-based NLE with AI-powered tools for creative professionals. Timeline editing, AI generation, style transfer, and more.",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cf-bg">{children}</body>
    </html>
  );
}
