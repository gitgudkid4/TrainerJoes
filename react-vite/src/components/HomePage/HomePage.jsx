import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../redux/product";
import * as watchlistActions from "../../redux/watchlist";
import * as cartActions from "../../redux/cart";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./HomePage.css";
import AddToWatchlist from "../Watchlist/AddToWatchlist";

const HomePage = () => {
    const dispatch = useDispatch();
    const productsObj = useSelector((state) => state.product);
    const currUser = useSelector((state) => state.session.user);
    const products = Object.values(productsObj);
    const watchlistsObj = useSelector((state) => state.watchlist);
    const watchlists = Object.values(watchlistsObj);
    const cartsObj = useSelector((state) => state.cart);
    const carts = Object.values(cartsObj);

    const [localCart, setLocalCart] = useState([]);
    const [selectedType, setSelectedType] = useState("All");

    const userWatchlist =
        (currUser &&
            watchlists.find((watchlist) => watchlist.user_id === currUser.id)
                ?.watchlist_products) ||
        [];

    const userCart =
        (currUser &&
            carts.find((cart) => cart.user_id === currUser.id)?.cart_items) ||
        [];

    const userCartId =
        (currUser && carts.find((cart) => cart.user_id === currUser.id)?.id) ||
        "";

    useEffect(() => {
        dispatch(productActions.fetchAllProducts());
        dispatch(watchlistActions.fetchAllWatchlist());
        dispatch(cartActions.fetchAllCarts());
    }, [dispatch]);

    useEffect(() => {
        setLocalCart(userCart);
    }, [userCart]);

    const handleAddToCart = (productId) => {
        dispatch(cartActions.addProductToCart(userCartId, productId)).then(
            () => {
                setLocalCart([...localCart, { id: productId }]);
            }
        );
        console.log("Success!");
    };

    const visibleProducts = currUser
        ? products.filter((product) => product.user_id !== currUser.id)
        : products;

    const uniqueTypes = [
        "All",
        ...new Set(
            visibleProducts.flatMap((product) =>
                [product.pokemon.type_1, product.pokemon.type_2].filter(Boolean)
            )
        ),
    ];

    const filteredProducts =
        selectedType === "All"
            ? visibleProducts
            : visibleProducts.filter(
                  (product) =>
                      product.pokemon.type_1 === selectedType ||
                      product.pokemon.type_2 === selectedType
              );

    return (
        <div id="homepage-container">
            <h1>Products Listing</h1>
            <div className="filter-container">
                <label htmlFor="type-filter">
                    <h3>Filter by Type:</h3>
                </label>
                <select
                    id="type-filter"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <div className="product-list-container">
                {filteredProducts.map((product) => {
                    const productPokemon = product.pokemon;

                    const pokemonName =
                        product.pokemon.name.charAt(0).toUpperCase() +
                        product.pokemon.name.slice(1);

                    // Check if the product is in the user's watchlist
                    const isWatchlisted = userWatchlist.some(
                        (watchlistProduct) => watchlistProduct.id === product.id
                    );

                    // Check if the product is in the user's cart
                    const isInCart = localCart.some(
                        (cartItem) => cartItem.id === product.id
                    );

                    return (
                        <div className="product-container" key={product.id}>
                            <NavLink to={`/products/${product.id}`}>
                                <div className="game-gen-container">
                                    <h2>By {product.user.username}</h2>
                                    <h3>Game: {product.game}</h3>
                                    <h4>
                                        Game Generation: {product.generation}
                                    </h4>
                                </div>
                                <div className="homepage-type-container">
                                    <h3
                                        className={`pokemon-type ${productPokemon?.type_1.toLowerCase()}`}
                                    >
                                        {productPokemon.type_1}
                                    </h3>
                                    {productPokemon?.type_2 && (
                                        <h3
                                            className={`pokemon-type ${productPokemon?.type_2.toLowerCase()}`}
                                        >
                                            {productPokemon?.type_2}
                                        </h3>
                                    )}
                                </div>
                                <div className="pokemon-image">
                                    <img
                                        src={product.pokemon.pokemon_img}
                                        alt={pokemonName}
                                    />
                                </div>

                                <div className="name-level">
                                    <h2>{pokemonName}</h2>
                                    <h4>Level {product.level}</h4>
                                </div>
                                <div className="ability-nature-item">
                                    <h4>Ability: {product.ability}</h4>
                                    <h4>Nature: {product.nature}</h4>
                                    <h4>Item: {product.item}</h4>
                                </div>
                                <div className="move-container">
                                    {product.moves?.map((pm) => (
                                        <h5
                                            key={pm.slot}
                                            className="move-chip"
                                            style={{ background: pm.move?.type?.color_hex || '#444' }}
                                        >
                                            {pm.move?.display_name}
                                        </h5>
                                    ))}
                                </div>
                                <div className="shiny-container">
                                    <h2
                                        className={
                                            product.shiny
                                                ? "shiny"
                                                : "not-shiny"
                                        }
                                    >
                                        {product.shiny ? "Shiny!" : "Not Shiny"}
                                    </h2>
                                </div>
                                <div className="homepage-price-container">
                                    <h3>${product.price}</h3>
                                    <h3>{product.quantity} left!</h3>
                                </div>
                            </NavLink>
                            {currUser && currUser.id === product.user_id ? (
                                <h3 className="user-product">
                                    This is your product!
                                </h3>
                            ) : (
                                currUser && (
                                    <div className="cart-watchlist">
                                        {isInCart ? (
                                            <span className="cart-text">
                                                In Cart
                                            </span>
                                        ) : (
                                            <button
                                                className="cart-button"
                                                onClick={() =>
                                                    handleAddToCart(product.id)
                                                }
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        {
                                            currUser.watchlist ? (
                                                isWatchlisted ? (
                                                    <span className="watchlisted-text">
                                                        Watchlisted
                                                    </span>
                                                ) : (
                                                    <div className="add-to-watchlist-button">
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
                                            ) : null
                                        }
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HomePage;
