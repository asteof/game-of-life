const epochLabel = document.getElementById('epoch');
const gameOverLabel = document.getElementById('game-over');

const CELL_AMOUNT = 10; //amount of cells in row and column
//specifying different values for COLS and ROWS will lead to incorrect data display
const COLS = CELL_AMOUNT;
const ROWS = CELL_AMOUNT;

//grid is a square
let grid;
let resolution; //is used for resizing canvas and finding mouse position
let epoch = 0;
let intervalDelay = 600;
let gameIsRunning = null; //variable used as interval for easy setting and clearing
let isDrawing = false; //variable for continuous drawing, may be unused
//determine previous position of mouse, used for optimization of continuous drawing
let prevX, prevY;

//creates two dimensional array
const createArray = (cols, rows) => {
    let array = new Array(cols);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(rows);
    }
    return array;
}

//creates 2D array containing initial values
const createGrid = () => {
    grid = createArray(COLS, ROWS);
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            grid[i][j] = 0; //fills arrays with 0
        }
    }
    grid[0][1] = 1;
    grid[1][2] = 1;
    grid[2][0] = 1;
    grid[2][1] = 1;
    grid[2][2] = 1;
    console.table(grid);
}

//redraws canvas on window resizing
const resizeCanvas = () => {
    const container = document.getElementById('container');

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    let fieldDimension;
    if (w > h) {
        fieldDimension = h * 0.92;
    } else {
        fieldDimension = w * 0.92;
    }
    canvas.height = fieldDimension;
    canvas.width = fieldDimension;
    resolution = fieldDimension;
    drawGrid(grid, ctx);
}

//used to reset game
const clearGrid = () => {
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            grid[i][j] = 0; //fills arrays with 0
        }
    }
    // console.table(grid)
}

//fills grid with random values
const randomizeGrid = () => {
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            grid[i][j] = Math.floor(Math.random() > 0.69 ? 1 : 0);
        }
    }
    console.table(grid);
}

//draws grid on canvas
const drawGrid = (grid, ctx) => {
    const cellSize = resolution / CELL_AMOUNT;

    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            let color;
            let strokeColor;
            if (grid[i][j] === 1) {
                color = '#ffa700';
                strokeColor = '#222222';
            } else {
                color = '#222222';
                strokeColor = '#303030';
            }
            ctx.fillStyle = color;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            // (j * cellSize) is the X position to draw a rectangle
            // (i * cellSize) is the Y position to draw a rectangle
            // j comes first, because j stands for ROWS
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

//main logic for game, calculates next states for all grid
const calculateNextGrid = (grid) => {
    let nextGrid = createArray(COLS, ROWS);

    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            let state = grid[i][j];    //current cell state
            let neighbours = countNeighbours(grid, i, j); //8 neighbours of cell in current grid

            if (state === 0 && neighbours === 3) {
                nextGrid[i][j] = 1;
            } else if (state === 1 && (neighbours < 2 || neighbours > 3)) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = state;
            }
            // console.log(`Col: ${i}`, `Row: ${j}`, `State: ${state}`, `Next state:${nextGrid[i][j]}`)
        }
    }
    return nextGrid;
}

//counts sum of neighbour cells to apply game rules to specific cell
const countNeighbours = (array, x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + COLS) % COLS;
            let row = (y + j + ROWS) % ROWS;
            sum += array[col][row];
        }
    }
    sum -= array[x][y];
    return sum;
}

//is used for calculating new game state and redrawing canvas
const epochChange = () => {
    drawGrid(grid, ctx);
    let nextGrid = calculateNextGrid(grid);

    if (grid.toString() !== nextGrid.toString()) {
        grid = nextGrid;
        epoch++;
    } else {
        stopGame();
        gameOverLabel.style.display = 'flex';
    }
    epochLabel.textContent = epoch.toString();
}

const initialize = () => {
    createGrid();
    // epochChange();
    resizeCanvas();
}

//pauses the game, also used in reset function
const stopGame = () => {
    clearInterval(gameIsRunning);
    gameIsRunning = null;
}

//resets game stats and grid to 0
const resetGame = () => {
    stopGame();
    clearGrid();
    drawGrid(grid, ctx);
    epoch = 0;
    epochLabel.textContent = epoch.toString();
    startBtn.textContent = 'Start';
    gameOverLabel.style.display = 'none';
}

//finds position of mouse relatively to canvas and changes state of cell
//can be used as a click event listener on canvas element
// IS USED in mousedown event, draws single cell
const canvasClickHandler = (e) => {
    console.log(isDrawing)
    gameOverLabel.style.display = 'none';
    let rect = canvas.getBoundingClientRect();

    //(e.clientX - rect.left) is position of click relative to canvas
    let x = Math.floor((e.clientX - rect.left) * (CELL_AMOUNT / resolution));
    let y = Math.floor((e.clientY - rect.top) * (CELL_AMOUNT / resolution));

    console.log(x, y, resolution, rect)
    if (grid[y][x] === 1) {
        grid[y][x] = 0;
        console.log(`x: ${x} y: ${y}\ngrid[${x}][${y}]: ${grid[x][y]} -> 0`);
    } else if (grid[y][x] === 0) {
        grid[y][x] = 1;
        console.log(`x: ${x} y: ${y}\ngrid[${x}][${y}]: ${grid[x][y]} -> 1`);
    }
    prevX = x;
    prevY = y;
    drawGrid(grid, ctx);
}
/**/

//mousedown event, sets drawing variable to true to start drawing
const startDrawing = (e) => {
    canvasClickHandler(e)
    if (!isDrawing)
        isDrawing = true;
}

const finishDrawing = () => {
    if (isDrawing)
        isDrawing = false;
}

const canvasDrawHandler = (e) => {
    if (isDrawing) {
        gameOverLabel.style.display = 'none'
        let rect = canvas.getBoundingClientRect()
        let x = Math.floor((e.clientX - rect.left) * CELL_AMOUNT / resolution);
        let y = Math.floor((e.clientY - rect.top) * CELL_AMOUNT / resolution);

        // let prevPoint = grid[x][y];

        if (prevX !== x || prevY !== y) {

            console.log(x, y)
            if (grid[y][x] === 1) {
                grid[y][x] = 0;
            } else if (grid[y][x] === 0) {
                grid[y][x] = 1;
            }
        }
        prevX = x;
        prevY = y;
        drawGrid(grid, ctx);
    }
}
/**/

const startBtnHandler = () => {
    gameOverLabel.style.display = 'none';
    if (gameIsRunning === null) {
        gameIsRunning = setInterval(epochChange, intervalDelay);
    }
    startBtn.textContent = 'Start';
}

const stopBtnHandler = () => {
    if (gameIsRunning !== null) {
        stopGame();
        startBtn.textContent = 'Resume';
    }
}

const clearBtnHandler = () => {
    resetGame();
}

const randomBtnHandler = () => {
    resetGame();
    randomizeGrid();
    drawGrid(grid, ctx);
}

const defaultBtnHandler = () => {
    resetGame();
    createGrid()
    drawGrid(grid, ctx);
}


window.addEventListener('load', initialize);
window.addEventListener('resize', resizeCanvas);

const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');
// canvas.addEventListener('click', canvasClickHandler);
/**/
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mouseup', finishDrawing)
window.addEventListener('mouseup', finishDrawing)
canvas.addEventListener('mousemove', canvasDrawHandler)
/**/

const startBtn = document.getElementById('start');
startBtn.addEventListener('click', startBtnHandler);

const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', stopBtnHandler);

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', clearBtnHandler);

const randomBtn = document.getElementById('random');
randomBtn.addEventListener('click', randomBtnHandler);

const defaultBtn = document.getElementById('default');
defaultBtn.addEventListener('click', defaultBtnHandler);

const slider = document.getElementById('slider');
const speedometer = document.getElementById('speedometer');
slider.addEventListener('input', () => {
    intervalDelay = Math.floor(slider.value);
    if (gameIsRunning !== null) {
        clearInterval(gameIsRunning);
        gameIsRunning = setInterval(epochChange, intervalDelay);
    }
    speedometer.textContent = intervalDelay.toString() + 'ms';
})