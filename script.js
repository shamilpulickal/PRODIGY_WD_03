const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const twoPlayerModeButton = document.getElementById('two-player-mode');
const aiModeButton = document.getElementById('ai-mode');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAiMode = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusText.innerHTML = "Select a game mode to start!";

// Event listeners for game mode buttons
twoPlayerModeButton.addEventListener('click', () => startGame(false));
aiModeButton.addEventListener('click', () => startGame(true));

// Event listeners for the game cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Event listener for the reset button
resetButton.addEventListener('click', resetGame);

function startGame(aiMode) {
    isAiMode = aiMode;
    resetGame();
    statusText.innerHTML = currentPlayerTurn();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Handle player's move
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkForWinner();

    if (gameActive && isAiMode) {
        switchPlayer(); // Switch to AI player
        aiMakeMove(); // Let the AI make its move
    } else if (gameActive) {
        switchPlayer(); // Continue to the other human player if it's 2-player mode
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.innerHTML = currentPlayerTurn();
}

function aiMakeMove() {
    // Simple AI: choose the first available spot
    const availableCells = gameState.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameState[randomIndex] = currentPlayer;
        cells[randomIndex].innerHTML = currentPlayer;

        checkForWinner();

        if (gameActive) {
            switchPlayer(); // Switch back to the human player after AI's turn
        }
    }
}

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusText.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = '');
}
