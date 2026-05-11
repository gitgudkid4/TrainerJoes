from flask.cli import AppGroup
from .type import seed_types, undo_types
from .users import seed_users, undo_users
from .pokemon import seed_pokemon, undo_pokemon
from .move import seed_moves, undo_moves
from .product import seed_products, undo_products
from .review import seed_reviews, undo_reviews
from .cart import seed_carts, undo_carts
from .watchlist import seed_watchlists, undo_watchlists
from .productimage import seed_productimages, undo_productimages

from app.models import db, environment, SCHEMA

seed_commands = AppGroup('seed')


@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_watchlists()
        undo_carts()
        undo_reviews()
        undo_productimages()
        undo_products()
        undo_moves()
        undo_pokemon()
        undo_users()
        undo_types()
    seed_types()
    seed_users()
    seed_pokemon()
    seed_moves()
    seed_products()
    seed_productimages()
    seed_reviews()
    seed_carts()
    seed_watchlists()


@seed_commands.command('undo')
def undo():
    undo_watchlists()
    undo_carts()
    undo_reviews()
    undo_productimages()
    undo_products()
    undo_moves()
    undo_pokemon()
    undo_users()
    undo_types()
