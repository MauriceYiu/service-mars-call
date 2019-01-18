import React, { Component } from 'react';
import "./index.scss";
import NavHeader from "./../../components/navHeader/navHeader";
import Pay from "./../../components/pay/pay";
import { getEmpData, callEmpFinish } from "./../../api/indexApi";
import dateUtil from "./../../utils/date";
import { connect } from "react-redux";
import InfiniteScroll from 'react-infinite-scroller';


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId: "",
            empList: [],//员工列表
            storeInfo: {
                storeName: "",
                logo: "",
                endTime: ""
            },
            count: 0,//ws次数
            showPay: false,
            hasMore: true,
            page: 0,
            totalPage: 0,
            size: 50
        };
        this.getEmp = this.getEmp.bind(this);
        this.loadFunc = this.loadFunc.bind(this);
        this.finish = this.finish.bind(this);
    }
    render() {
        let { empList, storeInfo, showPay, storeId, hasMore } = this.state;
        return (
            <div className="index">
                <NavHeader showSetFreeTime={false} storeInfo={storeInfo} history={this.props.history} showPay={() => this.setState({ showPay: true })} />
                <div className="list-warp">
                    <table className="table-tit" width="100%">
                        <thead>
                            <tr width="100%">
                                <th width="15.5%">头像</th>
                                <th width="19%">呼叫机号</th>
                                <th width="19%">呼叫时间</th>
                                <th width="27.5%">呼叫服务员</th>
                                <th width="19%">呼叫状态</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="cont" ref={(ref) => this.scrollParentRef = ref}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadFunc}
                            hasMore={hasMore}
                            useWindow={false}
                            getScrollParent={() => this.scrollParentRef}
                            initialLoad={false}
                        >
                            <table className="table-cont" width="100%">

                                <tbody>

                                    {
                                        empList.map((item, index) => {
                                            return (
                                                <tr width="100%" key={index}>
                                                    <td width="15.5%" className="avatar-td">
                                                        <span className="avatar">
                                                            <img src={item.picture} alt="" />
                                                        </span>
                                                    </td>
                                                    <td width="19%" >{item.tableNum}</td>
                                                    <td width="19%" className="time">{dateUtil(item.callTime)}</td>
                                                    <td width="27.5%" >{item.empName}</td>
                                                    <td width="19%" className={item.busy ? "is-busy busy" : "is-busy"} onClick={() => this.finish(item)}>{item.busy ? "未处理" : "已处理"}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </InfiniteScroll>
                        {
                            !hasMore || empList.length === 0 || empList.length < 50 ? (
                                <div className="loader">加载完毕</div>
                            ) : (<div className="loader">加载中...</div>)
                        }
                    </div>
                </div>
                {
                    showPay ? (
                        <Pay hidePay={() => this.setState({ showPay: false })} storeId={storeId} />
                    ) : ("")
                }
            </div>
        );
    }
    componentDidMount() {
        this.getEmp(0, this.state.size);
    }
    async finish(item) {
        if (!item.busy) {
            return;
        }
        try {
            let res = await callEmpFinish(item.id);
            console.log(res);
            this.getEmp(0, this.state.size);
        } catch (error) {
            console.log(error);
        }
    }
    async getEmp(page, size) {
        console.log(this.props);
        let storeId = localStorage.getItem("storeId");
        try {
            if (page === 0) {
                let res = await getEmpData(storeId, page, size);
                let storeInfo = {
                    storeName: res.data.name,
                    logo: res.data.logo,
                    endTime: res.data.callEndTime
                };
                this.setState({
                    empList: res.data.data.content ? res.data.data.content : [],
                    storeInfo,
                    storeId,
                    totalPage: res.data.data.totalPages
                });
                localStorage.setItem("storeInfo", JSON.stringify(storeInfo));
            } else {
                let res = await getEmpData(storeId, page, size);
                let storeInfo = {
                    storeName: res.data.name,
                    logo: res.data.logo,
                    endTime: res.data.callEndTime
                };
                this.setState({
                    empList: res.data.data.content ? this.state.empList.concat(res.data.data.content) : this.state.empList.concat([]),
                    storeInfo,
                    storeId,
                    totalPage: res.data.data.totalPages
                });
                localStorage.setItem("storeInfo", JSON.stringify(storeInfo));
            }

        } catch (error) {
            console.log(error);
        }
    }
    // 加载更多
    loadFunc() {
        setTimeout(() => {
            let { page, totalPage, size } = this.state;
            page++;
            if (page <= totalPage) {
                this.getEmp(page, size);
                this.setState({
                    hasMore: true,
                    page
                });
                console.log(page);
                if (page === totalPage) {
                    this.setState({
                        hasMore: false
                    });
                }
            } else {
                return;
            }
        }, 100);
    }
    componentDidUpdate() {
        console.log(this.props);
        if (this.props.wsStatus.count !== this.state.count) {
            this.getEmp(0, this.state.size);
            this.setState({
                count: this.props.wsStatus.count
            });
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default connect(
    state => ({ wsStatus: state.wsData })
)(Index);