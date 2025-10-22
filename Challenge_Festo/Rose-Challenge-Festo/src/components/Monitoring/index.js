import React from "react";
import CylinderStatus from "../Readings/CylinderStatus";
import ActuatorHistoryChart from "./ActuatorHistoryChart";

export default function Monitoring() {
  return (
    <div className="monitoring-wrapper">
      <div style={{ marginBottom: 16 }}>
        <CylinderStatus pollMs={3000} />
      </div>

      <div className="monitoring-card">
        <ActuatorHistoryChart
          title="Histórico – Cilindro DSNU (0=Recuado, 1=Avançado)"
          tagAvancado="Avancado_1S2"
          tagRecuado="Recuado_1S1"
        />
      </div>

      <div className="monitoring-card">
        <ActuatorHistoryChart
          title="Histórico – Cilindro DSBC (0=Recuado, 1=Avançado)"
          tagAvancado="Avancado_2S2"
          tagRecuado="Recuado_2S1"
        />
      </div>
    </div>
  );
}