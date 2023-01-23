import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Card from './Card';
import './CardsWrapper.css';


const CardsWrapper = () => {
const INITIAL_STATE = []
const [cards, setCards] = useState(INITIAL_STATE);
const deck = useRef();
const gameOver = useRef(false);


useEffect(()=> {
    const getDeck = async () => {
        const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        deck.current = (res.data.deck_id);
    }
    getDeck();
}, [])

const handleClick = async() => {
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.current}/draw/?count=1`);
    if (!res.data.cards[0]) {
        gameOver.current = true;
        setCards([...cards]);
        return alert("No cards remaining!");
    }
    setCards(()=>{
        let newCard = res.data.cards[0];
        newCard['angle'] = Math.random() * 90 - 45;
        newCard['randomY'] = Math.random() * 40 - 20;
        newCard['randomX'] = Math.random() * 40 - 20;
        let cardsCopy = [...cards, newCard];
        return cardsCopy;
    })
}

const reshuffleDeck = async ()=> {
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.current}/shuffle/`);
    gameOver.current = false;
    setCards(INITIAL_STATE);
}

   return (
    <div>
        <div className="CardsWrapper-buttondiv">
            {gameOver.current == true ? <button onClick={reshuffleDeck} className="getCard">Reshuffle</button> : <button onClick={handleClick} className="getCard">Gimme a card!</button> }
        </div>
        <div className="CardsWrapper-cards">
            {cards.map(c=> <Card key={c.code} code={c.code} image={c.image} angle={c.angle} randomY={c.randomY} randomX={c.randomX} />)}
        </div>
        
    </div>
    ) 
}

export default CardsWrapper;