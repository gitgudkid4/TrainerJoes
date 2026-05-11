from .db import db, environment, SCHEMA, add_prefix_for_prod


class Type(db.Model):
    __tablename__ = 'types'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    color_hex = db.Column(db.String(7), nullable=False)

    pokemon_primary = db.relationship('Pokemon', foreign_keys='Pokemon.type_1_id', back_populates='type_1_obj')
    pokemon_secondary = db.relationship('Pokemon', foreign_keys='Pokemon.type_2_id', back_populates='type_2_obj')
    moves = db.relationship('Move', back_populates='type')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'color_hex': self.color_hex,
        }
