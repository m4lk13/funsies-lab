import type { Metadata } from "next";
import { IM_Fell_English_SC, UnifrakturCook } from "next/font/google";
import "@/styles/globals.css";

const gothic = UnifrakturCook({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-gothic"
});

const body = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Astro — Pixel Tarot Natal Chart",
  description: "Cast a monochrome pixel tarot spread from a natal chart."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${gothic.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
