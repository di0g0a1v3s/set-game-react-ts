import React from 'react';
import { GameRoom } from '../game-room/GameRoom';
import { Board } from './Board';

interface MainMenuState {
    showMainMenu: boolean
    gameRoom: GameRoom | null;
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
        const gameRoom = new GameRoom(null);
        this.setState({showMainMenu: false, gameRoom})
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
