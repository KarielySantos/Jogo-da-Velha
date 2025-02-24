const startGameBtn = document.getElementById("startGameBtn");
const backBtn = document.getElementById("backBtn");
const gamePage = document.getElementById("gamePage");
const homePage = document.getElementById("homePage");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const titleText = document.getElementById("title");
const restartBtn = document.getElementById("restartBtn");
const modeBtn = document.getElementById("modeBtn");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

canvas.width = 300;
canvas.height = 300;
const cellSize = 100;

let board, currentPlayer, gameActive, blinkInterval, playAgainstAI;


startGameBtn.addEventListener("click", () => {
    homePage.style.display = "none";
    gamePage.style.display = "block";
    initializeGame();
});

backBtn.addEventListener("click", () => {
    gamePage.style.display = "none";
    homePage.style.display = "block";
});

function initializeGame() {
    board = Array(3).fill(null).map(() => Array(3).fill(""));
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
    updateNeonColor("#ff007f");
    clearInterval(blinkInterval);
    drawBoard();
}

function updateNeonColor(color) {
    document.documentElement.style.setProperty("--neonColor", color);
    canvas.style.boxShadow = `0px 0px 20px ${color}`;
    titleText.style.textShadow = `0px 0px 15px ${color}`;
    statusText.style.textShadow = `0px 0px 10px ${color}`;
}

function startBlinkEffect(color1, color2 = null) {
    clearInterval(blinkInterval);
    let isBright = false;
    blinkInterval = setInterval(() => {
        let glow = isBright ? "0px 0px 20px" : "0px 0px 40px";
        let color = color2 ? (isBright ? color1 : color2) : color1;
        canvas.style.boxShadow = `${glow} ${color}`;
        titleText.style.textShadow = `${glow} ${color}`;
        statusText.style.textShadow = `${glow} ${color}`;
        isBright = !isBright;
    }, 500);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;

    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 100, 0);
        ctx.lineTo(i * 100, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 100);
        ctx.lineTo(canvas.width, i * 100);
        ctx.stroke();
    }
    drawMoves();
}

function drawMoves() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const symbol = board[row][col];
            if (symbol !== "") {
                ctx.font = "bold 60px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowBlur = 10;
                ctx.shadowColor = symbol === "X" ? "#ff007f" : "#00d4ff";
                ctx.fillStyle = symbol === "X" ? "#ff007f" : "#00d4ff";
                ctx.fillText(symbol, col * 100 + 50, row * 100 + 50);
            }
        }
    }
}

function checkGameStatus() {
    const winConditions = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            gameActive = false;
            statusText.textContent = `Jogador ${board[a[0]][a[1]]} venceu!`;
            winSound.play();
            startBlinkEffect(board[a[0]][a[1]] === "X" ? "#ff007f" : "#00d4ff");
            return;
        }
    }
    if (board.flat().every(cell => cell !== "")) {
        gameActive = false;
        statusText.textContent = "Empate!";
        startBlinkEffect("#ff007f", "#00d4ff");
        return;
    }
}

canvas.addEventListener("click", (event) => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / cellSize);
    const row = Math.floor((event.clientY - rect.top) / cellSize);

    if (board[row][col] === "") {
        board[row][col] = currentPlayer;
        clickSound.play();
        drawBoard();
        checkGameStatus();
        if (gameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateNeonColor(currentPlayer === "X" ? "#ff007f" : "#00d4ff");
            statusText.textContent = `Vez do jogador ${currentPlayer}`;
            if (playAgainstAI && currentPlayer === "O") {
                setTimeout(aiMove, 500);
            }
        }
    }
});

function aiMove() {
    if (!gameActive) return;
    let emptyCells = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === "") emptyCells.push([row, col]);
        }
    }
    if (emptyCells.length > 0) {
        let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[row][col] = "O";
        clickSound.play();
        drawBoard();
        checkGameStatus();
        if (gameActive) {
            currentPlayer = "X";
            updateNeonColor("#ff007f");
            statusText.textContent = `Vez do jogador ${currentPlayer}`;
        }
    }
}

restartBtn.addEventListener("click", initializeGame);
modeBtn.addEventListener("click", () => {
    playAgainstAI = !playAgainstAI;
    modeBtn.textContent = playAgainstAI ? "Modo: Contra IA" : "Modo: PvP";
    initializeGame();
});

initializeGame();

document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const images = document.querySelectorAll(".carousel img");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let index = 0;
    const totalImages = images.length;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", function () {
        index = (index + 1) % totalImages;
        updateCarousel();
    });

    prevBtn.addEventListener("click", function () {
        index = (index - 1 + totalImages) % totalImages;
        updateCarousel();
    });

    // Muda automaticamente a cada 3 segundos
    setInterval(() => {
        index = (index + 1) % totalImages;
        updateCarousel();
    }, 3000);
});
