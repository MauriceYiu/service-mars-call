/* eslint-disable */
import React, { Component } from 'react';
import "./App.scss";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actions from './../actions/index';
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);     
    this.state = { error: false ,storeId:"",count:0,nowStatus:true};
    this.connect = this.connect.bind(this);
    this.topWindow = this.topWindow.bind(this);
    this.refreshWindow = this.refreshWindow.bind(this);
  }
  render() {
    return (
      <div className="App">
        {this.props.children}
        <div className="refresh-top">
            <span className="iconfont icon-zhiding" onClick={()=>this.topWindow()}></span>
            <span className="iconfont icon-shuaxin" onClick={()=>this.refreshWindow()}></span>
        </div>
      </div>
    );
  }
  refreshWindow(){
    window.location.reload(true);
  }
  topWindow(){
    $(".cont").animate({ scrollTop: 0 }, 500);
  }
  componentDidMount(){
    try {
        console.log(this.props)
        let searchStr = window.location.search.split('?')[1];
        let searchArr = searchStr.split('&');
        let searchObj = {};
        for (var i = 0; i < searchArr.length; i++) {
            var curParam = searchArr[i].split('=');
            searchObj[curParam[0]] = curParam[1];
        }
        this.setState({
            storeId: searchObj.storeId
        });
        // if(!localStorage.getItem("storeId")){
        localStorage.setItem("storeId",searchObj.storeId);
        // }
        this.connect(searchObj.storeId);
    } catch (error) {
        console.log(error);
    }
  }
  connect(storeId){
    let b = new Base64();
    let authStr = 'Basic '+ b.encode("13980547109"+':'+"123456");
    var socket = new SockJS('https://api.huoxingy.com/gs-guide-websocket');
    this.stompClient = Stomp.over(socket);
    let that = this;
    let callList = [];
    // let rewardList = [];
    let status = true;
    this.stompClient.connect({'Auth-Token':authStr}, function (frame) {
        that.stompClient.ws.onerror = function ( evnt ) {
            that.connect(that.state.storeId);
        }
        that.stompClient.ws.onclose = function ( evnt ) {
            that.connect(that.state.storeId);
        }
        that.stompClient.subscribe('/message/'+storeId, async function (event) {
            console.log("我收到了服务器消息");
            let res = JSON.parse(event.body);
            // if(res.source !== "CALL" || res.source !== "REWARD"){
            //     console.log(res.source)
            //     return;
            // }
            if(res.source === "CALL" || res.source === "REWARD"){
                await that.setState({
                    count:that.state.count+res.count
                });
                console.log(that.state.count);
                if ( res.count > 0 ) {
                    // let audio = '<audio style="display:none;" controls="" class="audio" src="https://api.huoxingy.com/v1/pos/speech?tex=请注意'+res.tableNum+'号呼叫'+res.workId+'服务员&vol=9&per=0&spd=5&pit=5" autoplay="autoplay" id="audios"></audio>';
                    // $('.App').append(audio);
                    if(res.source === "CALL"){
                        that.props.actions.setWsStatus({count:that.state.count});
                    }
                    // setTimeout(()=>{
                    //     // $(".audio").remove();
                    // },9000);
                    let newRes = Object.assign({did:false},res);
                    console.log(newRes);
                    // if(callList.length > 2){
                    //     // console.log("dayue")
                    //     return;
                    // }else{
                        callList.push(newRes);
                    // }
                    console.log(callList)
                    let callType = localStorage.getItem("callType");
                    function call(callList,index) {
                        if(callList.length>0 && status){
                            let audio;
                            if(callList[index].source === "CALL"){
                                if(!callType || callType==="empCode"){
                                    audio = '<audio style="display:none;" controls="" class="audio" src="https://api.huoxingy.com/v1/pos/speech?tex=请注意'+callList[index].tableNum+'号请注意'+callList[index].tableNum+'号呼叫'+callList[index].workId+'号&vol=9&per=0&spd=5&pit=5" autoplay="autoplay" id="audios"></audio>';
                                }else{
                                    audio = '<audio style="display:none;" controls="" class="audio" src="https://api.huoxingy.com/v1/pos/speech?tex=请注意'+callList[index].tableNum+'号请注意'+callList[index].tableNum+'号呼叫'+callList[index].empName+'&vol=9&per=0&spd=5&pit=5" autoplay="autoplay" id="audios"></audio>';
                                }
                            }else if(callList[index].source === "REWARD"){
                                let unit;
                                switch (callList[index].productName) {
                                    case "玫瑰花":
                                    unit="朵";
                                    break;
                                    case "跑车":
                                    unit="辆";
                                    break;
                                    case "别墅":
                                    unit="栋";
                                    break;
                                    case "游艇":
                                    unit="只";
                                    break;
                                    case "水晶鞋":
                                    unit="双";
                                    break;
                                    default:
                                    unit="个";
                                    break;
                                }
                                if(!callType || callType==="empCode"){
                                    audio = '<audio style="display:none;" controls="" class="audio" src="https://api.huoxingy.com/v1/pos/speech?tex='+callList[index].tableNum+'号客户机给'+callList[index].empCode+'号打赏'+callList[index].qty+''+unit+''+callList[index].productName+'&vol=9&per=0&spd=5&pit=5" autoplay="autoplay" id="audios"></audio>';
                                }else{
                                    audio = '<audio style="display:none;" controls="" class="audio" src="https://api.huoxingy.com/v1/pos/speech?tex='+callList[index].tableNum+'号客户机给'+callList[index].empName+'打赏'+callList[index].qty+''+unit+''+callList[index].productName+'&vol=9&per=0&spd=5&pit=5" autoplay="autoplay" id="audios"></audio>';
                                }
                            }
                            $('.App').append(audio);
                            status = false;//正在播放
                            $(".audio").on("playing",function () {
                                status = false;//正在播放
                                console.log("正在播放");
                            })
                            $(".audio").on("ended",function () {
                                console.log("播放完毕");
                                this.remove();
                                audio = "";
                                callList.splice(index,1);
                                console.log(callList);
                                status = true;
                                call(callList,0);
                            })
                        }
                    }
                    if(status){
                        setTimeout(()=>{
                            call(callList,0);
                        },1000)
                    }
                    console.log(callList)
                }
            }
            // }else if(res.source === "REWARD"){
            //     if ( res.count > 0 ) {
            //         let unit;
            //         switch (res.productName) {
            //             case "玫瑰花":
            //             unit="朵";
            //             break;
            //             case "跑车":
            //             unit="辆";
            //             break;
            //             case "别墅":
            //             unit="栋";
            //             break;
            //             case "游艇":
            //             unit="只";
            //             break;
            //             case "水晶鞋":
            //             unit="双";
            //             break;
            //             default:
            //             unit="个";
            //             break;
            //         }
            //         let audio = '<audio style="display:none;" controls="" class="audio" src="https://api.huoxingy.com/v1/pos/speech?tex='+res.tableNum+'号客户机给'+res.empCode+'号服务员打赏'+res.qty+''+unit+''+res.productName+'&vol=9&per=0&spd=5&pit=5" autoplay="autoplay" id="audios"></audio>';
            //         $('.App').append(audio);
            //     }
            // }
            
        });
    });
    this.stompClient.ws.onclose = function ( evnt ) {
        setTimeout(()=>{
            that.connect(that.state.storeId); 
        }, 1000);
    }
    this.stompClient.debug = function(str) {
        // console.log(str);
    };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.log(info);
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default withRouter(connect(
    (state)=>({wsStatus:state.wsData}),
    mapDispatchToProps
)(App));
