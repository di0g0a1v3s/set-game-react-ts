import React from "react";
import { Number } from "../game-mechanics/Set";
import { CardState } from './Board';
import { ShapeProps, SingleShape } from "./SingleShape";

interface CardProps extends ShapeProps {
    number: Number;
    onCardSelected: () => void;
    cardState: CardState;
};

export class Card extends React.Component<CardProps>{
    render(): React.ReactNode {
        const numOfShapes = this.props.number === Number.one ? 1 
                            : this.props.number === Number.two ? 2 : 3
        let cardClass = "";
        switch(this.props.cardState){
            case CardState.correct:
                cardClass = "card-correct";
                break;
            case CardState.incorrect:
                cardClass = "card-incorrect";
                break;
            case CardState.selected:
                cardClass = "card-selected";
                break;
        }
        return <div 
            className={`card ${cardClass}`}
            onClick={this.props.onCardSelected}>
            { 
                Array(numOfShapes).fill(
                    <SingleShape color={this.props.color} shading={this.props.shading} shape={this.props.shape}/>
                )
            }
        </div>
    }
}