"use client";

import React from "react";
import { Users, ShieldCheck, MapPin } from "lucide-react";

import { useTeams } from "@/hooks/useTeams";

export function TeamCoordination({ selectedReport, reports }: { selectedReport: any, reports: any[] }) {
  const { teams, loading } = useTeams();

  // Görevde olan ekipleri belirle (Herhangi bir vaka atanmış ekipler)
  const busyTeams = reports
    .filter(r => r.status === "In Progress" && r.assigned_teams)
    .flatMap(r => r.assigned_teams);

  const handleAssign = async (teamName: string) => {
    if (!selectedReport) {
      alert("Lütfen önce listeden bir vaka seçiniz!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/reports/${selectedReport.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_team: teamName
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${selectedReport.id.slice(0, 8)} nolu vaka ${teamName} ekibine başarıyla atandı!`);
      } else {
        alert(`Hata: ${data.detail || "Atama yapılamadı."}`);
      }
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Bağlantı hatası: Backend sunucusuna erişilemedi.");
    }
  };

  if (loading) return <div className="p-6 text-center animate-pulse text-secondary text-xs font-bold">EKİPLER YÜKLENİYOR...</div>;

  // Sadece atanabilir (müsait) ekipleri filtrele
  const assignableTeams = teams.filter(t => !busyTeams.includes(t.name));

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-sm uppercase tracking-widest">Atanabilir Ekipler</h2>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
          {assignableTeams.length} MÜSAİT
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {assignableTeams.length > 0 ? (
          assignableTeams.map((team, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3 group hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                  <span className="font-bold text-sm">{team.name}</span>
                  <span className="text-[9px] font-medium text-primary uppercase">Şef: {team.leader_name || "Belirtilmedi"}</span>
                </div>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-600">
                  MÜSAİT
                </span>
              </div>
              
              <div className="text-[10px] font-semibold text-secondary">
                <span className="uppercase tracking-tighter opacity-70">Uzmanlık:</span>
                <span className="text-slate-700 ml-2">{team.expertise}</span>
              </div>

              <button 
                onClick={() => handleAssign(team.name)}
                className="w-full mt-1 bg-primary text-white text-[10px] font-black py-2.5 rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest shadow-sm active:scale-95"
              >
                Vaka Ata
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-secondary opacity-50 italic text-xs text-center">
            <p>Müsait ekip bulunmamaktadır.</p>
            <p className="mt-1">Tüm ekipler görevde.</p>
          </div>
        )}
      </div>
    </div>
  );
}
