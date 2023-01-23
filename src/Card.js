import React from 'react';
import './Card.css';

const Card = ({code, image, randomX, randomY, angle}) => {

    return (
        <>
            <img className="Card-img" style={{transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`}} src={image} />
        </>
    )
}

export default Card;