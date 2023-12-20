export enum Color {
    green,
    red,
    violet
}

export enum Shading {
    solid,
    empty,
    striped
}

export enum Shape {
    diamond,
    oval,
    squiggle
}

export enum Number {
    one,
    two,
    three
}

type CardProperty = Color | Shading | Shape | Number;

export enum PlayResult {
    gameOver,
    validSet,
    invalidSet
}

type Card = {
    color: Color;
    shading: Shading;
    shape: Shape;
    number: Number
}

export class SetGame {
    private cardsOnTable: Card[];
    private cardsInDeck: Card[];

    constructor() {
        this.cardsInDeck = [];
        this.cardsOnTable = [];
        for(let color of [Color.green, Color.red, Color.violet]) {
            for(let shading of [Shading.empty, Shading.solid, Shading.striped]){
                for(let shape of [Shape.diamond, Shape.oval, Shape.squiggle]){
                    for(let number of [Number.one, Number.two, Number.three]){
                        const newCard: Card = {color, shading, shape, number};
                        this.cardsInDeck.push(newCard)
                    }
                }
            }
        }
        this.shuffleDeck();
        for(let i = 0; i < 12; i++){
            const poppedCard = this.cardsInDeck.pop()
            if(poppedCard != null){
                this.cardsOnTable.push(poppedCard);
            }
        }
        this.ensureSetOnTable();
    }

    public getCardsOnTable() {
        return [...this.cardsOnTable]
    }

    public play(cards: Card[]): PlayResult {
        const cardsOnTable = cards.every(c => this.cardInArray(c, this.cardsOnTable));
        const validSet = cardsOnTable && this.validateSet(cards);
        if(!validSet){
            return PlayResult.invalidSet;
        } else {
            this.cardsOnTable = 
                this.cardsOnTable
                    .filter(card => !this.cardInArray(card, cards));
            if(this.cardsOnTable.length < 12 && this.cardsInDeck.length > 0){
                for(let i = 0; i < 3; i++){
                    const poppedCard = this.cardsInDeck.pop()
                    if(poppedCard != null){
                        this.cardsOnTable.push(poppedCard);
                    }
                }
            }
            const gameOver = !this.ensureSetOnTable();
            return gameOver ? PlayResult.gameOver : PlayResult.validSet
        }
    }

    private cardInArray(card: Card, array: Card[]): boolean {
        for(let c of array){
            if(this.cardsAreSame(c, card)){
                return true;
            }
        }
        return false;
    }

    private cardsAreSame(card1: Card, card2: Card): boolean {
        return card1.color === card2.color 
            && card1.number === card2.number 
            && card1.shading === card2.shading 
            && card1.shape === card2.shape;
    }

    private ensureSetOnTable(): boolean {
        let setOnTable: boolean = true;
        let emptyDeck: boolean = false;
        while(true){
            setOnTable = this.checkSetOnTable();
            if(!setOnTable){
                for(let i = 0; i < 3; i++) {
                    const poppedCard = this.cardsInDeck.pop()
                    if(poppedCard != null){
                        this.cardsOnTable.push(poppedCard);
                    } else{
                        emptyDeck = true;
                        break;
                    }
                }
                if(emptyDeck){
                    break;
                }
            } else {
                break;
            }
        }
        return !emptyDeck;     
    }

    private checkSetOnTable(): boolean {
        
        const combinations = (arr: Card[], size: number): Array<Card[]> => {
            const len = arr.length;
          
            if (size > len){
                return [];
            }
            if (size === len){
                return [arr];
            }
            if (size == 1) {
                const combs = [];
                for (let i = 0; i < arr.length; i++) {
                    combs.push([arr[i]]);
                }
                return combs;
            }
          
            return arr.reduce((acc: Array<Card[]>, val: Card, i: number) => {
              const res = combinations(arr.slice(i + 1), size - 1)
                .map((comb) => [val].concat(comb) );
              
              return acc.concat(res);
            }, []);
        }
        
        const possibleSets = combinations(this.cardsOnTable, 3);
        for(let possibleSet of possibleSets){
            if(this.validateSet(possibleSet)){
                return true;
            }
        }
        return false;
    }

    private shuffleDeck(): void {
        this.cardsInDeck = this.cardsInDeck
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    private validateSet(cards: Card[]): boolean {
        if(cards == null || cards.length !== 3){
            return false;
        }
        if(!(this.allPropertiesEqual(cards[0].color, cards[1].color, cards[2].color) ||
                this.allPropertiesDifferent(cards[0].color, cards[1].color, cards[2].color))){
            return false;
        }
        if(!(this.allPropertiesEqual(cards[0].number, cards[1].number, cards[2].number) ||
                this.allPropertiesDifferent(cards[0].number, cards[1].number, cards[2].number))){
            return false;
        }
        if(!(this.allPropertiesEqual(cards[0].shading, cards[1].shading, cards[2].shading) ||
                this.allPropertiesDifferent(cards[0].shading, cards[1].shading, cards[2].shading))){
            return false;
        }
        if(!(this.allPropertiesEqual(cards[0].shape, cards[1].shape, cards[2].shape) ||
                this.allPropertiesDifferent(cards[0].shape, cards[1].shape, cards[2].shape))){
            return false;
        }
        return true
    }

    private allPropertiesEqual(prop1: CardProperty, prop2: CardProperty, prop3: CardProperty): boolean{
        return prop1 === prop2 && prop1 === prop3;
    }

    private allPropertiesDifferent(prop1: CardProperty, prop2: CardProperty, prop3: CardProperty): boolean{
        return prop1 !== prop2 && prop1 !== prop3 && prop2 !== prop3;
    }
}