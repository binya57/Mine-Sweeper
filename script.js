const COLUMNS = 18;
const ROWS = 18;
const CELL_SIZE = 30;
const BOMB_COUNT = (COLUMNS * ROWS) / 8;
const BOMB_CLASS = "bomb";
const REVEALED_CLASS = "revealed";
const FLAGGED_CLASS = "flagged";
let lockBoard = false;
const cellElementsMap = new Map();

const board = document.getElementById("board");

function game() {
  createCells();
  generateBombs();
  generateNumbers();
}

function createCells() {
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${COLUMNS},${CELL_SIZE}px)`;
  board.style.gridTemplateRows = `repeat(${ROWS},${CELL_SIZE}px)`;

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
    cell.adjacentBombsCount = getAdjacentBombsCount(key);
  });
}

function handleCellClick(event, key) {
  const cell = cellElementsMap.get(key);
  if (lockBoard || cell.revealed || cell.isFlagged) return;
  if (cell.isBomb) return handleBombClick(cell);
  revealCell(cell);
  if (cell.adjacentBombsCount === 0) {
    propagateReaveal(key);
  }
}

function handleBombClick(cell) {
  cell.classList.add(BOMB_CLASS);
  gameOver();
}

function handleFlagCell(event, key) {
  if (lockBoard) return;
  event.preventDefault();
  const cell = cellElementsMap.get(key);
  cell.isFlagged = !cell.isFlagged;
  cell.classList.toggle(FLAGGED_CLASS);
}

function revealCell(cell) {
  cell.revealed = true;
  cell.classList.add(REVEALED_CLASS);
  cell.innerText = cell.adjacentBombsCount || "";
}

function propagateReaveal(key) {
  getAdjacentCellsKeys(key).forEach((cellKey) => {
    const cell = cellElementsMap.get(cellKey);
    if (!cellElementsMap.has(cellKey) || cell.isBomb || cell.revealed) return;
    revealCell(cell);
    if (cell.adjacentBombsCount > 0) return;
    propagateReaveal(cellKey);
  });
}

function getAdjacentCellsKeys(key) {
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

  return adjacentCellsKeys;
}

function getAdjacentBombsCount(key) {
  const adjacentCellsKeys = getAdjacentCellsKeys(key);

  return adjacentCellsKeys.reduce((acc, key) => {
    const adjacentCell = cellElementsMap.get(key);
    return adjacentCell?.isBomb ? acc + 1 : acc;
  }, 0);
}

function gameOver() {
  lockBoard = true;
  revealBombs();
  setTimeout(showDialog, 1 * 1000);
}

function revealBombs() {
  const allBombKeys = Array.from(cellElementsMap)
    .filter(([key, cell]) => cell.isBomb)
    .map(([key, cell]) => key)
    .forEach((key) => {
      const bombCell = cellElementsMap.get(key);
      bombCell.classList.add(BOMB_CLASS);
    });
}

function restart() {
  cellElementsMap.clear();
  while (board.firstChild) board.removeChild(board.lastChild);
  document.getElementById("overlay").style.display = "none";
  document.getElementById("dialog").classList.remove("show");
  lockBoard = false;
  game();
}

function toKey(column, row) {
  return `${column}-${row}`;
}

function fromKey(key) {
  return key.split("-").map(Number);
}

function showDialog() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("dialog").classList.add("show");
  document.querySelector("#dialog button").addEventListener("click", restart);
}

game();
