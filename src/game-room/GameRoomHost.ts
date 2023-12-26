import { SetGame, Card, PlayResult } from '../game-mechanics/Set';
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, onValue, update } from "firebase/database";
import { firebaseConfig, generateRandomId } from './GameRoomCommon';

export class GameRoomHost {
    private database: Database;
    private setGame: SetGame | null = null;
    private roomId: string;
    private scoreBoard: Map<string, number>;
    constructor() {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
        this.roomId = generateRandomId();
        console.log("qqq new room", this.roomId)
        this.scoreBoard = new Map();
        this.initializeRoom(this.roomId)
         
        onValue(ref(this.database, 'room/' + this.roomId + "/play"), (snapshot) => {
            const cards = snapshot.val()?.cards as Card[];
            const playId = snapshot.val()?.id as string;
            const playerID = snapshot.val()?.playerID as string;
            if(cards != null && playId != null && playerID != null){
                const playResult = this.setGame?.play(cards)
                if(playResult === PlayResult.gameOver || playResult === PlayResult.validSet){
                    const playerPoints = (this.scoreBoard.get(playerID) ?? 0) + 1;
                    this.scoreBoard.set(playerID, playerPoints);
                }
                set(ref(this.database, 'room/' + this.roomId + "/playResult"), {id: playId, cards: cards, playResult: playResult});
                setTimeout(() => {
                    set(ref(this.database, 'room/' + this.roomId + "/gameState"), 
                        {
                            id: generateRandomId(), 
                            cardsOnTable: this.setGame?.getCardsOnTable(), 
                            numberOfCardsInDeck: this.setGame?.getNumberOfCardsInDeck(),
                            scoreBoard: Object.fromEntries(this.scoreBoard)
                        });
                }, 300)
            }
        })

        onValue(ref(this.database, 'room/' + this.roomId + "/newPlayer"), (snapshot) => {
            const playerId = snapshot.val()?.playerID as string;
            if(playerId != null){
                this.scoreBoard.set(playerId, 0);
                update(ref(this.database, 'room/' + this.roomId + "/gameState"), {scoreBoard: Object.fromEntries(this.scoreBoard)});
            }
        })
    }

    public getRoomID(){
        return this.roomId;
    }

    private initializeRoom(roomId: string) {
        this.setGame = new SetGame();
        set(ref(this.database, 'room/' + roomId + "/gameState"), {id: generateRandomId(), cardsOnTable: this.setGame?.getCardsOnTable(), numberOfCardsInDeck: this.setGame?.getNumberOfCardsInDeck()});
    }
}