import React from 'react';
import { Card as CardComponent } from './Card';
import { Card, CardHelper, PlayResult } from '../game-mechanics/Set';
import { GameRoomClient } from '../game-room/GameRoomClient';

interface BoardState {
  cardsOnTable: Card[];
  selectedCards: Card[];
  validSet: Card[];
  invalidSet: Card[];
  numberOfCardsInDeck: number;
  gameOver: boolean;
  scoreBoard: {[playerID: string]: number};
}

export enum CardState {
  selected,
  unselected,
  correct,
  incorrect
}
export interface BoardProps {
  gameRoom: GameRoomClient;
}
export class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps){
      super(props);
      this.state = {
        cardsOnTable: [],
        selectedCards: [],
        validSet: [],
        invalidSet: [],
        numberOfCardsInDeck: 0,
        gameOver: false,
        scoreBoard: {},
      }
    }

    componentDidMount(): void {
      this.props.gameRoom.getCurrentGameState().then(state => {
        if(state != null){
          this.setState({cardsOnTable: state.cardsOnTable ?? [], numberOfCardsInDeck: state.numberOfCardsInDeck, scoreBoard: state.scoreBoard})
        }
      })
      this.props.gameRoom.onGameStateChange(state => {
        if(state != null){
          this.setState({invalidSet: [], validSet: [], cardsOnTable: state.cardsOnTable ?? [], numberOfCardsInDeck: state.numberOfCardsInDeck, scoreBoard: state.scoreBoard})
        }
      })
      this.props.gameRoom.onPlayResult(gamePlayResult => {
        if(gamePlayResult != null){
          if(gamePlayResult.playResult === PlayResult.validSet){
            this.setState({validSet: gamePlayResult.cards})
          } else if(gamePlayResult.playResult === PlayResult.invalidSet){
            this.setState({invalidSet: gamePlayResult.cards})
          } else if(gamePlayResult.playResult === PlayResult.gameOver){
            this.setState({validSet: gamePlayResult.cards, gameOver: true})
          }
        }
      })
    }

    onCardSelected(card: Card) {
      let selectedCards: Card[];
      if(CardHelper.cardIsInArray(card, this.state.selectedCards)){
        selectedCards = this.state.selectedCards.filter(c => !CardHelper.cardsAreTheSame(card,c));
      } else {
        selectedCards = [card, ...this.state.selectedCards];
      }
      this.setState({selectedCards})
      if(selectedCards.length >= 3){
        this.props.gameRoom.play(selectedCards);
        this.setState({selectedCards: []});
      }
    }

    render(): React.ReactNode {
        return <div className='d-flex flex-column justify-content-center align-items-center bg-body p-4 border border-dark rounded w-100 h-100'>
          <div className="d-flex flex-column flex-lg-row justify-content-center">
            <div className={`set-board ${this.state.cardsOnTable.length > 12 ? 'set-board-15' : 'set-board-12'}`}> 
              {this.state.cardsOnTable.map(card => {
                return <CardComponent 
                          color={card.color} 
                          number={card.number} 
                          shading={card.shading} 
                          shape={card.shape}
                          onCardSelected={() => this.onCardSelected(card)}
                          cardState={
                            CardHelper.cardIsInArray(card,this.state.selectedCards) ? CardState.selected :
                            CardHelper.cardIsInArray(card,this.state.validSet) ? CardState.correct :
                            CardHelper.cardIsInArray(card,this.state.invalidSet) ? CardState.incorrect :
                            CardState.unselected
                          }/>}
              )}
            </div>
          <div className="d-flex flex-column align-items-center my-4 justify-content-around">
            <h2><span className="badge bg-success">Room ID: {this.props.gameRoom.getRoomID()}</span></h2>
              <div>
                <table className="table table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Player</th>
                      <th scope="col">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Object.keys(this.state.scoreBoard).map(playerId => {
                        return <tr>
                          <th scope="row">{this.props.gameRoom.playerID === playerId ? `(You) ${playerId}` : playerId}</th>
                          <td>{this.state.scoreBoard[playerId]}</td>
                        </tr>
                      })
                    }
                  </tbody>
                </table>
              </div>
              <h2><span className="badge bg-primary">Number of cards in deck: {this.state.numberOfCardsInDeck}</span></h2>
              {this.state.gameOver ? <h2><span className="badge bg-danger">GAME OVER</span></h2> : null}
            </div>
          </div>
        </div>
    }
}
