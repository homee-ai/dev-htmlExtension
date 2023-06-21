'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { appConfig } from "../config.js";
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { Dialog } from "../dialog/dialog-mobile.js";
Plugin.create(import.meta.url, (glitter) => {
    return {
        nav: {
            defaultData: {
                topInset: 10,
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (widget.data.topInset != response.data) {
                                widget.data.topInset = response.data;
                                widget.refreshComponent();
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        return `
                            <div class="w-100 d-flex" style="padding-right: 26px;padding-top: ${10 + widget.data.topInset}px;">
                                ${gvc.bindView(() => {
                            var noticeCount = 0;
                            glitter.runJsInterFace("setNotificationBadgeCallBack", {}, (response) => {
                                noticeCount = parseInt(response.data, 10);
                                gvc.notifyDataChange('notification');
                            });
                            return {
                                bind: `notification`,
                                view: () => {
                                    return ` 
                                            <img class="ms-auto" src="${new URL(`../img/component/notification.svg`, import.meta.url)}" alt="" onclick="${gvc.event(() => {
                                        glitter.runJsInterFace("noticeBell", {}, () => {
                                        });
                                    })}">
                                            ${(noticeCount > 0) ? `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${noticeCount}</div>` : ``}
                                     `;
                                },
                                divCreate: { class: `ms-auto position-relative` },
                                onCreate: () => {
                                }
                            };
                        })}
                                <img  src = "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1676918883480" alt="" style="margin-left: 20px;width: 28px;height: 28px;" onclick="${gvc.event(() => {
                            appConfig().changePage(gvc, "system_setting", {});
                        })}">
                            </div>
                        `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        information: {
            defaultData: {
                userData: {
                    user_id: 12052350,
                    last_name: "Rdtest",
                    first_name: "Rdtes22t",
                    name: "Rdtest Rd",
                    photo: "https://prd-homee-api-public.s3.amazonaws.com/scene/12577227/headPhoto.png",
                    AUTH: ""
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                const vm = {
                    data: {},
                    loading: true
                };
                appConfig().getUserData({
                    callback: (response) => {
                        vm.data = response;
                        vm.loading = false;
                    }
                });
                return {
                    view: () => {
                        return `
                        ${gvc.bindView({
                            dataList: [{ obj: vm, key: 'loading' }],
                            bind: "baseUserInf",
                            view: () => {
                                var _a, _b;
                                if (vm.loading) {
                                    return ``;
                                }
                                return `
                                <div class="d-flex align-items-center">
                                    <div class="d-flex position-relative">
                                        <img src="${(_a = vm.data.photo) !== null && _a !== void 0 ? _a : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${vm.data.last_name}&txtfont=Helvetica&txtalign=middle,center`}" style="width: 88px;height: 88px;left: 8px;top: 0px;border-radius: 50%">
                                        <img src="${new URL(`../img/component/edit.svg`, import.meta.url)}" style="position: absolute;right: 0;bottom: 0;" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, "user_edit_Profile");
                                })}">
                                    </div>
                                    <div class="d-flex flex-column justify-content-center align-baseline" style="margin-left: 32px;">
                                        <div class="d-flex">
                                            <div class="last-name">${vm.data.last_name}</div><div class="first-name">${vm.data.first_name}</div>
                                        </div>
                                        <div class="name">
                                            ${(_b = vm.data) === null || _b === void 0 ? void 0 : _b.name}
                                        </div>
                                    </div>
                                </div>
                                `;
                            },
                            divCreate: { style: `margin : 40px 0;padding : 0 27px;` }
                        })}   
                        
                        `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        funRow: {
            defaultData: {
                left: "我的訂單",
                right: "查看全部",
                click: () => {
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                var _a;
                widget.data.background = (_a = widget.data.background) !== null && _a !== void 0 ? _a : "#FBF9F6";
                return {
                    view: () => {
                        gvc.addStyle(`
                            .serviceRow{
                                padding : 0px 20px;
                                gap : 8px;
                                           
                                height : 68px;
                                
                                background : #FBF9F6;
                                border-radius : 20px;
                                
                                margin-bottom : 12px;
                            }      
                            .leftText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 16px;
                                line-height: 23px;
                                
                                /* HOMEE black */
                
                                color: #292929;
                
                            }   
                            .rightText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 13px;
                                line-height: 14px;
                                /* identical to box height, or 108% */
                                
                                
                                /* HOMEE dark grey */
                                
                                color: #858585;
                
                            }   
                        `);
                        return `
                        <div class="d-flex align-items-center  w-100 serviceRow" style="background: ${widget.data.background}" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc, widget, clickEvent: widget.data
                            });
                        })}">
                            <div class="d-flex me-auto leftText" style="padding-left:2px;height: 29px;align-items: center;" >
                                ${widget.data.left}
                            </div>
                            <div class="d-flex align-items-center ms-auto rightText">
                                ${widget.data.right}
                                <img class="ms-auto" src="${new URL(`../img/component/angle-right.svg`, import.meta.url)}" alt="" style="width: 16px;height: 16px;">
                            </div>
                        </div>
                        `;
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: '背景顏色色碼',
                                default: widget.data.background || "#FBF9F6",
                                placeHolder: '請輸入背景顏色的色碼',
                                callback: (text) => {
                                    widget.data.background = text;
                                    widget.refreshComponent();
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "左方文字",
                                default: widget.data.left,
                                placeHolder: "請輸入左方文字",
                                callback: (text) => {
                                    widget.data.left = text;
                                    widget.refreshAll();
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "右方文字",
                                default: widget.data.right,
                                placeHolder: "請輸入右方文字",
                                callback: (text) => {
                                    widget.data.right = text;
                                    widget.refreshAll();
                                }
                            }),
                            ClickEvent.editer(gvc, widget, widget.data)
                        ]);
                    }
                };
            },
        },
        funPuzzle: {
            defaultData: {
                model: [
                    {
                        title: "我的空間",
                        icon: new URL(`../img/component/footer/homeBlack.svg`, import.meta.url),
                        count: 0,
                        click: () => {
                        }
                    },
                    {
                        title: "我的靈感",
                        icon: new URL(`../img/component/footer/idea.svg`, import.meta.url),
                        count: 0,
                        click: () => {
                        }
                    },
                    {
                        title: "回饋優惠",
                        icon: new URL(`../img/component/discount.svg`, import.meta.url),
                        count: 0,
                        click: () => {
                        }
                    }
                ]
            },
            render: (gvc, widget, setting, hoverID) => {
                var _a, _b;
                widget.data.model = (_a = widget.data.model) !== null && _a !== void 0 ? _a : [];
                widget.data.background = (_b = widget.data.background) !== null && _b !== void 0 ? _b : "#FBF9F6";
                return {
                    view: () => {
                        gvc.addStyle(`
                     .mySpaceCount{
                        width: 16px;
                        height: 16px;
            
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 10px;
                        line-height: 15px;
                        text-align: center;
                        background: #FD6A58;
                        /* HOMEE white */
            
                        border: 1px solid #FFFFFF;
                        border-radius: 8px;
                        /* HOMEE white */
            
                        color: #FFFFFF;
            
                    }
                    `);
                        return gvc.bindView({
                            bind: "funPuzzle",
                            view: () => {
                                return gvc.map(widget.data.model.map((item, index) => {
                                    let length = widget.data.model.length;
                                    let width = (100 / length);
                                    let style = (index != length - 1) ? "border-right:1px solid #EAD8C2" : "";
                                    return `
                                    <div class="d-flex flex-column align-items-center" style="width: ${width}%;height: 56px; ${style}" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({ gvc, widget, clickEvent: item
                                        });
                                    })}">
                                        <div style="position: relative;width: 30px;height: 30px;">
                                            ${(() => {
                                        if (item.count != 0) {
                                            return `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${item.count}</div>`;
                                        }
                                        else {
                                            return ``;
                                        }
                                    })()}
                                            <img class="h-100 w-100" src="${item.icon}" style="">
                                        </div>
                                        <div class="indexTitle" style="margin-top: 5px;font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 23px;
color: #1E1E1E;
">
                                            ${item.title}
                                        </div>
                                        
                                    </div>
                   
                            `;
                                }));
                            }, divCreate: {
                                class: `d-flex justify-content-between `,
                                style: `padding: 28px 20px;border-radius: 20px; gap: 8px; margin-top: 16px;margin-bottom: 12px;background : ${widget.data.background};`
                            }
                        });
                    },
                    editor: () => {
                        return glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: '背景顏色色碼',
                            default: widget.data.background || "#FBF9F6",
                            placeHolder: '請輸入背景顏色的色碼',
                            callback: (text) => {
                                widget.data.background = text;
                                widget.refreshComponent();
                            }
                        }) + gvc.map(widget.data.model.map((dd, index) => {
                            return `<div class="alert alert-dark">
<h3 class="text-white" style="font-size: 16px;">項目.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: '標題',
                                default: dd.title,
                                placeHolder: '請輸入標題',
                                callback: (text) => {
                                    dd.title = text;
                                    widget.refreshComponent();
                                }
                            })}
${`<div class="d-flex align-items-center  mt-3">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.left.splice(index, 1);
                                widget.refreshComponent();
                            })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.icon}">

<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            dd.icon = link;
                                            widget.refreshComponent();
                                        });
                                    }
                                });
                            })}"></i>
</div>`}
${ClickEvent.editer(gvc, widget, dd)}
</div>`;
                        }));
                    }
                };
            },
        },
        funTwoPuzzle: {
            defaultData: {
                model: [
                    {
                        title: "我的空間",
                        icon: "https://prd-homee-api-public.s3.amazonaws.com/file/guest/1687325397951-newSpace.svg",
                        count: 0,
                        click: () => {
                        }
                    },
                    {
                        title: "回饋優惠",
                        icon: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1676977138152.png",
                        count: 0,
                        click: () => {
                        }
                    }
                ]
            },
            render: (gvc, widget, setting, hoverID) => {
                var _a, _b;
                widget.data.model = (_a = widget.data.model) !== null && _a !== void 0 ? _a : [];
                widget.data.background = (_b = widget.data.background) !== null && _b !== void 0 ? _b : "#FFFFFF";
                return {
                    view: () => {
                        gvc.addStyle(`
                     .mySpaceCount{
                        width: 16px;
                        height: 16px;
            
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 10px;
                        line-height: 15px;
                        text-align: center;
                        background: #FD6A58;
                        /* HOMEE white */
            
                        border: 1px solid #FFFFFF;
                        border-radius: 8px;
                        /* HOMEE white */
            
                        color: #FFFFFF;
            
                    }
                    `);
                        return gvc.bindView({
                            bind: "funPuzzle",
                            view: () => {
                                return gvc.map(widget.data.model.map((item, index) => {
                                    let length = widget.data.model.length;
                                    let width = (100 / length);
                                    let style = (index != length - 1) ? "border-right:2px solid #F8F3ED" : "";
                                    return `
                                    <div class="d-flex align-items-center justify-content-center" style="width: ${width}%;height: 56px; ${style}" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({ gvc, widget, clickEvent: item
                                        });
                                    })}">
                                        <div style="position: relative;width: 30px;height: 30px;margin-right: 16px;">
                                            ${(() => {
                                        if (item.count != 0) {
                                            return `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${item.count}</div>`;
                                        }
                                        else {
                                            return ``;
                                        }
                                    })()}
                                            <img class="h-100 w-100" src="${item.icon}" style="">
                                        </div>
                                        <div class="indexTitle" style="margin-top: 5px;font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 23px;
color: #1E1E1E;
">
                                            ${item.title}
                                        </div>
                                        
                                    </div>
                   
                            `;
                                }));
                            }, divCreate: {
                                class: `d-flex justify-content-between `,
                                style: `padding: 28px 20px;border-radius: 20px; gap: 8px; margin-top: 16px;margin-bottom: 12px;background : ${widget.data.background};`
                            }
                        });
                    },
                    editor: () => {
                        return glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: '背景顏色色碼',
                            default: widget.data.background || "#FBF9F6",
                            placeHolder: '請輸入背景顏色的色碼',
                            callback: (text) => {
                                widget.data.background = text;
                                widget.refreshComponent();
                            }
                        }) + gvc.map(widget.data.model.map((dd, index) => {
                            return `<div class="alert alert-dark">
<h3 class="text-white" style="font-size: 16px;">項目.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: '標題',
                                default: dd.title,
                                placeHolder: '請輸入標題',
                                callback: (text) => {
                                    dd.title = text;
                                    widget.refreshComponent();
                                }
                            })}
${`<div class="d-flex align-items-center  mt-3">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.left.splice(index, 1);
                                widget.refreshComponent();
                            })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.icon}">

<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            dd.icon = link;
                                            widget.refreshComponent();
                                        });
                                    }
                                });
                            })}"></i>
</div>`}
${ClickEvent.editer(gvc, widget, dd)}
</div>`;
                        }));
                    }
                };
            },
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/homeBlack.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "靈感",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "我的空間",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "購物車",
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "會員",
                        icon: new URL('../img/component/footer/userRed.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                    var _a;
                    if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.bottomInset) != response.data) {
                        widget.data.bottomInset = response.data;
                        widget.refreshAll();
                    }
                }, {
                    webFunction: () => {
                        return { data: 10 };
                    }
                });
                return {
                    view: () => {
                        gvc.addStyle(`
                        footer{
                            background:white;
                            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                            padding-top:18px;
                        }
                        .footerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                            text-align: center;
                            color: #1E1E1E;
                        }
                        .selected{
                            color:#FE5541;
                        }
                    `);
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;background: #FFFFFF;box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data, index) => {
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle ${(() => {
                                    if (index == 4)
                                        return "selected";
                                })()}">${data.title}</div>
                                </div>
                                `;
                            }));
                        })()}
                        </footer>
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        empty: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        return ``;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        systemSetting: {
            defaultData: {
                link: []
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                const dialog = new Dialog(gvc);
                return {
                    view: () => {
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
                        let vm = {
                            model: [
                                {
                                    img: new URL("../img/notify.svg", import.meta.url),
                                    text: "消息通知",
                                    click: () => {
                                        glitter.runJsInterFace("onClickNoti", {}, () => {
                                        });
                                    }
                                },
                                {
                                    img: new URL("../img/information.svg", import.meta.url),
                                    text: "關於",
                                    click: () => {
                                        glitter.runJsInterFace("about", {}, () => {
                                        });
                                    }
                                },
                                {
                                    img: new URL("../img/shield.svg", import.meta.url),
                                    text: "隱私",
                                    click: () => {
                                        glitter.runJsInterFace("privacy", {}, () => {
                                        });
                                    }
                                },
                            ],
                            logout: () => {
                                dialog.confirm("是否確認登出帳號?", (result) => {
                                    if (result) {
                                        appConfig().setUserData({
                                            value: {}, callback: (resonse) => {
                                                glitter.setPro("tempLeave", "falser", () => {
                                                    appConfig().setHome(gvc, 'home');
                                                });
                                            }
                                        });
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
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
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
                                                    <img class="ms-auto" src="${new URL("../img/angle-right.svg", import.meta.url)}" alt="右箭頭" style="height: 24px;width: 24px;" >
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
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
