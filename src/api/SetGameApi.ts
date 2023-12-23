import { SetGame, Card } from "../game-mechanics/Set";
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, get } from "firebase/database";



const firebaseConfig = {
    databaseURL: "https://set-game-6cb33-default-rtdb.europe-west1.firebasedatabase.app/",
};

export class SetGameApi {
    private database: Database;
    private isHost: boolean;
    private setGame: SetGame | null = null;
    constructor(private roomId: string | null) {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
        this.isHost = false;
        if(roomId == null){
            console.log("qqq ")
            this.roomId = (Math.random() + 1).toString(36).substring(7);
            this.isHost = true;
            this.initializeRoom(this.roomId)
        }   
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
        set(ref(this.database, 'room/' + roomId), {
            cardsOnTable: this.setGame.getCardsOnTable()
        });
    }

    public getCardsOnTable() {
        return this.setGame == null ? [] : this.setGame.getCardsOnTable();
    }

    public getNumberOfCardsInDeck() {
        return this.setGame == null ? 0 : this.setGame.getNumberOfCardsInDeck();
    }

    public play(cards: Card[]) {
        return this.setGame?.play(cards);
    }

}

