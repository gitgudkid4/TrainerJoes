const SET_MOVES = 'moves/SET_MOVES';

const setMoves = (moves) => ({ type: SET_MOVES, moves });

export const fetchAllMoves = () => async (dispatch) => {
    const res = await fetch('/api/moves/');
    if (res.ok) {
        const data = await res.json();
        dispatch(setMoves(data));
    }
};

const initialState = {};

const moveReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MOVES: {
            const normalized = {};
            action.moves.forEach((move) => {
                normalized[move.id] = move;
            });
            return normalized;
        }
        default:
            return state;
    }
};

export default moveReducer;
