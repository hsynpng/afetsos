"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { ReportTable } from "@/components/ReportTable";
import { NLPAnalysis } from "@/components/NLPAnalysis";
import { TeamCoordination } from "@/components/TeamCoordination";
import { useReports } from "@/hooks/useReports";

// MapView needs to be loaded client-side only
const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-2xl border border-border" />
});

export default function Dashboard() {
  const { reports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  if (loading) {
    return <div className="flex items-center justify-center h-96 font-bold text-secondary animate-pulse uppercase tracking-widest">Veriler Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Header />

      {/* Stats Overview */}
      <StatsCards reports={reports} />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Reports Table */}
        <div className="xl:col-span-2">
          <ReportTable 
            reports={reports}
            onSelect={(report) => setSelectedReport(report)} 
            selectedId={selectedReport?.id} 
          />
        </div>

        {/* NLP Analysis Side Panel */}
        <div className="xl:col-span-1">
          <NLPAnalysis report={selectedReport} />
        </div>
      </div>

      {/* Map and Team Coordination */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8">
        <div className="xl:col-span-2">
          <MapView reports={reports} />
        </div>
        <div className="xl:col-span-1">
          <TeamCoordination selectedReport={selectedReport} reports={reports} />
        </div>
      </div>
    </div>
  );
}
