"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme } from "./components/Theme";
import { ThemeProvider, useTheme } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { resolvedTheme } = useTheme();
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" enableSystem enableColorScheme>
          <Theme isDark={resolvedTheme === "dark"} />
          <span>{children}</span>
        </ThemeProvider>
      </body>
    </html>
  );
}
