'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { SharedView } from '../../widget/sharedView.js';
import { Voucher } from '../../api/voucher.js';
import { Dialog } from '../../widget/dialog.js';
init((gvc, glitter, gBundle) => {
    var _a;
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
            overflow-y: auto;
        }

        body {
            width: 100%;
            height: 100%;
        }

        main {
            width: 100%;
            padding: 24px 19px 44px;
            font-family: 'Noto Sans TC';
            font-style: normal;
            margin: 0;
            box-sizing: border-box;
        }
    `);
    const shareView = new SharedView(gvc);
    const dialog = new Dialog(gvc);
    let voucherText = '';
    const viewType = (_a = gBundle.viewType) !== null && _a !== void 0 ? _a : 'Select';
    let vm = {
        empty: true,
        model: { backPoint: 0, couponEnable: [] },
    };
    dialog.dataLoading(true);
    Voucher.getVoucher(viewType, (data) => {
        dialog.dataLoading(false);
        if (data) {
            vm.model.couponEnable = data;
        }
        else {
            dialog.showInfo('載入失敗');
        }
        gvc.notifyDataChange('mainView');
    });
    return {
        onCreateView: () => {
            let botInset = 10;
            glitter.runJsInterFace('getBotInset', {}, (response) => {
                botInset = response.data;
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => ({ data: 10 }),
            });
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
                        <div class="w-100 d-flex" style="padding-right: 26px;">
                            ${shareView.navigationBar({
                        title: '點數回饋 / 優惠券',
                        leftIcon: `<img
                                    class=""
                                    src="img/sample/idea/left-arrow.svg"
                                    style="width: 24px;height: 24px;margin-right: 16px"
                                    alt=""
                                    onclick="${gvc.event(() => {
                            if (glitter.pageConfig.length === 1) {
                                glitter.runJsInterFace('dismiss', {}, () => { });
                            }
                            else {
                                glitter.goBack();
                            }
                        })}"
                                />`,
                        rightIcon: ``,
                    })}
                        </div>
                        <main class="p-0" style="">
                            ${(() => {
                        switch (viewType) {
                            case 'Select':
                                return `
                                            <div
                                                class="d-flex"
                                                style="
                                                    margin-left: 35px;
                                                    margin-right: 35px;
                                                    width: calc(100% - 70px);
                                                    height: 48px;
                                                    background: #FFFFFF;
                                                    box-shadow: -2px 2px 15px rgba(0, 0, 0, 0.05);
                                                    border-radius: 10px;margin-top:36px;
                                                "
                                            >
                                                <input
                                                    class="flex-fill form-control"
                                                    style="
                                                        background: none;
                                                        outline: none;
                                                        border: none;
                                                        font-size: 14px;
                                                        font-family: 'Noto Sans TC';
                                                        font-style: normal;
                                                    "
                                                    placeholder="輸入優惠代碼"
                                                    onchange="${gvc.event((e) => {
                                    voucherText = e.value;
                                })}"
                                                />
                                                <img
                                                    src="img/voucherEnter.svg"
                                                    style="width: 48px; height: 48px;"
                                                    onclick="${gvc.event(() => {
                                    glitter.runJsInterFace('selectVoucher', {
                                        code: voucherText,
                                    }, () => { });
                                })}"
                                                />
                                            </div>
                                            <div
                                                style="width: calc(100% - 112px);margin-left: 56px;height: 1px;margin-top: 24px;margin-bottom: 24px;background:#E0E0E0;"
                                            ></div>
                                        `;
                            case 'Preview':
                                return gvc.bindView({
                                    bind: 'backPoint',
                                    view: () => {
                                        gvc.addStyle(`
                                                    .giveBack {
                                                        font-weight: 500;
                                                        font-size: 18px;
                                                        line-height: 200%;
                                                        color: #292929;
                                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                                    }
                                                    .backPoint {
                                                        font-weight: 700;
                                                        font-size: 32px;
                                                        line-height: 46px;
                                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                                        color: #fd6a58;
                                                    }
                                                `);
                                        return `
                                                    <div class="d-flex align-items-baseline justify-content-center">
                                                        <div class="giveBack">點數回饋：</div>
                                                        <div class="backPoint">${vm.model.backPoint}</div>
                                                    </div>
                                                `;
                                    },
                                    divCreate: {
                                        style: `height:96px;background: #FBF9F6;border-radius: 20px;margin:24px;`,
                                        class: `d-flex justify-content-center align-items-center `,
                                    },
                                });
                            case 'History':
                                return `
                                        <div style="margin-top:24px;"></div>
                                    `;
                        }
                    })()}
                            ${gvc.bindView({
                        bind: 'coupon',
                        view: () => {
                            gvc.addStyle(`
                                        .couponcompany : {
                                            font-weight: 400;
                                            font-size: 12px;
                                            line-height: 17px;
                                            color: #292929;
                                        }
                                    `);
                            return gvc.map(vm.model.couponEnable.map((coupon, index) => {
                                return gvc.bindView({
                                    bind: `couponDetail${index}`,
                                    view: () => {
                                        return `
                                                        <div
                                                            class="d-flex align-items-center"
                                                            style="
                                                                margin-left: 35px;
                                                                margin-right: 35px;
                                                                height: 104px;
                                                                background: #FFFFFF;
                                                                box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);
                                                                border-radius: 20px;margin-bottom: 16px;padding-left: 28px;
                                                            "
                                                            onclick="${gvc.event(() => {
                                            switch (viewType) {
                                                case 'Preview':
                                                case 'History':
                                                    glitter.changePage('jsPage/user/couponDetail.js', 'couponDetail', true, { data: coupon });
                                                    break;
                                                case 'Select':
                                                    glitter.runJsInterFace('selectVoucher', {
                                                        code: coupon.code,
                                                    }, () => { });
                                                    break;
                                            }
                                        })}"
                                                        >
                                                            <div
                                                                class="d-flex flex-column align-items-center"
                                                                style="width: 60px;overflow: hidden;"
                                                            >
                                                                <img src="${coupon.vendor_icon}" style="width: 56px;height: 56px;" />
                                                                <span
                                                                    style="
                                                                        font-family: 'Noto Sans TC';
                                                                        font-style: normal;
                                                                        font-weight: 400;
                                                                        font-size: 10px;
                                                                        width: 60px;
                                                                        line-height: 12px;
                                                                        margin-top: 4px;
                                                                        word-break: break-all;
                                                                        overflow: hidden; 
                                                                        white-space: nowrap;
                                                                        text-overflow: ellipsis;
                                                                        -webkit-line-clamp: 1;
                                                                        -webkit-box-orient: vertical;  
                                                                        overflow: hidden;
                                                                        text-align: center;
                                                                    "
                                                                    >${coupon.vendor_name}</span
                                                                >
                                                            </div>
                                                            <div
                                                                style="
                                                                    width: 1px;
                                                                    height: 64px;
                                                                    background: #D6D6D6;
                                                                    margin-left: 24px;
                                                                "
                                                            ></div>
                                                            <div
                                                                class="d-flex flex-column justify-content-center"
                                                                style="margin-left: 20px;width: calc(100% - 170px);">
                                                                <span       
                                                                    style="
                                                                        font-family: 'Noto Sans TC';
                                                                        font-style: normal;
                                                                        font-weight: 700;
                                                                        font-size: 18px;
                                                                        line-height: 26px;
                                                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                                                        color: #FD6A58;
                                                                    " 
                                                                    >${coupon.title}</span
                                                                >
                                                                <span
                                                                    style="
                                                                        font-family: 'Noto Sans TC';
                                                                        font-style: normal;
                                                                        font-weight: 400;
                                                                        font-size: 12px;
                                                                        line-height: 17px;
                                                                    "
                                                                    >${coupon.subTitle}</span
                                                                >
                                                                <span
                                                                    style="
                                                                        font-family: 'Noto Sans TC';
                                                                        font-style: normal;
                                                                        font-weight: 400;
                                                                        font-size: 10px;
                                                                        line-height: 14px;color: #858585;
                                                                    "
                                                                    >${coupon.formatEndTime}</span
                                                                >
                                                            </div>
                                                            <div class="flex-fill"></div>
                                                            ${glitter.print(() => {
                                            if (coupon.isUse) {
                                                return `
                                                                    <div
                                                                        class="px-2"
                                                                        style="
                                                                            background: #E0E0E0;
                                                                            border-radius: 4px;
                                                                            color: #858585;
                                                                            font-family: 'Noto Sans TC';
                                                                            font-style: normal;
                                                                            font-weight: 400;
                                                                            font-size: 12px;
                                                                            line-height: 17px;
                                                                            margin-right: 10px;
                                                                        "
                                                                    >
                                                                        已使用
                                                                    </div>
                                                                `;
                                            }
                                            else {
                                                return `
                                                                    <div
                                                                        class="px-2"
                                                                        style="
                                                                            background: #FD6A58;
                                                                            border-radius: 4px;
                                                                            color: white;
                                                                            font-family: 'Noto Sans TC';
                                                                            font-style: normal;
                                                                            font-weight: 400;
                                                                            font-size: 12px;
                                                                            line-height: 17px;
                                                                            margin-right: 10px;
                                                                        "
                                                                    >
                                                                        使用
                                                                    </div>
                                                                `;
                                            }
                                        })}
                                                        </div>
                                                    `;
                                    },
                                    divCreate: { style: ``, class: `` },
                                });
                            }));
                        },
                        divCreate: { style: `padding-bottom:100px;`, class: `` },
                    })}
                        </main>
                    `;
                },
                divCreate: { class: ``, style: `height:100vh; position:relative;padding-bottom: 100px;` },
            });
        },
        onResume: () => { },
        onCreate: () => { },
    };
});
