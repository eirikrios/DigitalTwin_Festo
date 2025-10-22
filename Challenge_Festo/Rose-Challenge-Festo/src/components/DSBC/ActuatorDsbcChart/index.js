import ActuatorHistoryChart from "../../ActuatorHistoryChart";

export default function ActuatorDsnuChart({
  tagAvancado = "Avancado_1S2",
  tagRecuado = "Recuado_1S1",
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-xl w-full text-center">
      <ActuatorHistoryChart tagAvancado={tagAvancado} tagRecuado={tagRecuado} />
    </div>
  );
}
