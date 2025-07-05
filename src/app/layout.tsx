import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import type { Metadata } from "next";
import { Gabarito } from "next/font/google";

import "./globals.css";
import QueryProvider from "./utils/query_provider";
import Drawer from "./components/Drawer";
import { Suspense } from "react";

const defaultFont = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PSDrops",
  description: "Find deals on PSDrops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <Suspense>
          <body className={`${defaultFont.className} antialiased bg-base-300`}>
            <main className="lg:grid lg:grid-cols-[0.25fr_1fr] 2xl:grid-cols-[0.15fr_1fr] max-h-screen">
              <Drawer />
              <Sidebar />
              <div className="flex flex-col relative">
                <Topbar />
                {children}
              </div>
            </main>
          </body>
        </Suspense>
      </QueryProvider>
    </html>
  );
}
