const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')
const epochLabel = document.getElementById('epoch')
const gameOverLabel = document.getElementById('game-over')
const slider = document.getElementById('slider')
//grid is a square
let grid;
let cellAmount = 10 //amount of cells in row and column
//specifying different values will lead to incorrect data display
const cols = cellAmount;
const rows = cellAmount;
let resolution;
let epoch = -1;
let intervalDelay = 600
let gameIsRunning; //variable used as interval for easy setting and clearing
// let isDrawing = false;

const createArray = (cols, rows) => {
    let array = new Array(cols);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(rows)
    }
    return array
}

const createGrid = () => {
    grid = createArray(cols, rows)
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            fillGrid(grid);
        }
    }
    console.table(grid)
}

const resizeCanvas = () => {
    const container = document.getElementById('container')

    const w = container.offsetWidth
    const h = container.offsetHeight
    let fieldDimension;
    if (w > h) {
        fieldDimension = h * 0.92
    } else {
        fieldDimension = w * 0.92
    }
    canvas.height = fieldDimension
    canvas.width = fieldDimension
    resolution = fieldDimension
    drawGrid(grid, ctx)
}

const fillGrid = (grid) => {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0 //fills arrays with 0
        }
    }
    grid[1][0] = 1
    grid[2][1] = 1
    grid[0][2] = 1
    grid[1][2] = 1
    grid[2][2] = 1
    // console.table(grid)
}

const clearGrid = () => {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0 //fills arrays with 0
        }
    }
    // console.table(grid)
}

const randomizeGrid = () => {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = Math.floor(Math.random() > 0.69 ? 1 : 0)
        }
    }
    console.table(grid)
}

const drawGrid = (grid, ctx) => {
    const cellSize = resolution / cellAmount

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let color
            let strokeColor
            if (grid[i][j] === 1) {
                color = '#ffa700'
                strokeColor = '#222222'
            } else {
                color = '#222222'
                strokeColor = '#303030'
            }
            ctx.fillStyle = color
            ctx.strokeStyle = strokeColor
            ctx.lineWidth = 2
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize)
        }
    }
}

const calculateNextGrid = (grid) => {
    let nextGrid = createArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j]          //current cell state
            let neighbours = countNeighbours(grid, i, j) //8 neighbours of cell in current grid

            if (state === 0 && neighbours === 3) {
                nextGrid[i][j] = 1
            } else if (state === 1 && (neighbours < 2 || neighbours > 3)) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = state
            }
            // console.log(`Col: ${i}`, `Row: ${j}`, `State: ${state}`, `Next state:${nextGrid[i][j]}`)
        }
    }
    return nextGrid
}

const countNeighbours = (array, x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols
            let row = (y + j + rows) % rows;
            sum += array[col][row]
        }
    }
    sum -= array[x][y]
    return sum
}

// const countLiveCells = (grid) => {
//     let sum = 0;
//     for (let i = 0; i < cols; i++) {
//         for (let j = 0; j < rows; j++) {
//             sum += grid[i][j]
//         }
//     }
//     return sum
// }


const epochChange = () => {
    drawGrid(grid, ctx)
    let nextGrid = calculateNextGrid(grid)

    if (grid.toString() !== nextGrid.toString()) {
        grid = nextGrid
        epoch++
    } else {
        stopGame()
        gameOverLabel.style.display = 'flex'
    }
    epochLabel.innerHTML = epoch.toString()
    // requestAnimationFrame(epochChange)
}

const initialize = () => {
    createGrid()
    epochChange()
    resizeCanvas()
}

const stopGame = () => {
    clearInterval(gameIsRunning)
    gameIsRunning = null
}

const resetGame = () => {
    clearGrid()
    drawGrid(grid, ctx)
    epoch = 0;
    epochLabel.innerHTML = epoch.toString()
    gameOverLabel.style.display = 'none'
}

const canvasClickHandler = (e) => {
    gameOverLabel.style.display = 'none'
    let rect = canvas.getBoundingClientRect()
    let x = Math.floor((e.clientX - rect.left) * cellAmount / resolution);
    let y = Math.floor((e.clientY - rect.top) * cellAmount / resolution);

    console.log(rect, x, y)
    if (grid[y][x] === 1) {
        grid[y][x] = 0
        console.log(`x: ${x} y: ${y}\ngrid[${x}][${y}]: ${grid[x][y]} -> 0`)
    } else if (grid[y][x] === 0) {
        grid[y][x] = 1
        console.log(`x: ${x} y: ${y}\ngrid[${x}][${y}]: ${grid[x][y]} -> 1`)
    }

    drawGrid(grid, ctx)
}
/*

const startPosition = () => {
        isDrawing = true
}
const endPosition = () => {
    isDrawing = false
}

const canvasDrawHandler = (e) => {
    if (isDrawing) {
        gameOverLabel.style.display = 'none'
        let rect = canvas.getBoundingClientRect()
        let x = Math.floor((e.clientX - rect.left) * cellAmount / resolution);
        let y = Math.floor((e.clientY - rect.top) * cellAmount / resolution);

        if (grid[y][x] === 1) {
            grid[y][x] = 0
        } else if (grid[y][x] === 0) {
            grid[y][x] = 1
        }
        drawGrid(grid, ctx)
    }
}
*/

const startBtnHandler = () => {
    gameOverLabel.style.display = 'none'
    gameIsRunning = setInterval(epochChange, intervalDelay)
}

const stopBtnHandler = () => {
    stopGame()
}

const clearBtnHandler = () => {
    stopGame()
    resetGame()
}

const randomBtnHandler = () => {
    stopGame()
    resetGame()
    randomizeGrid()
    drawGrid(grid, ctx)
}

const defaultBtnHandler = () => {
    stopGame()
    resetGame()
    fillGrid(grid)
    drawGrid(grid, ctx)
}


window.addEventListener('load', initialize)
window.addEventListener('resize', resizeCanvas)

canvas.addEventListener('click', canvasClickHandler)
// canvas.addEventListener('mousedown', startPosition)
// canvas.addEventListener('mouseup', endPosition)
// canvas.addEventListener('mousemove', canvasDrawHandler)

const startBtn = document.getElementById('start')
startBtn.addEventListener('click', startBtnHandler)

const stopBtn = document.getElementById('stop')
stopBtn.addEventListener('click', stopBtnHandler)

const clearBtn = document.getElementById('clear')
clearBtn.addEventListener('click', clearBtnHandler)

const randomBtn = document.getElementById('random')
randomBtn.addEventListener('click', randomBtnHandler)

const defaultBtn = document.getElementById('default')
defaultBtn.addEventListener('click', defaultBtnHandler)


const speedometer = document.getElementById('speedometer')
slider.addEventListener('input', () => {
    intervalDelay = Math.floor(slider.value)
    speedometer.innerHTML = intervalDelay.toString()
})

// const life = new Life()
// window.addEventListener('load', life.createGrid)
// window.addEventListener('resize', life.resizeCanvas)