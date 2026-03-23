import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { StoreProvider } from "@/src/store/provider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Формы",
  description: "Google Forms Lite Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={manrope.variable}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
