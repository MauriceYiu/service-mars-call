import React, { Component } from 'react';
import "./setEmp.scss";
import NavHeader from "./../../components/navHeader/navHeader";
import Pay from "./../../components/pay/pay";
import { getEmpDataForSet, setEmpWorkStatus, setFreeTime } from "./../../api/indexApi";
import { Select } from 'antd';
import alertMessage from "./../../utils/alertMessage";

const Option = Select.Option;


class SetEmp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empList: [],
            storeId: "",
            storeInfo: {
                storeName: "",
                logo: "",
                endTime: ""
            },
            showFreeTime: false,
            nowFreeTime: 20,//呼叫空闲时间
            showPay: false,
            callType: "empCode"//设置呼叫模式员工工号或员工名字
        };
        this.changeEmpWorkStatus = this.changeEmpWorkStatus.bind(this);
        this.getEmpData = this.getEmpData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForCallType = this.handleChangeForCallType.bind(this);
    }
    render() {
        let { empList, storeInfo, showFreeTime, showPay, storeId, nowFreeTime, callType } = this.state;
        return (
            <div className="set-emp">
                <NavHeader showPay={() => this.setState({ showPay: true })} showSetFreeTime={true} showFreeTime={() => this.setState({ showFreeTime: true })} storeInfo={storeInfo} history={this.props.history} />
                <div className="list-warp">
                    <table className="table-tit" width="100%">
                        <thead>
                            <tr width="100%">
                                <th width="33.33333%">员工姓名</th>
                                <th width="33.33333%">员工状态</th>
                                <th width="33.33333%">员工工号</th>
                                {/* <th width="25%">操作</th> */}
                            </tr>
                        </thead>
                    </table>
                    <div className="cont">
                        <table className="table-cont" width="100%">
                            <tbody>
                                {
                                    empList.map((item, index) => {
                                        return (
                                            <tr width="100%" key={index}>
                                                <td width="33.33333%">{item.name}</td>
                                                <td width="33.33333%" className={item.work ? "change-status" : "change-status out-work"} onClick={() => this.changeEmpWorkStatus(item)}>{item.work ? "上班" : "下班"}</td>
                                                <td width="33.33333%">{item.code}</td>
                                                {/* <td width="25%" onClick={() => this.changeEmpWorkStatus(item)} className="change-status">{!item.work ? "上班" : "下班"}</td> */}
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    showFreeTime ? (
                        <div className="free-time-mask" onClick={() => this.setState({ showFreeTime: false })}>
                            <div className="free-time-wrap" onClick={(e) => e.stopPropagation()}>
                                <div className="tit">请选择呼叫自动空闲时间</div>
                                <Select defaultValue={nowFreeTime + ""} firstActiveValue={nowFreeTime + ""} defaultActiveFirstOption={false} value={nowFreeTime + ""} style={{ width: 120 }} onChange={(value) => this.handleChange(value)}>
                                    <Option value="20">20s</Option>
                                    <Option value="30">30s</Option>
                                    <Option value="40">40s</Option>
                                    <Option value="50">50s</Option>
                                    <Option value="60">60s</Option>
                                </Select>
                                <div className="tit">请选择语音播放工号/名字</div>
                                <Select defaultValue={callType + ""} firstActiveValue={callType + ""} defaultActiveFirstOption={false} value={callType + ""} style={{ width: 120 }} onChange={(value) => this.handleChangeForCallType(value)}>
                                    <Option value="empCode">员工工号</Option>
                                    <Option value="empName">员工姓名</Option>
                                </Select>
                                <div><button onClick={() => this.changeFreeTime()}>确定</button></div>
                            </div>
                        </div>
                    ) : ("")
                }
                {
                    showPay ? (
                        <Pay hidePay={() => this.setState({ showPay: false })} storeId={storeId} />
                    ) : ("")
                }
            </div>
        );
    }
    componentDidMount() {
        let storeId = localStorage.getItem("storeId");
        let callType = localStorage.getItem("callType") ? localStorage.getItem("callType") : "empCode";
        let storeInfo;
        if (localStorage.getItem("storeInfo")) {
            storeInfo = JSON.parse(localStorage.getItem("storeInfo"));
        } else {
            this.props.history.push("/");
        }
        this.setState({
            storeId,
            storeInfo,
            callType
        });
        this.getEmpData(storeId);
    }

    async changeFreeTime() {
        let { storeId, nowFreeTime, callType } = this.state;
        try {
            localStorage.setItem("callType", callType);
            let res = await setFreeTime(storeId, nowFreeTime);
            console.log(res);
            if (res.data.result.code === 200) {
                alertMessage.success(res.data.result.msg)
                this.setState({
                    showFreeTime: false
                });
                this.getEmpData(this.state.storeId);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async getEmpData(storeId) {
        try {
            let res = await getEmpDataForSet(storeId);
            this.setState({
                empList: res.data.data,
                nowFreeTime: res.data.second
            });
        } catch (error) {
            console.log(error);
        }
    }
    handleChange(value) {
        console.log(value);
        this.setState({
            nowFreeTime: value
        });
    }
    handleChangeForCallType(value) {
        console.log(value);
        this.setState({
            callType: value
        });
    }
    async changeEmpWorkStatus(item) {
        try {
            let status = item.work ? false : true;
            let res = await setEmpWorkStatus(item.id, status);
            if (res.status === 200) {
                this.getEmpData(this.state.storeId);
            }
        } catch (error) {
            console.log(error);
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default SetEmp;