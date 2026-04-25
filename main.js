const boardElement = document.getElementById("board");
const turnText = document.getElementById("turn");

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let currentPlayer = BLACK;

let board = Array.from({ length: 8 }, () =>
  Array(8).fill(EMPTY)
);

// 初期配置
board[3][3] = WHITE;
board[3][4] = BLACK;
board[4][3] = BLACK;
board[4][4] = WHITE;

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function renderBoard() {
  boardElement.innerHTML = "";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      cell.addEventListener("click", () => placeStone(x, y));

      if (board[y][x] !== EMPTY) {
        const stone = document.createElement("div");
        stone.classList.add("stone");

        if (board[y][x] === BLACK) {
          stone.classList.add("black");
        } else {
          stone.classList.add("white");
        }

        cell.appendChild(stone);
      }

      boardElement.appendChild(cell);
    }
  }

  turnText.textContent =
    currentPlayer === BLACK ? "黒のターン" : "白のターン";
}

function placeStone(x, y) {
  if (board[y][x] !== EMPTY) return;

  const flipped = getFlippableStones(x, y);

  if (flipped.length === 0) return;

  board[y][x] = currentPlayer;

  flipped.forEach(([fx, fy]) => {
    board[fy][fx] = currentPlayer;
  });

  currentPlayer =
    currentPlayer === BLACK ? WHITE : BLACK;

  renderBoard();
}

function getFlippableStones(x, y) {
  let result = [];
  const opponent =
    currentPlayer === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let temp = [];
    let nx = x + dx;
    let ny = y + dy;

    while (
      nx >= 0 && nx < 8 &&
      ny >= 0 && ny < 8
    ) {
      if (board[ny][nx] === opponent) {
        temp.push([nx, ny]);
      } else if (board[ny][nx] === currentPlayer) {
        result.push(...temp);
        break;
      } else {
        break;
      }

      nx += dx;
      ny += dy;
    }
  }

  return result;
}

renderBoard();
