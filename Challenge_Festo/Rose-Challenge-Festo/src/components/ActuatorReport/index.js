import React from 'react';
import generatePDF from '../../utils/generatePDF';

export default function ActuatorReport({ chartsRef, actuatorTitle, actuatorStatus }) {
  const handleGenerate = () => {
    if (!chartsRef?.current) return;
    generatePDF(chartsRef.current, actuatorTitle, actuatorStatus);
  };

  return (
    <button
      className="select-model-button select-model-button--xl"
      onClick={handleGenerate}
      title="Baixar PDF da Simulação"
    >
      Baixar PDF da Simulação
    </button>
  );
}