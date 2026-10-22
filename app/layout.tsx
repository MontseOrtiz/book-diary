import type { Metadata } from "next";
import { Gayathri, Sacramento } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

const gayathri = Gayathri({
  variable: "--font-gayathri",
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  title: "Book Diary",
  description: "Diario personal de lectura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sacramento.variable} ${gayathri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
