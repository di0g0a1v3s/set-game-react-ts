import { SetGame, Card, PlayResult } from '../game-mechanics/Set';
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, get, onValue } from "firebase/database";
import { firebaseConfig } from './GameRoomCommon';

export class GameRoomHost {
    private database: Database;
    private setGame: SetGame | null = null;
    private roomId: string;
    constructor() {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
        this.roomId = this.generateRandomId();
        console.log("qqq new room", this.roomId)
        this.initializeRoom(this.roomId)
         
        onValue(ref(this.database, 'room/' + this.roomId + "/play"), (snapshot) => {
            const cards = snapshot.val() as Card[];
            if(cards != null){
                const playResult = this.setGame?.play(cards)
                set(ref(this.database, 'room/' + this.roomId + "/playResult"), {cards: cards, playResult: playResult});
                setTimeout(() => {
                    set(ref(this.database, 'room/' + this.roomId + "/gameState"), {id: this.generateRandomId(), cardsOnTable: this.setGame?.getCardsOnTable(), numberOfCardsInDeck: this.setGame?.getNumberOfCardsInDeck()});
                }, 300)
                
            }
        })
    }

    public getRoomId(){
        return this.roomId;
    }

    private async roomIsActive(roomId: string) {
        const ret = await get(ref(this.database, 'room/' + roomId))
        return ret.exists()
    }

    private initializeRoom(roomId: string) {
        this.setGame = new SetGame();
        set(ref(this.database, 'room/' + roomId + "/gameState"), {id: this.generateRandomId(), cardsOnTable: this.setGame?.getCardsOnTable(), numberOfCardsInDeck: this.setGame?.getNumberOfCardsInDeck()});
    }

    private generateRandomId(): string {
        return (Math.random() + 1).toString(36).substring(2);
    }
}