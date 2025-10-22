import { useNavigate } from 'react-router-dom';
import ActuatorDsnu from './ActuatorDsnu';
import ActuatorDsbc from './ActuatorDsbc';
import './styles.css';

export default function SelectModel() {
  const nav = useNavigate();

  return (
    <section className="select-model-container">
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <button
          className="select-model-button"
          onClick={() => nav('/')}
          style={{ padding: '0.6rem 1.2rem' }}
        >
          Voltar
        </button>

        <h2
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#003f5a',
            margin: 0,
          }}
        >
          Escolha o produto para visualizar a simulação:
        </h2>

        <button
          className="select-model-button"
          style={{ padding: '0.6rem 1.2rem', visibility: 'hidden' }}
          aria-hidden="true"
          tabIndex={-1}
        >
          Voltar
        </button>
      </div>

      <div className="select-model-options">
        <ActuatorDsnu onClick={() => nav('/dsnu')} />
        <ActuatorDsbc onClick={() => nav('/dsbc')} />
      </div>
    </section>
  );
}
