"use client";

import React from "react";
import { Search, Filter, MapPin, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { cn, translateUrgency, translateStatus, translateNeedType } from "@/lib/utils";

import { useReports } from "@/hooks/useReports";

export default function CasesPage() {
  const { reports, loading } = useReports();

  if (loading) {
    return <div className="flex items-center justify-center h-96 font-bold text-secondary animate-pulse uppercase tracking-widest">Vakalar Yükleniyor...</div>;
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tüm Vakalar</h1>
          <p className="text-sm font-semibold text-secondary mt-1 tracking-wide">{reports.length} / {reports.length} kayıt</p>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input 
            type="text" 
            placeholder="Vaka ara (konum, mesaj)..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
            <Filter className="w-3.5 h-3.5" />
            Tüm Öncelikler
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
            Tüm Durumlar
          </button>
        </div>
      </div>

      {/* Vaka Kartları Listesi */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-secondary tracking-widest">#{report.id.slice(0, 8)}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                    report.urgency_level === "Critical" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                  )}>{translateUrgency(report.urgency_level)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Afetzede</h3>
                  <p className="text-sm text-secondary font-medium mt-1 italic">&quot;{report.message}&quot;</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-secondary uppercase tracking-widest mt-2">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(report.created_at).toLocaleTimeString("tr-TR")}</div>
                  <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Analiz Edildi</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className={cn(
                  "flex items-center gap-2 font-bold text-xs uppercase tracking-widest",
                  report.status === "Pending" ? "text-blue-500" : 
                  report.status === "Resolved" ? "text-emerald-500" :
                  "text-orange-500"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    report.status === "Resolved" ? "bg-emerald-500" : "animate-pulse bg-current"
                  )} />
                  {translateStatus(report.status)}
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-[10px] font-bold text-secondary uppercase opacity-70 mb-1">Atanan Ekipler</p>
                  <div className="flex flex-col items-end gap-1">
                    {report.assigned_teams && report.assigned_teams.length > 0 ? (
                      report.assigned_teams.map((team: string, idx: number) => (
                        <span key={idx} className="text-xs font-black text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{team}</span>
                      ))
                    ) : (
                      <p className="text-xs font-black text-slate-400 italic">Henüz atanmadı</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-secondary uppercase opacity-70">İhtiyaç Türü</p>
                  <p className="text-sm font-black text-primary uppercase">{translateNeedType(report.need_type)}</p>
                </div>
              </div>
            </div>
            
            {/* Hover Göstergesi */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary translate-x-full group-hover:translate-x-0 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  );
}
