import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://task-clocked.vercel.app/"),
  title: "Task Clock",
  description: "Track your tasks with a 24hr clock",
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <SpeedInsights />
        <Toaster />
        <SonnerToaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
