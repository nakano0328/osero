class OthelloGame {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.currentPlayerElement = document.getElementById('current-player');
        this.blackCountElement = document.getElementById('black-count');
        this.whiteCountElement = document.getElementById('white-count');
        this.gameMessageElement = document.getElementById('game-message');
        this.validMovesElement = document.getElementById('valid-moves');
        this.newGameBtn = document.getElementById('new-game-btn');
        
        this.gameState = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    async initializeGame() {
        try {
            await this.fetchGameState();
            this.renderBoard();
        } catch (error) {
            console.error('ゲームの初期化に失敗しました:', error);
            this.showMessage('ゲームの初期化に失敗しました');
        }
    }
    
    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
    }
    
    async fetchGameState() {
        const response = await fetch('/api/game/state');
        if (!response.ok) {
            throw new Error('ゲーム状態の取得に失敗しました');
        }
        this.gameState = await response.json();
    }
    
    async startNewGame() {
        try {
            const response = await fetch('/api/game/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('新しいゲームの開始に失敗しました');
            }
            
            const data = await response.json();
            this.gameState = data.game_state;
            this.renderBoard();
            this.showMessage('新しいゲームを開始しました！');
        } catch (error) {
            console.error('新しいゲームの開始に失敗しました:', error);
            this.showMessage('新しいゲームの開始に失敗しました');
        }
    }
    
    async makeMove(row, col) {
        try {
            const response = await fetch('/api/game/move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ row, col })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '手を打つことができませんでした');
            }
            
            const data = await response.json();
            this.gameState = data.game_state;
            this.renderBoard();
            
            if (this.gameState.is_game_over) {
                this.showGameOver();
            } else {
                this.showMessage('');
            }
        } catch (error) {
            console.error('手を打つことに失敗しました:', error);
            this.showMessage(error.message);
        }
    }
    
    renderBoard() {
        if (!this.gameState) return;
        
        // 盤面をクリア
        this.gameBoard.innerHTML = '';
        
        // 8x8の盤面を作成
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 駒がある場合は表示
                const piece = this.gameState.board[row][col];
                if (piece !== ' ') {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece === 'B' ? 'black' : 'white'}`;
                    cell.appendChild(pieceElement);
                }
                
                // 有効な手の場合はハイライト
                const isValidMove = this.gameState.valid_moves.some(
                    move => move[0] === row && move[1] === col
                );
                
                if (isValidMove) {
                    cell.classList.add('valid-move');
                    cell.addEventListener('click', () => this.makeMove(row, col));
                }
                
                this.gameBoard.appendChild(cell);
            }
        }
        
        this.updateGameInfo();
    }
    
    updateGameInfo() {
        if (!this.gameState) return;
        
        // 現在のプレイヤーを更新
        this.currentPlayerElement.textContent = 
            this.gameState.current_player === 'B' ? '黒' : '白';
        
        // スコアを更新
        this.blackCountElement.textContent = this.gameState.black_count;
        this.whiteCountElement.textContent = this.gameState.white_count;
        
        // 有効な手を表示
        if (this.gameState.valid_moves.length > 0) {
            const movesText = this.gameState.valid_moves
                .map(move => `(${move[0]}, ${move[1]})`)
                .join(', ');
            this.validMovesElement.textContent = `有効な手: ${movesText}`;
        } else {
            this.validMovesElement.textContent = '有効な手がありません';
        }
    }
    
    showGameOver() {
        const winner = this.gameState.winner;
        let message = '';
        
        if (winner === 'Draw') {
            message = '引き分けです！';
        } else {
            const winnerName = winner === 'B' ? '黒' : '白';
            message = `${winnerName}の勝利です！`;
        }
        
        this.gameMessageElement.textContent = message;
        this.gameMessageElement.className = 'game-message winner-message';
        this.validMovesElement.textContent = '';
    }
    
    showMessage(message) {
        this.gameMessageElement.textContent = message;
        this.gameMessageElement.className = 'game-message';
    }
}

// ページが読み込まれたらゲームを開始
document.addEventListener('DOMContentLoaded', () => {
    new OthelloGame();
});

