import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModelDsbc from '../3dModels/ModelDsbc';
import ActuatorDsbcStatus from './ActuatorDsbcStatus';
import ActuatorDsbcChart from './ActuatorDsbcChart';
import ActuatorPressureChart from '../ActuatorPressureChart';
import ActuatorReport from '../ActuatorReport';

import './styles.css';

const ActuatorDsbcDisplay = () => {
  const nav = useNavigate();
  const chartsRef = useRef(null);

  return (
    <section className="dsbc-page">
      <div className="dsbc-header">
        <button
          className="select-model-button select-model-button--xl"
          onClick={() => nav('/select')}
        >
          Voltar
        </button>

        <h1 className="dsbc-title">DSBC 40-180-PPV</h1>

        <ActuatorReport
          chartsRef={chartsRef}
          actuatorTitle="DSBC 40 180 PPV"
          actuatorStatus="AVANÇADO"
        />
      </div>

      <div className="dsbc-top">
        <div className="dsbc-top__left">
          <div className="dsbc-3d viewport">
            <ModelDsbc />
          </div>
        </div>

        <div className="dsbc-top__right">
          <ActuatorDsbcStatus />
        </div>
      </div>

      <div ref={chartsRef} className="dsbc-bottom">
        <div className="chart-card">
          <h2 className="chart-title">Hstórico de Posição da Haste:</h2>
          <ActuatorDsbcChart
            tagAvancado="Avancado_2S2"
            tagRecuado="Recuado_2S1"
          />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Hstórico de Pressão:</h2>
          <ActuatorPressureChart
            tagV1="PressaoEntradaDSBC"
            tagV2="PressaoSaidaDSBC"
          />
        </div>
      </div>
    </section>
  );
};

export default ActuatorDsbcDisplay;