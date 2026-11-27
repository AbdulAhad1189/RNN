import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RECURRING — A visual journey through recurrent neural networks",
  description: "A visual essay on memory, time, and learning in recurrent neural networks, grounded in Elman (1990).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
