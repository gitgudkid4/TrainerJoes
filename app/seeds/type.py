from app.models import db, Type, environment, SCHEMA
from sqlalchemy.sql import text

TYPE_DATA = [
    {'name': 'normal',   'color_hex': '#A8A77A'},
    {'name': 'fire',     'color_hex': '#EE8130'},
    {'name': 'water',    'color_hex': '#6390F0'},
    {'name': 'electric', 'color_hex': '#F7D02C'},
    {'name': 'grass',    'color_hex': '#7AC74C'},
    {'name': 'ice',      'color_hex': '#96D9D6'},
    {'name': 'fighting', 'color_hex': '#C22E28'},
    {'name': 'poison',   'color_hex': '#A33EA1'},
    {'name': 'ground',   'color_hex': '#E2BF65'},
    {'name': 'flying',   'color_hex': '#A98FF3'},
    {'name': 'psychic',  'color_hex': '#F95587'},
    {'name': 'bug',      'color_hex': '#A6B91A'},
    {'name': 'rock',     'color_hex': '#B6A136'},
    {'name': 'ghost',    'color_hex': '#735797'},
    {'name': 'dragon',   'color_hex': '#6F35FC'},
    {'name': 'dark',     'color_hex': '#705746'},
    {'name': 'steel',    'color_hex': '#B7B7CE'},
    {'name': 'fairy',    'color_hex': '#D685AD'},
]


def seed_types():
    for t in TYPE_DATA:
        new_type = Type(name=t['name'], color_hex=t['color_hex'])
        db.session.add(new_type)
    db.session.commit()


def undo_types():
    if environment == 'production':
        db.session.execute(
            f'TRUNCATE table {SCHEMA}.types RESTART IDENTITY CASCADE;'
        )
    else:
        db.session.execute(text('DELETE FROM types'))
    db.session.commit()
