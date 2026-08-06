import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Travelio — Corporate Travel Operating System",
  description: "The command center for corporate travel agencies",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} h-full`}>
      <body className="min-h-full bg-background">{children}</body>
    </html>
  );
}
