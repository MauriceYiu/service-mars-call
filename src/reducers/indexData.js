import * as actionTypes from "./../constants";

const initialStateForWS = {
    count:0
};
export const wsData = (state = initialStateForWS, action) => {
    switch (action.type) {
        case actionTypes.RECEIVE_WS:
            return { ...action.data
            };
        default:
            return state;
    }
}