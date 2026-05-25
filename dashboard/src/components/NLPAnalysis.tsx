"use client";

import React from "react";
import { Radio, BrainCircuit, Activity, HeartPulse, CheckCircle2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn, translateUrgency, translateNeedType, translateHealthStatus, translateDamage } from "@/lib/utils";

export function NLPAnalysis({ report }: { report: any }) {
  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6 h-full flex flex-col items-center justify-center text-secondary">
        <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-bold uppercase tracking-widest opacity-50">Vaka Seçiniz</p>
      </div>
    );
  }

  // Bu değişkeni "false" yaparak silme butonunu kapatabilirsiniz.
  const isDeleteEnabled = true;

  const riskScore = report.urgency_level === "Critical" ? 95 : report.urgency_level === "High" ? 75 : 45;

  return (
    <div className="bg-white rounded-2xl border border-border p-6 h-full flex flex-col gap-6 shadow-sm overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-sm uppercase tracking-widest">NLP Analiz</h2>
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase">#{report.id.slice(0, 8)}</span>
      </div>

      <div className="space-y-6">
        {/* Ham Mesaj */}
        <div>
          <label className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2 block">Ham Mesaj</label>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-sm font-medium text-slate-700 leading-relaxed">
            &quot;{report.message}&quot;
          </div>
        </div>

        {/* Analiz Sonuçları */}
        <div>
          <label className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 block">Analiz Sonuçları</label>
          <div className="grid grid-cols-1 gap-2">
            <DetailRow label="İhtiyaç Türü" value={translateNeedType(report.need_type)} color="primary" />
            <DetailRow label="Kişi Sayısı" value={(!report.victim_count || report.victim_count === "N/A" || report.victim_count === "UNKNOWN") ? "1" : String(report.victim_count)} color="secondary" />
            <DetailRow label="Sağlık Durumu" value={translateHealthStatus(report.health_status || "Belirtilmedi")} color="secondary" />
            <DetailRow label="Konum / Kat" value={(!report.floor_number || report.floor_number === "N/A" || report.floor_number === "UNKNOWN") ? "Belirtilmedi" : report.floor_number} color="secondary" />
            <DetailRow label="Bina Hasarı" value={translateDamage(report.infrastructure_damage || "Belirtilmedi")} color="secondary" />
            <DetailRow label="Aciliyet" value={translateUrgency(report.urgency_level)} color="primary" />
          </div>
        </div>

        {/* Risk Skoru */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Risk Skoru</label>
            </div>
            <span className="text-xl font-black text-primary">{riskScore}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              key={report.id}
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full bg-gradient-to-r",
                riskScore > 80 ? "from-orange-500 to-red-600" : "from-yellow-400 to-orange-500"
              )}
            />
          </div>
        </div>

        {/* İşlem Butonu */}
        <div className="pt-4">
          {report.status !== "Resolved" ? (
            <button 
              onClick={async () => {
                if(!confirm("Bu vakayı 'ÇÖZÜLDÜ' olarak işaretlemek ve tüm ekipleri boşa çıkarmak istiyor musunuz?")) return;
                try {
                  const res = await fetch(`http://localhost:8000/reports/${report.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Resolved" })
                  });
                  if (res.ok) alert("Vaka başarıyla kapatıldı.");
                } catch (e) { alert("Hata oluştu."); }
              }}
              className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              VAKAYI KAPAT / ÇÖZÜLDÜ
            </button>
          ) : (
            <div className="w-full py-4 bg-slate-100 text-slate-500 font-black rounded-2xl border border-slate-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-not-allowed">
              <CheckCircle2 className="w-4 h-4" />
              BU VAKA ÇÖZÜLDÜ
            </div>
          )}

          {/* Vaka Kaldır / Sil Butonu */}
          {isDeleteEnabled && (
            <button
              onClick={async () => {
                if(!confirm("DİKKAT! Bu vakayı veritabanından tamamen silmek istiyor musunuz? Bu işlem geri alınamaz!")) return;
                try {
                  const res = await fetch(`http://localhost:8000/reports/${report.id}`, {
                    method: "DELETE"
                  });
                  if (res.ok) alert("Vaka veritabanından tamamen silindi.");
                } catch (e) { alert("Hata oluştu."); }
              }}
              className="w-full py-3 mt-3 bg-red-50 text-red-600 font-black rounded-2xl border border-red-200 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              VAKAYI KALDIR / SİL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 p-2 px-3 rounded-lg border border-slate-100">
      <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{label}</span>
      <span className={cn(
        "text-xs font-black truncate max-w-[150px]",
        color === "primary" ? "text-primary" : "text-slate-700"
      )}>{value}</span>
    </div>
  );
}
