import ActuatorHistoryChart from '../../ActuatorHistoryChart';

const ActuatorDsnuChart = ({
  tagAvancado = 'Avancado_1S2',
  tagRecuado = 'Recuado_1S1',
  status,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-xl w-full text-center">
      <ActuatorHistoryChart
        tagAvancado={tagAvancado}
        tagRecuado={tagRecuado}
        value={status}
      />
    </div>
  );
};

export default ActuatorDsnuChart;