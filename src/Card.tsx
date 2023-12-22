import React from "react";
import { Color, Shading, Shape, Number } from "./Set";
import { CardState } from './Board';

interface CardProps extends ShapeProps {
    number: Number;
    onCardSelected: () => void;
    cardState: CardState;
};

interface ShapeProps {
    color: Color;
    shading: Shading;
    shape: Shape;
};

class SingleShape extends React.Component<ShapeProps>{
    
    render(): React.ReactNode {
        let color = '';
        switch (this.props.color) {
            case Color.green:
                color = "#009b01"
                break;
            case Color.red:
                color = "#ff009a"
                break;
            case Color.violet:
                color = "#2f2fff"
                break;
            default:
                break;
        }
        const diamondPolygon = (color: string, shading: Shading) => {
            const ret = [<polygon points="2 20 50 2 98 20 50 38" stroke={color} fill={shading === Shading.solid ? color : "transparent"} strokeWidth="4"/>]
            if(shading === Shading.striped){
                ret.push(<line x1="50" x2="50" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="10" x2="10" y1="18" y2="22" stroke={color} strokeWidth="2"/>,
                            <line x1="90" x2="90" y1="18" y2="22" stroke={color} strokeWidth="2"/>,
                            <line x1="15" x2="15" y1="16" y2="24" stroke={color} strokeWidth="2"/>,
                            <line x1="85" x2="85" y1="16" y2="24" stroke={color} strokeWidth="2"/>,
                            <line x1="20" x2="20" y1="14" y2="26" stroke={color} strokeWidth="2"/>,
                            <line x1="80" x2="80" y1="14" y2="26" stroke={color} strokeWidth="2"/>,
                            <line x1="25" x2="25" y1="12" y2="28" stroke={color} strokeWidth="2"/>,
                            <line x1="75" x2="75" y1="12" y2="28" stroke={color} strokeWidth="2"/>,
                            <line x1="30" x2="30" y1="10" y2="30" stroke={color} strokeWidth="2"/>,
                            <line x1="70" x2="70" y1="10" y2="30" stroke={color} strokeWidth="2"/>,
                            <line x1="35" x2="35" y1="8" y2="32" stroke={color} strokeWidth="2"/>,
                            <line x1="65" x2="65" y1="8" y2="32" stroke={color} strokeWidth="2"/>,
                            <line x1="40" x2="40" y1="6" y2="34" stroke={color} strokeWidth="2"/>,
                            <line x1="60" x2="60" y1="6" y2="34" stroke={color} strokeWidth="2"/>,
                            <line x1="45" x2="45" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                            <line x1="55" x2="55" y1="4" y2="36" stroke={color} strokeWidth="2"/>)
            }
            return ret;
        }

        const ovalPolygon = (color: string, shading: Shading) => {
            const ret = [<rect x="2" y="2" rx="18" ry="18" width="96" height="36" stroke={color} fill={shading === Shading.solid ? color : "transparent"} strokeWidth="4"/>]
            if(shading === Shading.striped){
                ret.push(<line x1="50" x2="50" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="5" x2="5" y1="8" y2="32" stroke={color} strokeWidth="2"/>,
                            <line x1="95" x2="95" y1="8" y2="32" stroke={color} strokeWidth="2"/>,
                            <line x1="10" x2="10" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                            <line x1="90" x2="90" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                            <line x1="15" x2="15" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                            <line x1="85" x2="85" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                            <line x1="20" x2="20" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="80" x2="80" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="25" x2="25" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="75" x2="75" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="30" x2="30" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="70" x2="70" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="35" x2="35" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="65" x2="65" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="40" x2="40" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="60" x2="60" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="45" x2="45" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                            <line x1="55" x2="55" y1="2" y2="38" stroke={color} strokeWidth="2"/>)
            }
            return ret;
        }

        const squigglePolygon = (color: string, shading: Shading) => {
            const ret = 
            [<path d="M16,38 
                C-5,28 0,0 18,2 
                C45,5 50,20 84,2
                C105,12 100,40 82,38 
                C55,35 50,20 16,38" stroke={color} fill={shading === Shading.solid ? color : "transparent"} strokeWidth="4"/>]
            if(shading === Shading.striped){
                ret.push(
                    <line x1="5" x2="5" y1="10" y2="30" stroke={color} strokeWidth="2"/>,
                    <line x1="10" x2="10" y1="4" y2="34" stroke={color} strokeWidth="2"/>,
                    <line x1="15" x2="15" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                    <line x1="20" x2="20" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                    <line x1="25" x2="25" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                    <line x1="30" x2="30" y1="4" y2="34" stroke={color} strokeWidth="2"/>,
                    <line x1="35" x2="35" y1="6" y2="32" stroke={color} strokeWidth="2"/>,
                    <line x1="40" x2="40" y1="6" y2="30" stroke={color} strokeWidth="2"/>,
                    <line x1="45" x2="45" y1="8" y2="30" stroke={color} strokeWidth="2"/>,
                    <line x1="50" x2="50" y1="8" y2="30" stroke={color} strokeWidth="2"/>,
                    <line x1="55" x2="55" y1="10" y2="30" stroke={color} strokeWidth="2"/>,
                    <line x1="60" x2="60" y1="8" y2="32" stroke={color} strokeWidth="2"/>,
                    <line x1="65" x2="65" y1="8" y2="32" stroke={color} strokeWidth="2"/>,
                    <line x1="70" x2="70" y1="6" y2="36" stroke={color} strokeWidth="2"/>,
                    <line x1="75" x2="75" y1="6" y2="38" stroke={color} strokeWidth="2"/>,
                    <line x1="80" x2="80" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                    <line x1="85" x2="85" y1="2" y2="38" stroke={color} strokeWidth="2"/>,
                    <line x1="90" x2="90" y1="4" y2="36" stroke={color} strokeWidth="2"/>,
                    <line x1="95" x2="95" y1="10" y2="32" stroke={color} strokeWidth="2"/>,)
            }
            return ret;
        }

        return <div className="shape"> 
            <svg width="100" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg">
                {
                    this.props.shape === Shape.diamond ? diamondPolygon(color, this.props.shading) : 
                        this.props.shape === Shape.oval ? ovalPolygon(color, this.props.shading) : squigglePolygon(color, this.props.shading)
                }
            </svg>
        </div>
    }

}


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