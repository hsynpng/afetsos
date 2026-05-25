import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Aciliyet seviyesini Türkçeye çevirir */
export function translateUrgency(level: string): string {
  const map: Record<string, string> = {
    "Critical": "KRİTİK",
    "High": "YÜKSEK",
    "Medium": "ORTA",
    "Low": "DÜŞÜK",
  };
  return map[level] || level;
}

/** Vaka durumunu Türkçeye çevirir */
export function translateStatus(status: string): string {
  const map: Record<string, string> = {
    "Pending": "AÇIK",
    "In Progress": "DEVAM EDİYOR",
    "Resolved": "ÇÖZÜLDÜ",
    "Open": "AÇIK",
    "OPEN": "AÇIK",
    "IN PROGRESS": "DEVAM EDİYOR",
  };
  return map[status] || status;
}

/** İhtiyaç tipini Türkçeye çevirir */
export function translateNeedType(type: string): string {
  if (!type || type === "null") return "Belirtilmedi";
  const map: Record<string, string> = {
    "N/A": "Belirtilmedi",
    "UNKNOWN": "Bilinmiyor",
    "Unknown": "Bilinmiyor",
    "Not specified": "Belirtilmedi",
    "Food": "Gıda",
    "Water": "Su",
    "Medical": "Tıbbi Yardım",
    "Rescue": "Kurtarma",
    "Shelter": "Barınma",
    "Clothing": "Giysi",
    "Blanket": "Battaniye",
    "Transportation": "Ulaşım",
    "Communication": "İletişim",
    "Psychological": "Psikolojik Destek",
    "Search and Rescue": "Arama Kurtarma",
    "First Aid": "İlk Yardım",
    "Evacuation": "Tahliye",
    "Infrastructure": "Altyapı",
    "Electricity": "Elektrik",
    "Gas Leak": "Gaz Kaçağı",
    "Fire": "Yangın",
    "Debris Removal": "Enkaz Kaldırma",
    "": "Belirtilmedi",
  };
  return map[type] || type;
}

/** Sağlık durumunu Türkçeye çevirir */
export function translateHealthStatus(status: string): string {
  if (!status || status === "null") return "Belirtilmedi";
  const map: Record<string, string> = {
    "N/A": "Belirtilmedi",
    "UNKNOWN": "Bilinmiyor",
    "Unknown": "Bilinmiyor",
    "Not specified": "Belirtilmedi",
    "Injured": "Yaralı",
    "Critical": "Kritik",
    "Stable": "Stabil",
    "Deceased": "Hayatını Kaybetmiş",
    "Trapped": "Enkaz Altında",
    "Missing": "Kayıp",
    "": "Belirtilmedi",
  };
  return map[status] || status;
}

/** Bina hasar durumunu Türkçeye çevirir */
export function translateDamage(damage: string): string {
  if (!damage || damage === "null") return "Belirtilmedi";
  const map: Record<string, string> = {
    "N/A": "Belirtilmedi",
    "UNKNOWN": "Bilinmiyor",
    "Unknown": "Bilinmiyor",
    "Not specified": "Belirtilmedi",
    "None": "Hasar Yok",
    "Light": "Hafif Hasar",
    "Moderate": "Orta Hasar",
    "Severe": "Ağır Hasar",
    "Collapsed": "Çökmüş",
    "Partial Collapse": "Kısmen Çökmüş",
    "": "Belirtilmedi",
  };
  return map[damage] || damage;
}

/** NLP analiz durumunu Türkçeye çevirir */
export function translateNLPStatus(status: string): string {
  const map: Record<string, string> = {
    "ANALYZED": "ANALİZ EDİLDİ",
    "PROCESSING": "İŞLENİYOR",
    "PENDING": "BEKLEMEDE",
    "FAILED": "BAŞARISIZ",
  };
  return map[status] || status;
}

/** Tarihi Türkçe formatında gösterir */
export function formatTurkishDate(date: Date = new Date()): string {
  const gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  
  return `${date.getDate()} ${aylar[date.getMonth()]} ${date.getFullYear()} ${gunler[date.getDay()]}`;
}
