const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };
    const resetBoard = () => board.fill("");

    return { getBoard, setMark, resetBoard };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const GameController = (() => {
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const startGameButton = document.getElementById('start-game');
    const statusDisplay = document.getElementById('status');
    const playersInfoDiv = document.getElementById('players-info');
    const gameBoardDiv = document.getElementById('game-board');

    let player1, player2, currentPlayer;
    let gameOver = false;

    const initializeGame = () => {
        const board = Gameboard.getBoard();
        gameBoardDiv.innerHTML = board.map((cell, index) => `<div data-index="${index}">${cell}</div>`).join("");
        gameBoardDiv.addEventListener('click', handleClick);
        statusDisplay.textContent = '';
        gameOver = false;
        currentPlayer = player1;

        // Update player info display
        playersInfoDiv.innerHTML = `
            <p>${player1.name} (${player1.mark}) vs ${player2.name} (${player2.mark})</p>
        `;
    };

    const handleClick = (e) => {
        if (gameOver) return;
        const index = e.target.getAttribute('data-index');
        if (Gameboard.setMark(index, currentPlayer.mark)) {
            updateDisplay();
            if (checkWin()) {
                statusDisplay.textContent = `${currentPlayer.name} wins!`;
                gameOver = true;
                return;
            }
            if (Gameboard.getBoard().every(cell => cell !== "")) {
                statusDisplay.textContent = "It's a tie!";
                gameOver = true;
                return;
            }
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
    };

    const updateDisplay = () => {
        const cells = document.querySelectorAll('#game-board div');
        cells.forEach(cell => {
            const index = cell.getAttribute('data-index');
            cell.textContent = Gameboard.getBoard()[index];
        });
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    const startGame = () => {
        const player1Name = player1NameInput.value.trim();
        const player2Name = player2NameInput.value.trim();
        if (!player1Name || !player2Name) {
            alert('Please enter names for both players.');
            return;
        }
        player1 = Player(player1Name, "X");
        player2 = Player(player2Name, "O");
        Gameboard.resetBoard();
        initializeGame();
    };

    startGameButton.addEventListener('click', startGame);

    return { startGame };
})();
