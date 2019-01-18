import React, { Component } from 'react';
import "./pay.scss";
import { getOrderId, getCode, isPaySuc } from "./../../api/indexApi";
import alertMessage from "./../../utils/alertMessage";

class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titInfo: "请您选择付款方式",
            showPayCode: false,
            payCodeImg: "",
            nowCountTime: "3:00",
            orderId: "",
            amount: 0,
            paySuc: false
        };
        this.goPay = this.goPay.bind(this);
        this.countDown = this.countDown.bind(this);
        this.rotationPay = this.rotationPay.bind(this);
        this.payFinish = this.payFinish.bind(this);
    }
    render() {
        let { titInfo, showPayCode, payCodeImg, nowCountTime, amount } = this.state;
        return (
            <div className="pay" onClick={() => { this.setState({ showPayCode: false }); this.props.hidePay() }}>
                <div className="pay-wrap" onClick={(e) => e.stopPropagation()}>

                    <div className="pay-tit">
                        {titInfo}
                        {
                            showPayCode ? (
                                <React.Fragment>
                                    <span className="clock">{nowCountTime}</span>
                                    <span className="left arrow-back" onClick={() => this.setState({ showPayCode: false })}>返回上级</span>
                                </React.Fragment>
                            ) : ("")
                        }
                    </div>
                    <div className="pay-count">
                        <span>续期费用：￥</span><b>{amount}</b>
                    </div>
                    {
                        showPayCode ? (
                            <div className="pay-code">
                                <div className="pay-code-tit">请您及时付款，倒计时结束后，该码将失效。</div>
                                <div className="code">
                                    <img src={payCodeImg} alt="" />
                                </div>
                                <div className="close-button">
                                    <button onClick={() => this.payFinish()}>支付完成</button>
                                </div>
                            </div>
                        ) : (
                                <div className="sel-pay-type">
                                    <span className="pay-type ali" onClick={() => this.goPay("ali")}>
                                        <div className="icont-wrap">
                                            <i className="iconfont icon-zhifubao"></i>
                                            <span className="pay-name">支付宝</span>
                                        </div>
                                    </span>
                                    <span className="pay-type wechat" onClick={() => this.goPay("wechat")}>
                                        <div className="icont-wrap">
                                            <i className="iconfont icon-weixin"></i>
                                            <span className="pay-name">微信</span>
                                        </div>
                                    </span>
                                </div>
                            )
                    }
                </div>
            </div>
        );
    }
    // 支付
    async goPay(payType) {
        if (payType === "ali") {
            this.setState({
                titInfo: "支付宝支付"
            });
        } else {
            this.setState({
                titInfo: "微信支付"
            });
        }
        // 生成订单，拿到支付二维码
        let type = payType === "ali" ? true : false;
        try {
            if (this.state.orderId) {
                try {
                    let resForCode = await getCode(this.state.orderId, type);
                    this.setState({
                        payCodeImg: resForCode.data.url,
                        showPayCode: true
                    });
                    this.countDown();
                    let payStatus;//是否支付成功
                    this.payTimer = setInterval(async () => {
                        payStatus = await this.rotationPay(this.state.orderId);
                        if (payStatus) {
                            clearInterval(this.payTimer);
                            clearInterval(this.countTimer);
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 500);
                        }
                    }, 1500);
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    // 支付轮询
    async rotationPay(id) {
        try {
            let res = await isPaySuc(id);
            if (res.status === 200) {
                console.log(res);
                //201支付中，轮询
                if (res.data.code === 201) {
                    return false;
                } else if (res.data.code === 200) {
                    alertMessage.success("支付成功");
                    this.setState({
                        showPayCode: false,
                        paySuc: true,
                        payCodeImg: ""
                    });
                    this.props.hidePay()
                    return true;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    //倒计时
    countDown() {
        let maxTime = 60 * 3;//三分钟
        let nowCountTime;
        this.countTimer = setInterval(() => {
            if (maxTime >= 0) {
                let minutes = Math.floor(maxTime / 60);
                let seconds = Math.floor(maxTime % 60);
                seconds = seconds < 10 ? "0" + seconds : seconds;
                nowCountTime = `${minutes}:${seconds}`;
                this.setState({
                    nowCountTime
                });
                --maxTime;
            } else {
                clearInterval(this.countTimer);
                this.setState({
                    showPayCode: false,
                    nowCountTime: "3:00"
                });
            }
        }, 1000);
    }
    async payFinish() {
        if (!this.state.paySuc) {
            alertMessage.warning("还未支付成功，请等待。");
            return;
        }
        await this.setState({ showPayCode: false, paySuc: true });
        this.props.hidePay()
    }
    componentDidUpdate() {
        // 如果当前有支付轮询，那么关闭支付框后，应该停止轮询
        if (!this.state.showPayCode) {
            clearInterval(this.payTimer);
            clearInterval(this.countTimer);
        }
    }
    async componentDidMount() {
        try {
            let storeId = localStorage.getItem("storeId");
            let res = await getOrderId(storeId);
            if (res.data.id) {
                this.setState({
                    orderId: res.data.id,
                    amount: res.data.amount
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    componentWillUnmount() {
        clearInterval(this.payTimer);
        clearInterval(this.countTimer);
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default Pay;