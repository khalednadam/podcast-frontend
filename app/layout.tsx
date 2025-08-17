import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { Suspense } from "react";

const gtAmerica = localFont({
  src: './fonts/gt-america.woff',
  display: 'swap',
  variable: '--font-gtamerica',
  weight: '700',
});
const sfMono = localFont({
  src: './fonts/SF-Mono-Regular.otf',
  display: 'swap',
  variable: '--font-sfMono',
  weight: '400',
});


export const metadata: Metadata = {
  title: "Khaled's Podcast Player",
  description: "A mini podcast player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${gtAmerica.variable} ${sfMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="w-[calc(100%-225px)]">
              <Suspense fallback={<div className="h-16 bg-background" />}>
                <Header />
              </Suspense>
              <main>{children}</main>
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
