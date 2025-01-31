import { INITIAL_SNAKE, INITIAL_DIRECTION } from './constants';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  score: number;
  gameOver: boolean;
}

export const INITIAL_GAME_STATE: GameState = {
  snake: INITIAL_SNAKE,
  food: { x: 15, y: 15 },
  direction: INITIAL_DIRECTION,
  score: 0,
  gameOver: false
};