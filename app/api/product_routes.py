from flask import Blueprint, jsonify, request, redirect
from flask_login import current_user, login_required
from app.models import db, Product, ProductMove, Move, Review, WatchlistItem, Watchlist
from app.forms import ProductForm, ReviewForm

product_routes = Blueprint("products", __name__)


@product_routes.route("/", methods=["GET"])
def get_all_products():
    products = Product.query.all()

    if not products:
        return jsonify({"message": "no products found"}), 404

    products_list = [product.to_dict() for product in products]

    return jsonify(products_list)


@product_routes.route("/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    product = Product.query.get(product_id)

    if product:
        return jsonify(product.to_dict())
    else:
        return jsonify({"message": "Product not found"}), 404


@product_routes.route("/create", methods=["POST"])
def post_product():
    data = request.json  # Get the JSON data from the request

    # validate no data
    
    if not data:
        return jsonify({"message": "No data provided"}), 400

    # You may want to manually handle validation or use a schema validation library
    shiny = data.get("shiny", False)

    new_product = Product(
        user_id=current_user.id,
        pokemon_id=data.get("pokemon_id"),
        level=data.get("level"),
        ability=data.get("ability"),
        item=data.get("item"),
        nature=data.get("nature"),
        game=data.get("game"),
        shiny=shiny,
        generation=data.get("generation"),
        quantity=data.get("quantity"),
        price=data.get("price"),
        description=data.get("description"),
    )

    try:
        db.session.add(new_product)
        db.session.flush()

        move_ids = data.get("move_ids", [])
        for slot, move_id in enumerate(move_ids[:4], start=1):
            if move_id:
                pm = ProductMove(product_id=new_product.id, move_id=int(move_id), slot=slot)
                db.session.add(pm)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Database error", "error": str(e)}), 500

    return jsonify(new_product.to_dict()), 201


@product_routes.route("/<int:product_id>/edit", methods=["PUT"])
@login_required
def update_product(product_id):
    # Find the product by ID
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product does not exist"}), 404

    if product.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    # Extract data from the JSON request body
    data = request.get_json()

    # Update product fields with the data from the request
    product.level = data.get("level", product.level)
    product.item = data.get("item", product.item)
    product.game = data.get("game", product.game)
    product.generation = data.get("generation", product.generation)
    product.price = data.get("price", product.price)
    product.description = data.get("description", product.description)
    product.quantity = data.get("quantity", product.quantity)

    if "move_ids" in data:
        ProductMove.query.filter_by(product_id=product_id).delete()
        for slot, move_id in enumerate(data["move_ids"][:4], start=1):
            if move_id:
                pm = ProductMove(product_id=product.id, move_id=int(move_id), slot=slot)
                db.session.add(pm)

    db.session.commit()

    return jsonify(product.to_dict()), 200


@product_routes.route("/<int:product_id>/delete", methods=["DELETE"])
def delete_product_by_id(product_id):
    # Query the product to delete
    product = Product.query.get(product_id)

    if product:
        # Find all related WatchlistItems
        related_watchlist_items = WatchlistItem.query.filter_by(
            product_id=product_id
        ).all()

        # Delete related WatchlistItems
        for item in related_watchlist_items:
            db.session.delete(item)

        # Now safely delete the product
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"}), 200  # Return a JSON response
    else:
        return jsonify({"message": "Product not found"}), 404


@product_routes.route("/<int:product_id>/reviews", methods=["GET"])
def get_reviews_by_product_id(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "product does not exist"}), 404

    reviews_list = []

    for review in product.reviews:
        review_data = review.to_dict()

        reviews_list.append(review_data)

    return jsonify(reviews_list)


@product_routes.route("/<int:product_id>/reviews/create", methods=["POST"])
@login_required
def post_review(product_id):
    form = reviewForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        description = form.data["description"]
        thumbs_up = form.data["thumbs_up"]
        thumbs_down = form.data["thumbs_down"]

        new_review = Review(
            user_id=current_user.id,
            product_id=product_id,
            description=description,
            thumbs_up=thumbs_up,
            thumbs_down=thumbs_down,
        )

        db.session.add(new_review)
        db.session.commit()

        return {"review": new_review.to_dict()}, 201

    return {"errors": form.errors}, 400
