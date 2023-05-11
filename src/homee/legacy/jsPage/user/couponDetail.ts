'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from '../../view/coupleView.js';
import { SharedView } from '../../widget/sharedView.js';

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
            overflow-y: auto;
        }

        body {
            width: 100%;
            height: 100%;
        }

        main {
            padding: 24px 19px 44px;
            font-family: 'Noto Sans TC';
            font-style: normal;
            margin: 0;
            box-sizing: border-box;
            width: 100%;
        }
    `);

    let viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    const data: VoucherModel = gBundle.data;

    return {
        onCreateView: () => {
            if (data === undefined) {
                glitter.changePage('jsPage/user/couponTotal.js', 'couponTotal', true, {});
                return '';
            } else {
                let topInset: number = glitter.share.topInset;
                let botInset: number = 10;
                let vm = {
                    empty: true,
                    model: {
                        couponEnable: {
                            id: '0',
                            icon: data.vendor_icon,
                            company: data.vendor_name,
                            discount: data.title,
                            condition: data.subTitle,
                            date: data.formatEndTime,
                            click: () => {
                                glitter.runJsInterFace('useCoupon', {}, () => {}, { webFunction: () => ({}) });
                            },
                        },
                        text: [
                            {
                                title: '優惠內容',
                                context: data.name,
                            },
                            {
                                title: '有效期限',
                                context: data.endTime === null ? '無使用期限' : `${data.startTime} - ${data.endTime}`,
                            },
                            {
                                title: '適用商品',
                                context: (() => {
                                    let text = '';
                                    switch (data.config.applicability_product) {
                                        case 'all':
                                            text += '全館商品';
                                            break;
                                        case 'categories':
                                            text += '指定商品類別';
                                            break;
                                        case 'products':
                                            data.config.app_products.map((a: { name: string }, i: number) => {
                                                text += a.name + (data.config.app_products.length == i + 1 ? '' : ', ');
                                            });
                                            break;
                                    }
                                    return text;
                                })(),
                            },
                            {
                                title: '付款',
                                context: '適用於所有付款方式',
                            },
                            {
                                title: '物流',
                                context: '適用於所有物流方式',
                            },
                            {
                                title: '注意事項',
                                context:
                                    '※ 此優惠不可與其他優惠同時使用\n' +
                                    '※ 訂單金額無法累計折扣\n' +
                                    '※ 消費折扣金額僅以商品金額為限，不含運費等額外服務之費用\n' +
                                    '※ 若需退貨導致消費金額未達滿額折扣之標準，退款時將會扣除折扣金額以及 1% 回饋金\n' +
                                    '※ HOMEE 保有修改活動及最終解釋之權利，請以網站公告為準',
                            },
                        ],
                    },
                };

                glitter.runJsInterFace(
                    'getBotInset',
                    {},
                    (response) => {
                        botInset = response.data;
                        gvc.notifyDataChange('mainView');
                    },
                    {
                        webFunction: () => ({ data: 10 }),
                    }
                );

                return gvc.bindView({
                    bind: `mainView`,
                    view: () => {
                        return /*html*/ `
                            <div class="w-100 d-flex" style="padding-right: 26px;">
                                ${shareView.navigationBar({
                                    title: '優惠券內容',
                                    leftIcon: /*html*/ ` <img
                                        class=""
                                        src="img/sample/idea/left-arrow.svg"
                                        style="width: 24px;height: 24px;margin-right: 16px"
                                        alt=""
                                        onclick="${gvc.event(() => glitter.goBack('couponTotal'))}"
                                    />`,
                                    rightIcon: /*html*/ `
                                        <img
                                            class=""
                                            src="img/customerService.png"
                                            style="width: 28px;height: 28px;"
                                            alt=""
                                            onclick="${gvc.event(() => glitter.goBack('main2'))}"
                                        />
                                    `,
                                })}
                            </div>
                            <main style="padding-left: 35px; padding-right: 35px;" class="">
                                ${gvc.bindView({
                                    bind: 'coupon',
                                    // 取得優惠卷內容物, 再用 divcreate 控制背景
                                    view: () => viewModel.couponRow(vm.model.couponEnable),
                                    divCreate: {
                                        style: `margin-bottom:16px; padding:16px; background: #FFFFFF; border-radius: 20px; box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);`,
                                        class: `d-flex align-items-center`,
                                    },
                                })}
                                ${gvc.bindView({
                                    bind: 'context',
                                    view: () => {
                                        gvc.addStyle(`
                                            .contextTitle {
                                                font-weight: 700;
                                                font-size: 15px;
                                                line-height: 150%;
                                                color: #292929;
                                            }
                                            .contextText {
                                                font-weight: 400;
                                                font-size: 12px;
                                                line-height: 17px;
                                                color: #292929;
                                                line-height: 17px;
                                                word-break: break-all;
                                                white-space: normal;
                                            }
                                        `);
                                        let returnHTML = ``;
                                        vm.model.text.forEach((context) => {
                                            returnHTML += /*html*/ `
                                                ${gvc.bindView({
                                                    bind: context.title,
                                                    view: () => {
                                                        let newContext = context.context.replace(/(\r\n)|(\n)/g, '<br>');
                                                        return /*html*/ `
                                                            <div class="contextTitle">${context.title}</div>
                                                            <div class="contextText">${newContext}</div>
                                                        `;
                                                    },
                                                    divCreate: {
                                                        style: `margin-bottom:16px;`,
                                                        class: `d-flex flex-column align-items-baseline`,
                                                    },
                                                })}
                                            `;
                                        });
                                        return returnHTML;
                                    },
                                    divCreate: { style: ``, class: `` },
                                })}
                            </main>
                        `;
                    },
                    divCreate: { class: ``, style: `height:100vh; position:relative;` },
                });
            }
        },
        onResume: () => {},
        onCreate: () => {},
    };
});
