from sqlalchemy.sql import text
from app.models import db, Product, ProductMove, Move, User, Pokemon, environment, SCHEMA

MOVE_DISPLAY_TO_SLUG = {
    'Flamethrower': 'flamethrower',
    'Fly': 'fly',
    'Earthquake': 'earthquake',
    'Dragon Claw': 'dragon-claw',
    'Thunderbolt': 'thunderbolt',
    'Quick Attack': 'quick-attack',
    'Iron Tail': 'iron-tail',
    'Volt Tackle': 'volt-tackle',
    'Body Slam': 'body-slam',
    'Rest': 'rest',
    'Sleep Talk': 'sleep-talk',
    'Crunch': 'crunch',
    'Thunderpunch': 'thunder-punch',
    'Fire Punch': 'fire-punch',
    'Hyper Beam': 'hyper-beam',
    'Psychic': 'psychic',
    'Shadow Ball': 'shadow-ball',
    'Aura Sphere': 'aura-sphere',
    'Sludge Bomb': 'sludge-bomb',
    'Dream Eater': 'dream-eater',
    'Hypnosis': 'hypnosis',
    'Focus Blast': 'focus-blast',
    'Energy Ball': 'energy-ball',
    'Dynamic Punch': 'dynamic-punch',
    'Stone Edge': 'stone-edge',
    'Bullet Punch': 'bullet-punch',
    'Waterfall': 'waterfall',
    'Dragon Dance': 'dragon-dance',
    'Ice Fang': 'ice-fang',
    'Flare Blitz': 'flare-blitz',
    'Extreme Speed': 'extreme-speed',
    'Wild Charge': 'wild-charge',
    'Thunder Wave': 'thunder-wave',
    'Giga Drain': 'giga-drain',
    'Leech Seed': 'leech-seed',
    'Surf': 'surf',
    'Ice Beam': 'ice-beam',
    'Earth Power': 'earth-power',
}

PRODUCT_SEED_DATA = [
    {
        'user_idx': 1,
        'pokemon_id': 6,
        'level': 100, 'ability': 'Blaze', 'item': 'Charcoal',
        'nature': 'Brave', 'game': 'FireRed', 'shiny': True,
        'generation': 3, 'quantity': 10, 'price': 3.99,
        'description': 'Max Spa and Speed EV. High Spa and HP IV.',
        'moves': ['Flamethrower', 'Fly', 'Earthquake', 'Dragon Claw'],
    },
    {
        'user_idx': 1,
        'pokemon_id': 25,
        'level': 100, 'ability': 'Static', 'item': 'Light Ball',
        'nature': 'Jolly', 'game': 'Yellow', 'shiny': True,
        'generation': 1, 'quantity': 20, 'price': 9.99,
        'description': 'Max Spa and Speed EV. Pretty bad IV.',
        'moves': ['Thunderbolt', 'Quick Attack', 'Iron Tail', 'Volt Tackle'],
    },
    {
        'user_idx': 1,
        'pokemon_id': 143,
        'level': 100, 'ability': 'Immunity', 'item': 'Leftovers',
        'nature': 'Relaxed', 'game': 'Silver', 'shiny': False,
        'generation': 2, 'quantity': 5, 'price': 3.50,
        'description': 'EV TRAINED FOR HP AND SPD. VERY HIGH HP IV!',
        'moves': ['Body Slam', 'Rest', 'Sleep Talk', 'Crunch'],
    },
    {
        'user_idx': 1,
        'pokemon_id': 149,
        'level': 100, 'ability': 'Inner Focus', 'item': 'Dragon Fang',
        'nature': 'Modest', 'game': 'Emerald', 'shiny': True,
        'generation': 3, 'quantity': 8, 'price': 3.75,
        'description': 'MAX IV AND MAX EV. BUY NOW VERY STRONG POKEMON!',
        'moves': ['Dragon Claw', 'Fly', 'Thunderpunch', 'Fire Punch'],
    },
    {
        'user_idx': 1,
        'pokemon_id': 150,
        'level': 100, 'ability': 'Pressure', 'item': 'None',
        'nature': 'Timid', 'game': 'Red', 'shiny': False,
        'generation': 1, 'quantity': 3, 'price': 0.99,
        'description': 'Selling my baby because I need cash. EV trained with max Spa and Speed. 31 Spa IV.',
        'moves': ['Hyper Beam', 'Psychic', 'Shadow Ball', 'Aura Sphere'],
    },
    {
        'user_idx': 2,
        'pokemon_id': 94,
        'level': 100, 'ability': 'Levitate', 'item': 'Focus Sash',
        'nature': 'Timid', 'game': 'FireRed', 'shiny': False,
        'generation': 3, 'quantity': 10, 'price': 12.99,
        'description': 'Max Speed and Special Attack EV. Perfect IVs in Special Attack and Speed.',
        'moves': ['Shadow Ball', 'Sludge Bomb', 'Dream Eater', 'Hypnosis'],
    },
    {
        'user_idx': 2,
        'pokemon_id': 65,
        'level': 100, 'ability': 'Synchronize', 'item': 'TwistedSpoon',
        'nature': 'Modest', 'game': 'LeafGreen', 'shiny': False,
        'generation': 1, 'quantity': 8, 'price': 1.50,
        'description': 'Max Special Attack and Speed EV. High Special Attack IV.',
        'moves': ['Psychic', 'Focus Blast', 'Shadow Ball', 'Energy Ball'],
    },
    {
        'user_idx': 2,
        'pokemon_id': 68,
        'level': 100, 'ability': 'Guts', 'item': 'Leftovers',
        'nature': 'Adamant', 'game': 'Red', 'shiny': True,
        'generation': 1, 'quantity': 6, 'price': 9.00,
        'description': 'Max Attack EV. Very high Attack IV.',
        'moves': ['Dynamic Punch', 'Stone Edge', 'Earthquake', 'Bullet Punch'],
    },
    {
        'user_idx': 2,
        'pokemon_id': 130,
        'level': 100, 'ability': 'Intimidate', 'item': 'Mystic Water',
        'nature': 'Jolly', 'game': 'Platinum', 'shiny': False,
        'generation': 1, 'quantity': 12, 'price': 2.50,
        'description': 'EV trained for Attack and Speed. Perfect IVs in Attack and Speed.',
        'moves': ['Waterfall', 'Crunch', 'Dragon Dance', 'Ice Fang'],
    },
    {
        'user_idx': 2,
        'pokemon_id': 59,
        'level': 100, 'ability': 'Intimidate', 'item': 'Charcoal',
        'nature': 'Adamant', 'game': 'Green', 'shiny': False,
        'generation': 1, 'quantity': 7, 'price': 3.50,
        'description': 'Max Attack and Speed EV. High IVs across the board.',
        'moves': ['Flare Blitz', 'Extreme Speed', 'Crunch', 'Wild Charge'],
    },
    {
        'user_idx': 3,
        'pokemon_id': 26,
        'level': 100, 'ability': 'Static', 'item': 'Light Ball',
        'nature': 'Hasty', 'game': 'Yellow', 'shiny': True,
        'generation': 1, 'quantity': 9, 'price': 5.50,
        'description': 'Max Speed and Special Attack EV. Perfect Speed IV.',
        'moves': ['Thunderbolt', 'Quick Attack', 'Thunder Wave', 'Focus Blast'],
    },
    {
        'user_idx': 3,
        'pokemon_id': 3,
        'level': 100, 'ability': 'Overgrow', 'item': 'Leftovers',
        'nature': 'Calm', 'game': 'LeafGreen', 'shiny': False,
        'generation': 3, 'quantity': 10, 'price': 9.25,
        'description': 'EV trained for HP and Special Defense. High HP IV.',
        'moves': ['Giga Drain', 'Sludge Bomb', 'Earthquake', 'Leech Seed'],
    },
    {
        'user_idx': 3,
        'pokemon_id': 9,
        'level': 100, 'ability': 'Torrent', 'item': 'Mystic Water',
        'nature': 'Bold', 'game': 'Sapphire', 'shiny': False,
        'generation': 3, 'quantity': 8, 'price': 12.50,
        'description': 'Max Defense and Special Defense EV. High Defense IV.',
        'moves': ['Surf', 'Ice Beam', 'Earthquake'],
    },
    {
        'user_idx': 3,
        'pokemon_id': 34,
        'level': 100, 'ability': 'Sheer Force', 'item': 'Life Orb',
        'nature': 'Modest', 'game': 'Gold', 'shiny': True,
        'generation': 2, 'quantity': 5, 'price': 1.00,
        'description': 'EV trained for Special Attack and Speed. Perfect Special Attack IV.',
        'moves': ['Sludge Bomb', 'Earth Power'],
    },
    {
        'user_idx': 3,
        'pokemon_id': 122,
        'level': 100, 'ability': 'Sheer Force', 'item': 'Life Orb',
        'nature': 'Modest', 'game': 'Silver', 'shiny': False,
        'generation': 2, 'quantity': 6, 'price': 0.25,
        'description': 'Max HP and Special Attack EV. High HP IV.',
        'moves': ['Psychic'],
    },
]


def seed_products():
    users = User.query.order_by(User.id).all()
    moves_by_slug = {m.name: m for m in Move.query.all()}

    for data in PRODUCT_SEED_DATA:
        user = users[data['user_idx'] - 1]
        product = Product(
            user_id=user.id,
            pokemon_id=data['pokemon_id'],
            level=data['level'],
            ability=data['ability'],
            item=data['item'],
            nature=data['nature'],
            game=data['game'],
            shiny=data['shiny'],
            generation=data['generation'],
            quantity=data['quantity'],
            price=data['price'],
            description=data['description'],
        )
        db.session.add(product)
        db.session.flush()

        for slot, display_name in enumerate(data['moves'], start=1):
            slug = MOVE_DISPLAY_TO_SLUG.get(display_name)
            move = moves_by_slug.get(slug)
            if not move:
                print(f'  Warning: move "{display_name}" (slug: {slug}) not found in DB')
                continue
            product_move = ProductMove(
                product_id=product.id,
                move_id=move.id,
                slot=slot,
            )
            db.session.add(product_move)

    db.session.commit()


def undo_products():
    if environment == 'production':
        db.session.execute(
            f'TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;'
        )
    else:
        db.session.execute(text('DELETE FROM product_moves'))
        db.session.execute(text('DELETE FROM products'))
    db.session.commit()
