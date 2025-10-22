import { useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const nav = useNavigate();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  return (
    <section className="welcome-container with-banner">
      <div className="page-shell">
        <div className="welcome-content">
          <h1 className="welcome-title">Bem-vindo ao Digital Twin Festo!</h1>
          <p className="welcome-subtitle">
            Descubra o futuro do monitoramento e simulação em tempo real com a solução Digital Twin Rose
          </p>
          <button className="welcome-button" onClick={() => nav('/select')}>Começar</button>
        </div>
      </div>

      <footer className="welcome-footer">
        <div className="page-shell">
          <p>
            O Digital Twin foi desenvolvido para monitorar e prever falhas de um sistema por meio de uma simulação,
            possibilitando uma manutenção preventiva antes das falhas e, consequentemente, menores interrupções na linha de produção.
          </p>
        </div>
      </footer>
    </section>
  );
}