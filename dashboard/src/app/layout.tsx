import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFETSOS | Operasyon Merkezi",
  description: "Yapay Zeka Destekli Afet İletişim Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <div className="min-h-screen bg-dashboard-bg flex font-sans">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
