import React from 'react';
import { Card as CardComponent } from './Card';
import { Card, PlayResult, SetGame } from '../game-mechanics/Set';

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

export class Board extends React.Component<{}, BoardState> {
    private setGame: SetGame;
    constructor(props: {}){
      super(props);
      this.setGame = new SetGame();
      this.state = {
        cardsOnTable: this.setGame.getCardsOnTable(),
        selectedCards: [],
        validSet: [],
        invalidSet: [],
        numberOfCardsInDeck: this.setGame.getNumberOfCardsInDeck(),
        gameOver: false
      }
    }

    onCardSelected(card: Card) {
      let selectedCards: Card[];
      if(card.isInArray(this.state.selectedCards)){
        selectedCards = this.state.selectedCards.filter(c => !card.isSameAs(c));
      } else {
        selectedCards = [card, ...this.state.selectedCards];
      }
      this.setState({selectedCards})
      if(selectedCards.length >= 3){
        const playResult = this.setGame.play(selectedCards);
        this.setState({selectedCards: []});
        if(playResult === PlayResult.validSet){
          this.setState({validSet: selectedCards})
        } else if(playResult === PlayResult.invalidSet){
          this.setState({invalidSet: selectedCards})
        } else if(playResult === PlayResult.gameOver){
          this.setState({validSet: selectedCards, gameOver: true})
        }
        setTimeout(() => {
          const cardsOnTable = this.setGame.getCardsOnTable();
          const numberOfCardsInDeck = this.setGame.getNumberOfCardsInDeck();
          this.setState({invalidSet: [], validSet: [], cardsOnTable, numberOfCardsInDeck})
        }, 300)
        
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
                        card.isInArray(this.state.selectedCards) ? CardState.selected :
                        card.isInArray(this.state.validSet) ? CardState.correct :
                        card.isInArray(this.state.invalidSet) ? CardState.incorrect :
                        CardState.unselected
                      }/>}
          )}
        </div>,
        <div>Number of card in deck: {this.state.numberOfCardsInDeck}</div>,
        this.state.gameOver ? <div>GAME OVER</div> : null
        ]
    }
}
