"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { formatTurkishDate } from "@/lib/utils";

export function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Operasyon Merkezi</h1>
        <p className="text-sm font-semibold text-secondary mt-1 tracking-wide">{formatTurkishDate()}</p>
      </div>

      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
        <Wifi className="w-4 h-4 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest">Çevrimiçi</span>
      </div>
    </header>
  );
}
