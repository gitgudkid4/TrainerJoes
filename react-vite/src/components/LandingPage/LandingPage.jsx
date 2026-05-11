import "./LandingPage.css";
import { NavLink } from "react-router-dom";
import * as productActions from "../../redux/product";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const LandingPage = () => {
    const dispatch = useDispatch();
    const productsObj = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(productActions.fetchAllProducts());
    }, [dispatch]);

    const featuredProducts = useMemo(() => {
        const all = Object.values(productsObj);
        if (all.length <= 3) return all;
        return [...all].sort(() => Math.random() - 0.5).slice(0, 3);
    }, [productsObj]);

    return (
        <div id="landing-page-container">
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-eyebrow">The Premier Pokemon Marketplace</p>
                    <h1 className="hero-title">Trade Rare &amp; Powerful Pokemon</h1>
                    <p className="hero-subtitle">
                        Buy and sell competitive-ready Pokemon from trainers around the world.
                    </p>
                    <NavLink className="hero-cta" to="/home">
                        Browse All Listings
                    </NavLink>
                </div>
            </section>

            <section className="featured-section">
                <div className="featured-header">
                    <h2 className="featured-title">Featured Listings</h2>
                    <NavLink className="featured-see-all" to="/home">See All →</NavLink>
                </div>
                <div className="featured-grid">
                    {featuredProducts.length === 0 ? (
                        <p className="featured-empty">Loading listings…</p>
                    ) : (
                        featuredProducts.map((product) => {
                            const name =
                                product.pokemon.name.charAt(0).toUpperCase() +
                                product.pokemon.name.slice(1);
                            return (
                                <NavLink
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                    className="featured-card"
                                >
                                    <div className="featured-card-img-wrap">
                                        <img
                                            src={product.pokemon.pokemon_img}
                                            alt={name}
                                            className="featured-card-img"
                                        />
                                        {product.shiny && (
                                            <span className="shiny-badge">✦ Shiny</span>
                                        )}
                                    </div>
                                    <div className="featured-card-body">
                                        <div className="featured-card-types">
                                            <span className={`type-badge ${product.pokemon.type_1.toLowerCase()}`}>
                                                {product.pokemon.type_1}
                                            </span>
                                            {product.pokemon.type_2 && (
                                                <span className={`type-badge ${product.pokemon.type_2.toLowerCase()}`}>
                                                    {product.pokemon.type_2}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="featured-card-name">{name}</h3>
                                        <p className="featured-card-meta">
                                            Lv. {product.level} · {product.game}
                                        </p>
                                        <div className="featured-card-footer">
                                            <span className="featured-card-price">
                                                ${product.price}
                                            </span>
                                            <span className="featured-card-action">
                                                View →
                                            </span>
                                        </div>
                                    </div>
                                </NavLink>
                            );
                        })
                    )}
                </div>
            </section>

            <section className="landing-footer-strip">
                <p>List your own rare Pokemon and reach thousands of trainers.</p>
                <NavLink className="footer-strip-cta" to="/products/upload">
                    Start Selling
                </NavLink>
            </section>
        </div>
    );
};

export default LandingPage;
