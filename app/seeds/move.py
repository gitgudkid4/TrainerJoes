import time
import requests
from app.models import db, Move, Type, environment, SCHEMA
from sqlalchemy.sql import text

MOVE_SLUGS = [
    'flamethrower', 'fly', 'earthquake', 'dragon-claw', 'thunderbolt',
    'quick-attack', 'iron-tail', 'volt-tackle', 'body-slam', 'rest',
    'sleep-talk', 'crunch', 'thunder-punch', 'fire-punch', 'hyper-beam',
    'psychic', 'shadow-ball', 'aura-sphere', 'sludge-bomb', 'dream-eater',
    'hypnosis', 'focus-blast', 'energy-ball', 'dynamic-punch', 'stone-edge',
    'bullet-punch', 'waterfall', 'dragon-dance', 'ice-fang', 'flare-blitz',
    'extreme-speed', 'wild-charge', 'thunder-wave', 'giga-drain',
    'leech-seed', 'surf', 'ice-beam', 'earth-power',
]


def fetch_move_data(slug):
    url = f'https://pokeapi.co/api/v2/move/{slug}/'
    response = requests.get(url)
    if response.status_code != 200:
        print(f'  Warning: could not fetch move {slug} (status {response.status_code})')
        return None
    data = response.json()
    return {
        'name': slug,
        'display_name': slug.replace('-', ' ').title(),
        'type_name': data['type']['name'],
        'category': data['damage_class']['name'],
        'power': data.get('power'),
        'accuracy': data.get('accuracy'),
        'pp': data.get('pp'),
    }


def seed_moves():
    types_by_name = {t.name: t for t in Type.query.all()}

    for slug in MOVE_SLUGS:
        print(f'  Fetching move: {slug}')
        move_data = fetch_move_data(slug)
        if not move_data:
            continue

        move_type = types_by_name.get(move_data['type_name'])
        if not move_type:
            print(f'  Warning: unknown type {move_data["type_name"]} for move {slug}')
            continue

        new_move = Move(
            name=move_data['name'],
            display_name=move_data['display_name'],
            type_id=move_type.id,
            category=move_data['category'],
            power=move_data['power'],
            accuracy=move_data['accuracy'],
            pp=move_data['pp'],
        )
        db.session.add(new_move)
        time.sleep(0.1)

    db.session.commit()


def undo_moves():
    if environment == 'production':
        db.session.execute(
            f'TRUNCATE table {SCHEMA}.moves RESTART IDENTITY CASCADE;'
        )
    else:
        db.session.execute(text('DELETE FROM moves'))
    db.session.commit()
