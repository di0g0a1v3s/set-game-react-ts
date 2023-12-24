import { SetGame, Card } from '../game-mechanics/Set';
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, onValue } from "firebase/database";
import { firebaseConfig, generateRandomId } from './GameRoomCommon';

export class GameRoomHost {
    private database: Database;
    private setGame: SetGame | null = null;
    private roomId: string;
    constructor() {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
        this.roomId = generateRandomId();
        console.log("qqq new room", this.roomId)
        this.initializeRoom(this.roomId)
         
        onValue(ref(this.database, 'room/' + this.roomId + "/play"), (snapshot) => {
            const cards = snapshot.val()?.cards as Card[];
            const playId = snapshot.val()?.id as string;
            if(cards != null && playId != null){
                const playResult = this.setGame?.play(cards)
                set(ref(this.database, 'room/' + this.roomId + "/playResult"), {id: playId, cards: cards, playResult: playResult});
                setTimeout(() => {
                    set(ref(this.database, 'room/' + this.roomId + "/gameState"), {id: generateRandomId(), cardsOnTable: this.setGame?.getCardsOnTable(), numberOfCardsInDeck: this.setGame?.getNumberOfCardsInDeck()});
                }, 300)
            }
        })
    }

    public getRoomId(){
        return this.roomId;
    }

    private initializeRoom(roomId: string) {
        this.setGame = new SetGame();
        set(ref(this.database, 'room/' + roomId + "/gameState"), {id: generateRandomId(), cardsOnTable: this.setGame?.getCardsOnTable(), numberOfCardsInDeck: this.setGame?.getNumberOfCardsInDeck()});
    }
}