import { useEffect, useMemo, useState } from 'react';
import '../styles.css';
import { sendSimInputs, getCylinderStatus } from '../../../utils/cylinderService';

const P_MIN = 0.4;
const P_MAX = 12.0;
const STROKE = 180;
const VMAX = 1500;
const INST_BUF = 2.0;
const K_GAIN = 1.0;

export default function ActuatorDsbcStatus() {
  const [pressao, setPressao] = useState('');
  const [carga, setCarga] = useState('');
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState('—');

  const pNum = Number(pressao) || 0;

  const calc = useMemo(() => {
    if (!started) return { pin: 0, pout: 0, vAv: 0, vCiclo: 0, light: 'off' };

    const pertoMin = pNum > 0 && pNum - P_MIN < INST_BUF;
    const pertoMax = P_MAX - pNum < INST_BUF;

    let light = 'green'; // estável
    if (pNum < P_MIN || pNum > P_MAX) light = 'red';      // falha
    else if (pertoMin || pertoMax)    light = 'yellow';   // instável

    const vAv = Math.max(0, Math.min(VMAX, K_GAIN * ((pNum - P_MIN) / (P_MAX - P_MIN)) * VMAX));
    const vCiclo = vAv / 2;

    return {
      pin: (pNum > 0 ? pNum : 0).toFixed(3),
      pout: 0,
      vAv: Math.round(vAv),
      vCiclo: Math.round(vCiclo),
      light
    };
  }, [pNum, started]);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const s = await getCylinderStatus();
        setStatus(s?.statusCilindro2 || '—');
      } catch (_) {}
    }, 1000);
    return () => clearInterval(id);
  }, []);

  async function handleStart() {
    setStarted(false);
    const dsnu = { pressao: 0, carga: 0 };
    const dsbc = { pressao: Number(pressao) || 0, carga: Number(carga) || 0 };
    await sendSimInputs({ dsnu, dsbc });
    setStarted(true);
  }

  const isFail = calc.light === 'red';
  const isWarn = calc.light === 'yellow';
  const isOk   = calc.light === 'green';

  return (
    <div className="status-right">
      <p className="status-title">Dados da Simulação:</p>

      <p className="status-line">
        Posição da haste: <span className="status-value">{status}</span>
      </p>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
        <label>Pressão (bar):</label>
        <input
          value={pressao}
          onChange={(e) => setPressao(e.target.value)}
          placeholder="ex: 8.0"
          style={{ width: 100, padding: '6px 8px', border: '1px solid #cfd7de', borderRadius: 8 }}
        />
        <label>Carga (N):</label>
        <input
          value={carga}
          onChange={(e) => setCarga(e.target.value)}
          placeholder="ex: 350"
          style={{ width: 120, padding: '6px 8px', border: '1px solid #cfd7de', borderRadius: 8 }}
        />

        <button className="select-model-button select-model-button--xl" onClick={handleStart}>
          Começar
        </button>
      </div>

      <p className="status-line" style={{ marginTop: 6 }}>
        Limites DSBC: {P_MIN}–{P_MAX} bar | Stroke: {STROKE} mm | v<sub>máx</sub>≈ {VMAX} mm/s
      </p>

      <p className="status-line">
        Velocidade de avanço: <span className="status-value">{calc.vAv} mm/s</span>
      </p>
      <p className="status-line">
        Velocidade de ciclo: <span className="status-value">{calc.vCiclo} mm/s</span>
      </p>

      <div className="traffic">
        <div className="traffic-item">
          <span className={`light red ${isFail ? 'on' : ''}`}></span>
          <p>Falha</p>
        </div>
        <div className="traffic-item">
          <span className={`light yellow ${isWarn ? 'on' : ''}`}></span>
          <p>Instável</p>
        </div>
        <div className="traffic-item">
          <span className={`light green ${isOk ? 'on' : ''}`}></span>
          <p>Estável</p>
        </div>
      </div>

      <p className="status-line" style={{ fontSize: 13 }}>
        P<sub>in</sub>: {calc.pin} bar | P<sub>out</sub>: {calc.pout} bar
      </p>
    </div>
  );
}