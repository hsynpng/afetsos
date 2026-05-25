"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  TriangleAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { id: "dashboard", label: "Kontrol Paneli", icon: LayoutDashboard, href: "/" },
  { id: "cases", label: "Vakalar", icon: FileText, href: "/vakalar" },
  { id: "teams", label: "Ekipler", icon: Users, href: "/ekipler" },
  { id: "settings", label: "Ayarlar", icon: Settings, href: "/ayarlar" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <TriangleAlert className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">AFETSOS</h1>
          <p className="text-[10px] text-secondary font-medium tracking-widest uppercase">Afet İletişim</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-secondary hover:bg-slate-50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-secondary group-hover:text-foreground")} />
              <span className="font-semibold text-sm">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3 text-secondary font-medium text-xs">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="tracking-widest uppercase">SİSTEM AKTİF</span>
        </div>
      </div>
    </aside>
  );
}
