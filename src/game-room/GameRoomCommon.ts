import { Card, PlayResult } from '../game-mechanics/Set';

export const firebaseConfig = {
    databaseURL: "https://set-game-6cb33-default-rtdb.europe-west1.firebasedatabase.app/",
};

export interface GameState{
    cardsOnTable: Card[];
    numberOfCardsInDeck: number;
}

export interface GamePlayResult{
    cards: Card[], 
    playResult: PlayResult
}

