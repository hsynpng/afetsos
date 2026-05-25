"use client";

import React, { useState, useEffect } from "react";
import { Bell, Monitor, Database, Globe, Volume2, Mail, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    emailReports: false,
    autoRefresh: true,
    refreshInterval: "30 saniye",
    mapProvider: "OpenStreetMap"
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("afetsos_settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Save settings when they change
  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("afetsos_settings", JSON.stringify(newSettings));
  };

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className={cn(
        "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-200",
        active ? "bg-primary" : "bg-slate-200"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
        active ? "right-1" : "left-1"
      )} />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ayarlar</h1>
        <p className="text-sm font-semibold text-secondary mt-1 tracking-wide">Sistem ve bildirim yapılandırması</p>
      </div>

      {/* Notifications */}
      <section className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-sm uppercase tracking-widest">Bildirimler</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Anlık Bildirimler</p>
              <p className="text-xs text-secondary font-medium">Yeni vaka ve kritik uyarıları anında alın</p>
            </div>
            <Toggle active={settings.notifications} onClick={() => updateSetting("notifications", !settings.notifications)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Sesli Uyarılar</p>
              <p className="text-xs text-secondary font-medium">Kritik vakalarda sesli uyarı çalsın</p>
            </div>
            <Toggle active={settings.sound} onClick={() => updateSetting("sound", !settings.sound)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">E-posta Raporları</p>
              <p className="text-xs text-secondary font-medium">Günlük operasyon özeti e-posta ile gönderilsin</p>
            </div>
            <Toggle active={settings.emailReports} onClick={() => updateSetting("emailReports", !settings.emailReports)} />
          </div>
        </div>
      </section>

      {/* Appearance & Data */}
      <section className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Monitor className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-sm uppercase tracking-widest">Görünüm & Veri</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Otomatik Yenileme</p>
              <p className="text-xs text-secondary font-medium">Verileri belirli aralıklarla otomatik güncelle</p>
            </div>
            <Toggle active={settings.autoRefresh} onClick={() => updateSetting("autoRefresh", !settings.autoRefresh)} />
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Yenileme Aralığı</label>
            <select 
              value={settings.refreshInterval}
              onChange={(e) => updateSetting("refreshInterval", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none"
            >
              <option>30 saniye</option>
              <option>1 dakika</option>
              <option>5 dakika</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Dil</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
              <Globe className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold">Türkçe</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-sm uppercase tracking-widest">Sistem</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-slate-800">Harita Sağlayıcı</p>
              <p className="text-[10px] text-secondary font-medium uppercase tracking-widest">Harita görünümünde kullanılacak servis</p>
            </div>
            <select 
              value={settings.mapProvider}
              onChange={(e) => updateSetting("mapProvider", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none"
            >
              <option>OpenStreetMap</option>
              <option>Google Maps (Yakında)</option>
            </select>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-800">Veritabanı Durumu</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm font-bold text-emerald-600">Bağlı (Supabase)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
