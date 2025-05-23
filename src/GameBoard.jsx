import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const GameBoard = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE ||
          prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(DIRECTIONS.ArrowRight);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="container text-center mt-4">
      <h2 className="text-primary">{gameOver ? "Game Over!" : "Snake Game"}</h2>
      <p className="lead">Score: {score}</p>

      {/* Game Grid */}
      <div className="d-flex justify-content-center mt-3">
        <div
          className="border border-dark rounded"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
            gap: "1px",
            width: "420px",
            backgroundColor: "#f8f9fa",
          }}
        >
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={i}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: isSnake ? "green" : isFood ? "red" : "white",
                  border: "1px solid gray",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Restart Button */}
      {gameOver && (
        <button onClick={restartGame} className="btn btn-danger mt-3">
          Restart Game
        </button>
      )}

      {/* On-Screen Controller */}
      <div className="mt-4">
        <div className="d-flex justify-content-center mb-2">
          <button
            className="btn btn-secondary"
            onClick={() => setDirection(DIRECTIONS.ArrowUp)}
          >
            ↑
          </button>
        </div>
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setDirection(DIRECTIONS.ArrowLeft)}
          >
            ←
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setDirection(DIRECTIONS.ArrowDown)}
          >
            ↓
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setDirection(DIRECTIONS.ArrowRight)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
