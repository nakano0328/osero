from flask import Blueprint, jsonify, request
from src.models.othello import Othello

game_bp = Blueprint('game', __name__)

# グローバルなゲーム状態（実際のアプリケーションではセッションやデータベースを使用）
current_game = Othello()

@game_bp.route('/api/game/state', methods=['GET'])
def get_game_state():
    """現在のゲーム状態を取得"""
    return jsonify(current_game.get_game_state())

@game_bp.route('/api/game/new', methods=['POST'])
def new_game():
    """新しいゲームを開始"""
    global current_game
    current_game = Othello()
    return jsonify({
        'message': 'New game started',
        'game_state': current_game.get_game_state()
    })

@game_bp.route('/api/game/move', methods=['POST'])
def make_move():
    """手を打つ"""
    data = request.get_json()
    
    if not data or 'row' not in data or 'col' not in data:
        return jsonify({'error': 'Row and col are required'}), 400
    
    try:
        row = int(data['row'])
        col = int(data['col'])
    except (ValueError, TypeError):
        return jsonify({'error': 'Row and col must be integers'}), 400
    
    if current_game.make_move(row, col):
        # 手を打った後、相手のターンに切り替え
        current_game.switch_player()
        
        # 相手に有効な手がない場合、再度プレイヤーを切り替え
        if not current_game.get_valid_moves() and not current_game.is_game_over():
            current_game.switch_player()
        
        return jsonify({
            'success': True,
            'game_state': current_game.get_game_state()
        })
    else:
        return jsonify({'error': 'Invalid move'}), 400

