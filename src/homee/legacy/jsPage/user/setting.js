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
            margin: 0;
            box-sizing: border-box;
        }
        .logout{
            width: 296px;
            height: 48px;
            background: #FD6A58;
            border-radius: 28px;
            font-weight: 700;
            font-size: 18px;
            line-height: 26px;
            letter-spacing: 0.15em;
            color: #FFFFFF;
        }
        .deleteAccount{
            font-weight: 400;
            font-size: 15px;
            color: #292929;
            margin-top:8px;
        }

        `);
    let viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    let vm = {
        model: [
            {
                img: "img/notify.svg",
                text: "消息通知",
                click: () => {
                    glitter.runJsInterFace("onClickNoti", {}, () => {
                    });
                }
            },
            {
                img: "img/information.svg",
                text: "關於",
                click: () => {
                    glitter.runJsInterFace("about", {}, () => {
                    });
                }
            },
            {
                img: "img/shield.svg",
                text: "隱私",
                click: () => {
                    glitter.runJsInterFace("privacy", {}, () => {
                    });
                }
            },
        ],
        logout: () => {
            glitter.runJsInterFace("logout", {}, (response) => {
            }, {
                webFunction: () => {
                    return {};
                }
            });
        },
        deleteAccount: () => {
            glitter.runJsInterFace("deleteAccount", {}, (response) => {
            }, {
                webFunction: () => {
                    return {};
                }
            });
        }
    };
    let model = undefined;
    return {
        onCreateView: () => {
            let topInset = glitter.share.topInset;
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
                     <div class="w-100 d-flex" style="padding-right: 26px;">
                        ${shareView.navigationBar({
                        title: "設置",
                        leftIcon: `<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.goBack();
                        })}">\``,
                        rightIcon: ``
                    })}
                    </div>
                    <main style="padding-left: 27px;padding-right: 27px;padding-top: 0px;">
                        ${gvc.bindView({
                        bind: "",
                        view: () => {
                            gvc.addStyle(`
                                    .rowText{
                                        font-weight: 500;
                                        font-size: 20px;
                                        line-height: 29px;
                                        color: #292929;                                    
                                    }
                                    .rowBorder{
                                        border-bottom: 1px solid #E0E0E0;
                                    }
                                `);
                            return gvc.map(vm.model.map((rowData, index) => {
                                let border = "";
                                if (index != vm.model.length - 1) {
                                    border = "rowBorder";
                                }
                                return `<div class="d-flex align-items-center ${border} " style="padding:35.5px 0;" onclick="${gvc.event(() => {
                                    rowData.click();
                                })}">
 <img src="${rowData.img}" alt="${rowData.text}" style="width: 35px;height: 32px;margin-right: 16px;">
                                                    <div class="rowText">${rowData.text}</div>
                                                    <img class="ms-auto" src="img/angle-right.svg" alt="右箭頭" style="height: 24px;width: 24px;" >
</div>`;
                            }));
                        }, divCreate: { style: `margin-bottom:24px;`, class: `` }
                    })}
                        <div class="d-flex align-items-center justify-content-center" style=""><button class="logout border-0" onclick="${gvc.event(() => {
                        vm.logout();
                    })}">登出</button></div>
                        <div class="deleteAccount d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                        vm.deleteAccount();
                    })}">刪除帳號</div>
                    </main>
                    
                    `;
                },
                divCreate: { class: ``, style: `` }
            });
        },
        onResume: function () {
        },
        onCreate: () => {
        }
    };
    function initModel() {
        model = [];
    }
});
