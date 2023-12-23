import { SetGame, Card } from "../game-mechanics/Set";
import firebase from 'firebase/compat/app';
import "firebase/compat/database";



const firebaseConfig = {
    databaseURL: "https://set-game-6cb33-default-rtdb.europe-west1.firebasedatabase.app/",
};

export class SetGameApi {
    private database: firebase.database.Database;
    private isHost: boolean;
    private setGame: SetGame | null = null;
    constructor(private roomId: string | null) {
        const app = firebase.initializeApp(firebaseConfig);
        this.database = firebase.database(app)
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
        const ret = await this.database.ref('room/' + roomId).get()
        return ret.exists()
    }

    private initializeRoom(roomId: string) {
        this.setGame = new SetGame();
        this.database.ref('room/' + roomId).set({
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

