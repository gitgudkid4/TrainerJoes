from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Numeric


class Product(db.Model):
    __tablename__ = "products"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"),
        nullable=False,
    )
    pokemon_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("pokemon.id")), nullable=False
    )

    level = db.Column(db.Integer, nullable=False)
    ability = db.Column(db.String(500), nullable=False)
    item = db.Column(db.String(500))
    nature = db.Column(db.String(500), nullable=False)
    game = db.Column(db.String(500), nullable=False)
    shiny = db.Column(db.Boolean)
    generation = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(Numeric(10, 2), nullable=False)
    description = db.Column(db.String(500), nullable=False)

    user = db.relationship("User", back_populates="products")
    pokemon = db.relationship("Pokemon", back_populates="products")
    reviews = db.relationship("Review", back_populates="product")
    cart_items = db.relationship("CartItem", back_populates="product")
    watchlist_items = db.relationship("WatchlistItem", back_populates="product")
    product_image = db.relationship(
        "ProductImage", cascade="all, delete-orphan", back_populates="product"
    )
    product_moves = db.relationship(
        "ProductMove", cascade="all, delete-orphan", back_populates="product"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "pokemon_id": self.pokemon_id,
            "pokemon": (self.pokemon.to_dict() if self.pokemon else None),
            "ability": self.ability,
            "item": self.item,
            "description": self.description,
            "level": self.level,
            "generation": self.generation,
            "nature": self.nature,
            "game": self.game,
            "quantity": self.quantity,
            "shiny": self.shiny,
            "price": self.price,
            "user": (
                {"id": self.user.id, "username": self.user.username}
                if self.user
                else None
            ),
            "reviews": [review.to_dict() for review in self.reviews],
            "product_image": [image.to_dict() for image in self.product_image],
            "moves": sorted(
                [pm.to_dict() for pm in self.product_moves],
                key=lambda x: x["slot"],
            ),
        }
