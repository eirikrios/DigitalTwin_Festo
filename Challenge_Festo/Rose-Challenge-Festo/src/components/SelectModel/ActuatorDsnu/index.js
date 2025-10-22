import React from 'react';
import imgDsnu from 'assets/images/DsnuIconClean.png';
import '../styles.css';

export default function ActuatorDsnu({ onClick }) {
  return (
    <div className="actuator" onClick={onClick}>
      <div className="actuator__col">
        <img
          src={imgDsnu}
          alt="Atuador DSNU 20-100-PPV"
          className="actuator__image"
        />
      </div>

      <div className="actuator__col">
        <h3 className="actuator__title">DSNU 20-100-PPV</h3>

        <div className="actuator__specs">
          <span className="actuator__specsHeading">Especificações:</span><br />
          <span className="actuator__label">Atuador:</span> redondo normalizado ISO 6432 <br />
          <span className="actuator__label">Curso:</span> 100 mm <br />
          <span className="actuator__label">Diâmetro:</span> Ø 20 mm <br />
          <span className="actuator__label">Área efetiva do pistão:</span> 314 mm² <br />
          <span className="actuator__label">Força teórica (a 6 bar):</span> avanço ≈ 188 N e recuo ≈ 162 N <br />
          <span className="actuator__label">Pressão de operação:</span> 1 - 10 bar <br />
          <span className="actuator__label">Velocidade:</span> 0,1 - 1,0 m/s <br />
          <span className="actuator__label">Amortecimento:</span> PPV (pneumático regulável em ambas extremidades)
        </div>

        <button
          className="select-model-button select-model-button--xl"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          Ver simulação DSNU
        </button>
      </div>
    </div>
  );
}
