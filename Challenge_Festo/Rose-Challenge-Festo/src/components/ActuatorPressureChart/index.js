import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getHistoryByTag } from "../../utils/cylinderService";

function fmt(ts) { try { return new Date(ts).toLocaleTimeString(); } catch { return ts; } }

export default function ActuatorPressureChart({
  tagV1,
  tagV2,
  refreshMs = 3000,
}) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    let t;

    async function fetchData() {
      setErr("");
      try {
        const [h1, h2] = await Promise.all([
          getHistoryByTag(tagV1),
          getHistoryByTag(tagV2),
        ]);

        const map = new Map();
        h1.forEach(r => map.set(r.ts, { ts: r.ts, Entrada: Number(r.valor) }));
        h2.forEach(r => {
          const p = map.get(r.ts) || { ts: r.ts };
          p.Saida = Number(r.valor);
          map.set(r.ts, p);
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(a.ts) - new Date(b.ts)
        );
        const data = merged.map(d => ({
          time: fmt(d.ts),
          Entrada: d.Entrada ?? null,
          Saida: d.Saida ?? null,
        }));

        if (active) setRows(data);
      } catch (e) {
        if (active) setErr(e?.message || "Network Error");
      }
    }

    fetchData();
    t = setInterval(fetchData, refreshMs);
    return () => { active = false; t && clearInterval(t); };
  }, [tagV1, tagV2, refreshMs]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      {err ? (
        <div style={{ color: "tomato" }}>{err}</div>
      ) : (
        <ResponsiveContainer>
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Entrada" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="Saida"   dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}