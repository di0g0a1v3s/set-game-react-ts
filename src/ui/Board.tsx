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

    computeWinner(){
     return Object.keys(this.state.scoreBoard).sort((a, b) => {
        return this.state.scoreBoard[b] - this.state.scoreBoard[a]
      })[0];
    }

    render(): React.ReactNode {
      
        return <div className="d-flex flex-column">
          <button type="button" className="btn btn-light mb-3 me-auto" onClick={() => window.location.replace('/')}>
            <i className="bi bi-chevron-left"></i> Back to main menu
          </button>
          <div className='d-flex flex-column justify-content-center align-items-center bg-body p-3 border border-dark rounded w-100 h-100'>

            <div className="d-flex flex-column flex-lg-row justify-content-center">
              <div className={`set-board ${this.state.cardsOnTable.length > 12 ? 'set-board-15' : 'set-board-12'}`}>
                {this.state.cardsOnTable.map(card => {
                  return <CardComponent
                    color={card.color}
                    number={card.number}
                    shading={card.shading}
                    shape={card.shape}
                    onCardSelected={() => this.onCardSelected(card)}
                    cardState={CardHelper.cardIsInArray(card, this.state.selectedCards) ? CardState.selected :
                      CardHelper.cardIsInArray(card, this.state.validSet) ? CardState.correct :
                        CardHelper.cardIsInArray(card, this.state.invalidSet) ? CardState.incorrect :
                          CardState.unselected} />;
                }
                )}
              </div>
              <div className="d-flex flex-column align-items-center my-4 justify-content-around">
                <h2><span className="badge bg-success">Game ID: {this.props.gameRoom.getRoomID()}</span></h2>
                <div>
                  <table className="table table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Player</th>
                        <th scope="col">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(this.state.scoreBoard).map(playerId => {
                        return <tr>
                          <th scope="row">{this.props.gameRoom.playerID === playerId ? `(You) ${playerId}` : playerId}</th>
                          <td>{this.state.scoreBoard[playerId]}</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
                <h2><span className="badge bg-primary">Number of cards in deck: {this.state.numberOfCardsInDeck}</span></h2>
              </div>
            </div>



            {this.state.gameOver && <><div className="modal fade bd-example-modal-lg show" tabIndex={-1} role="dialog" style={{ "display": "block" }}>
              <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content">
                  <div className="modal-header justify-content-center">
                    <h4 className="modal-title text-danger" id="exampleModalLongTitle">GAME OVER</h4>
                  </div>
                  <div className="modal-body d-flex justify-content-center">
                    <h5 className="modal-title" id="exampleModalLongTitle">{this.computeWinner() === this.props.gameRoom.playerID ? 'You won!' : `Winner: ${this.computeWinner()}`}</h5>
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button type="button" className="btn btn-outline-dark" onClick={() => {
                      window.location.replace('/');
                    } }>Back to main menu</button>
                  </div>
                </div>
              </div>
            </div><div className="modal-backdrop fade show"></div></>}


          </div>
        </div>
    }
}
