from .db import db, environment, SCHEMA, add_prefix_for_prod


class Pokemon(db.Model):
    __tablename__ = 'pokemon'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)
    pokemon_img = db.Column(db.String(1000), nullable=False)
    pokemon_sprite = db.Column(db.String(1000), nullable=False)
    type_1_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('types.id')), nullable=False)
    type_2_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('types.id')), nullable=True)

    type_1_obj = db.relationship('Type', foreign_keys=[type_1_id], back_populates='pokemon_primary')
    type_2_obj = db.relationship('Type', foreign_keys=[type_2_id], back_populates='pokemon_secondary')
    products = db.relationship('Product', back_populates='pokemon')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'pokemon_img': self.pokemon_img,
            'pokemon_sprite': self.pokemon_sprite,
            'type_1': self.type_1_obj.name if self.type_1_obj else None,
            'type_1_color': self.type_1_obj.color_hex if self.type_1_obj else None,
            'type_2': self.type_2_obj.name if self.type_2_obj else None,
            'type_2_color': self.type_2_obj.color_hex if self.type_2_obj else None,
        }
