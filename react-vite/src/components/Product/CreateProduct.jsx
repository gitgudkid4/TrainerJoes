import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as productImageActions from "../../redux/productimage";
import * as pokemonActions from "../../redux/pokemon";
import * as productActions from "../../redux/product";
import { fetchAllMoves } from "../../redux/move";
import { useNavigate } from "react-router-dom";
import "./CreateProduct.css";

const UploadPicture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currUser = useSelector((state) => state.session.user);
    const allPokemon = useSelector((state) => state.pokemon);
    const allMoves = useSelector((state) => Object.values(state.move));

    const [pokemonId, setPokemonId] = useState("");
    const [level, setLevel] = useState("");
    const [ability, setAbility] = useState("");
    const [item, setItem] = useState("");
    const [nature, setNature] = useState("");
    const [game, setGame] = useState("");
    const [shiny, setShiny] = useState(false);
    const [generation, setGeneration] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [moveId1, setMoveId1] = useState("");
    const [moveId2, setMoveId2] = useState("");
    const [moveId3, setMoveId3] = useState("");
    const [moveId4, setMoveId4] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [productImageUrl, setProductImageUrl] = useState("");
    const [productImagePreview, setProductImagePreview] = useState("");
    const [productImageFilename, setProductImageFilename] = useState("");
    const [productImageLoading, setProductImageLoading] = useState(false);
    const [productImageError, setProductImageError] = useState("");

    useEffect(() => {
        const formErrors = {};
        if (!pokemonId) formErrors.pokemon = "Please select a Pokemon";
        if (!level) formErrors.level = "Level is required";
        if (level <= 0 || level > 100) formErrors.level = "Levels are between 1-100";
        if (!ability) formErrors.ability = "Ability is required";
        if (!item) formErrors.item = "Item is required";
        if (!nature) formErrors.nature = "Nature is required";
        if (!game) formErrors.game = "Game is required";
        if (!generation) formErrors.generation = "Generation is required";
        if (generation > 9) formErrors.generation = "There are 9 generations";
        if (!quantity) formErrors.quantity = "Please enter a quantity";
        if (!price) formErrors.price = "Please enter a price";
        if (!description) formErrors.description = "Please enter a description";
        if (description.length > 500) formErrors.description = "Description too long";
        if (!moveId1) formErrors.move_1 = "Please select at least one move";
        if (!productImageUrl) formErrors.productImageUrl = "Please upload an image";
        setErrors(formErrors);
    }, [pokemonId, level, ability, item, nature, game, generation, quantity, price, description, moveId1, productImageUrl]);

    useEffect(() => {
        dispatch(pokemonActions.fetchAllPokemon());
        dispatch(fetchAllMoves());
    }, [dispatch]);

    useEffect(() => {
        if (!currUser) navigate("/");
    }, [currUser, navigate]);

    const fileWrap = (e) => {
        e.stopPropagation();
        const tempFile = e.target.files[0];
        if (tempFile.size > 5000000) {
            setProductImageError("Image exceeds the maximum file size of 5MB");
            setProductImagePreview("");
            setProductImageFilename("");
            return;
        }
        const newFilename = `product_image_${Date.now()}.${tempFile.name.split(".").pop()}`;
        const newFile = new File([tempFile], newFilename, { type: tempFile.type });
        setProductImagePreview(URL.createObjectURL(tempFile));
        setProductImageUrl(newFile);
        setProductImageFilename(newFile.name);
        setProductImageError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (Object.keys(errors).length > 0) return;

        const moveIds = [moveId1, moveId2, moveId3, moveId4]
            .filter(Boolean)
            .map(Number);

        const productData = {
            pokemon_id: parseInt(pokemonId),
            user_id: currUser.id,
            level,
            ability,
            item,
            nature,
            game,
            shiny,
            generation,
            quantity,
            price: parseFloat(price),
            description,
            move_ids: moveIds,
        };

        const newProduct = await dispatch(productActions.postProduct(productData));
        const newProductId = newProduct.id;

        const productImageData = new FormData();
        productImageData.append("img_url", productImageUrl);
        productImageData.append("product_id", newProductId);
        productImageData.append("filename", productImageFilename);

        setProductImageLoading(true);
        await dispatch(productImageActions.postProductImage(productImageData));
        setProductImageLoading(false);

        navigate(`/products/${newProduct.id}`);
    };

    const moveOptions = allMoves.sort((a, b) => a.display_name.localeCompare(b.display_name));

    return (
        <form id="create-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ position: "relative", height: "240px", marginTop: "6px" }}>
                <div className="select-pokemon-container">
                    <label htmlFor="pokemon">Select Pokémon:</label>
                    <select id="pokemon" value={pokemonId} onChange={(e) => setPokemonId(e.target.value)}>
                        <option value="">Select a Pokémon</option>
                        {Object.values(allPokemon).map((pokemon) => (
                            <option key={pokemon.id} value={pokemon.id}>
                                {pokemon.name}
                            </option>
                        ))}
                    </select>
                    {hasSubmitted && errors.pokemon && <span className="error-p">{errors.pokemon}</span>}
                </div>
                <div className="container-label-input-image">
                    <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        name="img_url"
                        onChange={fileWrap}
                        className="input-file-image"
                    />
                    <label htmlFor="product-image-upload" className="image-label">
                        Upload Product Image
                    </label>
                    {hasSubmitted && errors.productImageUrl}
                    {hasSubmitted && productImageError && <span className="error-p">{productImageError}</span>}
                </div>
                {productImagePreview && (
                    <img src={productImagePreview} alt="product image preview" style={{ width: "300px", maxHeight: "200px" }} className="product-image" />
                )}
                {productImageLoading && <p style={{ color: "#999", fontSize: "12px" }}>Uploading product image...</p>}
            </div>

            <div id="info-container">
                <div className="level-ability-container">
                    <div className="level-container">
                        <label>Level:</label>
                        <input type="number" value={level} onChange={(e) => setLevel(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="" />
                        {hasSubmitted && errors.level && <span className="error-p">{errors.level}</span>}
                    </div>
                    <div className="ability-container">
                        <label>Ability:</label>
                        <input type="text" value={ability} onChange={(e) => setAbility(e.target.value)} placeholder="Enter ability" />
                        {hasSubmitted && errors.ability && <span className="error-p">{errors.ability}</span>}
                    </div>
                </div>
                <div className="item-nature-container">
                    <div className="item-container">
                        <label>Item:</label>
                        <input type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Enter held item" />
                        {hasSubmitted && errors.item && <span className="error-p">{errors.item}</span>}
                    </div>
                    <div className="nature-container">
                        <label>Nature:</label>
                        <input type="text" value={nature} onChange={(e) => setNature(e.target.value)} placeholder="Enter nature" />
                        {hasSubmitted && errors.nature && <span className="error-p">{errors.nature}</span>}
                    </div>
                </div>
                <div className="game-generation-container">
                    <div className="game-container">
                        <label>Game:</label>
                        <input type="text" value={game} onChange={(e) => setGame(e.target.value)} placeholder="Enter product's game" />
                        {hasSubmitted && errors.game && <span className="error-p">{errors.game}</span>}
                    </div>
                    <div className="generation-container">
                        <label>Generation:</label>
                        <input type="number" value={generation} onChange={(e) => setGeneration(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="Enter game's generation" />
                        {hasSubmitted && errors.generation && <span className="error-p">{errors.generation}</span>}
                    </div>
                </div>
                <div className="shiny-container">
                    <label>Shiny? </label>
                    <input type="checkbox" checked={shiny} onChange={(e) => setShiny(e.target.checked)} />
                </div>
                <div className="quantity-price-container">
                    <div className="quantity-container">
                        <label>Quantity:</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="" />
                        {hasSubmitted && errors.quantity && <span className="error-p">{errors.quantity}</span>}
                    </div>
                    <div className="value-container">
                        <label>Price:</label>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="" />
                        {hasSubmitted && errors.price && <span className="error-p">{errors.price}</span>}
                    </div>
                </div>
                <div className="description-container">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description (IV and EV for example)" className="description-text" />
                    {hasSubmitted && errors.description && <span className="error-p">{errors.description}</span>}
                </div>
                <div className="moves-container">
                    {[
                        { label: "Move 1 (Required)", value: moveId1, setter: setMoveId1, error: errors.move_1 },
                        { label: "Move 2", value: moveId2, setter: setMoveId2, error: null },
                        { label: "Move 3", value: moveId3, setter: setMoveId3, error: null },
                        { label: "Move 4", value: moveId4, setter: setMoveId4, error: null },
                    ].map(({ label, value, setter, error }, i) => (
                        <div key={i} className={`move-${i + 1}-container`}>
                            <label>{label}:</label>
                            <select value={value} onChange={(e) => setter(e.target.value)}>
                                <option value="">— None —</option>
                                {moveOptions.map((move) => (
                                    <option key={move.id} value={move.id}>
                                        {move.display_name} ({move.type?.name})
                                    </option>
                                ))}
                            </select>
                            {hasSubmitted && error && <span className="error-p">{error}</span>}
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UploadPicture;
