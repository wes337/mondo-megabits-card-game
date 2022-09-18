# To do

A general list of things left to do.

## Deck builder

- ~~Enforce 40 card minimum~~
- Toggle modal to remind player if they have unsaved changes
- General UI improvements
- Add subtypes as filters
- Add "Load" button, and way to have multiple decks saved per player
- Save decks somewhere (local storage, db?)

## Lobby

- Add lobby chat

## Room

- Add deck selector

## Front End

- Preload/cache card images
- Use TypeScript
- Figure out how to get env vars working with Vite. I am manually changing the WS server URI right now, but it should set it based on the Node environment
- More styles from cards
- General UI improvements, layout changes
- ~~Create a single re-usable modal component which can be opened/closed through global state~~
- Create more re-usable components (for example inputs)
- Create hooks for functions that are used in multiple files
- Win screen and lose screen

## Back End (Game related)

- Rename old zones
- Add "Proselytize" option at end of turn (spend 10 funding to increase narrative by 1)
- Add way to set/replace location card
- Combat:
  - Add way for creatures to attack (STR)
  - Add way for creatures to attack (INT)
  - Summoning sickness
  - Prevent attacking figurehead if active zone contains creatures
  - Prevent attacking narrative if there is figurehead or active creatures
- Untap all cards at start of turn
- Allow seating of Figurehead creature in Think Tank
- Better logging for the game, and way to print all game events to a readable human log

## Long term

- Add user sign-up/login (SSO)
- Player emotes, avatars
- Guided tutorials/demo games which teach you how to play
- Only allow players to use cards they own (maybe?)
- More animations, effects
- Leader/score boards
