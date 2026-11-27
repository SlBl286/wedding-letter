import type { Metadata } from "next";
import { Be_Vietnam_Pro, Pinyon_Script, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kim Anh & Tiến Đạt — Wedding Invitation",
  description: "Thiệp mời lễ thành hôn của Kim Anh và Tiến Đạt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${beVietnam.variable} ${pinyon.variable}`}
    >
      <body className="min-h-screen bg-[#FAF9F5] text-[#151815] antialiased">
        {children}
      </body>
    </html>
  );
}
