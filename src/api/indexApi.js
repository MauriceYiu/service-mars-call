import instance from "./index";

//首页获取员工列表
export const getEmpData = (storeId, page, size) => {
    return instance({
        url: "get-empCall",
        method: "GET",
        params: {
            storeId,
            page,
            size
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


//设置员工页面获取员工列表
export const getEmpDataForSet = (storeId) => {
    return instance({
        url: "get-emp",
        method: "GET",
        params: {
            storeId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}
// 设置员工上下班
export const setEmpWorkStatus = (empId, status) => {
    return instance({
        url: "update-work",
        method: "POST",
        data: {
            empId,
            work: status
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 完成呼叫服务员接口

export const callEmpFinish = (empId) => {
    return instance({
        url: "call-finish",
        method: "GET",
        params: {
            id: empId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 设置呼叫空闲时间

export const setFreeTime = (storeId, second) => {
    return instance({
        url: "set-call",
        method: "POST",
        data: {
            storeId,
            second
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


// 获取呼叫续费订单

export const getOrderId = (storeId) => {
    return instance({
        url: "set-callPay",
        method: "POST",
        data: {
            storeId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 获取支付二维码

export const getCode = (id, type) => {
    return instance({
        url: "callService/scan-code",
        method: "POST",
        data: {
            id,
            type
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


// 获取支付二维码

export const isPaySuc = (id) => {
    return instance({
        url: "rotation-tran",
        method: "GET",
        params: {
            id
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}