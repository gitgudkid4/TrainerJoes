import os
from sqlalchemy.sql import text
from app.models import db, Product, User, Pokemon, ProductImage, environment, SCHEMA


def seed_productimages():

    product_images = [
        ProductImage(
            img_url="https://images.gamebanana.com/img/ss/mods/634dc41b545d9.jpg",
            filename="productimage1_filename.jpg",
            product_id=1,
        ),
        ProductImage(
            img_url="https://i.ytimg.com/vi/edyp5e03mQs/sddefault.jpg",
            filename="productimage2_filename.jpg",
            product_id=2,
        ),
        ProductImage(
            img_url="https://pokefella.com/cdn/shop/products/PokefellaSet-Snorlaxgmaxultrashiny_1024x1024.png?v=1584801109",
            filename="productimage3_filename.jpg",
            product_id=3,
        ),
        ProductImage(
            img_url="https://i.ytimg.com/vi/obZB7fErjYU/hqdefault.jpg",
            filename="productimage4_filename.jpg",
            product_id=4,
        ),
        ProductImage(
            img_url="https://pm1.aminoapps.com/7242/8796a70a723e33d89c8ebca0b41f11bcd3cd9ea1r1-2048-1536v2_uhq.jpg",
            filename="productimage5_filename.jpg",
            product_id=5,
        ),
        ProductImage(
            img_url="https://pokefella.com/cdn/shop/products/PokefellaSet-Gengargmaxultrashiny_1024x1024.png?v=1584863643",
            filename="productimage6_filename.jpg",
            product_id=6,
        ),
        ProductImage(
            img_url="https://www.smogon.com/forums/attachments/1637161743723-png.385895/",
            filename="productimage7_filename.jpg",
            product_id=7,
        ),
        ProductImage(
            img_url="https://i.ytimg.com/vi/LcDWTqyU9Bo/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgVyhkMA8=&rs=AOn4CLCbWn67FRjKfz78_hE4ASnQpYWM6g",
            filename="productimage8_filename.jpg",
            product_id=8,
        ),
        ProductImage(
            img_url="https://qph.cf2.quoracdn.net/main-qimg-ee784e2551fa90003698ade90d94642c-pjlq",
            filename="productimage9_filename.jpg",
            product_id=9,
        ),
        ProductImage(
            img_url="https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/05/pokemon-red-arcanine-pokedex-entry.jpg",
            filename="productimage10_filename.jpg",
            product_id=10,
        ),
        ProductImage(
            img_url="https://i.ytimg.com/vi/skJLoNIeO2o/mqdefault.jpg",
            filename="productimage11_filename.jpg",
            product_id=11,
        ),
        ProductImage(
            img_url="https://pokefella.com/cdn/shop/products/Venusaur_ad75dfbc-30b0-4174-b26a-e26ea02509aa_1024x.png?v=1592721407",
            filename="productimage12_filename.jpg",
            product_id=12,
        ),
        ProductImage(
            img_url="https://64.media.tumblr.com/ddc1b3676af855a2d27fde1e60d246ad/d382896f458e2548-ad/s1280x1920/14c5ed3956e085dad88640f8e6e52439c235834d.png",
            filename="productimage13_filename.jpg",
            product_id=13,
        ),
        ProductImage(
            img_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0VpTrtQPFm9BiLEV9MJUJD7yoVCuKgB0nFQ&s",
            filename="productimage14_filename.jpg",
            product_id=14,
        ),
        ProductImage(
            img_url="https://thenewleafjournal.com/wp-content/uploads/2022/01/mr-mime-miles-pkmn-yellow.jpg",
            filename="productimage15_filename.jpg",
            product_id=15,
        ),
    ]

    db.session.add_all(product_images)
    db.session.commit()


def undo_productimages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.product_images RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM product_images"))

    db.session.commit()
