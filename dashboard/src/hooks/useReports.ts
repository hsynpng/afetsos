import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Listen for real-time updates
    const channel = supabase
      .channel("reports_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          console.log("Veritabanında değişiklik algılandı, güncelleniyor...");
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { reports, loading, refresh: fetchReports };
}
