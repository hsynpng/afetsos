"use client";

import React from "react";
import { cn, translateUrgency, translateStatus, translateNeedType } from "@/lib/utils";
import { CheckCircle2, MapPin, Clock } from "lucide-react";

export function ReportTable({ 
  reports, 
  onSelect, 
  selectedId 
}: { 
  reports: any[], 
  onSelect: (report: any) => void, 
  selectedId?: string 
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-lg uppercase tracking-wider">Vaka Yönetimi</h2>
        <span className="text-sm font-semibold text-secondary">{reports.length} kayıt</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[11px] font-bold text-secondary uppercase tracking-widest border-b border-border">
              <th className="px-6 py-4">SIRA</th>
              <th className="px-6 py-4">KİŞİ / KONUM</th>
              <th className="px-6 py-4">MESAJ ANALİZİ</th>
              <th className="px-6 py-4">ACİLİYET</th>
              <th className="px-6 py-4">EKİP</th>
              <th className="px-6 py-4 text-right">DURUM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report, index) => (
              <tr 
                key={report.id} 
                onClick={() => onSelect(report)}
                className={cn(
                  "hover:bg-slate-50/50 transition-colors group cursor-pointer",
                  selectedId === report.id && "bg-slate-50"
                )}
              >
                <td className={cn(
                  "px-6 py-5 font-bold text-xs text-secondary border-l-4 transition-all",
                  selectedId === report.id ? "border-l-primary" : "border-l-transparent group-hover:border-l-primary/50"
                )}>
                  #{reports.length - index}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Afetzede</span>
                    <div className="flex items-center gap-1 text-[10px] text-secondary font-medium mt-1">
                      <MapPin className="w-3 h-3" />
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-800 truncate max-w-[250px]">{report.message}</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{translateNeedType(report.need_type)}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                    report.urgency_level === "Critical" ? "bg-red-100 text-red-600" : 
                    report.urgency_level === "High" ? "bg-orange-100 text-orange-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {translateUrgency(report.urgency_level)}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1">
                    {report.assigned_teams && report.assigned_teams.length > 0 ? (
                      report.assigned_teams.map((team: string, idx: number) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">
                          {team}
                        </span>
                      ))
                    ) : (
                      <span className="text-secondary text-[10px] font-bold opacity-30 italic">EKİP ATANMADI</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold",
                      report.status === "Pending" ? "bg-blue-50 text-blue-600" : 
                      report.status === "Resolved" ? "bg-emerald-50 text-emerald-600" :
                      "bg-orange-50 text-orange-600"
                    )}>
                      {translateStatus(report.status)}
                    </span>
                    <span className="text-[9px] text-secondary font-medium uppercase tracking-widest">
                      {new Date(report.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
