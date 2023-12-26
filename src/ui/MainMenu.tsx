import React from 'react';
import { GameRoomClient } from '../game-room/GameRoomClient';
import { GameRoomHost } from '../game-room/GameRoomHost';
import { Board } from './Board';
import Button from 'react-bootstrap/Button';


interface MainMenuState {
    showMainMenu: boolean
    gameRoom: GameRoomClient | null;
    inputValue: string;
}

export class MainMenu extends React.Component<{}, MainMenuState> {

    constructor(props: {}){
      super(props);
      this.state = {
        showMainMenu: true,
        gameRoom: null,
        inputValue: "",
      }
    }


    startNewRoom() {
        const gameRoomHost = new GameRoomHost();
        const gameRoomClient = new GameRoomClient(gameRoomHost.getRoomID());
        this.setState({showMainMenu: false, gameRoom: gameRoomClient})
    }

    enterExistingRoom(roomId: string): void {
        const gameRoomClient = new GameRoomClient(roomId);
        this.setState({showMainMenu: false, gameRoom: gameRoomClient})
    }

    render(): React.ReactNode {
        return <div className='d-flex bg-success bg-opacity-50 bg-gradient flex-column justify-content-center align-items-center min-vh-100' >
            { (this.state.showMainMenu || this.state.gameRoom == null) ? 
            <div className='bg-body p-4 border border-dark rounded m-4'>
                <div className='d-flex justify-content-center align-items-center'>
                    <Button variant='outline-success' onClick={() => this.startNewRoom()}>
                        START NEW ROOM
                    </Button>
                </div>
                <div className='d-flex justify-content-center align-items-center m-4'>
                    OR
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <label>Enter existing Room ID:</label>
                    <input className="m-2" value={this.state.inputValue} onChange={(evt) => this.setState({inputValue: evt.target.value})}></input>
                    <Button variant='outline-danger' onClick={() => this.enterExistingRoom(this.state.inputValue)}>GO!</Button>
                </div>
            </div>
            : <div className='d-flex justify-content-center align-items-center p-4'>
                <Board gameRoom={this.state.gameRoom}/>
            </div>
            }
        </div>
            
    }
}
