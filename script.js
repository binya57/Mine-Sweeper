const COLUMNS = 18;
const ROWS = 18;
const CELL_SIZE = 25;
const BOMB_COUNT = (COLUMNS * ROWS) / 10;
const BOMB_CLASS = "bomb";
const REVEALED_CLASS = "revealed";
const FLAGGED_CLASS = "flagged";

const board = document.getElementById("board");
board.style.display = "grid";
board.style.gridTemplateColumns = `repeat(${COLUMNS},${CELL_SIZE}px)`;
board.style.gridTemplateRows = `repeat(${ROWS},${CELL_SIZE}px)`;

function game() {
  createCells();
  generateBombs();
  generateNumbers();
}

const cellElementsMap = new Map();

function createCells() {
  for (let column = 0; column < COLUMNS; column++) {
    for (let row = 0; row < ROWS; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const cellKey = toKey(column, row);
      cell.addEventListener("click", (e) => handleCellClick(e, cellKey));
      cell.addEventListener("contextmenu", (e) => handleFlagCell(e, cellKey));
      cellElementsMap.set(cellKey, cell);
      board.appendChild(cell);
    }
  }
}

function generateBombs() {
  for (let i = 0; i < BOMB_COUNT; i++) {
    const column = Math.round(Math.random() * (COLUMNS - 1));
    const row = Math.round(Math.random() * (ROWS - 1));
    const cell = cellElementsMap.get(toKey(column, row));
    cell.isBomb = true;
  }
}

function generateNumbers() {
  cellElementsMap.forEach((value, key) => {
    const cell = cellElementsMap.get(key);
    if (cell.isBomb) return;
    cell.adjacentBombsCount = findAdjacentBombs(key);
  });
}

function findAdjacentBombs(key) {
  const [column, row] = fromKey(key);

  const adjacentCellsKeys = [
    [column, row - 1],
    [column, row + 1],
    [column - 1, row],
    [column + 1, row],
    [column + 1, row - 1],
    [column - 1, row - 1],
    [column + 1, row + 1],
    [column - 1, row + 1],
  ].map(([column, row]) => toKey(column, row));

  return adjacentCellsKeys.reduce((acc, key) => {
    const adjacentCell = cellElementsMap.get(key);
    return adjacentCell?.isBomb ? acc + 1 : acc;
  }, 0);
}

function handleCellClick(event, key) {
  const cell = cellElementsMap.get(key);
  if (cell.revealed) return;
  if (cell.isFlagged) return;
  if (cell.isBomb) return handleBombClick(cell);
  cell.revealed = true;
  cell.classList.add(REVEALED_CLASS);
  cell.innerText = cell.adjacentBombsCount || "";
}

function handleBombClick(cell) {
  cell.classList.add(BOMB_CLASS);
  gameOver();
}

function handleFlagCell(event, key) {
  event.preventDefault();
  const cell = cellElementsMap.get(key);
  cell.isFlagged = !cell.isFlagged;
  cell.classList.toggle(FLAGGED_CLASS);
}

function gameOver() {
  showDialog();
}

//utils
function toKey(column, row) {
  return `${column}-${row}`;
}

function fromKey(key) {
  return key.split("-").map(Number);
}

function showDialog() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const dialog = document.createElement("div");
  dialog.className = "dialog";
  dialog.innerHTML = `
        <h2>Game Over!<h2/>
        <button>Restart</button>
    `;
  overlay.appendChild(dialog);
  board.appendChild(overlay);
}

game();
