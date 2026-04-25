const boardElement = document.getElementById("board");
const turnText = document.getElementById("turn");

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let currentPlayer = BLACK;
let board = [];
let history = [];

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function createInitialBoard() {
  let newBoard = [];

  for (let y = 0; y < 8; y++) {
    newBoard[y] = [];
    for (let x = 0; x < 8; x++) {
      newBoard[y][x] = EMPTY;
    }
  }

  newBoard[3][3] = WHITE;
  newBoard[3][4] = BLACK;
  newBoard[4][3] = BLACK;
  newBoard[4][4] = WHITE;

  return newBoard;
}

function copyBoard(targetBoard) {
  return targetBoard.map(row => [...row]);
}

function saveHistory() {
  history.push({
    board: copyBoard(board),
    player: currentPlayer
  });
}

function undoMove() {
  if (history.length === 0) return;

  const last = history.pop();
  board = copyBoard(last.board);
  currentPlayer = last.player;

  renderBoard();
}

function resetGame() {
  board = createInitialBoard();
  currentPlayer = BLACK;
  history = [];
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      cell.onclick = () => placeStone(x, y);

      if (board[y][x] !== EMPTY) {
        const stone = document.createElement("div");
        stone.className = "stone";

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

function getFlippableStones(x, y, player = currentPlayer) {
  if (board[y][x] !== EMPTY) return [];

  let result = [];
  const opponent = player === BLACK ? WHITE : BLACK;

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
      } else if (board[ny][nx] === player) {
        if (temp.length > 0) {
          result.push(...temp);
        }
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

function hasValidMove(player) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (getFlippableStones(x, y, player).length > 0) {
        return true;
      }
    }
  }
  return false;
}

function countStones() {
  let black = 0;
  let white = 0;

  for (let row of board) {
    for (let cell of row) {
      if (cell === BLACK) black++;
      if (cell === WHITE) white++;
    }
  }

  return { black, white };
}

function finishGame() {
  const result = countStones();

  let message = `ゲーム終了\n黒: ${result.black}\n白: ${result.white}\n`;

  if (result.black > result.white) {
    message += "黒の勝ち！";
  } else if (result.white > result.black) {
    message += "白の勝ち！";
  } else {
    message += "引き分け！";
  }

  alert(message);
}

function switchTurn() {
  currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  if (!hasValidMove(currentPlayer)) {
    alert(
      (currentPlayer === BLACK ? "黒" : "白") +
      "は置ける場所がありません\nパスします"
    );

    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

    if (!hasValidMove(currentPlayer)) {
      finishGame();
      return;
    }
  }

  renderBoard();
}

function placeStone(x, y) {
  const flipped = getFlippableStones(x, y);

  if (flipped.length === 0) return;

  saveHistory();

  board[y][x] = currentPlayer;

  flipped.forEach(([fx, fy]) => {
    board[fy][fx] = currentPlayer;
  });

  switchTurn();
}

resetGame();
