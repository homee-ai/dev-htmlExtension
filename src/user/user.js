'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { SharedView } from "../homee/shareView.js";
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { appConfig } from "../config.js";
import { Funnel } from "../homee/funnel.js";
import { Dialog } from "../homee/legacy/widget/dialog.js";
import { ViewModel } from "../homee/legacy/view/userProfile.js";
import { User } from "../api/user.js";
import { Checkout } from "../api/checkout.js";
Plugin.create(import.meta.url, (glitter) => {
    return {
        nav: {
            defaultData: {
                nav: {
                    title: "",
                    leftIcon: new URL('../img/component/left-arrow.svg', import.meta.url),
                    leftPage: "",
                    boxShadow: true,
                    background: "#FFFFFF"
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    .voucherInput{                        
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                    }
                    .voucherInput::placeholder{
                        color: #858585;
                    }
                    
                `);
                const sharedView = new SharedView(gvc);
                return {
                    view: () => {
                        return sharedView.navigationBar({
                            title: widget.data.nav.title,
                            leftIcon: `<img class="" src="${widget.data.nav.leftIcon}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            })}">`,
                            rightIcon: ``,
                            boxShadow: widget.data.nav.boxShadow,
                            background: widget.data.nav.background,
                        });
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="font-size: 16px;">是否需要底線</h3>
                            <select class="form-control" onchange="${gvc.event((e) => {
                                widget.data.nav.boxShadow = (e.value == 1);
                                widget.refreshAll;
                            })}">         
                              <option value="1">要</option>                     
                              <option value="0">不用</option>                              
                              ${(() => {
                                let text = (widget.data.nav.boxShadow) ? "要" : "不用";
                                return `<option selected hidden>${text}</option>`;
                            })()}                              
                            </select>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `文字`,
                                default: widget.data.nav.title,
                                placeHolder: widget.data.nav.title,
                                callback: (text) => {
                                    widget.data.nav.title = text;
                                    widget.refreshAll();
                                }
                            }),
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">返回icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.leftIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.nav.leftIcon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">背景顏色</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input type="color" value="${widget.data.nav.background}" onchange="${gvc.event((e) => {
                                widget.data.nav.background = e.value;
                                widget.refreshAll();
                            })}">
                            </div>    
                        `
                        ]);
                    }
                };
            },
        },
        banner: {
            defaultData: {
                img: new URL('../img/component/ourServiceBanner.png', import.meta.url),
                text: "文字",
                click: () => {
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .banner-text{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 15px;
                        color: #1E1E1E;
                        word-wrap:break-word;
                        white-space:pre-wrap; 
                        margin-top : 16px;
                        padding:0 27px;
                    }
                `);
                return {
                    view: () => {
                        return `
                        <div style="padding:0 42px;">
                            <img class="w-100" src="${widget.data.img}">
                        </div>
                        <div class="banner-text">${widget.data.text}</div>
                        
                        `;
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">返回icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.img}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.img = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text) => {
                                    widget.data.text = text;
                                    widget.refreshAll();
                                }
                            })
                        ]);
                    }
                };
            },
        },
        funRow: {
            defaultData: {
                img: "../img/component/notification.svg",
                text: "消息通知",
                click: () => {
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        gvc.addStyle(`
                            .rowText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 20px;
                                line-height: 29px;
                                color: #1E1E1E;                                  
                            }
                        `);
                        return `
                        <div class="d-flex align-items-center  " style="padding:35px 0px;" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">
                            <img src="${new URL(widget.data.img)}" alt="${widget.data.text}" style="width: 32px;height: 32px;margin-right: 16px;">
                            <div class="rowText">${widget.data.text}</div>
                            <img class="ms-auto" src="${new URL("../img/component/right-arrow.svg")}" alt="右箭頭" style="height: 24px;width: 24px;" >
                        </div>
                        `;
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">左方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.img}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.img = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `中間文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text) => {
                                    widget.data.text = text;
                                    widget.refreshAll();
                                }
                            }),
                        ]);
                    }
                };
            },
        },
        button: {
            defaultData: {
                text: "文字",
                click: () => {
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return `
                        <buttom class="" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">${widget.data.text}</buttom>
                        `;
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `中間文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text) => {
                                    widget.data.text = text;
                                    widget.refreshAll();
                                }
                            })
                        ]);
                    }
                };
            },
        },
        text: {
            defaultData: {
                text: "文字",
                click: {}
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return `
                        <div class="" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: widget.data.click
                            });
                        })}">${widget.data.text}</div>
                        `;
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `文字內容`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text) => {
                                    widget.data.text = text;
                                    widget.refreshAll();
                                }
                            }),
                            ClickEvent.editer(gvc, widget, widget.data.click)
                        ]);
                    }
                };
            },
        },
        dividingLine: {
            defaultData: {
                style: "solid",
                width: 1,
                color: "000"
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return `
                        <div class="w-100" style="border-top: ${widget.data.width}px ${widget.data.style} #${widget.data.color};"></div>
                        
                        `;
                    },
                    editor: () => {
                        return gvc.map([]);
                    }
                };
            },
        },
        textArea: {
            defaultData: {
                text: "文字",
                click: () => {
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return `
                        <div class="" style="white-space:normal;word-wrap:break-word;word-break:break-all;" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">${widget.data.text}</div>
                        `;
                    },
                    editor: () => {
                        var _a;
                        return gvc.map([
                            `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">文字內容</h3>
                            <textarea class="form-control p-0" placeholder="" style="height:auto"  onchange="${gvc.event((e) => {
                                let element = e;
                                widget.data.text = e.value;
                                widget.refreshAll();
                                element.style.height = "auto";
                                element.style.height = (element.scrollHeight) + "px";
                            })}" >${(_a = widget.data.text) !== null && _a !== void 0 ? _a : ''}</textarea>`
                        ]);
                    }
                };
            },
        },
        ourService: {
            defaultData: {
                link: [],
                section: [
                    {
                        title: "產品相關",
                        service: [
                            {
                                text: "免費線上規劃軟體",
                                onclick: () => {
                                }
                            },
                            {
                                text: "品質保證",
                                onclick: () => {
                                }
                            },
                            {
                                text: "國際認證",
                                onclick: () => {
                                }
                            },
                            {
                                text: "試睡保證",
                                onclick: () => {
                                }
                            },
                        ]
                    },
                    {
                        title: "購物相關",
                        service: [
                            {
                                text: "HOMEE 分店",
                                onclick: () => {
                                }
                            },
                            {
                                text: "付款方式說明",
                                onclick: () => {
                                }
                            },
                            {
                                text: "隱私權保護及網站使用與購物政策   ",
                                onclick: () => {
                                }
                            },
                            {
                                text: "折讓單作業說明",
                                onclick: () => {
                                }
                            },
                        ]
                    },
                    {
                        title: "服務相關",
                        service: [
                            {
                                text: "運送服務",
                                onclick: () => {
                                }
                            },
                            {
                                text: "組裝服務",
                                onclick: () => {
                                }
                            },
                            {
                                text: "舊家具搬運 / 舊床墊回收服務",
                                onclick: () => {
                                }
                            },
                            {
                                text: "空間規劃 / 丈量服務",
                                onclick: () => {
                                }
                            },
                            {
                                text: "驗房服務",
                                onclick: () => {
                                }
                            },
                        ]
                    }
                ],
                lastSection: {
                    contactUs: {
                        title: "聯絡我們",
                        servicePhoneTitle: "客服專線",
                        servicePhone: "0972-636-236",
                        serviceTimeTitle: "服務時間",
                        physicalStore: "週一 ~ 週五 10:00-18:00",
                        onlineStore: "週一 ~ 週日 09:00-18:00",
                        service1v1: {
                            title: "線上專人服務",
                            onclick: () => {
                            }
                        }
                    },
                    kanban: "img/kanban.png"
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        return `
                        ${gvc.bindView({
                            bind: "serviceListGroup",
                            view: () => {
                                let classStyle = {
                                    serviceCard: `
                                        background: #FBF9F6;
                                        border-radius: 24px;
                                        padding: 16px 0px 7px;
                                        margin-bottom:16px;
                                    `,
                                    serviceTitle: `
                                        font-weight: 700;
                                        font-size: 24px;
                                        line-height: 35px;
                                        color: #292929;
                                        margin-bottom:24px;
                                    `,
                                    serviceText: `
                                        font-weight: 400;
                                        font-size: 15px;
                                        line-height: 150%;
                                        color: #858585;
                                    `,
                                    serviceRow: `
                                        padding-left : 32px;
                                        padding-right : 24px;
                                        gap : 8px;
                                        margin-bottom:17px;                          
                                        height : 23px;
                                    `,
                                    left: `
                                        font-weight: 400;
                                        font-size: 15px;
                                        line-height: 150%;                                        
                                        color: #858585;
                                    `,
                                    right: `
                                    font-weight: 400;
                                    font-size: 13px;
                                    line-height: 14px;                                                                        
                                    color: #858585;
                                    `
                                };
                                let returnHTML = ``;
                                widget.data.section.forEach((serviceList) => {
                                    returnHTML += `                           
                                    ${gvc.bindView({
                                        bind: "service",
                                        view: () => {
                                            let serviceGroup = ``;
                                            serviceGroup = gvc.map(serviceList.service.map((service) => {
                                                return `
                                                <div class="d-flex align-items-center  w-100 " style="${classStyle.serviceRow}" onclick="${gvc.event(() => {
                                                    ClickEvent.trigger({
                                                        gvc, widget, clickEvent: service
                                                    });
                                                })}">
                                                    <div class="d-flex me-auto" style="${classStyle.left} padding-left:2px;height: 29px;align-items: center;" >
                                                        ${service.text}
                                                    </div>
                                                    <div class="d-flex align-items-center ms-auto">                                                        
                                                        <img class="ms-auto" src="${new URL(`../img/component/angle-right.svg`, import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                    </div>
                                                </div>
                                              
                                              `;
                                            }));
                                            return `
                                    <div class="d-flex align-items-center flex-column" style="${classStyle.serviceCard}">
                                        <div class="" style="${classStyle.serviceTitle}">${serviceList.title}</div>
                                        ${serviceGroup}
                                    </div>
                                `;
                                        }
                                    })}
                                `;
                                });
                                return returnHTML;
                            }, divCreate: { style: `margin-top: 26px;font-family: 'Noto Sans TC';font-style: normal;`, class: `` }
                        })}
                        ${gvc.bindView({
                            bind: "lastSection",
                            view: () => {
                                let styleClass = {
                                    lastSectionTitle: `
                                        font-weight: 700;
                                        font-size: 24px;
                                        line-height: 35px;                                    
                                        color: #292929;                                    
                                        margin-bottom : 24px;
                                    `,
                                    serviceTimeBlock: `
                                        font-weight: 400;
                                        font-size: 15px;
                                        line-height: 150%;
                                        color: #858585;
                                    `,
                                    servicePhoneBlock: `
                                        font-weight: 400;
                                        font-size: 15px;
                                        line-height: 150%;
                                        color: #858585;
                                    `,
                                    serviceBTN: `
                                        height: 48px;
                                        margin-top:24px;                  
                                        font-weight: 700;
                                        font-size: 18px;
                                        line-height: 26px;                                        
                                        text-align: center;
                                        letter-spacing: 0.15em;            
                                        background: #FD6A58;
                                        border-radius: 28px;                                                                                
                                        color: #FFFFFF;
                                    `
                                };
                                let thisModel = widget.data.lastSection;
                                return `
                        
                                <div class="d-flex justify-content-center align-items-center" style="${styleClass.lastSectionTitle}">${thisModel.contactUs.title}</div>
                                <div class=" d-flex flex-column align-items-start justify-content-start" style="${styleClass.servicePhoneBlock} margin-bottom: 16px;">
                                    <div>客服專線：0972-636-236</div>
                                    
                                </div>
                                <div class="" style="${styleClass.serviceTimeBlock} ">
                                    <div>${thisModel.contactUs.serviceTimeTitle} : ${thisModel.contactUs.physicalStore}</div>                                    
                                    <div>${thisModel.contactUs.onlineStore}</div>
                                </div>
                                <button class="w-100  border-0" style="${styleClass.serviceBTN}" onclick="${gvc.event(() => {
                                    thisModel.contactUs.service1v1.onclick();
                                })}">${thisModel.contactUs.service1v1.title}</button>
                                
                                ${gvc.bindView({
                                    bind: "kanban",
                                    view: () => {
                                        return `
                                            <div class="" style="position: absolute;bottom: 0;left:0;transform: translate(0 , 100%);padding-top: 57%;width : 100%;background:50% / cover url(${new URL(`../img/component/kanban.png`, import.meta.url)})"></div>
                                        `;
                                    },
                                    divCreate: { class: ``, style: `width : 100%;` }
                                })}     
                            `;
                            },
                            divCreate: {
                                class: ``,
                                style: `background: #FBF9F6;border-radius: 24px;padding: 16px 32px 24px;margin-bottom:200px;position: relative;`
                            }
                        })}
                        `;
                    },
                    editor: () => {
                        return gvc.map(widget.data.section.map((dd, index) => {
                            return `<div class="alert alert-dark">
<h3 style="color:white;font-size: 16px;" class="d-flex align-items-center"><i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.section.splice(index, 1);
                                widget.refreshAll();
                            })}"></i>區塊.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "區塊名稱",
                                default: dd.title,
                                placeHolder: `請輸入區塊名稱`,
                                callback: (text) => {
                                    dd.title = text;
                                    widget.refreshAll();
                                }
                            })}
<div class="mt-2"></div>
${gvc.map(dd.service.map((d3, index) => {
                                return `<div class="alert alert-warning">
${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                        dd.service.splice(index, 1);
                                        widget.refreshAll();
                                    })}"></i>按鈕.` + (index + 1),
                                    default: d3.text,
                                    placeHolder: `請輸入按鈕名稱`,
                                    callback: (text) => {
                                        d3.text = text;
                                        widget.refreshAll();
                                    }
                                }) + ClickEvent.editer(gvc, widget, d3)}
</div>`;
                            }))}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                dd.service.push({
                                    text: "標題",
                                    onclick: () => {
                                    }
                                });
                                widget.refreshAll();
                            })}">添加按鈕</div>
</div>
<div class="w-100 bg-white my-2" style="height: 1px;"></div>
`;
                        }).concat([
                            `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                widget.data.section.push({
                                    title: "新增區塊",
                                    service: []
                                });
                                widget.refreshAll();
                            })}">添加區塊</div>`
                        ]));
                    }
                };
            },
        },
        pointsRewardBlock: {
            defaultData: {
                backPoint: 600,
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        let rebat = 0;
                        Checkout.getRebat((response) => {
                            widget.data.backPoint = response.data[0].credit_balance;
                            gvc.notifyDataChange('backPoint');
                        });
                        return `
                        ${gvc.bindView({
                            bind: 'backPoint',
                            view: () => {
                                let classStyle = {
                                    giveBack: `
                                        font-weight: 500;
                                        font-size: 18px;
                                        line-height: 200%;
                                        color: #292929;
                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                    `,
                                    backPoint: `
                                        font-weight: 700;
                                        font-size: 32px;
                                        line-height: 46px;
                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                        color: #fd6a58;
                                    `
                                };
                                return `
                                <div class="d-flex align-items-baseline justify-content-center">
                                    <div class="" style="${classStyle.giveBack}">點數回饋：</div>
                                    <div class="" style="${classStyle.backPoint}">${widget.data.backPoint}</div>
                                </div>
                            `;
                            },
                            divCreate: {
                                style: `height:96px;background: #FFFFFF;border-radius: 20px;margin-top:24px;`,
                                class: `w-100 d-flex justify-content-center align-items-center `,
                            },
                        })}
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        voucher: {
            defaultData: {
                voucherList: [
                    {
                        id: "0",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "有效期限：2025.03.31",
                        isUse: false,
                        status: 0,
                    },
                    {
                        id: "1",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "即將失效：剩下 8 小時",
                        isUse: false,
                        status: 1,
                    },
                    {
                        id: "2",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "有效期限：2025.03.31",
                        isUse: false,
                        status: 2,
                    },
                    {
                        id: "3",
                        vendor_name: "供應商名稱",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "優惠卷名稱",
                        config: {},
                        title: "現折 10,000 元",
                        subTitle: "滿 30,000 元",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "有效期限：2025.03.31",
                        isUse: false,
                        status: 3,
                    }
                ],
                cEvent: {},
                eventList: {
                    status0: {},
                    status1: {},
                    status2: {}
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let voucherStatus;
                (function (voucherStatus) {
                    voucherStatus[voucherStatus["unused"] = 0] = "unused";
                    voucherStatus[voucherStatus["expire"] = 1] = "expire";
                    voucherStatus[voucherStatus["used"] = 2] = "used";
                    voucherStatus[voucherStatus["passed"] = 3] = "passed";
                })(voucherStatus || (voucherStatus = {}));
                const vm = {
                    loading: false
                };
                try {
                    vm.loading = true;
                    gvc.notifyDataChange('voucherCardList');
                    Checkout.getVoucher('Select', (data) => {
                        vm.loading = false;
                        widget.data.voucherCardList = data.map((dd) => {
                            return {
                                vendor_id: dd.id,
                                vendor_icon: new URL('../img/component/voucher/cardIcon.png', import.meta.url),
                                vendor_name: dd.vendor_name,
                                vendor_context: "優惠券內容",
                                name: dd.subTitle,
                                discount: dd.title,
                                lowCostText: dd.lowCostText,
                                lowCostNumber: dd.lowCostNumber,
                                dateText: "有效期限：",
                                date: dd.formatEndTime,
                                dateType: "",
                                code: dd.code,
                                ogData: dd
                            };
                        });
                        gvc.notifyDataChange('voucherCardList');
                    });
                }
                catch (e) {
                }
                return {
                    view: () => {
                        function useVoucher(id) {
                            appConfig().changePage(gvc, "user_couponDetail");
                        }
                        gvc.addStyle(`
                            .unusedDate{
                                color : #FF0000;
                            }
                            .normalDate{
                                color : #858585;
                            }
                            .useBTNtext{                            
                                border-radius: 4px;                               
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                line-height: 20px;
                                margin-right: 10px;
                                width:48px;
                                text-align: center;
                                height: 20px;
                                
                            }
                            .useBTNtext.on{
                                background: #FE5541;
                                color: #FFFFFF;
                            }
                            .useBTNtext.off{
                                background: #EAD8C2;
                                color: #858585;
                            }
                            .useBTNtext.passed{
                                background: #E0E0E0;
                                color: #858585;
                            }
                        `);
                        return gvc.bindView({
                            bind: "voucherCardList",
                            view: () => {
                                var _a;
                                widget.data.voucherCardList = (_a = widget.data.voucherCardList) !== null && _a !== void 0 ? _a : [];
                                return gvc.map(widget.data.voucherCardList.map((coupon) => {
                                    return `
                                        <div class="voucherCard overflow-hidden" style="background: #FFFFFF;border-radius: 20px;padding:8px 0;box-shadow: -2px 2px 15px rgba(0, 0, 0, 0.05);margin-bottom:16px;position:relative;" onclick="${gvc.event(() => {
                                    })}"> 
                                            <div class="d-flex" style="padding: 8px 22px;">
                                                <img src="${coupon.vendor_icon.href}" style="width: 24px;height: 24px;border-radius: 50%;margin-right: 8px;">
                                                <div class="vendor_name">${coupon.vendor_name}</div>
                                                <div class="ms-auto" style="font-weight: 700;font-size: 12px;line-height: 150%;color: #FE5541;" onclick="${gvc.event(() => {
                                        appConfig().changePage(gvc, 'user_couponDetail', coupon);
                                    })}">優惠卷內容</div>
                                            </div>
                                            <div class="w-100" style="background: #E0E0E0;height: 1px;"></div>
                                            <div class="" style="padding: 8px 22px;">
                                                <div  style="font-weight: 700;font-size: 16px;line-height: 23px;">${coupon.name}</div>
                                                <div class="d-flex align-items-center" style="margin-top:4px;font-weight: 700;  font-size: 24px;line-height: 35px;color: #FE5541;">${coupon.discount}</div>
                                                <div class="d-flex align-items-center" style="margin-top: 4px;">
                                                    <div class="" style="font-weight: 400;font-size: 12px;line-height: 17px;color: #858585;">${coupon.lowCostText}</div>
                                                    <div style="font-weight: 700;font-size: 12px;line-height: 150%;color: #1E1E1E;">${coupon.lowCostNumber}</div>
                                                    <div class="ms-auto d-flex">
                                                        <div class="${coupon.dateType}dateText" style="font-weight: 400;font-size: 12px;line-height: 17px;color: #858585;">${coupon.dateText}</div>
                                                        <div class="${coupon.dateType}date" style="font-weight: 700;font-size: 12px;line-height: 150%;color: #1E1E1E;">${coupon.date}</div>
                                                    </div>                                                        
                                                </div>
                                            </div>
                                            <div class="" style="width:24px;height:24px;border-radius:50%;background:rgba(0, 0, 0, 0.05);position:absolute;left:-12px;top:calc(50% - 12px);"></div>
                                            <div class="" style="width:24px;height:24px;border-radius:50%;background:rgba(0, 0, 0, 0.05);position:absolute;right:-12px;top:calc(50% - 12px);    "></div>
                                        </div>    
                                    `;
                                }));
                            },
                            divCreate: {}
                        });
                    },
                    editor: () => {
                        return ClickEvent.editer(gvc, widget, widget.data, {
                            option: [],
                            hover: true
                        });
                    }
                };
            },
        },
        voucherDetail: {
            defaultData: {
                coupon: {
                    id: "0",
                    vendor_name: "供應商名稱",
                    vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                    name: "優惠卷名稱",
                    config: {},
                    title: "現折 10,000 元",
                    subTitle: "滿 30,000 元",
                    startTime: "2022.03.31 00:00",
                    endTime: "2025.03.31 23:59",
                    formatEndTime: "有效期限：2025.03.31",
                    isUse: false,
                    status: 0,
                    content: "遠傳心生活 iPhone + 購物方案，全館任選滿 30000 元，現折 10000 元。",
                    product: "適用於所有商品",
                    payway: "適用於所有付款方式",
                    logistics: "適用於所有物流方式",
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        let classStyle = {
                            useBTNtext: `
                                
                            `
                        };
                        gvc.addStyle(`
                            .normalDate{
                                color : #858585;
                            }
                            .useBTNtext{                            
                                border-radius: 4px;                               
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                line-height: 20px;
                                margin-right: 10px;
                                width:48px;
                                text-align: center;
                                height: 20px;                                
                            }
                            .useBTNtext.on{
                                background: #FE5541;
                                color: #FFFFFF;
                            }
                            
                            .detailTitle{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 700;
                                font-size: 15px;
                                color: #292929;
                                margin-top:16px;
                            }
                            .detailText{
                                white-space: normal;
                                word-wrap: break-word;
                                word-break: break-all;
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                color: #292929;
                            }
                        `);
                        const data = (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data;
                        let coupon = widget.data.coupon;
                        if (data.vendor_id) {
                            coupon = {
                                id: data.vendor_id,
                                vendor_name: data.vendor_name,
                                vendor_icon: data.vendor_icon,
                                name: data.ogData.name,
                                config: {},
                                title: data.ogData.title,
                                subTitle: data.ogData.subTitle,
                                startTime: data.ogData.startTime.substring(0, 10),
                                endTime: (data.ogData.endTime) ? data.ogData.endTime.substring(0, 10) : "無有效期限",
                                formatEndTime: `有效期限：${(data.ogData.endTime) ? data.ogData.endTime.substring(0, 10) : "無有效期限"}`,
                                isUse: false,
                                status: 0,
                                content: data.ogData.note,
                                product: "適用於所有商品",
                                payway: "適用於所有付款方式",
                                logistics: "適用於所有物流方式",
                            };
                            coupon.vendor_id = data.vendor_id;
                            coupon.vendor_icon = data.vendor_icon;
                            coupon.vendor_name = data.vendor_name;
                        }
                        return `
                        <div class="overflow-hidden" style="margin-top: 30px;background: #FFFFFF;border-radius: 20px;padding:8px 0;box-shadow: -2px 2px 15px rgba(0, 0, 0, 0.05);margin-bottom:16px;position:relative;" onclick="${gvc.event(() => {
                        })}"> 
                            <div class="d-flex" style="padding: 8px 22px;">
                                <img src="${data.vendor_icon}" style="width: 24px;height: 24px;border-radius: 50%;margin-right: 8px;">
                                <div class="vendor_name" style="font-weight: 400;font-size: 15px;line-height: 150%;">${(_b = data.vendor_name) !== null && _b !== void 0 ? _b : "廠商名稱"}</div>
                                <div class="vendor_context ms-auto ${(() => { if (data.ogData.isUse)
                            return "d-none"; })()}" style="color: #FE5541;font-weight: 700;font-size: 15px;line-height: 150%;" onclick="${gvc.event(() => {
                            let code = data === null || data === void 0 ? void 0 : data.code;
                        })}">使用</div>
                            </div>
                            <div class="w-100" style="background: #E0E0E0;height: 1px;"></div>
                            <div class="" style="padding: 8px 22px;">
                                <div style="font-weight: 700;font-size: 16px;line-height: 23px;color: #1E1E1E;">${(_c = data.name) !== null && _c !== void 0 ? _c : "優惠卷名稱"}</div>
                                <div style="font-weight: 700;font-size: 24px;line-height: 35px;color: #FE5541;margin:4px 0;">${(_d = data.discount) !== null && _d !== void 0 ? _d : "優惠卷折扣內容"}</div>
                                <div class="d-flex ">
                                    <div style="font-weight: 400;font-size: 12px;color: #858585;">${(_e = data.lowCostText) !== null && _e !== void 0 ? _e : "最低消費:"}</div>
                                    <div style="font-weight: 700;font-size: 12px;color: #1E1E1E;">${(_f = data.lowCostNumber) !== null && _f !== void 0 ? _f : "NT $0"}</div>
                                    <div class="ms-auto d-flex">
                                        <div class="${data.dateType}" style="font-weight: 400;font-size: 12px;color: #858585;">${(_g = data.dateText) !== null && _g !== void 0 ? _g : "有效期限:"}</div>
                                        <div class="${data.dateType}" style="font-weight: 700;font-size: 12px;color: #1E1E1E;">${(_h = data.date) !== null && _h !== void 0 ? _h : "31 三月 2025"}</div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div style="position: absolute;left: -12px;top: calc(50% - 12px);width: 24px;height: 24px;border-radius: 50%;background: #f8f3ed;"></div>
                            <div style="width: 24px;height: 24px;border-radius: 50%;position: absolute;right: -12px;top: calc(50% - 12px);background: #f8f3ed;" class="lackCircle rightCircle"></div>
                        </div>    
                                        
                        <div class="w-100" style="padding: 0 5px;">                                                     
                            <div class="detailTitle" style="font-weight: 700;font-size: 15px;line-height: 150%;color: #1E1E1E;">
                                優惠內容
                            </div>
                            <div class="detailText" style="font-weight: 400;font-size: 12px;line-height: 17px;">
                                ${coupon.content}
                            </div>
                            <div class="detailTitle" style="font-weight: 700;font-size: 15px;line-height: 150%;color: #1E1E1E;">
                                有效期限
                            </div>
                            <div class="detailText" style="font-weight: 400;font-size: 12px;line-height: 17px;">
                                ${coupon.startTime}~${coupon.endTime}
                            </div>
                            <div class="detailTitle" style="font-weight: 700;font-size: 15px;line-height: 150%;color: #1E1E1E;">
                                商品
                            </div>
                            <div class="detailText" style="font-weight: 400;font-size: 12px;line-height: 17px;">
                                ${coupon.product}
                            </div>
                            <div class="detailTitle" style="font-weight: 700;font-size: 15px;line-height: 150%;color: #1E1E1E;">
                                付款
                            </div>
                            <div class="detailText" style="font-weight: 400;font-size: 12px;line-height: 17px;">
                                ${coupon.payway}
                            </div>
                            <div class="detailTitle" style="font-weight: 700;font-size: 15px;line-height: 150%;color: #1E1E1E;">
                                物流
                            </div>
                            <div class="detailText" style="font-weight: 400;font-size: 12px;line-height: 17px;">
                                ${coupon.logistics}
                            </div>
                            <div class="detailTitle" style="font-weight: 700;font-size: 15px;line-height: 150%;color: #1E1E1E;">
                                注意事項
                            </div>
                            <div class="detailText" style="font-weight: 400;font-size: 12px;line-height: 17px;">
                                ※ 此優惠不可與其他優惠同時使用<br>
                                ※ 訂單金額無法累計折扣<br>
                                ※ 消費折扣金額僅以商品金額為限，不含運費等額外服務之費用<br>
                                ※ 若需退貨導致消費金額未達滿額折扣之標準，退款時將會扣除折扣金額以及 1% 回饋金<br>
                                ※ HOMEE 保有修改活動及最終解釋之權利，請以網站公告為準<br>
                            </div>
                        </div>
                        `;
                    },
                    editor: () => {
                        return ClickEvent.editer(gvc, widget, widget.data, {
                            option: [],
                            hover: true
                        });
                    }
                };
            },
        },
        edit: {
            defaultData: {
                topInset: 10,
                nav: {
                    title: "",
                    leftIcon: new URL('../img/component/left-arrow.svg', import.meta.url),
                    leftPage: "",
                    boxShadow: true,
                    background: "#FFFFFF"
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        let classStyle = {
                            mySpaceCount: `
                                width: 18px;
                                height: 18px;
                    
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;                                
                                font-weight: 700;
                                font-size: 12px;
                                line-height: 15px;
                                text-align: center;                      
                    
                                border: 1px solid #FFFFFF;
                                border-radius: 8px;                             
                    
                                color: #FFFFFF;
                            `,
                            indexTitle: `
                            font-weight: 400;
                            font-size: 15px;
                            line-height: 150%;                
                            color: #292929;
                            `,
                            save: `
                                font-weight: 500;
                                font-size: 17px;
                                line-height: 25px;                                                               
                                text-align: center;                                                                                                
                                color: #FD6A58;
                            `,
                            changePhoto: `
                                font-weight: 700;
                                font-size: 14px;
                                line-height: 20px;
                                font-feature-settings: 'pnum' on, 'lnum' on;
                                color: #FD6A58;                            
                                margin-top : 8px;
                            `,
                            accTitle: `
                                font-weight: 700;
                                font-size: 24px;
                                line-height: 35px;
                                color: #292929;
                                margin-bottom : 18px;
                            `,
                            addrAdd: `
                                font-weight: 400;
                                font-size: 15px;
                                line-height: 150%;
                                color: #FD6A58;
                            `,
                            addrEdit: `
                                font-weight: 400;
                                font-size: 15px;
                                line-height: 150%;
                                color: #FD6A58;
                                margin-right : 12px;
                            `,
                            addrDel: `
                                font-weight: 400;
                                font-size: 15px;
                                line-height: 150%;
                                color: #858585;
                            `,
                            left: `
                                width: 21%;
                                font-size: 18px;
                                font-weight: 500;
                                line-height: 26px;
                                color: #1E1E1E;
                            `,
                            right: `
                                font-weight: 400;
                                font-size: 16px;
                                line-height: 23px;
                                color: #292929;
                                border-bottom: 1px solid #E0E0E0;
                            `
                        };
                        const sharedView = new SharedView(gvc);
                        let viewModel = new ViewModel(gvc);
                        let dialog = new Dialog(gvc);
                        let firstAddressData = {};
                        const vm = {
                            loading: true,
                            data: undefined,
                            userData: undefined,
                            addressModel: []
                        };
                        appConfig().getUserData({
                            callback: (response) => {
                                var _a, _b, _c;
                                vm.data = [
                                    {
                                        left: "姓名",
                                        type: "name",
                                        name: "name",
                                        placehold: {
                                            get last() {
                                                return (response === null || response === void 0 ? void 0 : response.last_name) || "";
                                            },
                                            set last(value) {
                                                response.last_name = value;
                                            },
                                            get first() {
                                                return (response === null || response === void 0 ? void 0 : response.first_name) || "";
                                            },
                                            set first(value) {
                                                response.first_name = value;
                                            }
                                        }
                                    },
                                    {
                                        left: "用戶名稱",
                                        type: "text",
                                        name: "userName",
                                        get placehold() {
                                            var _a;
                                            return (_a = (response.name)) !== null && _a !== void 0 ? _a : ((vm.data.first_name + vm.data.last_name) || "");
                                        },
                                        set placehold(value) {
                                            response.name = value;
                                        }
                                    },
                                    {
                                        left: "電子郵件",
                                        type: "email",
                                        name: "email",
                                        get placehold() {
                                            return response.email || "";
                                        },
                                        set placehold(value) {
                                            response.email = value;
                                        }
                                    },
                                    {
                                        left: "電話",
                                        type: "number",
                                        name: "phone",
                                        get placehold() {
                                            return response.phone;
                                        },
                                        set placehold(value) {
                                            response.phone = value;
                                        }
                                    },
                                    {
                                        left: "密碼",
                                        type: "password",
                                        name: "password",
                                        check: false,
                                        placehold: ""
                                    },
                                    {
                                        visible: false,
                                        left: "新密碼",
                                        type: "password",
                                        name: "newPassword",
                                        placehold: ""
                                    },
                                    {
                                        visible: false,
                                        left: "再次輸入",
                                        type: "password",
                                        name: "confirmPassword",
                                        placehold: ""
                                    }
                                ];
                                if (response.addressModel) {
                                    vm.addressModel = [
                                        {
                                            left: "姓名",
                                            type: "name",
                                            name: "addressName",
                                            placehold: {
                                                last: response.addressModel.last_name,
                                                first: response.addressModel.first_name
                                            }
                                        },
                                        {
                                            left: "電話",
                                            type: "number",
                                            name: "addressPhone",
                                            placehold: response.addressModel.address_phone
                                        },
                                        {
                                            left: "公司名稱",
                                            type: "text",
                                            name: "addressCompany",
                                            placehold: response.addressModel.company
                                        },
                                        {
                                            left: "地址",
                                            type: "text",
                                            name: "address",
                                            placehold: response.addressModel.address
                                        }
                                    ];
                                }
                                else {
                                    vm.addressModel = (_c = (_b = (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data) === null || _b === void 0 ? void 0 : _b.addressModel) !== null && _c !== void 0 ? _c : [];
                                }
                                vm.userData = response;
                                vm.loading = false;
                            }
                        });
                        let photoFile = undefined;
                        let b64 = undefined;
                        let resetPassword = false;
                        let addressModel = [];
                        function saveData() {
                            dialog.dataLoading(true);
                            User.setUserData(vm.userData, (response) => {
                                dialog.dataLoading(false);
                                appConfig().setUserData({
                                    value: vm.userData,
                                    callback: (response) => {
                                        appConfig().setHome(gvc, 'user_setting');
                                        setTimeout(() => {
                                            dialog.showInfo("更改成功");
                                        }, 1000);
                                    }
                                });
                            });
                        }
                        function dataURLtoFile(dataurl, filename) {
                            let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return new File([u8arr], filename, { type: mime });
                        }
                        function deleteFirstAddress() {
                            if (confirm("確定刪除?")) {
                                glitter.runJsInterFace("deleteAddress", {}, (response) => {
                                    vm.addressModel = [];
                                    gvc.notifyDataChange('firstAddress');
                                }, {
                                    webFunction: () => {
                                        return { result: "OK" };
                                    }
                                });
                            }
                        }
                        return gvc.map([
                            `
                            ${sharedView.navigationBar({
                                title: '我的帳號',
                                leftIcon: `<img class="" src="${new URL('../img/component/left-arrow.svg', import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                    if (glitter.getUrlParameter('navagation') == "true") {
                                        glitter.runJsInterFace("dismiss", {}, () => {
                                        });
                                    }
                                    else {
                                        glitter.goBack();
                                    }
                                })}">`,
                                rightIcon: `<div class="save" onclick="${gvc.event(() => {
                                    saveData();
                                })}">儲存</div>`,
                                boxShadow: widget.data.nav.boxShadow,
                                background: widget.data.nav.background,
                            })}
                            `,
                            `
                            <main style="overflow-x: hidden;margin-top: 50px;">                                   
                                ${(() => {
                                let funnel = new Funnel(gvc);
                                return gvc.map([`
                                    <input
                                    type="file"
                                    class="d-none"
                                    id="${gvc.id("photo")}"
                                    onchange="${gvc.event((e) => {
                                        for (let i = 0; i < $(e).get(0).files.length; i++) {
                                            let canvas = document.createElement('canvas');
                                            let ctx = canvas.getContext('2d');
                                            let file = $(e).get(0).files[i];
                                            let img = new Image();
                                            img.src = URL.createObjectURL(file);
                                            img.onload = function () {
                                                let width = img.width;
                                                if (width > 200) {
                                                    canvas.width = 200;
                                                    canvas.height = img.height * 200 / img.width;
                                                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                                    let f = $(e).get(0).files[i];
                                                    let ran = funnel.randomString(3);
                                                    const regex = new RegExp('[^.]+$');
                                                    const extension = f.name.match(regex);
                                                    let compressedImageURL = canvas.toDataURL(`image/${extension}`, 0.75);
                                                    photoFile = {
                                                        ran: ran,
                                                        fullName: f.name,
                                                        name: f.name.substring(0, extension.index - 1),
                                                        ext: extension[0],
                                                        data: dataURLtoFile(compressedImageURL, f.name),
                                                    };
                                                    b64 = compressedImageURL;
                                                }
                                                else {
                                                    const regex = new RegExp('[^.]+$');
                                                    let f = $(e).get(0).files[i];
                                                    const extension = f.name.match(regex);
                                                    let ran = funnel.randomString(3);
                                                    photoFile = {
                                                        ran: ran,
                                                        fullName: f.name,
                                                        name: f.name.substring(0, extension.index - 1),
                                                        ext: extension[0],
                                                        data: f,
                                                    };
                                                }
                                                appConfig().uploadImage(photoFile.data, (response) => {
                                                    vm.userData.photo = response;
                                                    $('#' + gvc.id('photoImage')).attr('src', response);
                                                });
                                            };
                                        }
                                    })}"
                                    ></input>`,
                                    gvc.bindView({
                                        dataList: [
                                            {
                                                obj: vm,
                                                key: 'loading'
                                            }
                                        ],
                                        bind: gvc.glitter.getUUID(),
                                        view: () => {
                                            var _a;
                                            if (vm.loading) {
                                                return ``;
                                            }
                                            return `
                                                <div class="w-100 d-flex flex-column align-items-center">                            
                                                    <img id="${gvc.id('photoImage')}" src="${(photoFile !== undefined) ? b64 : (_a = vm.userData.photo) !== null && _a !== void 0 ? _a : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${vm.data.last_name}&txtfont=Helvetica&txtalign=middle,center`}" style="width: 128px;height: 128px;border-radius: 50%"
                                                    onclick="${gvc.event(() => {
                                                $(`#${gvc.id("photo")}`).click();
                                            })}">
                                                    <div class="" style="${classStyle.changePhoto}" onclick="${gvc.event(() => {
                                                $(`#${gvc.id("photo")}`).click();
                                            })}">更換大頭貼</div>                                                      
                                                </div>
                                            `;
                                        },
                                        divCreate: {
                                            class: `w-100 d-flex justify-content-center align-items-center`,
                                            style: `margin-bottom : 40px;`
                                        }
                                    })]);
                            })()}    
<!--                                                    上排資料-->
                                ${gvc.bindView({
                                dataList: [
                                    {
                                        obj: vm,
                                        key: 'loading'
                                    }
                                ],
                                bind: "accountData",
                                view: () => {
                                    if (vm.loading) {
                                        return ``;
                                    }
                                    return `
                                        <div class="w-100 d-flex flex-column">
                                            <div class="" style="${classStyle.accTitle}">帳號資料</div>
                                            ${gvc.map(vm.data.map((dd) => {
                                        if (dd.name === 'password' && dd.check == false) {
                                            return gvc.bindView({
                                                bind: `${dd.name}-inputRow`,
                                                view: () => {
                                                    return `                   
                                                                <div class="" style="${classStyle.left}">${dd.left}</div>
                                                                <div class="" style="${classStyle.right} width: 78%;position: relative">
                                                                <input class="w-100 border-0 pwInput" name="password" type="password" placeholder="輸入原先密碼" onchange="${gvc.event((e) => {
                                                        dd.placehold = e.value;
                                                    })}" value="${dd.placehold}">
                                                                    ${(dd.check) ? `` : ` 
                                                                    <div class="pwCheck" style="font-weight: 400;font-size: 12px;line-height: 17px;color: #FE5541;position: absolute;bottom: 0;right: 0;" onclick="${gvc.event(() => {
                                                        if (vm.userData.pwd !== dd.placehold) {
                                                            dialog.showInfo("密碼輸入錯誤!");
                                                        }
                                                        else {
                                                            vm.data.map((d2) => {
                                                                if (d2.left != "密碼") {
                                                                    d2.visible = 'true';
                                                                }
                                                                else {
                                                                    d2.visible = false;
                                                                }
                                                            });
                                                            dd.visible = false;
                                                            dd.check = true;
                                                            resetPassword = true;
                                                            gvc.notifyDataChange('accountData');
                                                        }
                                                    })}">更改密碼</div>    
                                                                `}
                                                                                   
                                                </div>                               
                                                
                                                                `;
                                                },
                                                divCreate: { style: ``, class: `d-flex align-items-center input-row` }
                                            });
                                        }
                                        else {
                                            if (dd.visible === false) {
                                                return ``;
                                            }
                                            else {
                                                return viewModel.inputRow(dd);
                                            }
                                        }
                                    }))}
                                        </div>`;
                                },
                                divCreate: {}
                            })}
                                ${gvc.bindView({
                                bind: "firstAddress",
                                view: () => {
                                    let returnData = ``;
                                    vm.addressModel.forEach((data) => {
                                        returnData += viewModel.inputRow(data, "readonly");
                                    });
                                    let addBtn = ``;
                                    if (vm.addressModel.length == 0) {
                                        addBtn = `<div class="addr-add" onclick="${gvc.event(() => {
                                            appConfig().changePage(gvc, "editFirstAddress");
                                        })}">新增</div>`;
                                    }
                                    else {
                                        addBtn = `
                                            <div class="d-flex">
                                                <div class="addr-edit" onclick="${gvc.event(() => {
                                            vm.addressModel[3].type = "address";
                                            appConfig().changePage(gvc, "editFirstAddress", { addressModel: vm.addressModel });
                                        })}">編輯</div>
                                                <div class="addr-del" onclick="${gvc.event(() => {
                                            deleteFirstAddress();
                                        })}">刪除</div>
                                            </div>`;
                                    }
                                    return `
                                            <div class="w-100 d-flex flex-column d-none" style="margin-top:6px;">
                                                <div class="w-100 acc-title d-flex justify-content-between align-items-center">
                                                    <div class="">首選地址</div>${addBtn}
                                                </div>                                            
                                                ${returnData}               
                                            </div>`;
                                }, divCreate: {}
                            })}
                                
                            </main>
                            `
                        ]);
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        edit_firstAddress: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        let classStyle = {
                            mySpaceCount: `
                                width: 18px;
                                height: 18px;
                    
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;                         
                                font-weight: 700;
                                font-size: 12px;
                                line-height: 15px;
                                text-align: center; 
                                border: 1px solid #FFFFFF;
                                border-radius: 8px;                    
                                color: #FFFFFF;
                                `,
                            indexTitle: `
                                font-weight: 400;
                                font-size: 15px;
                                line-height: 150%;
                    
                                color: #292929;
                            `,
                            save: `
                                font-weight: 500;
                                font-size: 17px;
                                line-height: 25px;                             
                                
                                text-align: center;
                                
                                color: #FD6A58;
                            `,
                            changePhoto: `
                                font-weight: 700;
                                font-size: 14px;
                                line-height: 20px;
                                font-feature-settings: 'pnum' on, 'lnum' on;                              
                                color: #FD6A58;                                
                                margin-top : 8px;
                            `,
                            accTitle: `
                                font-weight: 700;
                                font-size: 24px;
                                line-height: 35px;
                                color: #292929;
                                margin-bottom : 18px;
                            `
                        };
                        gvc.addStyle(`
        .addr-add{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
      
            
            
            /* HOMEE red */
            
            color: #FD6A58;
        }
        .addr-edit{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #FD6A58;
            margin-right : 12px;
        }
        .addr-del{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #858585;
           
        }
    `);
                        let viewModel = new ViewModel(gvc);
                        let shareView = new SharedView(gvc);
                        let vm = {
                            empty: true
                        };
                        let model = undefined;
                        function initModel() {
                            appConfig().getUserData({
                                callback: (response) => {
                                    var _a, _b, _c, _d, _e, _f, _g;
                                    vm.empty = !!(response === null || response === void 0 ? void 0 : response.addressModel);
                                    let address = (response === null || response === void 0 ? void 0 : response.addressModel) ? response === null || response === void 0 ? void 0 : response.addressModel[3].placehold : "";
                                    model = (_c = (_b = (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data) === null || _b === void 0 ? void 0 : _b.addressModel) !== null && _c !== void 0 ? _c : [
                                        {
                                            left: "姓名",
                                            type: "name",
                                            name: "address-name",
                                            placehold: { last: ((_d = response === null || response === void 0 ? void 0 : response.addressModel) === null || _d === void 0 ? void 0 : _d.last_name) || "姓氏", first: ((_e = response === null || response === void 0 ? void 0 : response.addressModel) === null || _e === void 0 ? void 0 : _e.first_name) || "名稱" }
                                        },
                                        {
                                            left: "電話",
                                            type: "number",
                                            name: "address-phone",
                                            placehold: ((_f = response === null || response === void 0 ? void 0 : response.addressModel) === null || _f === void 0 ? void 0 : _f.address_phone) || ""
                                        },
                                        {
                                            left: "公司名稱",
                                            type: "text",
                                            name: "company",
                                            placehold: ((_g = response === null || response === void 0 ? void 0 : response.addressModel) === null || _g === void 0 ? void 0 : _g.company) || ""
                                        },
                                        {
                                            left: "地址",
                                            type: "address",
                                            name: "address",
                                            placehold: address
                                        }
                                    ];
                                }
                            });
                        }
                        initModel();
                        return `
                        <!--            輸入列-->
                        ${gvc.bindView({
                            bind: "firstAddress",
                            view: () => {
                                let returnData = ``;
                                model.forEach((data) => {
                                    returnData += viewModel.inputRow(data);
                                });
                                return `
                                <div class="w-100 d-flex flex-column" style="margin-top:6px;">
                                    <div class="w-100 acc-title d-flex justify-content-between align-items-center">
                                        <div class="">首選地址</div>
                                    </div>                                            
                                    ${returnData}                                     
                                </div>`;
                            }, onCreate: () => {
                            }
                        })}
                        <!--            按鍵描繪-->
                        ${gvc.bindView({
                            bind: "btnGroup",
                            view: () => {
                                gvc.addStyle(`
                                   .OKBtn{
                                    height: 48px;
                                    left: 0px;
                                    top: 0px;
                                    background: #FD6A58;
                                    border-radius: 28px;
                                    color: #FFFFFF;
                                   }
                                   .delete-btn{
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 400;
                                    font-size: 15px;
                                    line-height: 150%;
                                    /* identical to box height, or 22px */
                                    
                                    text-align: center;
                                    
                                    /* HOMEE black */
                                    
                                    color: #292929;
                                    
                                    margin-top:8px;
                                   }
                               `);
                                if (vm.empty) {
                                    return `
                                    <bottom class="OKBtn w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                        glitter.share.addressModel = model;
                                        appConfig().changePage(gvc, "user_edit_Profile");
                                    })}">更新地址</bottom>
                                    <div class="delete-btn" onclick="${gvc.event(() => {
                                        glitter.share.addressModel = undefined;
                                        appConfig().changePage(gvc, "user_edit_Profile");
                                    })}">刪除地址</div>
                                    `;
                                }
                                else {
                                    return `
                                    <bottom class="OKBtn w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                        model[3].type = "text";
                                        appConfig().changePage(gvc, "user_edit_Profile", {
                                            addressModel: model,
                                        });
                                    })}">
                                       儲存
                                    </bottom>
                                    `;
                                }
                            }, divCreate: { style: `padding: 0 59px;margin-top:40px;`, class: `d-flex flex-column justify-content-center align-items-center` }
                        })}
                        `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        invite_Friend: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
                                <main class="" style=padding:24px 35px 44px;font-family: 'Noto Sans TC';font-style: normal;margin: 0;box-sizing: border-box;"">
                                    ${gvc.bindView({
                                    bind: "icon",
                                    view: () => {
                                        return `
                                        <img src="${new URL('../img/inviteLOGO.svg', import.meta.url)}" alt="LOGO" style="width: 190px;height: 133px;">
                                    `;
                                    }, divCreate: { class: `d-flex flex-column align-items-center`, style: `padding-top:60px;` }
                                })}
                                </main>

                                                          
                            `;
                            },
                        });
                    },
                    editor: () => {
                        return `
                        <!--
                        ${gvc.bindView({
                            bind: "footer",
                            view: () => {
                                let classStyle = {
                                    footerBTN: `
                                                border-radius : 8px;
                                                border:1px solid rgb(210,66,123);
                                                font-size : 14px;
                                                font-weight : 700;
                                                padding:15px;
                                                `,
                                    shareBTN: `
                                                height: 48px;
                                                background: #FD6A58;
                                                border-radius: 24px;
                                                color : white;
                                            `,
                                    QRBTN: `
                                                background-color : white;
                                                color : rgb(210,66,123);
                                                margin-top : 18px;
                                            `
                                };
                                let inviteCode = "";
                                appConfig().getUserData({
                                    callback: (response) => {
                                    }
                                });
                                return `
                                            <bottom style="margin-bottom: 60px;${classStyle.footerBTN}${classStyle.shareBTN} " class="w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                    glitter.runJsInterFace("shareText", {
                                        text: `趕快下載HOMEE APP:https://apps.apple.com/tw/app/homee-marketplace/id6444941721，註冊並輸入我的邀請碼:${inviteCode}，立刻獲得200折 $ 100 優惠券`
                                    }, () => {
                                    });
                                })}">分享優惠連結給朋友</bottom>                                
                                        `;
                            }, divCreate: { class: `d-flex flex-column w-100`, style: `padding:12px 20px ${12 + widget.data.bottomInset}px;margin-top:auto;position: absolute;bottom:0;left: 0;background: #FFFFFF;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);` }
                        })}              
                        -->
                        `;
                    }
                };
            },
        },
        invite_BTN: {
            defaultData: {
                botInset: 0,
                inviteCode: ""
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        glitter.runJsInterFace("getBotInset", {}, (response) => {
                            if (widget.data.botInset != response.data) {
                                widget.data.botInset = response.data;
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        appConfig().getUserData({
                            callback: (response) => {
                                widget.data.inviteCode = response.invite_code;
                                gvc.notifyDataChange('footer');
                            }
                        });
                        return gvc.bindView({
                            bind: "footer",
                            view: () => {
                                let classAdd = {
                                    footerBTN: `
                                        border-radius : 8px;
                                        border:1px solid rgb(210,66,123);
                                        font-size : 14px;
                                        font-weight : 700;
                                        padding:15px;
                                    `,
                                    shareBTN: `
                                        height: 48px;
                                        background: #FD6A58;
                                        border-radius: 24px;
                                        color : white;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 18px;
                                        line-height: 26px;
                                        
                                        text-align: center;
                                        letter-spacing: 0.15em;
                                        color: #FFFFFF;
                                    `,
                                    QRBTN: `
                                        background-color : white;
                                        color : rgb(210,66,123);
                                        margin-top : 18px;
                                    `
                                };
                                return `
                                <bottom style="margin-bottom: 30px;${classAdd.footerBTN}${classAdd.shareBTN}" class="w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                    glitter.runJsInterFace("shareText", {
                                        text: `趕快下載HOMEE APP:https://apps.apple.com/tw/app/homee-marketplace/id6444941721，註冊並輸入我的邀請碼:${widget.data.inviteCode}，立刻獲得200折 $ 100 優惠券`
                                    }, () => {
                                    });
                                })}">分享優惠連結給朋友</bottom>
                                
                            `;
                            }, divCreate: { class: `d-flex flex-column w-100`, style: `padding:12px 20px ${12 + widget.data.botInset}px;margin-top:auto;position: absolute;bottom:0;left: 0;background: #FFFFFF;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);` }
                        });
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        empty: {
            defaultData: {
                link: []
            },
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
        }
    };
});
