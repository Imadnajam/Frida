import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import { Analytics } from "@vercel/analytics/react"
import favicon from "@/public/favicon.png";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Frida",
  description: "All Files to Markdown Converter.",
  icons: {
    icon: [
      { url: favicon.src, type: 'image/png' }
    ],
    shortcut: [{ url: favicon.src }],
    apple: [{ url: favicon.src }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={favicon.src} type="image/png" />
        <link rel="shortcut icon" href={favicon.src} type="image/png" />
        <link rel="apple-touch-icon" href={favicon.src} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}