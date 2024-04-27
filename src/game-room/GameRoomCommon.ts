import { Card, PlayResult } from '../game-mechanics/Set';

export const firebaseConfig = {
    databaseURL: "https://set-game-6cb33-default-rtdb.europe-west1.firebasedatabase.app/",
};

export interface GameState{
    cardsOnTable: Card[];
    numberOfCardsInDeck: number;
    scoreBoard: {[playerID: string]: number};
}

export interface GamePlayResult{
    cards: Card[], 
    playResult: PlayResult
}

export function generateRandomId(): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

