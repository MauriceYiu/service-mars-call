import * as actionTypes from "./../constants";

// 获取ws
export const setWsStatus = (info) => {
    return {
        type: actionTypes.RECEIVE_WS,
        data: info
    }
}