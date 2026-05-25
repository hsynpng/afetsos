"use client";

import React, { useState } from "react";
import { Users2, Radio, ShieldCheck, MapPin, Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { cn, translateNeedType } from "@/lib/utils";
import { useReports } from "@/hooks/useReports";
import { useTeams } from "@/hooks/useTeams";

export default function TeamsPage() {
  const { reports, loading: reportsLoading } = useReports();
  const { teams, loading: teamsLoading, refresh } = useTeams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", members: 1, expertise: "", leader_name: "" });

  if (reportsLoading || teamsLoading) {
    return <div className="flex items-center justify-center h-96 font-bold text-secondary animate-pulse uppercase tracking-widest">Sistem Yükleniyor...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTeam ? `http://localhost:8000/teams/${editingTeam.id}` : `http://localhost:8000/teams/`;
    const method = editingTeam ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setEditingTeam(null);
        setFormData({ name: "", members: 1, expertise: "", leader_name: "" });
        refresh();
      } else {
        alert(`Hata: ${result.detail || "Sunucu isteği reddetti."}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Bağlantı hatası: Backend sunucusuna ulaşılamıyor.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ekibi silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`http://localhost:8000/teams/${id}`, { method: "DELETE" });
      refresh();
    } catch (error) {
      alert("Silme hatası");
    }
  };

  const openEdit = (team: any) => {
    setEditingTeam(team);
    setFormData({ 
      name: team.name, 
      members: team.members, 
      expertise: team.expertise, 
      leader_name: team.leader_name || "" 
    });
    setIsModalOpen(true);
  };

  const handleFinishTask = async (reportId: string, teamName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remove_team: teamName })
      });
      if (response.ok) {
        refresh();
      }
    } catch (error) {
      alert("Görev bitirme hatası");
    }
  };

  const teamsWithTasks = teams.map(team => {
    const activeTask = reports.find(r => r.assigned_teams?.includes(team.name) && r.status === "In Progress");
    return {
      ...team,
      reportId: activeTask?.id,
      task: activeTask ? `#${activeTask.id.slice(0, 8)} - ${translateNeedType(activeTask.need_type)}` : "-",
      time: activeTask ? new Date(activeTask.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "",
      status: activeTask ? "GÖREVDE" : "MÜSAİT"
    };
  });

  const onDutyCount = teamsWithTasks.filter(t => t.status === "GÖREVDE").length;
  const availableCount = teamsWithTasks.filter(t => t.status === "MÜSAİT").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ekip Yönetimi</h1>
          <p className="text-sm font-semibold text-secondary mt-1 tracking-wide">{teams.length} kayıtlı ekip</p>
        </div>
        <button 
          onClick={() => { setEditingTeam(null); setFormData({name:"", members:1, expertise:"", leader_name:""}); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          YENİ EKİP EKLE
        </button>
      </div>

      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 text-blue-700 text-xs font-bold mb-4">
        <ShieldCheck className="w-5 h-5" />
        <span>Tavsiye: Kritik görevlere atama yapmadan önce ekip lideriyle telsiz irtibatı kurun.</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Müsait Ekip" value={availableCount} icon={Users2} color="text-emerald-500" bg="bg-emerald-50" />
        <StatCard label="Görevde" value={onDutyCount} icon={Radio} color="text-orange-500" bg="bg-orange-50" />
        <StatCard label="Toplam Kapasite" value={teams.reduce((acc, t) => acc + t.members, 0)} icon={ShieldCheck} color="text-blue-500" bg="bg-blue-50" />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-10">
        {teamsWithTasks.map((team) => (
          <div key={team.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className={cn(
              "p-6 flex items-center justify-between border-b border-border/50",
              team.status === "GÖREVDE" ? "bg-orange-50/30" : "bg-emerald-50/30"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  team.status === "GÖREVDE" ? "bg-orange-100 text-orange-600 border-orange-200" : "bg-emerald-100 text-emerald-600 border-emerald-200"
                )}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => openEdit(team)} className="text-[10px] font-bold text-primary hover:underline">DÜZENLE</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={() => handleDelete(team.id)} className="text-[10px] font-bold text-red-500 hover:underline">SİL</button>
                  </div>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                team.status === "GÖREVDE" ? "bg-orange-100 text-orange-600 border-orange-200" : "bg-emerald-100 text-emerald-600 border-emerald-200"
              )}>
                {team.status}
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase opacity-70 mb-1">Ekip Lideri / Şef</p>
                  <p className="text-sm font-black text-primary flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {team.leader_name || "Belirtilmedi"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase opacity-70 mb-1">Üye Sayısı</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Users2 className="w-4 h-4 text-secondary" /> {team.members} kişi</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase opacity-70 mb-1">Uzmanlık</p>
                  <p className="text-sm font-bold text-slate-800">{team.expertise}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-secondary uppercase opacity-70 mb-2 tracking-widest">Aktif Görev</p>
                {team.status === "GÖREVDE" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{team.task}</span>
                      <span className="text-[10px] font-bold text-secondary flex items-center gap-1"><MapPin className="w-3 h-3" /> {team.time}</span>
                    </div>
                    <button 
                      onClick={() => handleFinishTask(team.reportId, team.name)}
                      className="w-full bg-orange-500 text-white text-[10px] font-black py-2 rounded-lg hover:bg-orange-600 transition-colors uppercase tracking-widest"
                    >
                      GÖREVİ BİTİR / MÜSAİT YAP
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-2 text-[10px] font-black text-emerald-600 bg-emerald-50 rounded-lg uppercase tracking-widest">GÖREVE HAZIR</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50">
              <h2 className="font-black text-lg uppercase tracking-tight">{editingTeam ? "EKİBİ DÜZENLE" : "YENİ EKİP EKLE"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Ekip İsmi</label>
                <input required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Alpha Kurtarma" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Ekip Lideri / Şef</label>
                <input value={formData.leader_name} onChange={e=>setFormData({...formData, leader_name:e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Yüzbaşı Ahmet" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Üye Sayısı</label>
                <input required value={formData.members} onChange={e=>setFormData({...formData, members:parseInt(e.target.value)})} type="number" min="1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Uzmanlık Alanı</label>
                <input required value={formData.expertise} onChange={e=>setFormData({...formData, expertise:e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Enkaz Arama & Kurtarma" />
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest">KAYDET</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border flex items-center gap-5 shadow-sm">
      <div className={cn(bg, color, "p-4 rounded-xl")}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-secondary">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
}
