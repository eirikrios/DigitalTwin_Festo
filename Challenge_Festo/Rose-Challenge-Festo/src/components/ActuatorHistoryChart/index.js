import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getHistoryByTag } from "../../utils/cylinderService";

function fmt(ts) {
  try { return new Date(ts).toLocaleTimeString(); } catch { return ts; }
}

const ActuatorHistoryChart = ({
  tagAvancado,
  tagRecuado,
  refreshMs = 3000,
}) => {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    let t;

    async function fetchHistory() {
      setErr("");
      try {
        const [hA, hR] = await Promise.all([
          getHistoryByTag(tagAvancado),
          getHistoryByTag(tagRecuado),
        ]);

        const map = new Map();
        hA.forEach(r => map.set(r.ts, { ts: r.ts, Avancado: Number(r.valor) }));
        hR.forEach(r => {
          const p = map.get(r.ts) || { ts: r.ts };
          p.Recuado = Number(r.valor);
          map.set(r.ts, p);
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(a.ts) - new Date(b.ts)
        );
        const data = merged.map(d => ({
          time: fmt(d.ts),
          Avancado: d.Avancado ?? 0,
          Recuado: d.Recuado ?? 0,
        }));

        if (active) setRows(data);
      } catch (e) {
        if (active) setErr(e?.message || "Network Error");
      }
    }

    fetchHistory();
    t = setInterval(fetchHistory, refreshMs);
    return () => { active = false; t && clearInterval(t); };
  }, [tagAvancado, tagRecuado, refreshMs]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      {err ? (
        <div style={{ color: "tomato" }}>{err}</div>
      ) : (
        <ResponsiveContainer>
          <AreaChart data={rows} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Avancado" stroke="#00b894" fill="#00b894" />
            <Area type="monotone" dataKey="Recuado"  stroke="#0984e3" fill="#0984e3" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ActuatorHistoryChart;