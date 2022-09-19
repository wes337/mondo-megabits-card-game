# Mondo Megabits Game Server

## Usage

The server is currently hosted on [Heroku](https://mondo-megabits.herokuapp.com). The WebSocket Server can be reached at [wss://mondo-megabits.herokuapp.com](wss://mondo-megabits.herokuapp.com).

To run locally, first install dependencies, then run the `dev` script:

```
npm i
npm run dev
```

The server should now be running at `localhost:5000`.

## Directory Structure

### Classes

Where the game is actually played. Holds rules and controls interaction between players, cards, and the game board.

### WS

Used to send messages back to the client through the WebSocket.

### Functions

The functions invoked through the incoming WebSocket messages. These functions make use of both the Classes and the WS functions. They will check that the requesting user is connected to the game/room they want to perform actions in, and then perform those actions on their behalf.

### Utils

Helper functions, things that don't belong anywhere else.

### Types

Types and interfaces defining the data used throughout this project. These types refer to the server code, and not the game itself (e.g. Users, rooms, WebSocket messages, and _not_ card subtypes)
