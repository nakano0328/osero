class Othello {
  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(" "));
    this.board[3][3] = "W";
    this.board[3][4] = "B";
    this.board[4][3] = "B";
    this.board[4][4] = "W";
    this.currentPlayer = "B";
  }

  isValidMove(row, col) {
    if (
      row < 0 ||
      row >= 8 ||
      col < 0 ||
      col >= 8 ||
      this.board[row][col] !== " "
    ) {
      return false;
    }

    const opponent = this.currentPlayer === "B" ? "W" : "B";
    let foundValidDirection = false;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        let r = row + dr;
        let c = col + dc;
        let hasOpponentPiece = false;

        while (
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          this.board[r][c] === opponent
        ) {
          hasOpponentPiece = true;
          r += dr;
          c += dc;
        }

        if (
          hasOpponentPiece &&
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          this.board[r][c] === this.currentPlayer
        ) {
          foundValidDirection = true;
        }
      }
    }
    return foundValidDirection;
  }

  makeMove(row, col) {
    if (!this.isValidMove(row, col)) {
      return false;
    }

    this.board[row][col] = this.currentPlayer;
    const opponent = this.currentPlayer === "B" ? "W" : "B";

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        let r = row + dr;
        let c = col + dc;
        const toFlip = [];

        while (
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          this.board[r][c] === opponent
        ) {
          toFlip.push([r, c]);
          r += dr;
          c += dc;
        }

        if (
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          this.board[r][c] === this.currentPlayer
        ) {
          for (const [fr, fc] of toFlip) {
            this.board[fr][fc] = this.currentPlayer;
          }
        }
      }
    }
    return true;
  }

  getValidMoves() {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.isValidMove(r, c)) {
          moves.push([r, c]);
        }
      }
    }
    return moves;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "B" ? "W" : "B";
  }

  isGameOver() {
    const currentPlayerMoves = this.getValidMoves().length > 0;
    this.switchPlayer();
    const opponentPlayerMoves = this.getValidMoves().length > 0;
    this.switchPlayer(); // Switch back
    return !currentPlayerMoves && !opponentPlayerMoves;
  }

  getScore() {
    let black_count = 0;
    let white_count = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.board[r][c] === "B") black_count++;
        if (this.board[r][c] === "W") white_count++;
      }
    }
    return { black_count, white_count };
  }

  getWinner() {
    const { black_count, white_count } = this.getScore();
    if (black_count > white_count) return "B";
    if (white_count > black_count) return "W";
    return "Draw";
  }
}
