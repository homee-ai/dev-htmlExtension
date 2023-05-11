'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from '../../view/mainViewApi.js';
import { SharedView } from "../../widget/sharedView.js";
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

        main {
            padding: 24px 35px 44px;
         
            font-family: 'Noto Sans TC';
            font-style: normal;
            margin: 0;
            box-sizing: border-box;
        }

        `);
    let viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    let vm = {
        empty: true
    };
    let copywriting = [
        {
            name: "title",
            type: "title",
            text: `邀請朋友，獲得 $ ${glitter.share.inviteDiscount}`
        },
        {
            name: "subtitle1",
            type: "subtitle",
            text: `1.您的朋友將獲得200折 $ ${glitter.share.inviteDiscount} 優惠卷`
        },
        {
            name: "subtitle1-text1",
            type: "text",
            text: `需使用您的推薦連結成功註冊帳號，即可於第一筆訂單使用。`
        },
        {
            name: "subtitle2",
            type: "subtitle",
            text: `2.您也將獲得消費200折 $ ${glitter.share.inviteDiscount} 優惠卷`
        },
        {
            name: "subtitle2-text1",
            type: "text",
            text: `當您的朋友完成首張訂單的時候（最低金額 $ 200），您即會獲得 $ ${glitter.share.inviteDiscount} 優惠券。`
        }
    ];
    gvc.addStyle(`
        html{
            overflow-y : auto;
        }
        main{
            width:100%;
            padding-left:19px;
            padding-right:19px;
        }
        .cross{
            
        }
        
    `);
    return {
        onCreateView: () => {
            let topInset = 10;
            let botInset = 10;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data;
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => {
                    return { data: 10 };
                }
            });
            glitter.runJsInterFace("getBotInset", {}, (response) => {
                botInset = response.data;
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => {
                    return { data: 10 };
                }
            });
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
                    <div class="w-100 d-flex" style="padding-right: 26px;padding-top: ${10 + topInset}px;">
                       ${shareView.navigationBar({
                        title: "邀請朋友",
                        leftIcon: `
                            <img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.goBack("main2");
                        })}">`,
                        rightIcon: `<img src="img/customerService.png" style="width: 28px;height: 28px;" onclick="${gvc.event(() => {
                        })}">`
                    })}
                    </div>      
                    <main class="">
                        ${gvc.bindView({
                        bind: "icon",
                        view: () => {
                            return `
                                    <img src="img/inviteLOGO.svg" style="width: 190px;height: 133px;">
                                `;
                        }, divCreate: { class: `d-flex flex-column align-items-center`, style: `padding-top:110px;` }
                    })}
                        ${gvc.bindView({
                        bind: "textGroup",
                        view: () => {
                            let returnHTML = ``;
                            copywriting.forEach((paragraph) => {
                                returnHTML += viewModel.inviteFriendText(paragraph);
                            });
                            return returnHTML;
                        }, divCreate: { class: `d-flex flex-column `, style: `` }
                    })}
                    </main>

                    ${gvc.bindView({
                        bind: "footer",
                        view: () => {
                            gvc.addStyle(`
                                .footerBTN{
                                    border-radius : 8px;
                                    border:1px solid rgb(210,66,123);
                                    font-size : 14px;
                                    font-weight : 700;
                                    padding:15px;
                                }
                                .sharaBTN{
                                    height: 48px;
                                    background: #FD6A58;
                                    border-radius: 24px;
                                    color : white;
                                }
                                .QRBTN{
                                    background-color : white;
                                    color : rgb(210,66,123);
                                    margin-top : 18px;
                                }
                            `);
                            return `
                                <bottom class="w-100 d-flex align-items-center justify-content-center footerBTN sharaBTN">分享優惠連結給朋友</bottom>
                                
                            `;
                        }, divCreate: { class: `d-flex flex-column w-100`, style: `padding:12px 20px ${12 + glitter.share.bottomInset}px;margin-top:auto;position: fixed;bottom:0;left: 0;background: #FFFFFF;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);` }
                    })}
                    
                    
        `;
                },
                divCreate: { class: ``, style: `height:100vh;position:relative;` }
            });
        },
        onResume: function () {
        },
        onCreate: () => {
        }
    };
});
