import React, { useEffect, useState } from "react";
import { getCylinderStatus } from "../../../utils/cylinderService";
import "./styles.css";

const PILL_COLORS = {
  "AVANÇADO": "#004ba0ff",
  "RECUADO": "#3b91f5ff",
  "EM CURSO": "#999999",
};

function Pill({ label }) {
  const bg = PILL_COLORS[label] || "#666";
  return (
    <span
      style={{
        background: bg,
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 999,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

export default function CylinderStatus({ pollMs = 3000 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    let timer = null;

    async function fetchOnce() {
      try {
        const resp = await getCylinderStatus();
        if (active) {
          setData(resp);
          setErr("");
          setLoading(false);
        }
      } catch (e) {
        if (active) {
          setErr(e?.message || "Erro ao carregar status");
          setLoading(false);
        }
      }
    }

    fetchOnce();
    if (pollMs > 0) timer = setInterval(fetchOnce, pollMs);
    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, [pollMs]);

  if (loading) return <div>Carregando status…</div>;
  if (err) return <div style={{ color: "tomato" }}>{err}</div>;
  if (!data) return null;

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <strong>Cilindro 1:</strong> <Pill label={data.statusCilindro1} />
      <strong>Cilindro 2:</strong> <Pill label={data.statusCilindro2} />
    </div>
  );
}
