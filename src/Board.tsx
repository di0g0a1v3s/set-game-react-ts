import React from 'react';
import './App.css';
import { Card as CardComponent } from './Card';
import { Card, PlayResult, SetGame } from './Set';

interface BoardState {
  cardsOnTable: Card[];
  selectedCards: Card[];
  lastPlayResult: PlayResult | null;
  validSet: Card[];
  invalidSet: Card[];
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
        lastPlayResult: null,
      }
    }

    onCardSelected(card: Card) {
      const selectedCards: Card[] = [card, ...this.state.selectedCards];
      this.setState({selectedCards})
      if(selectedCards.length >= 3){
        const playResult = this.setGame.play(selectedCards);
        this.setState({selectedCards: []});
        if(playResult === PlayResult.validSet){
          this.setState({validSet: selectedCards})
        } else if(playResult === PlayResult.invalidSet){
          this.setState({invalidSet: selectedCards})
        }
        setTimeout(() => {
          const cardsOnTable = this.setGame.getCardsOnTable();
          this.setState({invalidSet: [], validSet: [], lastPlayResult: playResult, cardsOnTable})
        }, 500)
        
      }
    }

    render(): React.ReactNode {
        return <div className='board'> 
          {this.state.cardsOnTable.map(card => {
            return <CardComponent 
                      color={card.color} 
                      number={card.number} 
                      shading={card.shading} 
                      shape={card.shape}
                      onCardSelected={() => this.onCardSelected(card)}
                      cardState={
                        this.setGame.cardInArray(card, this.state.selectedCards) ? CardState.selected :
                        this.setGame.cardInArray(card, this.state.validSet) ? CardState.correct :
                        this.setGame.cardInArray(card, this.state.invalidSet) ? CardState.incorrect :
                        CardState.unselected
                      }/>}
          )}
        </div>
    }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
