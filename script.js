const COLUMNS = 18;
const ROWS = 18;
const CELL_SIZE = 25;
const BOMB_COUNT = (COLUMNS * ROWS) / 10;
const BOMB_CLASS = "bomb";

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
    cell.classList.add(BOMB_CLASS);
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
  let bombCount = 0;

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

  //   adjacentCellsKeys.forEach((key) => {
  //     const adjacentCell = cellElementsMap.get(key);

  //     if (adjacentCell.isBomb) {
  //       bombCount += 1;
  //     }
  //   });
  //   return bombCount;
}

function handleCellClick(event, key) {
  const cell = cellElementsMap.get(key);
  if (cell.revealed) return;
  if (cell.isBomb) return handleBombClick();
  cell.revealed = true;
  cell.classList.add("show");
}

function handleBombClick() {
  alert("TODO!");
}

function handleFlagCell(event, key) {
  alert("TODO!");
}

function gameOver() {
  alert("TODO!");
}

//utils
function toKey(column, row) {
  return `${column}-${row}`;
}

function fromKey(key) {
  return key.split("-").map(Number);
}

game();
