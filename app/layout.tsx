import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chef Brie | Private Chef - New Jersey & Pennsylvania",
  description:
    "Private chef. Culinary storyteller. Crafting unforgettable dining experiences — one plate at a time. Micro-catering, meal prep, and 6-course tasting pop-ups.",
  keywords: [
    "Chef Brie",
    "private chef",
    "micro-catering",
    "meal prep",
    "tasting pop-up",
    "New Jersey",
    "Pennsylvania",
  ],
  openGraph: {
    title: "Chef Brie | Private Chef",
    description: "Crafting unforgettable dining experiences — one plate at a time.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
