import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIKA Calm",
  description: "Evidence-informed parenting coaching for hard moments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
