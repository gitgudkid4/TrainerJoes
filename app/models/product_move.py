from .db import db, environment, SCHEMA, add_prefix_for_prod


class ProductMove(db.Model):
    __tablename__ = 'product_moves'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('products.id'), ondelete='CASCADE'),
        nullable=False,
    )
    move_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('moves.id')),
        nullable=False,
    )
    slot = db.Column(db.Integer, nullable=False)

    product = db.relationship('Product', back_populates='product_moves')
    move = db.relationship('Move', back_populates='product_moves')

    def to_dict(self):
        return {
            'slot': self.slot,
            'move': self.move.to_dict() if self.move else None,
        }
