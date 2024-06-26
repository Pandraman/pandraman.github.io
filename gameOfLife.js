document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let cellSize;
    let rows, cols;
    let grid = [];
    let gen = 0;
    let intervalId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 2.6;
        cellSize = 40; // Initialize cellSize after canvas dimensions are set
        initializeGrid(); // Reinitialize grid on canvas resize
        drawGrid(grid); // Redraw grid after resize
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createGrid() {
        const newGrid = new Array(rows);
        for (let row = 0; row < rows; row++) {
            newGrid[row] = new Array(cols).fill(0);
        }
        return newGrid;
    }

    function drawGrid(grid) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                ctx.beginPath();
                ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
                ctx.fillStyle = grid[row][col] ? '#308030' : '#303030';
                ctx.fill();
            }
        }
    }

    function updateGrid() {
        const newGrid = createGrid(); // Create a new grid for the next generation
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const neighbors = countNeighbors(row, col);
                if (grid[row][col] === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[row][col] = 0; // Cell dies due to underpopulation or overpopulation
                } else if (grid[row][col] === 0 && neighbors === 3) {
                    newGrid[row][col] = 1; // Cell reproduces due to reproduction rule
                } else {
                    newGrid[row][col] = grid[row][col]; // Cell remains unchanged
                }
            }
        }
        gen += 1;
        document.getElementById("genCounter").innerText = `Generation: ${gen}`;

        grid = newGrid; // Update grid with the new generation
    }

    function countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const x = row + i;
                const y = col + j;
                if (x >= 0 && x < rows && y >= 0 && y < cols) {
                    count += grid[x][y];
                }
            }
        }
        return count;
    }



    function initializeGrid() {
        rows = Math.floor(canvas.height / cellSize) + 50;
        cols = Math.floor(canvas.width / cellSize);
        grid = createGrid();
        randomizeGrid(); // Randomize the initial state of the grid
    }

    function randomizeGrid() {
        for (let row = 0; row < rows; row++) {
            grid[row] = new Array(cols);
            for (let col = 0; col < cols; col++) {
                grid[row][col] = Math.random() > 0.8 ? 1 : 0; // Adjust probability as needed
            }
        }
    }

    // Initial setup
    initializeGrid();
    drawGrid(grid);

    // Start the update and draw cycle
    intervalId = setInterval(() => {
        updateGrid();
        drawGrid(grid);
    }, 200);
});
