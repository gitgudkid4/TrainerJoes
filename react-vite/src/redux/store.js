import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import productsReducer from "./product";
import pokemonReducer from "./pokemon";
import watchlistReducer from "./watchlist";
import cartReducer from "./cart";
import reviewsReducer from "./review";
import moveReducer from "./move";

const rootReducer = combineReducers({
  session: sessionReducer,
  product: productsReducer,
  pokemon: pokemonReducer,
  watchlist: watchlistReducer,
  cart: cartReducer,
  review: reviewsReducer,
  move: moveReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
