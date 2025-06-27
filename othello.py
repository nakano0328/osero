class Othello:
    def __init__(self):
        self.board = [[' ' for _ in range(8)] for _ in range(8)]
        self.board[3][3] = 'W'
        self.board[3][4] = 'B'
        self.board[4][3] = 'B'
        self.board[4][4] = 'W'
        self.current_player = 'B'

    def print_board(self):
        print('  0 1 2 3 4 5 6 7')
        for i, row in enumerate(self.board):
            print(f'{i} ' + '|'.join(row))

    def is_valid_move(self, row, col):
        if not (0 <= row < 8 and 0 <= col < 8) or self.board[row][col] != ' ':
            return False

        opponent = 'W' if self.current_player == 'B' else 'B'
        
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue

                r, c = row + dr, col + dc
                if not (0 <= r < 8 and 0 <= c < 8) or self.board[r][c] != opponent:
                    continue

                while 0 <= r < 8 and 0 <= c < 8 and self.board[r][c] == opponent:
                    r += dr
                    c += dc

                if 0 <= r < 8 and 0 <= c < 8 and self.board[r][c] == self.current_player:
                    return True
        return False

    def make_move(self, row, col):
        if not self.is_valid_move(row, col):
            return False

        self.board[row][col] = self.current_player
        opponent = 'W' if self.current_player == 'B' else 'B'

        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue

                r, c = row + dr, col + dc
                to_flip = []
                while 0 <= r < 8 and 0 <= c < 8 and self.board[r][c] == opponent:
                    to_flip.append((r, c))
                    r += dr
                    c += dc

                if 0 <= r < 8 and 0 <= c < 8 and self.board[r][c] == self.current_player:
                    for fr, fc in to_flip:
                        self.board[fr][fc] = self.current_player
        return True

    def get_valid_moves(self):
        moves = []
        for r in range(8):
            for c in range(8):
                if self.is_valid_move(r, c):
                    moves.append((r, c))
        return moves

    def switch_player(self):
        self.current_player = 'W' if self.current_player == 'B' else 'B'

    def is_game_over(self):
        return not self.get_valid_moves() and not self.has_opponent_moves()

    def has_opponent_moves(self):
        original_player = self.current_player
        self.switch_player()
        opponent_moves = self.get_valid_moves()
        self.current_player = original_player  # 元に戻す
        return bool(opponent_moves)

    def get_winner(self):
        black_count = sum(row.count('B') for row in self.board)
        white_count = sum(row.count('W') for row in self.board)
        if black_count > white_count:
            return 'B'
        elif white_count > black_count:
            return 'W'
        else:
            return 'Draw'

def play_game():
    game = Othello()
    while True:
        game.print_board()
        print(f"Current player: {game.current_player}")
        valid_moves = game.get_valid_moves()

        if not valid_moves:
            print(f"No valid moves for {game.current_player}. Passing turn.")
            game.switch_player()
            if game.is_game_over():
                print("Game Over!")
                game.print_board()
                winner = game.get_winner()
                if winner == 'Draw':
                    print("It's a draw!")
                else:
                    print(f"Winner: {winner}")
                break
            continue

        print("Valid moves:", valid_moves)
        try:
            row = int(input("Enter row: "))
            col = int(input("Enter col: "))
        except ValueError:
            print("Invalid input. Please enter numbers.")
            continue

        if game.make_move(row, col):
            game.switch_player()
        else:
            print("Invalid move. Try again.")

if __name__ == '__main__':
    play_game()


