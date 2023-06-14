'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from '../../view/userProfile.js';
import { SharedView } from "../../widget/sharedView.js";
import { OrderNotice } from "../../api/orderNotice.js";
init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Bold.otf);
            font-weight: bold;
        }

        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Regular.otf);
            font-weight: normal;
        }

        html {
            width: 100%;
            height: 100%;
            
        }

        body {
            width: 100%;
            height: 100%;
     
        }
        .union{
            background: #FFFFFF;
            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);        
        }

        main {                   
            font-family: 'Noto Sans TC';
            margin: 0;
         
            background: #FFFFFF;

        }
        
        .top-row{
            padding : 16px 24px 0px;
            border-radius: 50px 50px 0 0;   
            
            background: #FFFFFF;
            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
        }
        .noticeText{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 17px;
            
            color: #858585;
        }


        
        `);
    let viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    let vm = {
        loading: false,
        model: {
            eggs: [],
            orderNotice: [],
        }
    };
    let model = undefined;
    let top = 63 + glitter.share.topInset - 40;
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
                    <div class="w-100 d-flex justify-content-end" style="padding-top: ${top}px;padding-right: 45px;background: transparent" onclick=" ${gvc.event(() => {
                        glitter.closeDiaLog("noticeList");
                    })}">
                        <img src="img/sample/dialog/union.svg" style="" alt="union">
                    </div>
                    <div class="top-row" style="height: calc(100vh - ${top}px)">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="noticeText">訂單更新通知</div>
                            ${gvc.bindView({
                        bind: "readBTN",
                        view: () => {
                            gvc.addStyle(`
                                        .unReadText {
                                            font-family: 'Noto Sans TC';
                                            font-style: normal;
                                            font-weight: 400;
                                            font-size: 12px;
                                            line-height: 17px;
                                            text-align: right;
                                            color: #FD6A58;
                                        }
                                    `);
                            let unReadMessage = 0;
                            glitter.runJsInterFace("getUnReadMessageCount", {}, (response) => {
                                unReadMessage = (response.data);
                            }, {
                                webFunction: () => {
                                    return { data: 0 };
                                }
                            });
                            return `
                                        <div class="unReadText " onclick="${gvc.event(() => {
                                glitter.runJsInterFace("ReadMessage", {}, (response) => {
                                    gvc.notifyDataChange('readBTN');
                                }, {
                                    webFunction: () => {
                                        alert("OKK");
                                    }
                                });
                            })}">全部已讀(${unReadMessage})</div>
                                    `;
                        },
                        divCreate: { style: ``, class: `` }
                    })}
                        </div>
                        ${gvc.bindView({
                        bind: "messageGroup",
                        view: () => {
                            let returnHTML = ``;
                            gvc.addStyle(`
                                    .noticeCard{
                                        padding:16px 24px; 
                                        border-bottom:1px solid #D6D6D6;
                                    }
                                    .noticeTitle{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 18px;
                                        line-height: 26px;
                                        color: #292929;
                                        margin-bottom:4px;
                                    }
                                    .noticeText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 14px;
                                        line-height: 150%;
                                        color : #858585;
                                        word-break : break-all;
                                        white-space : normal;
                                        margin-bottom : 8px;
                                    }
                                    .noticeID{
                                        color:#FD6A58;
                                    }
                                    .noticeDate{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                        color: #D6D6D6;
                                    }
                                `);
                            vm.model.orderNotice.forEach((orderDetail) => {
                                console.log(orderDetail);
                                let statusMap = ["付款已確認", "商品已出貨", "商品已送達"];
                                let statusTextMap = ["的包裹已抵達", "已順利出貨", "的付款已確認，我們會盡快為您出貨，敬請期待囉！"];
                                let dot = (orderDetail.read) ? "transparent" : "#FD6A58";
                                returnHTML += `
                                        <div class="w-100 d-flex flex-column noticeCard">
                                            <div class="noticeTitle" style="position: relative">
                                                <div style="background: ${dot};width: 8px;height: 8px;position: absolute;left: -16px;top: 10px;border-radius: 50%;"></div>
                                                ${statusMap[orderDetail.status]}
                                            </div>
                                            <div class="noticeText">
                                                訂單 <span class="noticeID">#${orderDetail.id}</span> ${statusTextMap[orderDetail.status]}
                                            </div>
                                            <div class="noticeDate">
                                                ${orderDetail.date}
                                            </div>
                                        </div>
                                    `;
                            });
                            return returnHTML;
                        },
                        divCreate: { class: ``, style: `` }
                    })}
                    </div>
                    
                `;
                },
                divCreate: { class: `outside`, style: `background-color:transparent;padding-top:${top})` }
            });
        },
        onResume: function () {
        },
        onCreate: () => {
            if (!vm.loading) {
                const orderNoticeAPI = new OrderNotice(gvc.glitter);
                orderNoticeAPI.getOrderNotice((response) => {
                    vm.loading = true;
                    vm.model.orderNotice = response;
                    gvc.notifyDataChange("messageGroup");
                });
            }
        }
    };
});
