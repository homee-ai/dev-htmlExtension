'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { Api } from "../homee/api/homee-api.js";
import { Checkout } from "../api/checkout.js";
import { SharedView } from "../homee/shareView.js";
import { appConfig } from "../config.js";
Plugin.create(import.meta.url, (glitter) => {
    const api = {
        upload: (photoFile, callback) => {
            glitter.share.dialog.dataLoading({ text: '上傳中', visible: true });
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}` }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            glitter.share.dialog.dataLoading({ visible: false });
                            glitter.share.dialog.successMessage({ text: "上傳成功" });
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            glitter.share.dialog.successMessage({ text: "上傳失敗" });
                        },
                    });
                },
                error: (err) => {
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        }
    };
    return {
        nav: {
            defaultData: {
                nav: {
                    leftIcon: new URL('../img/component/left-arrow.svg', import.meta.url),
                    leftPage: "",
                    rightIcon: new URL('../img/component/service.png', import.meta.url),
                    rightPage: ""
                },
                voucherPlaceholder: "輸入優惠代碼"
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
                            title: "優惠券",
                            leftIcon: `<img class="" src="${widget.data.nav.leftIcon}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                                ClickEvent.trigger({ gvc, widget, clickEvent: widget.data.leftEvent });
                            })}">`,
                            rightIcon: `<img class="" src="${widget.data.nav.rightIcon}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                            })}">
                            `
                        });
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">左方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.leftIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        api.upload(data[0].file, (link) => {
                                            widget.data.nav.leftIcon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            (() => {
                                var _a;
                                widget.data.leftEvent = (_a = widget.data.leftEvent) !== null && _a !== void 0 ? _a : {};
                                return ClickEvent.editer(gvc, widget, widget.data.leftEvent, {
                                    hover: true,
                                    option: [],
                                    title: "左方按鈕點擊"
                                });
                            })(),
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">右方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.rightIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        api.upload(data[0].file, (link) => {
                                            widget.data.nav.rightIcon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>
                        `,
                            (() => {
                                var _a;
                                widget.data.rightEvent = (_a = widget.data.rightEvent) !== null && _a !== void 0 ? _a : {};
                                return ClickEvent.editer(gvc, widget, widget.data.rightEvent, {
                                    hover: true,
                                    option: [],
                                    title: "右方按鈕點擊"
                                });
                            })(),
                        ]);
                    }
                };
            },
        },
        voucherInput: {
            defaultData: {
                voucherPlaceholder: "輸入優惠代碼"
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .voucherInput{                        
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                    }
                    .voucherInput::placeholder{
                        color: #858585;
                    }
                    .btnInput:hover{
                        cursor: pointer;
                    }
                    
                `);
                return {
                    view: () => {
                        var _a, _b;
                        return gvc.map([
                            gvc.bindView({
                                bind: "inputVoucherCode",
                                view: () => {
                                    let code = "";
                                    return `
                                    <input class="voucherInput w-100 border-0" style="position: relative" onchange="${gvc.event((e) => {
                                        code = e.value;
                                    })}" placeholder="${widget.data.voucherPlaceholder}">
                                    <div class="btnInput" style="font-weight: 700;font-size: 18px;line-height: 26px;color: #FE5541;position: absolute;right:16px;top: 13px;" onclick="${gvc.event(() => {
                                        var _a;
                                        (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data.callback(code);
                                        gvc.glitter.goBack();
                                    })}">
                                        套用
                                    </div>
                                `;
                                },
                                divCreate: {
                                    style: "margin:24px;padding:13px 16px;border: 1px solid #E0E0E0 ;border-radius: 8px;position: relative;",
                                    class: `${(((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data) && ((_b = gvc.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.obj.data.callback)) ? `` : `d-none`}`
                                }
                            })
                        ]);
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `輸入預測文字`,
                                default: widget.data.voucherPlaceholder,
                                placeHolder: widget.data.voucherPlaceholder,
                                callback: (text) => {
                                    widget.data.voucherPlaceholder = text;
                                    widget.refreshAll();
                                }
                            }),
                        ]);
                    }
                };
            },
        },
        voucherList: {
            defaultData: {
                voucherCardList: [{
                        vendor_id: "0",
                        vendor_icon: new URL('../img/component/voucher/cardIcon.png', import.meta.url),
                        vendor_name: "HOMEE",
                        vendor_context: "優惠券內容",
                        name: "用戶邀請朋友成功獎勵",
                        discount: "現折 10,000 元",
                        lowCostText: "最低消費：",
                        lowCostNumber: "NT$ 30,000",
                        dateText: "有效期限：",
                        date: "31 三月 2025",
                        dateType: "",
                    }, {
                        vendor_id: "1",
                        vendor_icon: new URL('../img/component/voucher/cardIcon.png', import.meta.url),
                        vendor_name: "HOMEE",
                        vendor_context: "優惠券內容",
                        name: "門市消費滿萬贈 HOMEE $500 優惠券",
                        discount: "現折 500 元",
                        lowCostText: "最低消費：",
                        lowCostNumber: "NT$ 0",
                        dateText: "即將失效：",
                        date: "剩下 8 小時",
                        dateType: "warning-"
                    }]
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .voucherCard{
                        background: #FFFFFF;
                        border-radius: 20px;
                        padding:8px 0;
                        box-shadow: -2px 2px 15px rgba(0, 0, 0, 0.05);
                        margin-bottom:16px;
                        position:relative;
                    }
                    .vendor_name{
                        font-weight: 400;
                        font-size: 15px;
                        color: #1E1E1E;
                    }
                    .vendor_context{
                        padding-top:3px;
                        font-weight: 700;
                        font-size: 12px;
                        color: #FE5541;
                    }
                    .vendor_context:hover{
                        cursor: pointer;
                    }
                    .name{
                        font-weight: 700;
                        font-size: 16px;
                        line-height: 23px;
                        color: #1E1E1E;
                    }
                    .discount{
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 35px;
                        color: #FE5541;
                        margin:4px 0;
                    }
                    .lowCostText{
                        font-weight: 400;
                        font-size: 12px;                        
                        color: #858585;
                    }
                    .lowCostNumber{
                        font-weight: 700;
                        font-size: 12px;
                        color: #1E1E1E;
                    }
                    .dateText{
                        font-weight: 400;
                        font-size: 12px;
                        color: #858585;
                    }
                    .date{
                        font-weight: 700;
                        font-size: 12px;
                        color: #1E1E1E;
                    }
                    .warning-dateText{
                        font-weight: 400;
                        font-size: 12px;
                        color: #FF0000;
                    }
                    .warning-date{
                        font-weight: 700;
                        font-size: 12px;
                        color: #FF0000;
                    }
                    .lackCircle{
                        width:24px;
                        height:24px;
                        border-radius:50%;
                        background:rgba(0, 0, 0, 0.05);
                    }
                    .leftCircle{                        
                        position:absolute;
                        left:-12px;
                        top:calc(50% - 12px);
                                              
                    }
                    .rightCircle{
                        width:24px;
                        height:24px;
                        border-radius:50%;
                        position:absolute;
                        right:-12px;
                        top:calc(50% - 12px);                      
                    }
                    
                `);
                const vm = {
                    loading: false
                };
                try {
                    if (true) {
                        vm.loading = true;
                        gvc.notifyDataChange('voucherCardList');
                        widget.data.voucherCardList = [];
                        Checkout.getVoucher('Select', (data) => {
                            vm.loading = false;
                            data = data.filter((dd) => {
                                return dd.config.howToPlay !== 'rebate';
                            });
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
                }
                catch (e) {
                }
                return {
                    view: () => {
                        return gvc.map([
                            gvc.bindView({
                                bind: "voucherCardList",
                                view: () => {
                                    if (vm.loading) {
                                        return `
                                        <div class="w-100">
                                            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                                <div class="spinner-border" role="status"></div>
                                            </div>
                                        </div>`;
                                    }
                                    let clock = gvc.glitter.ut.clock();
                                    return gvc.map(widget.data.voucherCardList.map((data) => {
                                        console.log("------------------------------");
                                        console.log(data);
                                        return `
                                        <div class="voucherCard overflow-hidden" onclick="${gvc.event(() => {
                                            var _a, _b;
                                            if (clock.stop() < 1000) {
                                                return;
                                            }
                                            if (!((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data.callback)) {
                                                appConfig().changePage(gvc, 'user_couponDetail', data);
                                            }
                                            else {
                                                (_b = gvc.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.obj.data.callback(data.code);
                                                gvc.glitter.goBack();
                                            }
                                        })}"> 
                                            <div class="d-flex" style="padding: 8px 22px;">
                                                <img src="${data.vendor_icon}" style="width: 24px;height: 24px;border-radius: 50%;margin-right: 8px;">
                                                <div class="vendor_name" style="">${data.vendor_name}</div>
                                                <div class="vendor_context ms-auto" onclick="${gvc.event(() => {
                                            clock.zeroing();
                                            data.selectBack = () => {
                                                var _a;
                                                (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data.callback(data.code);
                                                gvc.glitter.goBack("shopping_cart");
                                            };
                                            appConfig().changePage(gvc, 'user_couponDetail', data);
                                        })}">${data.vendor_context}</div>
                                            </div>
                                            <div class="w-100" style="background: #E0E0E0;height: 1px;"></div>
                                            <div class="" style="padding: 8px 22px;">
                                                <div class="name">${data.name}</div>
                                                <div class="discount">${data.discount}</div>
                                                <div class="d-flex ">
                                                    <div class="lowCostText">${data.lowCostText}</div>
                                                    <div class="lowCostNumber">${data.lowCostNumber}</div>
                                                    <div class="ms-auto d-flex">
                                                        <div class="${data.dateType}dateText">${data.dateText}</div>
                                                        <div class="${data.dateType}date">${data.date}</div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div class="lackCircle leftCircle"></div>
                                            <div class="lackCircle rightCircle"></div>
                                        </div>      
                                    `;
                                    }));
                                },
                                divCreate: { style: `padding:24px 24px 0;`, class: `w-100` }
                            })
                        ]);
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
                    view: () => { return ``; },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
