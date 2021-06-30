//
//
//     // grid;
//     // resolution;
//     // cellSize;
//

class Life {

    grid;
    resolution;
    gameIsRunning;

    constructor(canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx
        this.epochLabel = document.getElementById('epoch')
        this.gameOverLabel = document.getElementById('game-over')
        console.log(this.gameOverLabel)
        //grid is a square
        this.cellAmount = 10 //amount of cells in row and column
        //specifying different values will lead to incorrect data display
        this.cols = this.cellAmount;
        this.rows = this.cellAmount;
        this.epoch = -1;
        this.intervalDelay = 600
        //this.grid;
        // this.resolution;
        // this.gameIsRunning;

    }

    createArray(cols, rows) {
        let array = new Array(cols);
        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(rows)
        }
        return array
    }

    createGrid() {
        this.grid = this.createArray(this.cols, this.rows)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.fillGrid(this.grid);
            }
        }
        console.table(this.grid)
    }

    resizeCanvas() {
        const container = document.getElementById('container')

        const w = container.offsetWidth
        const h = container.offsetHeight
        let fieldDimension;
        if (w > h) {
            fieldDimension = h * 0.92
        } else {
            fieldDimension = w * 0.92
        }
        this.canvas.height = fieldDimension
        this.canvas.width = fieldDimension
        this.resolution = fieldDimension
        this.drawGrid(this.grid, this.ctx)
    }

    fillGrid(grid) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                grid[i][j] = 0 //fills arrays with 0
            }
        }
        grid[2][1] = 1
        grid[1][0] = 1
        grid[0][2] = 1
        grid[1][2] = 1
        grid[2][2] = 1
        // console.table(grid)
    }

    clearGrid() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = 0 //fills arrays with 0
            }
        }
        // console.table(grid)
    }

    randomizeGrid() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = Math.floor(Math.random() > 0.69 ? 1 : 0)
            }
        }
        console.table(this.grid)
    }

    drawGrid(grid, ctx) {
        const cellSize = this.resolution / this.cellAmount

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let color;
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

    calculateNextGrid(grid) {
        let nextGrid = this.createArray(this.cols, this.rows);

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let state = grid[i][j]          //current cell state
                let neighbours = this.countNeighbours(grid, i, j) //8 neighbours of cell in current grid

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

    countNeighbours(array, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + this.cols) % this.cols
                let row = (y + j + this.rows) % this.rows;
                sum += array[col][row]
            }
        }
        sum -= array[x][y]
        return sum
    }

    epochChange() {
        this.drawGrid(this.grid, this.ctx)
        let nextGrid = this.calculateNextGrid(this.grid)

        if (this.grid.toString() !== nextGrid.toString()) {
            this.grid = nextGrid
            this.epoch++
        } else {
            stopGame()
            this.gameOverLabel.style.display = 'flex'
        }
        this.epochLabel.innerHTML = this.epoch.toString()
        // requestAnimationFrame(epochChange)
    }

    initialize() {
        this.createGrid()
        this.epochChange()
        this.resizeCanvas()
    }

    stopGame() {
        clearInterval(this.gameIsRunning)
        this.gameIsRunning = null
    }

    resetGame() {
        this.clearGrid()
        this.drawGrid(this.grid, this.ctx)
        this.epoch = 0;
        this.epochLabel.innerHTML = this.epoch.toString()
        this.gameOverLabel.style.display = 'none'
    }

    canvasClickHandler(e) {
        this.gameOverLabel.style.display = 'none'
        let rect = this.canvas.getBoundingClientRect()
        let x = Math.floor((e.clientX - rect.left) * this.cellAmount / this.resolution);
        let y = Math.floor((e.clientY - rect.top) * this.cellAmount / this.resolution);


        if (this.grid[y][x] === 1) {
            this.grid[y][x] = 0
            console.log(`x: ${x} y: ${y}\ngrid[${x}][${y}]: ${this.grid[x][y]} -> 0`)
        } else if (this.grid[y][x] === 0) {
            this.grid[y][x] = 1
            console.log(`x: ${x} y: ${y}\ngrid[${x}][${y}]: ${this.grid[x][y]} -> 1`)
        }

        drawGrid(this.grid, this.ctx)
    }

    startBtnHandler() {
        this.gameOverLabel.style.display = 'none'
        this.gameIsRunning = setInterval(epochChange, this.intervalDelay)
    }

    stopBtnHandler() {
        this.stopGame()
    }

    clearBtnHandler() {
        this.stopGame()
        this.resetGame()
    }

    randomBtnHandler() {
        this.stopGame()
        this.resetGame()
        this.randomizeGrid()
        this.drawGrid(this.grid, this.ctx)
    }

}


const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')
const life = new Life(canvas, ctx)
// window.addEventListener('load', )
canvas.addEventListener('click', life.canvasClickHandler)
// canvas.addEventListener('mousedown', startPosition)
// canvas.addEventListener('mouseup', endPosition)
// canvas.addEventListener('mousemove', canvasDrawHandler)

const startBtn = document.getElementById('start')
startBtn.addEventListener('click', life.startBtnHandler)

const stopBtn = document.getElementById('stop')
stopBtn.addEventListener('click', life.stopBtnHandler)

const clearBtn = document.getElementById('clear')
clearBtn.addEventListener('click', life.clearBtnHandler)

const randomBtn = document.getElementById('random')
randomBtn.addEventListener('click', life.randomBtnHandler)


const slider = document.getElementById('slider')
const speedometer = document.getElementById('speedometer')
slider.addEventListener('input', () => {
    life.intervalDelay = Math.floor(slider.value)
    speedometer.innerHTML = life.intervalDelay.toString()
})
life.initialize()