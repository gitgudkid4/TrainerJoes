import "./OneProduct.css";
import * as productActions from "../../redux/product";
import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditProduct from "./EditProduct";
import DeleteReview from "../Review/DeleteReview";
import AddReview from "../Review/AddReview";
import EditReview from "../Review/EditReview";
import * as reviewActions from "../../redux/review";
import * as cartActions from "../../redux/cart";
import * as watchlistActions from "../../redux/watchlist";
import AddToWatchlist from "../Watchlist/AddToWatchlist";

const OneProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();

    const currUser = useSelector((state) => state.session.user);
    const product = useSelector((state) => state.product[productId]);
    const productPokemon = product?.pokemon;

    const cartsObj = useSelector((state) => state.cart);
    const carts = Object.values(cartsObj);
    const [localCart, setLocalCart] = useState([]);

    const watchlistsObj = useSelector((state) => state.watchlist);
    const watchlists = Object.values(watchlistsObj);

    const userCart =
        (currUser &&
            carts.find((cart) => cart.user_id === currUser.id)?.cart_items) ||
        [];

    const userCartId =
        (currUser && carts.find((cart) => cart.user_id === currUser.id)?.id) ||
        "";

    useEffect(() => {
        setLocalCart(userCart);
    }, [userCart]);

    const reviewsObj = useSelector((state) => state.review);
    const reviews = Object.values(reviewsObj);
    const productReviews = product
        ? reviews.filter((review) => review.product_id === product.id)
        : [];

    const userWatchlist =
        (currUser &&
            watchlists.find((watchlist) => watchlist.user_id === currUser.id)
                ?.watchlist_products) ||
        [];

    const thumbsUpCount = productReviews.filter(
        (review) => review.thumbs_up
    ).length;
    const thumbsDownCount = productReviews.filter(
        (review) => review.thumbs_down
    ).length;

    useEffect(() => {
        setLocalCart(userCart);
    }, [userCart]);

    const handleAddToCart = (productId) => {
        dispatch(cartActions.addProductToCart(userCartId, productId)).then(
            () => {
                setLocalCart([...localCart, { id: productId }]);
            }
        );
    };

    const sentiment =
        thumbsUpCount > thumbsDownCount
            ? "Mostly Positive"
            : thumbsDownCount > thumbsUpCount
            ? "Mostly Negative"
            : "Mixed";

    const hasReviewed =
        currUser &&
        productReviews.some((review) => review.user_id === currUser.id);

    const productName =
        productPokemon?.name.charAt(0).toUpperCase() +
        productPokemon?.name.slice(1);

    const productImage = product?.product_image;

    useEffect(() => {
        dispatch(productActions.fetchOneProduct(productId));
        dispatch(reviewActions.fetchAllReviews());
        dispatch(cartActions.fetchAllCarts());
        dispatch(watchlistActions.fetchAllWatchlist());
    }, [dispatch, productId]);

    const isWatchlisted = userWatchlist.some(
        (watchlistProduct) => watchlistProduct.id === product.id
    );

    const isInCart = localCart?.some(
        (cartItem) => cartItem?.id === product?.id
    );

    return (
        <div id="product-page-container">
            <div id="product-container">
                {product ? (
                    <>
                        <div className="product-card">
                            <NavLink
                                className="posted-user-container"
                                to={`/profile/${product?.user.id}`}
                            >
                                <h4>Posted by {product?.user.username}</h4>
                            </NavLink>
                            <div className="pokemon-name-img-type-container">
                                <h2 className="name-level-container">
                                    {productName}
                                    <h2>Level {product.level}</h2>
                                </h2>
                                <div className="type-container">
                                    <h3
                                        className={`pokemon-type ${productPokemon?.type_1.toLowerCase()}`}
                                    >
                                        {productPokemon?.type_1}
                                    </h3>
                                    {productPokemon?.type_2 && (
                                        <h3
                                            className={`pokemon-type ${productPokemon?.type_2.toLowerCase()}`}
                                        >
                                            {productPokemon?.type_2}
                                        </h3>
                                    )}
                                </div>
                                <img
                                    src={productPokemon?.pokemon_img}
                                    alt={productPokemon?.name}
                                    className="img-container"
                                />
                                <div className="ability-item-nature-container">
                                    <div className="product-ability-container">
                                        <h2>Ability:</h2>
                                        <h3>{product.ability}</h3>
                                    </div>
                                    <div className="product-item-container">
                                        <h2>Held Item:</h2>
                                        <h3>{product.item}</h3>
                                    </div>
                                    <div className="product-nature-container">
                                        <h2>Nature:</h2>
                                        <h3>{product.nature}</h3>
                                    </div>
                                    <div className="product-shiny-container">
                                        <h2>
                                            Shiny:{" "}
                                            {product.shiny ? "Yes" : "No"}
                                        </h2>
                                    </div>
                                    <div id="moves-info">
                                        <h2>Moves:</h2>
                                        <div className="product-moves-container">
                                            {product.moves?.map((pm) => (
                                                <h3
                                                    key={pm.slot}
                                                    className="move-chip"
                                                    style={{ background: pm.move?.type?.color_hex || '#444' }}
                                                >
                                                    {pm.move?.display_name}
                                                </h3>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="product-quantity-price-container">
                                        <h2 className="price-container">
                                            ${product.price}
                                        </h2>
                                        <h2 className="price-container">
                                            {product.quantity} left!
                                        </h2>
                                    </div>
                                    {currUser &&
                                    currUser.id === product.user_id ? (
                                        <h3 className="product-user-product">
                                            This is your product!
                                        </h3>
                                    ) : (
                                        currUser && (
                                            <div className="product-cart-watchlist">
                                                {isInCart ? (
                                                    <span className="product-cart-text">
                                                        In Cart
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="product-cart-button"
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                                {
                                                    currUser.watchlist ? (
                                                        isWatchlisted ? (
                                                            <span className="product-watchlisted-text">
                                                                Watchlisted
                                                            </span>
                                                        ) : (
                                                            <div className="product-add-to-watchlist-button">
                                                                <OpenModalButton
                                                                    buttonText="Add to Watchlist"
                                                                    modalComponent={
                                                                        <AddToWatchlist
                                                                            productId={
                                                                                product.id
                                                                            }
                                                                            watchlistId={
                                                                                currUser
                                                                                    .watchlist
                                                                                    .id
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    ) : null // Handle case when currUser.watchlist is not available
                                                }
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="game-data-container">
                                <div className="name-container">
                                    <h2>
                                        Current Game: {product.game} (gen{" "}
                                        {product.generation})
                                    </h2>
                                </div>
                                <div className="description-image-container">
                                    {productImage?.[0]?.img_url && (
                                        <img
                                            className="description-image"
                                            src={productImage[0].img_url}
                                            alt={productName}
                                        />
                                    )}
                                    <span className="description">
                                        {product.description}
                                    </span>
                                </div>
                            </div>
                            {currUser?.id === product.user_id && (
                                <div className="product-modal-button-container">
                                    <OpenModalButton
                                        buttonText="Edit Product"
                                        modalComponent={
                                            <EditProduct
                                                productId={product.id}
                                            />
                                        }
                                        className="edit-product-button"
                                    />
                                </div>
                            )}

                            {/* Reviews Section */}
                            <div id="review-cart">
                                <h2>Reviews</h2>
                                <h3>{productReviews.length} reviews </h3>

                                {/* Sentiment Display */}
                                {productReviews.length > 0 && (
                                    <div className="sentiment-container">
                                        <p>{sentiment}</p>
                                    </div>
                                )}

                                {productReviews.length > 0 ? (
                                    productReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="review-card"
                                        >
                                            <h3>{review.user.username}</h3>
                                            <p className="description-box">
                                                {review.description}
                                            </p>
                                            <p>
                                                Rating:{" "}
                                                {review.thumbs_up ? "👍" : "👎"}
                                            </p>
                                            {currUser &&
                                                currUser.id ===
                                                    review.user_id && (
                                                    <div className="user-review-button">
                                                        <div className="review-delete-button">
                                                            <OpenModalButton
                                                                buttonText="Delete"
                                                                modalComponent={
                                                                    <DeleteReview
                                                                        reviewId={
                                                                            review.id
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                        <div className="review-edit-button">
                                                            <OpenModalButton
                                                                buttonText="Edit"
                                                                modalComponent={
                                                                    <EditReview
                                                                        reviewId={
                                                                            review.id
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet.</p>
                                )}

                                {/* Add Review Button */}
                                {!hasReviewed &&
                                    currUser &&
                                    currUser.id !== product.user_id && (
                                        <div className="add-review-button">
                                            <OpenModalButton
                                                buttonText="Add Review"
                                                modalComponent={
                                                    <AddReview
                                                        productId={productId}
                                                    />
                                                }
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default OneProduct;
