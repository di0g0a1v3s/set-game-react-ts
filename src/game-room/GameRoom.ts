import { SetGame, Card } from "../game-mechanics/Set";
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, get, onValue } from "firebase/database";



const firebaseConfig = {
    databaseURL: "https://set-game-6cb33-default-rtdb.europe-west1.firebasedatabase.app/",
};

export class GameRoom {
    private database: Database;
    private isHost: boolean;
    private setGame: SetGame | null = null;
    constructor(private roomId: string | null) {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
        this.isHost = false;
        if(roomId == null){
            
            this.roomId = this.generateRandomId();
            console.log("qqq new room", this.roomId)
            this.isHost = true;
            this.initializeRoom(this.roomId)
        }   
        onValue(ref(this.database, 'room/' + this.roomId + "/play"), (snapshot) => {
            if(this.isHost){
                const cards = snapshot.val() as Card[];
                if(cards != null){
                    
                    const playResult = this.setGame?.play(cards)
                    console.log("qqq play", playResult)
                    const id = this.generateRandomId();
                    console.log("qqq id", id)
                    set(ref(this.database, 'room/' + this.roomId + "/cardsOnTable"), {id: id, cardsOnTable: this.setGame?.getCardsOnTable()});
                }
                
            }
        })
    }

    public getRoomId(){
        return this.roomId;
    }

    // private async roomIsActive(roomId: string) {
    //     const ret = await get(ref(this.database, 'room/' + roomId))
    //     return ret.exists()
    // }

    private initializeRoom(roomId: string) {
        this.setGame = new SetGame();
        set(ref(this.database, 'room/' + roomId + "/cardsOnTable"), {id: this.generateRandomId(), cardsOnTable: this.setGame?.getCardsOnTable()});
    }

    public onCardsOnTableChange(callback: (cardsOnTable: Card[]) => void) {
        onValue(ref(this.database, 'room/' + this.roomId + "/cardsOnTable"), (snapshot) => {
            console.log("qqq onCardsOnTableChange")
            const cards = snapshot.val()?.cardsOnTable as Card[];
            if(cards != null){
                callback(cards)
            }
        })
    }

    public async getCurrentCardsOnTable(): Promise<Card[]> {
        const snapshot =  await get(ref(this.database, 'room/' + this.roomId + "/cardsOnTable"))
        const cards = snapshot.val()?.cardsOnTable as Card[];
        if(cards != null) {
            return cards;
        }
        return [];
    }

    public getNumberOfCardsInDeck() {
        return this.setGame == null ? 0 : this.setGame.getNumberOfCardsInDeck();
    }

    public play(cards: Card[]) {
        set(ref(this.database, 'room/' + this.roomId + "/play"), cards);
    }

    private generateRandomId(): string {
        return (Math.random() + 1).toString(36).substring(2);
    }

}

