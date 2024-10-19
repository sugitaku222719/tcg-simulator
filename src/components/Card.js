import React from 'react';
import '../styles/Card.module.css'

const Card = ({ card }) => {
  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-name">{card.name}</h3>
        {card.image && <img src={card.image} alt={card.name} className="card-image" />}
        {card.description && <p className="card-description">{card.description}</p>}
        {card.attack !== undefined && <p className="card-attack">攻撃力: {card.attack}</p>}
        {card.defense !== undefined && <p className="card-defense">防御力: {card.defense}</p>}
      </div>
    </div>
  );
};

export default Card;