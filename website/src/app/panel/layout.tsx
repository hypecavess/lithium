import type { Metadata } from "next";
import { panelPage } from "../../constants/metadata";
import Sidebar from "../../components/layout/panel/Landbar";

export const metadata: Metadata = panelPage;

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#07080a] text-white flex justify-center selection:bg-blue-500/30 font-sans">
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-blue-500/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[35%] h-[35%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1150px] px-6 py-12 flex gap-8 z-10">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
