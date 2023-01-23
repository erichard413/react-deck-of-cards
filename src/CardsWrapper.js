import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Card from './Card';
import './CardsWrapper.css';



const CardsWrapper = () => {
const INITIAL_STATE = []
const [cards, setCards] = useState(INITIAL_STATE);
const deck = useRef();
const cardInterval = useRef();
const refCard = useRef(INITIAL_STATE);
const gameState = useRef('off');


useEffect(()=> {
    const getDeck = async () => {
        const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        deck.current = (res.data.deck_id);
    }
    getDeck();
}, [])

const handleClick = async() => {
    gameState.current = "on"
    cardInterval.current = setInterval(() => {
        const getCard = async () => {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.current}/draw/?count=1`);
            
            if (!res.data.cards[0]) {
            gameState.current = 'over';
            setCards([...cards]);
            stopDraw();
            return alert("No cards remaining!");
            }
    
            let newCard = res.data.cards[0];
            newCard['angle'] = Math.random() * 90 - 45;
            newCard['randomY'] = Math.random() * 40 - 20;
            newCard['randomX'] = Math.random() * 40 - 20;
            
            setCards(refCard.current.push(newCard));
        
        }
        getCard();
    }, 1000);

}

const stopDraw = () => {
    clearInterval(cardInterval.current);
    setCards(INITIAL_STATE);
    refCard.current = INITIAL_STATE;
    gameState.current = 'over'
}

const reshuffleDeck = async ()=> {
    await axios.get(`https://deckofcardsapi.com/api/deck/${deck.current}/shuffle/`);
    gameState.current = 'off';
    setCards(INITIAL_STATE);
}

   return (
    <div>
        <div className="CardsWrapper-buttondiv">
            {gameState.current === 'over' && <button onClick={reshuffleDeck} className="getCard">Reshuffle</button>}
            {gameState.current === 'on' && <button className="getCard" onClick={stopDraw}>Stop Drawing!</button>}
            {gameState.current === 'off' && <button onClick={handleClick} className="getCard">Start Drawing!</button>}
            
        </div>
        <div className="CardsWrapper-cards">
            {refCard.current.map(c=> <Card key={c.code} code={c.code} image={c.image} angle={c.angle} randomY={c.randomY} randomX={c.randomX} />)}
        </div>
        
    </div>
    ) 
}

export default CardsWrapper;