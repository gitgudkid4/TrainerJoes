from .db import db, environment, SCHEMA, add_prefix_for_prod


class Move(db.Model):
    __tablename__ = 'moves'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    display_name = db.Column(db.String(100), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('types.id')), nullable=False)
    category = db.Column(db.String(20))
    power = db.Column(db.Integer)
    accuracy = db.Column(db.Integer)
    pp = db.Column(db.Integer)

    type = db.relationship('Type', back_populates='moves')
    product_moves = db.relationship('ProductMove', back_populates='move')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_name': self.display_name,
            'type_id': self.type_id,
            'type': self.type.to_dict() if self.type else None,
            'category': self.category,
            'power': self.power,
            'accuracy': self.accuracy,
            'pp': self.pp,
        }
