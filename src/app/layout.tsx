import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maidev Express",
  description: "Sistem informasi pengiriman darat untuk UMKM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-emerald-50 text-slate-900">{children}</body>
    </html>
  );
}
