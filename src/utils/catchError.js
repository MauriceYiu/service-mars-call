import alertMessage from "./alertMessage";

let errInfo = '';

export default function (error) {
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        switch (error.response.status) {
            case 401:
                // window.location.href = window.location.href.split('#')[0] + '#/login';
                errInfo = "帐号失效，请重新登录";
                // window.location.href = "/";
                break;
            case 403:
                errInfo = "权限不足";
                break;
            case 404:
                errInfo = "页面不存在";
                break;
            case 400:
                errInfo = error.response.data.message ? error.response.data.message : (error.response.data ? error.response.data : "系统繁忙");
                break;
            case 500:
                errInfo = "系统错误";
                break;
            default:
                errInfo = error.response.data.message ? error.response.data.message : "系统繁忙";
                break;
        }
        alertMessage.error(errInfo);
        return Promise.reject(error);
    } else {
        console.log('Error', error.message);
    }
}