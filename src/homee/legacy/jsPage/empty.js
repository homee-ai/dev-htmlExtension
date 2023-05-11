import { init } from '../glitterBundle/GVController.js';
import { ViewModel } from "../view/mainViewApi";
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
            background: #F8F3ED;
        }

        body {
            width: 100%;
            height: 100%;
            background: #F8F3ED;
        }

        main {
            padding: 24px 35px 44px;
            background: #F8F3ED;
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
        }

        .homeBlack {
            color: #292929;
        }

        .mySpaceCount {
            width: 18px;
            height: 18px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            line-height: 15px;
            text-align: center;
            background: #FD6A58;
            /* HOMEE white */

            border: 1px solid #FFFFFF;
            border-radius: 8px;
            /* HOMEE white */

            color: #FFFFFF;

        }

        .indexTitle {
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;

            /* HOMEE white */
            color: #292929;
        }`);
    let viewModel = new ViewModel(gvc);
    return {
        onCreateView: () => {
            let topInset = 10;
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
        <div class="w-100 d-flex" style="padding-right: 26px;background: #F8F3ED;padding-top: ${10 + topInset}px;">
            ${gvc.bindView(() => {
                        var noticeCount = 0;
                        glitter.runJsInterFace("setNotificationBadgeCallBack", {}, (response) => {
                            noticeCount = parseInt(response.data, 10);
                            gvc.notifyDataChange('notification');
                        });
                        return {
                            bind: `notification`,
                            view: () => {
                                return ` <img class="ms-auto" src="img/notify.svg" alt="" onclick="${gvc.event(() => {
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
            <img  src="img/setting.svg" alt="" style="margin-left: 20px" onclick="${gvc.event(() => {
                        glitter.runJsInterFace("toSetting", {}, () => {
                        });
                    })}">
        </div>
        <main style="">
        <div  class="d-flex" ><img class="w-100" src="img/test.svg" alt=""></div>
        <div class="bg-white" style="padding: 16px;box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);border-radius: 20px; gap: 8px; margin-top: 45px">
            <div class="d-flex">
                <span class="homeBlack" >我的訂單</span>
                <div class="d-flex align-items-center" style="margin-left: auto" onclick="${gvc.event(() => {
                        glitter.runJsInterFace("seeAllOrder", {}, () => {
                        });
                    })}">
                    查看全部
                    <img class="ms-1" src="img/angle-right.svg" alt="">
                </div>
            </div>
         ${(() => {
                        let model = {
                            loading: true,
                            data: {
                                total: "100",
                                status: "-1",
                                order_number: "#21071107",
                                datetime: "Jul 03, 2021 12:20:49 PM",
                                line_items: [
                                    {
                                        product_name: "CBD 麻糬好眠枕 - 人體工學型（預購）",
                                        sku: "C050001-1",
                                        price: "2980",
                                        quantity: "1",
                                        subtotal: "2980",
                                    },
                                    {
                                        product_name: "CBD 麻糬好眠枕 - 人體工學型（預購）",
                                        sku: "C050001-1",
                                        price: "2980",
                                        quantity: "1",
                                        subtotal: "2980"
                                    },
                                    {
                                        product_name: "CBD 麻糬好眠枕 - 人體工學型（預購）",
                                        sku: "C050001-1",
                                        price: "2980",
                                        quantity: "1",
                                        subtotal: "2980"
                                    },
                                ],
                                shipping_fees: "80",
                                billing_address: {
                                    state: "已付款",
                                    first_name: "張",
                                    last_name: "庭瑋",
                                    address1: "台北市 南港區 市民大道七段100號",
                                    phone: "0918928372",
                                },
                                shipping_address: {
                                    state: "已出貨",
                                    first_name: "張",
                                    last_name: "庭瑋",
                                    address1: "台北市 南港區 市民大道七段100號",
                                    phone: "0918928372",
                                },
                            },
                        };
                        glitter.runJsInterFace("getTopOrder", {}, (response) => {
                            model.data = response.data;
                            gvc.notifyDataChange('latestOrder');
                        }, {
                            webFunction: () => {
                                return { data: model.data };
                            }
                        });
                        let id = "latestOrder";
                        return gvc.bindView({
                            bind: id,
                            view: () => {
                                return viewModel.indexOrder(model.data);
                            },
                            divCreate: {},
                            onCreate: () => {
                            }
                        });
                    })()}
        </div>
         ${(() => {
                        let model = {
                            loading: true,
                            data: [
                                {
                                    title: "我的空間",
                                    icon: "img/myspace.svg",
                                    count: 0,
                                    click: () => {
                                        glitter.runJsInterFace("openMySpace", {}, () => {
                                        });
                                    }
                                },
                                {
                                    title: "我的靈感",
                                    icon: "img/myidea.svg",
                                    count: 0,
                                    click: () => {
                                        glitter.runJsInterFace("openMyThink", {}, () => {
                                        });
                                    }
                                },
                                {
                                    title: "回饋優惠",
                                    icon: "img/discount.svg",
                                    count: 0,
                                    click: () => {
                                        glitter.runJsInterFace("openReWard", {}, () => {
                                        });
                                    }
                                }
                            ]
                        };
                        let id = glitter.getUUID();
                        return gvc.bindView({
                            bind: id,
                            view: () => {
                                return viewModel.indexUserSpace(model.data);
                            },
                            divCreate: {
                                class: `bg-white d-flex justify-content-between`,
                                style: `padding: 24px;box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);border-radius: 20px; gap: 8px; margin-top: 16px`
                            },
                            onCreate: () => {
                            }
                        });
                    })()}
         ${(() => {
                        let model = {
                            data: [
                                {
                                    title: "我們的服務",
                                    icon: "img/service.svg",
                                    click: () => {
                                        glitter.runJsInterFace("ourService", {}, () => {
                                        });
                                    },
                                },
                                {
                                    title: "我的帳號",
                                    icon: "img/account.svg",
                                    click: () => {
                                        glitter.runJsInterFace("myAccount", {}, () => {
                                        });
                                    },
                                },
                                {
                                    title: "線上專人服務",
                                    icon: "img/1v1service.svg",
                                    click: () => {
                                        glitter.runJsInterFace("mess", {}, () => {
                                        });
                                    },
                                },
                                {
                                    title: "我要反饋",
                                    icon: "img/report.svg",
                                    click: () => {
                                        glitter.runJsInterFace("onlineService", {}, () => {
                                        });
                                    },
                                }
                            ],
                            loading: true
                        };
                        let id = "serviceList";
                        return gvc.bindView({
                            bind: id,
                            view: () => {
                                return viewModel.indexServiceList(model.data);
                            },
                            divCreate: {
                                class: `bg-white d-flex justify-content-between flex-column`,
                                style: `padding: 18px 16px;box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);border-radius: 20px; gap: 8px; margin-top: 16px;`
                            },
                            onCreate: () => {
                            }
                        });
                    })()}
<div class="w-100" style="height: 44px;"></div>
    </main>`;
                },
                divCreate: { class: ``, style: `` }
            });
        }
    };
});
