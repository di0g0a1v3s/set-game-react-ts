import { Card } from '../game-mechanics/Set';
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, get, onValue } from "firebase/database";
import { firebaseConfig, GamePlayResult, GameState, generateRandomId } from './GameRoomCommon';

export class GameRoomClient {
    private database: Database;
    public readonly playerID: string;
    constructor(private roomId: string) {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
        this.playerID = "Player-" + generateRandomId().substring(0,4);
        set(ref(this.database, 'room/' + this.roomId + "/newPlayer"), {playerID: this.playerID});
    }

    public getRoomID(){
        return this.roomId;
    }

    public getPlayerID() {
        return this.playerID;
    }

    // private async roomIsActive(roomId: string) {
    //     const ret = await get(ref(this.database, 'room/' + roomId))
    //     return ret.exists()
    // }

    public onGameStateChange(callback: (gameState: GameState) => void) {
        onValue(ref(this.database, 'room/' + this.roomId + "/gameState"), (snapshot) => {
            const result = snapshot.val() as GameState;
            if(result != null){
                callback(result)
            }
        })
    }

    public onPlayResult(callback: (gameState: GamePlayResult) => void) {
        onValue(ref(this.database, 'room/' + this.roomId + "/playResult"), (snapshot) => {
            const result = snapshot.val() as GamePlayResult;
            if(result != null){
                callback(result)
            }
        })
    }

    public async getCurrentGameState(): Promise<GameState | null> {
        const snapshot =  await get(ref(this.database, 'room/' + this.roomId + "/gameState"))
        const state = snapshot.val() as GameState;
        if(state != null) {
            return state;
        }
        return null;
    }

    public play(cards: Card[]) {
        set(ref(this.database, 'room/' + this.roomId + "/play"), {id: generateRandomId(), playerID: this.playerID, cards});
    }
}

