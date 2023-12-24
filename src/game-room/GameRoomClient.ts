import { SetGame, Card } from '../game-mechanics/Set';
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, set, get, onValue } from "firebase/database";
import { firebaseConfig, GamePlayResult, GameState } from './GameRoomCommon';

export class GameRoomClient {
    private database: Database;
    constructor(private roomId: string) {
        const app = initializeApp(firebaseConfig);
        this.database = getDatabase(app)
    }

    public getRoomId(){
        return this.roomId;
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
        set(ref(this.database, 'room/' + this.roomId + "/play"), cards);
    }
}

