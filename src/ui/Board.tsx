import React from 'react';
import { Card as CardComponent } from './Card';
import { Card, CardHelper, PlayResult } from '../game-mechanics/Set';
import { GameRoom } from '../game-room/GameRoom';

interface BoardState {
  cardsOnTable: Card[];
  selectedCards: Card[];
  validSet: Card[];
  invalidSet: Card[];
  numberOfCardsInDeck: number;
  gameOver: boolean;
}

export enum CardState {
  selected,
  unselected,
  correct,
  incorrect
}
export interface BoardProps {
  gameRoom: GameRoom;
}
export class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps){
      super(props);
      this.state = {
        cardsOnTable: [],
        selectedCards: [],
        validSet: [],
        invalidSet: [],
        numberOfCardsInDeck: this.props.gameRoom.getNumberOfCardsInDeck(),
        gameOver: false
      }
      
    }

    componentDidMount(): void {
      this.props.gameRoom.getCurrentCardsOnTable().then(cardsOnTable => {
        if(cardsOnTable != null){
          this.setState({cardsOnTable})
        }
      })
      this.props.gameRoom.onCardsOnTableChange(cardsOnTable => {
        console.log("qqq cards on table change")
        if(cardsOnTable != null){
          this.setState({cardsOnTable})
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
        // const playResult = 
        this.props.gameRoom.play(selectedCards);
        this.setState({selectedCards: []});
        // if(playResult === PlayResult.validSet){
        //   this.setState({validSet: selectedCards})
        // } else if(playResult === PlayResult.invalidSet){
        //   this.setState({invalidSet: selectedCards})
        // } else if(playResult === PlayResult.gameOver){
        //   this.setState({validSet: selectedCards, gameOver: true})
        // }
        // setTimeout(() => {
        //   // const cardsOnTable = this.props.gameRoom.getCardsOnTable();
        //   const numberOfCardsInDeck = this.props.gameRoom.getNumberOfCardsInDeck();
        //   this.setState({invalidSet: [], validSet: [], cardsOnTable, numberOfCardsInDeck})
        // }, 300)
        
      }
    }

    render(): React.ReactNode {
        return [<div className='board'> 
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
        </div>,
        <div>Number of card in deck: {this.state.numberOfCardsInDeck}</div>,
        this.state.gameOver ? <div>GAME OVER</div> : null
        ]
    }
}
