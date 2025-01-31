import { GameState, Position } from './types';
import { GRID_SIZE } from './constants';

export const moveSnake = (state: GameState): GameState => {
  if (state.gameOver) return state;

  const newHead = {
    x: (state.snake[0].x + state.direction.x + GRID_SIZE) % GRID_SIZE,
    y: (state.snake[0].y + state.direction.y + GRID_SIZE) % GRID_SIZE
  };

  if (checkCollision(newHead, state.snake)) {
    return { ...state, gameOver: true };
  }

  const newSnake = [newHead, ...state.snake];
  
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    return {
      ...state,
      snake: newSnake,
      food: generateFood(newSnake),
      score: state.score + 1
    };
  }

  newSnake.pop();
  return { ...state, snake: newSnake };
};

export const checkCollision = (head: Position, snake: Position[]): boolean => {
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
};

export const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};