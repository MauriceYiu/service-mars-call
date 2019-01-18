import React, { Component } from 'react';
import "./navHeader.scss";

class NavHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routeName: "工作人员设置"
        };
        this.changeRoute = this.changeRoute.bind(this);
    }
    render() {
        let { routeName } = this.state;
        let { storeInfo, showSetFreeTime } = this.props;
        let endTime = storeInfo.endTime;
        let date = new Date(endTime);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        let seconds = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        endTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return (
            <div className="nav-header">
                {/* <div className="logo">
                    <img src={storeInfo.logo} alt="" />
                    (到期时间：{endTime}
                </div> */}
                <span className="store-name">
                    {storeInfo.storeName}
                </span>
                <span className="end-time">
                    到期时间：{endTime}
                </span>
                <span className="get-time" onClick={()=>this.props.showPay()}>
                    续期
                </span>
                <div className="setting-emp">
                    <button onClick={() => this.changeRoute()}>{routeName}</button>
                </div>
                {
                    showSetFreeTime ? (
                        <div className="set-free-time">
                            <button onClick={() => this.props.showFreeTime()}>设置</button>
                        </div>
                    ) : ("")
                }
            </div>
        );
    }
    changeRoute() {
        let { pathname } = this.props.history.location;
        if (pathname === "/setEmp") {
            this.props.history.push("/");
        } else {
            this.props.history.push("/setEmp");
        }
    }
    componentDidMount() {
        let { pathname } = this.props.history.location;
        if (pathname === "/setEmp") {
            this.setState({
                routeName: "首页"
            });
        } else {
            this.setState({
                routeName: "工作人员设置"
            });
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default NavHeader;