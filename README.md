# SET Game Online

You can try it here: https://set-game-6cb33.web.app/

## Game rules

Go to https://set-game-6cb33.web.app/ and click `Start new game`, or enter an existing game ID if someone has already created a game.

<img width="577" alt="Screenshot 2024-04-27 at 22 30 50" src="https://github.com/di0g0a1v3s/set-game-react-ts/assets/60743836/8fc50765-e524-47f5-b8d6-4c80aa658f3f">

The goal of the game is to find the most SETs. A SET is defined as 3 cards in which:
- They all have the same number or have three different numbers.
- They all have the same shape or have three different shapes.
- They all have the same shading or have three different shadings.
- They all have the same color or have three different colors.

(https://en.wikipedia.org/wiki/Set_(card_game))

<img width="800" alt="Screenshot pc" src="https://github.com/di0g0a1v3s/set-game-react-ts/assets/60743836/5060944a-a85c-4a6a-b3c4-49b94f3a97e3">


The game is also optimized for mobile screens:

<img width="200" alt="Screenshot phone" src="https://github.com/di0g0a1v3s/set-game-react-ts/assets/60743836/1a7d12f5-51f2-445d-878a-4c7cd34b0f75">

## Technical details

### Deployment

This project is hosted on Firebase. Everytime there is a change on the master branch, Github Actions will automatically trigger a re-deploy.

### Architecture

This project has no backend code. It simply has a database (Firebase Realtime Database), from which the clients read the state of the game.

The client who creates the room, a.k.a. the host, is responsible for updating the state of the game in the database, i.e., processing plays, making sure they are valid, updating the score board, and updating the cards on the table.

The rest of the clients only write to the database when they make a play.

The frontend was implemented using Typescript and React.

### Developing

To develop locally, simply clone the repo and run `npm start`
