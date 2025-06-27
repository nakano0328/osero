class OthelloGame {
  constructor() {
    this.gameBoard = document.getElementById("game-board");
    this.currentPlayerElement = document.getElementById("current-player");
    this.blackCountElement = document.getElementById("black-count");
    this.whiteCountElement = document.getElementById("white-count");
    this.gameMessageElement = document.getElementById("game-message");
    this.validMovesElement = document.getElementById("valid-moves");
    this.newGameBtn = document.getElementById("new-game-btn");

    this.game = new Othello();

    this.initializeGame();
    this.setupEventListeners();
  }

  initializeGame() {
    this.renderBoard();
    this.showMessage("ゲームを開始してください！");
  }

  setupEventListeners() {
    this.newGameBtn.addEventListener("click", () => this.startNewGame());
  }

  startNewGame() {
    this.game = new Othello();
    this.renderBoard();
    this.showMessage("新しいゲームを開始しました！");
  }

  makeMove(row, col) {
    if (this.game.makeMove(row, col)) {
      this.game.switchPlayer();

      // 相手に有効な手がない場合、再度プレイヤーを切り替え
      if (this.game.getValidMoves().length === 0 && !this.game.isGameOver()) {
        this.showMessage(
          `${
            this.game.currentPlayer === "B" ? "白" : "黒"
          }には有効な手がないため、パスします。`
        );
        this.game.switchPlayer();
      } else {
        this.showMessage("");
      }

      this.renderBoard();

      if (this.game.isGameOver()) {
        this.showGameOver();
      }
    } else {
      this.showMessage("その場所には置けません。");
    }
  }

  renderBoard() {
    this.gameBoard.innerHTML = "";
    const validMoves = this.game.getValidMoves();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = row;
        cell.dataset.col = col;

        const piece = this.game.board[row][col];
        if (piece !== " ") {
          const pieceElement = document.createElement("div");
          pieceElement.className = `piece ${piece === "B" ? "black" : "white"}`;
          cell.appendChild(pieceElement);
        }

        const isValidMove = validMoves.some(
          (move) => move[0] === row && move[1] === col
        );

        if (isValidMove) {
          cell.classList.add("valid-move");
          cell.addEventListener("click", () => this.makeMove(row, col));
        }

        this.gameBoard.appendChild(cell);
      }
    }

    this.updateGameInfo();
  }

  updateGameInfo() {
    this.currentPlayerElement.textContent =
      this.game.currentPlayer === "B" ? "黒" : "白";

    const { black_count, white_count } = this.game.getScore();
    this.blackCountElement.textContent = black_count;
    this.whiteCountElement.textContent = white_count;

    const validMoves = this.game.getValidMoves();
    if (validMoves.length > 0) {
      const movesText = validMoves
        .map((move) => `(${move[0]}, ${move[1]})`)
        .join(", ");
      this.validMovesElement.textContent = `有効な手: ${movesText}`;
    } else {
      if (!this.game.isGameOver()) {
        this.validMovesElement.textContent =
          "有効な手がありません。パスになります。";
      } else {
        this.validMovesElement.textContent = "";
      }
    }
  }

  showGameOver() {
    const winner = this.game.getWinner();
    let message = "";

    if (winner === "Draw") {
      message = "引き分けです！";
    } else {
      const winnerName = winner === "B" ? "黒" : "白";
      message = `${winnerName}の勝利です！`;
    }

    this.gameMessageElement.textContent = message;
    this.gameMessageElement.className = "game-message winner-message";
    this.validMovesElement.textContent = "";
  }

  showMessage(message) {
    this.gameMessageElement.textContent = message;
    this.gameMessageElement.className = "game-message";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new OthelloGame();
});
