"use client";

import React from "react";
import { 
  Activity, 
  Flame, 
  Users2, 
  FileWarning 
} from "lucide-react";

export function StatsCards({ reports }: { reports: any[] }) {
  const criticalCount = reports.filter(r => r.urgency_level === "Critical").length;
  
  const stats = [
    { label: "Aktif Vakalar", value: reports.length.toString(), icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Kritik Uyarılar", value: criticalCount.toString(), icon: Flame, color: "text-red-500", bg: "bg-red-50" },
    { label: "Müsait Ekipler", value: "2", icon: Users2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Toplam Rapor", value: reports.length.toString(), icon: FileWarning, color: "text-orange-500", bg: "bg-orange-50" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-2xl border border-border flex items-center gap-5 hover:shadow-md transition-shadow cursor-default"
        >
          <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
