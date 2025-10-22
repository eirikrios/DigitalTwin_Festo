import React from 'react';
import imgDsbc from 'assets/images/DsbcIconClean.png';
import '../styles.css';

export default function ActuatorDsbc({ onClick }) {
  return (
    <div className="actuator actuator--reverse" onClick={onClick}>
      <div className="actuator__col">
        <h3 className="actuator__title">DSBC 40-180-PPV</h3>

        <div className="actuator__specs">
          <span className="actuator__specsHeading">Especificações:</span><br />
          <span className="actuator__label">Atuador:</span> normalizado ISO 15552 <br />
          <span className="actuator__label">Curso:</span> 180 mm <br />
          <span className="actuator__label">Diâmetro:</span> Ø 40 mm <br />
          <span className="actuator__label">Área efetiva do pistão:</span> 1256 mm² <br />
          <span className="actuator__label">Força teórica (a 6 bar):</span> avanço ≈ 754 N e recuo ≈ 678 N <br />
          <span className="actuator__label">Pressão de operação:</span> 1 – 12 bar <br />
          <span className="actuator__label">Velocidade:</span> 0,1 – 1,5 m/s <br />
          <span className="actuator__label">Amortecimento:</span> PPV (pneumático regulável em ambas extremidades)
        </div>

        <button
          className="select-model-button select-model-button--xl"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          Ver simulação DSBC
        </button>
      </div>

      <div className="actuator__col">
        <img
          src={imgDsbc}
          alt="Atuador DSBC 40-180-PPV"
          className="actuator__image"
        />
      </div>
    </div>
  );
}
