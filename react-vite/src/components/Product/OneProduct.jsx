import "./OneProduct.css";
import * as productActions from "../../redux/product";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const OneProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();

    const product = useSelector((state) => state.product[productId]);
    const productPokemon = product?.pokemon; // Use optional chaining
    const productName =
        productPokemon?.name.charAt(0).toUpperCase() +
        productPokemon?.name.slice(1);
    const productImage = product?.product_image;

    console.log("product", product);

    useEffect(() => {
        dispatch(productActions.fetchOneProduct(productId));
    }, [dispatch, productId]);

    return (
        <div id="product-page-container">
            <div id="product-container">
                {productPokemon ? (
                    <div className="product-card">
                        <div className="pokemon-name-img-type-container">
                            <h2 className="name-container">{productName}</h2>
                            <img
                                src={productPokemon.pokemon_img}
                                alt={productPokemon.name}
                                className="img_container"
                            />
                            <div className="type-container">
                                <h3
                                    className={`pokemon-type ${productPokemon.type_1.toLowerCase()}`}
                                >
                                    {productPokemon.type_1}
                                </h3>
                                {productPokemon.type_2 && (
                                    <h3
                                        className={`pokemon-type ${productPokemon.type_2.toLowerCase()}`}
                                    >
                                        {productPokemon.type_2}
                                    </h3>
                                )}
                            </div>
                        </div>
                        <div className="info-container">
                            <div className="ability-container">
                                <h2>Ability</h2>
                                <h3>{product.ability}</h3>
                            </div>
                            <div className="item-container">
                                <h2>Held Item</h2>
                                <h3>{product.item}</h3>
                            </div>
                            <div className="nature-container">
                                <h2>Nature</h2>
                                <h3>{product.nature}</h3>
                            </div>
                        <div className='moves-container'>
                            <h3>{product.move_1}</h3>
                            <h3>{product.move_2}</h3>
                            <h3>{product.move_3}</h3>
                            <h3>{product.move_4}</h3>
                        </div>
                        </div>
                        <div className="game-data-container">
                            <div className="name-container">
                                <h2>Current Game</h2>
                                <h3>
                                    {product.game} (gen {product.generation})
                                </h3>
                            </div>
                            <div className="description-image-container">
                                <span className="description">
                                    {product.description}
                                </span>
                                <img
                                    className="description-image"
                                    src={productImage[0].img_url}
                                ></img>
                            </div>
                        </div>
                        <div className="quantity-price-container">
                            <h2 className="price-container">
                                ${product.price}
                            </h2>
                            {/* <h2 className="quantity-container">
                                {product.quantity}
                            </h2> */}
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default OneProduct;
