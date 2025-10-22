import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModelDsnu from '../3dModels/ModelDsnu';
import ActuatorDsnuStatus from './ActuatorDsnuStatus';
import ActuatorDsnuChart from './ActuatorDsnuChart';
import ActuatorPressureChart from '../ActuatorPressureChart';
import ActuatorReport from '../ActuatorReport';

import './styles.css';

const ActuatorDsnuDisplay = () => {
  const nav = useNavigate();
  const chartsRef = useRef(null);

  return (
    <section className="dsnu-page">
      <div className="dsnu-header">
        <button
          className="select-model-button select-model-button--xl"
          onClick={() => nav('/select')}
        >
          Voltar
        </button>

        <h1 className="dsnu-title">DSNU 20-100-PPV</h1>

        <ActuatorReport
          chartsRef={chartsRef}
          actuatorTitle="DSNU 20 100 PPV"
          actuatorStatus="AVANÇADO"
        />
      </div>

      <div className="dsnu-top">
        <div className="dsnu-top__left">
          <div className="dsnu-3d viewport">
            <ModelDsnu />
          </div>
        </div>

        <div className="dsnu-top__right">
          <ActuatorDsnuStatus />
        </div>
      </div>

      <div ref={chartsRef} className="dsnu-bottom">
        <div className="chart-card">
          <h2 className="chart-title">Histórico de Posição da Haste</h2>
          <ActuatorDsnuChart
            tagAvancado="Avancado_1S2"
            tagRecuado="Recuado_1S1"
          />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Histórico de Pressão</h2>
          <ActuatorPressureChart
            tagV1="PressaoEntradaDSNU"
            tagV2="PressaoSaidaDSNU"
          />
        </div>
      </div>
    </section>
  );
};

export default ActuatorDsnuDisplay;