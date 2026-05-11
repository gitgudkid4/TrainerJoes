import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import * as productActions from "../../redux/product";
import * as productImageActions from "../../redux/productimage";
import { fetchAllMoves } from "../../redux/move";
import "./EditProduct.css";
import { useEffect, useState } from "react";

const EditProduct = ({ productId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const product = useSelector((state) => state.product[productId]);
    const allMoves = useSelector((state) => Object.values(state.move));
    const productImage = product?.product_image?.[0];
    const productImageId = productImage?.id;

    const [level, setLevel] = useState("");
    const [item, setItem] = useState("");
    const [game, setGame] = useState("");
    const [generation, setGeneration] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
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
        if (!level) formErrors.level = "Level is required";
        if (level <= 0 || level > 100) formErrors.level = "Levels are between 1-100";
        if (!item) formErrors.item = "Item is required";
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
    }, [level, item, game, generation, quantity, price, description, moveId1, productImageUrl]);

    useEffect(() => {
        dispatch(productActions.fetchOneProduct(productId));
        dispatch(fetchAllMoves());
    }, [dispatch, productId]);

    useEffect(() => {
        if (product) {
            setLevel(product.level);
            setItem(product.item);
            setGame(product.game);
            setGeneration(product.generation);
            setPrice(product.price);
            setDescription(product.description);
            setQuantity(product.quantity);
            const sorted = [...(product.moves || [])].sort((a, b) => a.slot - b.slot);
            setMoveId1(sorted[0]?.move?.id || "");
            setMoveId2(sorted[1]?.move?.id || "");
            setMoveId3(sorted[2]?.move?.id || "");
            setMoveId4(sorted[3]?.move?.id || "");
        }
        if (productImage) {
            setProductImageUrl(productImage.img_url);
            setProductImageFilename(productImage.filename);
            setProductImagePreview(productImage.img_url);
        }
    }, [product, productImage]);

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
            level,
            item,
            game,
            generation,
            price,
            quantity,
            description,
            move_ids: moveIds,
        };

        dispatch(productActions.putProduct(productData, productId));

        if (productImageUrl) {
            const updatedProductImageData = new FormData();
            updatedProductImageData.append("product_image_url", productImageUrl);
            updatedProductImageData.append("product_id", productId);
            updatedProductImageData.append("filename", productImageFilename);
            setProductImageLoading(true);
            await dispatch(productImageActions.putProductImage(productImageId, updatedProductImageData));
            setProductImageLoading(false);
        }

        await dispatch(productActions.fetchOneProduct(productId));
        closeModal();
    };

    const moveOptions = allMoves.sort((a, b) => a.display_name.localeCompare(b.display_name));

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" id="edit-form-container">
            <div style={{ position: "relative", height: "240px", marginTop: "6px" }}>
                <div className="container-label-input-image">
                    <input id="product-image-upload" type="file" accept="image/*" name="img_url" onChange={fileWrap} className="input-file-image" />
                    <label htmlFor="product-image-upload" className="image-label">Upload Product Image</label>
                    {hasSubmitted && errors.productImageUrl}
                    {hasSubmitted && productImageError && <span>{productImageError}</span>}
                </div>
                {productImagePreview && (
                    <img src={productImagePreview} alt="product image preview" style={{ width: "300px", maxHeight: "200px" }} className="product-image" />
                )}
                {productImageLoading && <p style={{ color: "#999", fontSize: "12px" }}>Uploading product image...</p>}
            </div>
            <div id="info-container">
                <div className="level-item-container">
                    <div className="edit-level-container">
                        <label>Level:</label>
                        <input type="number" value={level} onChange={(e) => setLevel(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="" />
                        {hasSubmitted && errors.level && <span>{errors.level}</span>}
                        {hasSubmitted && productImageError && <span>{productImageError}</span>}
                    </div>
                    <div className="edit-item-container">
                        <label>Item:</label>
                        <input type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Enter held item" />
                        {hasSubmitted && errors.item && <span>{errors.item}</span>}
                    </div>
                </div>
                <div className="game-generation-container">
                    <div className="game-container">
                        <label>Game:</label>
                        <input type="text" value={game} onChange={(e) => setGame(e.target.value)} placeholder="Enter product's current game" />
                        {hasSubmitted && errors.game && <span>{errors.game}</span>}
                    </div>
                    <div className="generation-container">
                        <label>Generation:</label>
                        <input type="number" value={generation} onChange={(e) => setGeneration(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="Enter game's generation" />
                        {hasSubmitted && errors.generation && <span>{errors.generation}</span>}
                    </div>
                </div>
                <div className="quantity-price-container">
                    <div className="quantity-container">
                        <label>Quantity:</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="" />
                        {hasSubmitted && errors.quantity && <span>{errors.quantity}</span>}
                    </div>
                    <div className="value-container">
                        <label>Price:</label>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="" />
                        {hasSubmitted && errors.price && <span>{errors.price}</span>}
                    </div>
                </div>
                <div className="description-container">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description (IV and EV for example)" />
                    {hasSubmitted && errors.description && <span>{errors.description}</span>}
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
                            {hasSubmitted && error && <span>{error}</span>}
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default EditProduct;
