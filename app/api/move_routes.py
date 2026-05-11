from flask import Blueprint, jsonify
from app.models import Move

move_routes = Blueprint('moves', __name__)


@move_routes.route('/')
def get_all_moves():
    moves = Move.query.order_by(Move.display_name).all()
    return jsonify([move.to_dict() for move in moves])


@move_routes.route('/<int:move_id>')
def get_move(move_id):
    move = Move.query.get(move_id)
    if not move:
        return jsonify({'message': 'Move not found'}), 404
    return jsonify(move.to_dict())
