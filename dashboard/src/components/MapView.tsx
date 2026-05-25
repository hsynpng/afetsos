"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { translateUrgency, translateNeedType } from "@/lib/utils";

// Fix for default marker icons in Leaflet + Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ reports }: { reports: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 h-[400px] relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-4 absolute top-6 left-10 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-border shadow-sm">
        <h2 className="font-bold text-xs uppercase tracking-widest">Harita Görünümü</h2>
      </div>

      <MapContainer 
        center={[38.3552, 38.3093]} 
        zoom={12} 
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <CircleMarker 
            key={report.id}
            center={[report.latitude, report.longitude]}
            radius={10}
            pathOptions={{ 
              fillColor: report.urgency_level === "Critical" ? "#ef4444" : 
                         report.urgency_level === "High" ? "#f97316" : "#eab308",
              color: "white",
              weight: 2,
              fillOpacity: 0.8
            }}
          >
            <Popup>
              <div className="flex flex-col gap-1">
                <span className="font-black text-[10px] text-primary uppercase">{translateUrgency(report.urgency_level)}</span>
                <span className="font-bold text-xs">{translateNeedType(report.need_type)}</span>
                <span className="text-[10px] text-secondary italic">&quot;{report.message.slice(0, 30)}...&quot;</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Harita Lejantı */}
      <div className="absolute bottom-10 left-10 z-[1000] bg-white/90 backdrop-blur p-4 rounded-xl border border-border shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold text-secondary uppercase">Kritik</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-[10px] font-bold text-secondary uppercase">Yüksek</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-[10px] font-bold text-secondary uppercase">Düşük</span>
        </div>
      </div>
    </div>
  );
}
