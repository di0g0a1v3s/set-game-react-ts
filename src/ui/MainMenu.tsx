import React from 'react';
import { GameRoomClient } from '../game-room/GameRoomClient';
import { GameRoomHost } from '../game-room/GameRoomHost';
import { Board } from './Board';

interface MainMenuState {
    showMainMenu: boolean
    gameRoom: GameRoomClient | null;
}

export class MainMenu extends React.Component<{}, MainMenuState> {

    constructor(props: {}){
      super(props);
      this.state = {
        showMainMenu: true,
        gameRoom: null,
      }
    }


    startNewRoom() {
        const gameRoomHost = new GameRoomHost();
        const gameRoomClient = new GameRoomClient(gameRoomHost.getRoomId());
        this.setState({showMainMenu: false, gameRoom: gameRoomClient})
    }

    render(): React.ReactNode {
        return (this.state.showMainMenu || this.state.gameRoom == null) ? <div>
            <div>
                <button onClick={() => this.startNewRoom()}>
                    START NEW ROOM
                </button>
                <p>
                OR
                </p>
                <label>Enter existing room id:</label>
                <input></input>
                <button>GO!</button>
            </div>
        </div> :
        <Board gameRoom={this.state.gameRoom}/>
    }
}
