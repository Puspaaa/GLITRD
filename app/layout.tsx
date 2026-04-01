import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Get Lost in the Right Direction | Interactive Wellness Journal",
  description:
    "An interactive mental wellness journal brought to life as a carnival. Walk your panda through 14 therapeutic areas. By Ushma Asher & Riddhi Panchal.",
  keywords: "mental wellness, journal, therapy, anxiety, self-care, mindfulness",
  openGraph: {
    title: "Get Lost in the Right Direction",
    description:
      "An interactive mental wellness carnival. Walk your panda through 14 journal sections.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Patrick Hand', cursive" }}>
        {children}
      </body>
    </html>
  );
}
