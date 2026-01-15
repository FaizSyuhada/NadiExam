import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NadiExam - AI-Based Exam Scheduling",
  description: "Clash-free exam scheduling system powered by classical AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="ml-40 flex-1 bg-gray-50">
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
