import { Glitter } from '../glitterBundle/Glitter.js';
export class Voucher {
    public static getVoucher(view: string, callback: (data: VoucherModel[] | boolean) => void) {
        const glitter = Glitter.glitter;
        glitter.addMtScript(
            [{ src: 'https://momentjs.com/downloads/moment-with-locales.js' }],
            () => {
                const moment = (window as any).moment;
                const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                moment.locale('zh-tw');

                const getEndtime = (t: string) => {
                    let end = '';
                    if (t === null) {
                        end = '無使用期限';
                    } else if (moment(t).isAfter(nowTime)) {
                        if (['小時', '分鐘', '秒'].find((x) => moment(nowTime).to(t).includes(x))) {
                            end = `<a style="color:red">即將失效 : ${moment(nowTime).to(t)}</a>`;
                        } else {
                            end = '使用期限: ' + t;
                        }
                    } else {
                        end = '已過期: ' + t;
                    }
                    return end;
                };

                const apiURL = (() => {
                    if (view === 'History') {
                        return `${glitter.share.apiURL}/api/v1/cart/v2/voucherHistory`;
                    } else {
                        return `${glitter.share.apiURL}/api/v1/cart/v2/voucher`;
                    }
                })();

                $.ajax({
                    url: apiURL,
                    type: 'get',
                    contentType: 'application/json; charset=utf-8',
                    headers: { Authorization: glitter.share.userData.AUTH },
                    success: (res: any) => {
                        callback(
                            res.voucherList.map((dd: any) => {
                                const c = dd.config.config;
                                return {
                                    id: dd.id,
                                    vendor_name: dd.config.vendor ? dd.config.vendor.name : 'HOMEE',
                                    vendor_icon: dd.config.vendor ? dd.config.vendor.icon : 'img/coupon1.svg',
                                    startTime: dd.startTime,
                                    endTime: dd.endTime,
                                    formatEndTime: getEndtime(dd.endTime),
                                    config: dd.config.config,
                                    code: dd.config.code,
                                    name: 'HOMEE',
                                    icon: 'img/coupon1.svg',
                                    title: (() => {
                                        let text = '';
                                        switch (c.howToPlay) {
                                            case 'discount':
                                                switch (c.discount_rebate_select) {
                                                    case 'basic_price':
                                                        text = `現折 ${c.discount_rebate_value} 元`;
                                                        break;
                                                    case 'percent':
                                                        text = `打 ${c.discount_rebate_value} 折`;
                                                        break;
                                                    case 'single_price':
                                                        text = `商品單價 ${c.discount_rebate_value} 元`;
                                                        break;
                                                    case 'unit_price':
                                                        text = `組合價 ${c.discount_rebate_value} 元`;
                                                        break;
                                                }
                                                break;
                                            case 'rebate':
                                                text = `回饋金 ${c.discount_rebate_value} 元`;
                                                break;
                                            case 'giveaway':
                                                text = `贈送指定商品`;
                                                break;
                                        }
                                        return text;
                                    })(),
                                    subTitle: (() => {
                                        let text = '';
                                        switch (dd.config.type) {
                                            case 4:
                                                text += '彩蛋優惠券';
                                                break;
                                            default:
                                                switch (c.applicability_product) {
                                                    case 'all':
                                                        text += '全館商品';
                                                        break;
                                                    case 'categories':
                                                        text += '指定商品類別';
                                                        break;
                                                    case 'products':
                                                        text += '指定商品';
                                                        break;
                                                }
                                                switch (c.accord_rule) {
                                                    case 'least':
                                                        text += `消費滿 ${c.accord_number} `;
                                                        break;
                                                    case 'every':
                                                        text += `每消費 ${c.accord_number} `;
                                                        break;
                                                }
                                                switch (c.accord) {
                                                    case 'consum':
                                                        text += '元';
                                                        break;
                                                    case 'product':
                                                        text += '件';
                                                        break;
                                                }
                                                break;
                                        }
                                        return text;
                                    })(),
                                    isUse: view === 'History',
                                };
                            })
                        );
                    },
                    error: () => callback(false),
                });
            },
            () => {}
        );
    }
}
