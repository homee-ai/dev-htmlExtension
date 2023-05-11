import { appConfig } from "../config.js";
export class Checkout {
    static addToCart(obj) {
        const glitter = window.glitter;
        Checkout.getCart((cartData) => {
            var _a, _b;
            cartData[obj.category] = (_a = cartData[obj.category]) !== null && _a !== void 0 ? _a : {};
            cartData[obj.category][obj.skuID] = (_b = cartData[obj.category][obj.skuID]) !== null && _b !== void 0 ? _b : {
                count: 0,
                sku: obj.skuID,
                isSelect: true
            };
            cartData[obj.category][obj.skuID].count += obj.amount;
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response) => {
                var _a, _b;
                obj.callback(true);
                glitter.share.cart = (_a = glitter.share.cart) !== null && _a !== void 0 ? _a : {};
                glitter.share.cart.callback = (_b = glitter.share.cart.callback) !== null && _b !== void 0 ? _b : [];
                glitter.share.cart.callback.map((dd) => {
                    dd();
                });
            });
        });
    }
    static setCart({ cartData, callback }) {
        const glitter = window.glitter;
        console.log(`setCart:${JSON.stringify(cartData)}`);
        glitter.runJsInterFace("setSpaceCartData", {
            data: JSON.stringify({ cartData: cartData })
        }, (response2) => {
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response) => {
                var _a, _b;
                callback(true);
                glitter.share.cart = (_a = glitter.share.cart) !== null && _a !== void 0 ? _a : {};
                glitter.share.cart.callback = (_b = glitter.share.cart.callback) !== null && _b !== void 0 ? _b : [];
                glitter.share.cart.callback.map((dd) => {
                    dd();
                });
            });
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                };
            }
        });
    }
    static getCart(callback) {
        const glitter = window.glitter;
        glitter.runJsInterFace("getSpaceCartData", {}, (response2) => {
            glitter.getPro(Checkout.cartTag, (response) => {
                callback((() => {
                    try {
                        const data1 = JSON.parse(response2.data);
                        console.log(`getSpaceCartData:${JSON.stringify(data1)}`);
                        let data = JSON.parse(response.data);
                        console.log('parse' + JSON.stringify(data));
                        Object.keys(data1).map((dd) => {
                            data[dd] = data1[dd];
                        });
                        return data;
                    }
                    catch (e) {
                        return {};
                    }
                })());
            });
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                };
            }
        });
    }
    static deleteCart(callback) {
        const glitter = window.glitter;
        glitter.runJsInterFace("setSpaceCartData", {
            data: ''
        }, (response2) => {
            glitter.setPro(Checkout.cartTag, '', (response) => {
                callback();
            });
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                };
            }
        });
    }
    static getCartSkuInfo({ skuID, next }) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/getCartSkuInfo`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    data: { sku: skuID },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        next(response.data);
                    },
                    error: (err) => {
                        next(false);
                    },
                });
            }
        });
    }
    static setCheckOut({ data, callback }) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/setCart`,
                    type: 'post',
                    headers: { Authorization: response.token },
                    data: JSON.stringify({ sku_ids: data }),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        callback(response);
                    },
                    error: (err) => {
                        callback(false);
                    },
                });
            }
        });
    }
    static setVoucher(obj) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'post',
                    headers: { Authorization: response.token },
                    data: JSON.stringify({ code: obj.code }),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static deleteVoucher(obj) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'delete',
                    headers: { Authorization: response.token },
                    data: JSON.stringify({}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static getVoucher(view, callback) {
        const glitter = window.glitter;
        glitter.addMtScript([{ src: 'https://momentjs.com/downloads/moment-with-locales.js' }], () => {
            const moment = window.moment;
            const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            moment.locale('zh-tw');
            const getEndtime = (t) => {
                let end = '';
                if (t === null) {
                    end = '無使用期限';
                }
                else if (moment(t).isAfter(nowTime)) {
                    if (['小時', '分鐘', '秒'].find((x) => moment(nowTime).to(t).includes(x))) {
                        end = `<a style="color:red">即將失效 : ${moment(nowTime).to(t)}</a>`;
                    }
                    else {
                        end = moment(moment(t, 'YYYY-MM-DD HH:mm:ss')).format('YYYY/MM/DD');
                    }
                }
                else {
                    end = t;
                }
                return end;
            };
            function addThousandSeparator(number) {
                let temp = number.toString();
                return temp.toLocaleString();
            }
            const apiURL = (() => {
                if (view === 'History') {
                    return `${appConfig().serverURL}/api/v1/cart/v2/voucherHistory`;
                }
                else {
                    return `${appConfig().serverURL}/api/v1/cart/v2/voucher`;
                }
            })();
            appConfig().getUserData({
                callback: (response) => {
                    $.ajax({
                        url: apiURL,
                        type: 'get',
                        contentType: 'application/json; charset=utf-8',
                        headers: { Authorization: response.token },
                        success: (res) => {
                            callback(res.voucherList.map((dd) => {
                                const c = dd.config.config;
                                return {
                                    id: dd.id,
                                    note: dd.config.note,
                                    vendor_name: dd.config.vendor ? dd.config.vendor.name : 'HOMEE',
                                    vendor_icon: dd.config.vendor ? dd.config.vendor.icon : 'img/coupon1.svg',
                                    startTime: dd.startTime,
                                    endTime: dd.endTime,
                                    formatEndTime: getEndtime(dd.endTime),
                                    config: dd.config.config,
                                    code: dd.config.code,
                                    name: dd.config.name,
                                    icon: 'img/coupon1.svg',
                                    title: (() => {
                                        let text = '';
                                        console.log(dd);
                                        switch (c.howToPlay) {
                                            case 'discount':
                                                switch (c.accord_rule) {
                                                    case "least": {
                                                        switch (c.accord) {
                                                            case "consum": {
                                                                switch (c.applicability_product) {
                                                                    case 'all':
                                                                        text += '所有商品';
                                                                        break;
                                                                    case 'categories':
                                                                        text += '指定分類';
                                                                        break;
                                                                    case 'products':
                                                                        text += '指定商品';
                                                                        break;
                                                                }
                                                                break;
                                                            }
                                                            case "product": {
                                                                text += `滿 ${c.accord_number} 件 `;
                                                                break;
                                                            }
                                                        }
                                                        switch (c.discount_rebate_select) {
                                                            case 'basic_price':
                                                                text += `現折 ${c.discount_rebate_value} 元`;
                                                                break;
                                                            case 'percent':
                                                                function transToChinese(value) {
                                                                    let ten = Math.floor(value / 10);
                                                                    let digit = value % 10;
                                                                    function convertToChineseNumber(number) {
                                                                        var chineseNumber;
                                                                        switch (number) {
                                                                            case 0:
                                                                                chineseNumber = "零";
                                                                                break;
                                                                            case 1:
                                                                                chineseNumber = "一";
                                                                                break;
                                                                            case 2:
                                                                                chineseNumber = "二";
                                                                                break;
                                                                            case 3:
                                                                                chineseNumber = "三";
                                                                                break;
                                                                            case 4:
                                                                                chineseNumber = "四";
                                                                                break;
                                                                            case 5:
                                                                                chineseNumber = "五";
                                                                                break;
                                                                            case 6:
                                                                                chineseNumber = "六";
                                                                                break;
                                                                            case 7:
                                                                                chineseNumber = "七";
                                                                                break;
                                                                            case 8:
                                                                                chineseNumber = "八";
                                                                                break;
                                                                            case 9:
                                                                                chineseNumber = "九";
                                                                                break;
                                                                            default:
                                                                                chineseNumber = "無對應中文數字";
                                                                        }
                                                                        return chineseNumber;
                                                                    }
                                                                    if (ten != 0) {
                                                                        if (digit == 0) {
                                                                            return convertToChineseNumber(ten);
                                                                        }
                                                                        else {
                                                                            return `${convertToChineseNumber(ten)}${convertToChineseNumber(digit)}`;
                                                                        }
                                                                    }
                                                                    else {
                                                                    }
                                                                }
                                                                text += `即享 ${transToChinese(c.discount_rebate_value)}折 優惠`;
                                                                break;
                                                            case 'single_price':
                                                                text += `商品單價 ${c.discount_rebate_value} 元`;
                                                                break;
                                                            case 'unit_price':
                                                                text += `組合價 ${c.discount_rebate_value} 元`;
                                                                break;
                                                        }
                                                        break;
                                                    }
                                                    case "every": {
                                                        switch (c.accord) {
                                                            case "consum": {
                                                                text += `每滿 ${c.accord_number} 元 `;
                                                                break;
                                                            }
                                                            case "product": {
                                                                text += `每滿 ${c.accord_number} 件 `;
                                                                break;
                                                            }
                                                        }
                                                        switch (c.discount_rebate_select) {
                                                            case 'basic_price':
                                                                text += `現折 ${c.discount_rebate_value} 元`;
                                                                break;
                                                            case 'percent':
                                                                function transToChinese(value) {
                                                                    let ten = value / 10;
                                                                    let digit = value % 10;
                                                                    function convertToChineseNumber(number) {
                                                                        var chineseNumber;
                                                                        switch (number) {
                                                                            case 0:
                                                                                chineseNumber = "零";
                                                                                break;
                                                                            case 1:
                                                                                chineseNumber = "一";
                                                                                break;
                                                                            case 2:
                                                                                chineseNumber = "二";
                                                                                break;
                                                                            case 3:
                                                                                chineseNumber = "三";
                                                                                break;
                                                                            case 4:
                                                                                chineseNumber = "四";
                                                                                break;
                                                                            case 5:
                                                                                chineseNumber = "五";
                                                                                break;
                                                                            case 6:
                                                                                chineseNumber = "六";
                                                                                break;
                                                                            case 7:
                                                                                chineseNumber = "七";
                                                                                break;
                                                                            case 8:
                                                                                chineseNumber = "八";
                                                                                break;
                                                                            case 9:
                                                                                chineseNumber = "九";
                                                                                break;
                                                                            default:
                                                                                chineseNumber = "無對應中文數字";
                                                                        }
                                                                        return chineseNumber;
                                                                    }
                                                                    if (ten != 0) {
                                                                        if (digit == 0) {
                                                                            return convertToChineseNumber(ten);
                                                                        }
                                                                        else {
                                                                            return `${convertToChineseNumber(ten)}${convertToChineseNumber(digit)}`;
                                                                        }
                                                                    }
                                                                    else {
                                                                    }
                                                                }
                                                                text += `即享 ${transToChinese(c.discount_rebate_value)}折 優惠`;
                                                                break;
                                                            case 'single_price':
                                                                text += `商品單價 ${c.discount_rebate_value} 元`;
                                                                break;
                                                            case 'unit_price':
                                                                text += `組合價 ${c.discount_rebate_value} 元`;
                                                                break;
                                                        }
                                                        break;
                                                    }
                                                }
                                                break;
                                            case 'rebate':
                                                let rebateImg = `<img style="height:23px;width: 20px;margin-left: 4px;" src="${new URL('../img/rebate.svg', import.meta.url)}">`;
                                                switch (c.accord_rule) {
                                                    case "least": {
                                                        switch (c.accord) {
                                                            case "consum": {
                                                                switch (c.applicability_product) {
                                                                    case 'all':
                                                                        text += '所有商品';
                                                                        break;
                                                                    case 'categories':
                                                                        text += '指定分類';
                                                                        break;
                                                                    case 'products':
                                                                        text += '指定商品';
                                                                        break;
                                                                }
                                                                break;
                                                            }
                                                            case "product": {
                                                                text += `滿 ${c.accord_number} 件 `;
                                                                break;
                                                            }
                                                        }
                                                        switch (c.discount_rebate_select) {
                                                            case 'basic_price':
                                                                text += `即贈 ${c.discount_rebate_value} ${rebateImg}`;
                                                                break;
                                                            case 'percent':
                                                                text += `即贈 15% ${rebateImg}`;
                                                                break;
                                                        }
                                                        break;
                                                    }
                                                    case "every": {
                                                        switch (c.accord) {
                                                            case "consum": {
                                                                text += `每滿 ${c.accord_number} 元 `;
                                                                break;
                                                            }
                                                            case "product": {
                                                                text += `每滿 ${c.accord_number} 件 `;
                                                                break;
                                                            }
                                                        }
                                                        switch (c.discount_rebate_select) {
                                                            case 'basic_price':
                                                                text += `即贈 ${c.discount_rebate_value} ${rebateImg}`;
                                                                break;
                                                            case 'percent':
                                                                text += `即贈 15% ${rebateImg}`;
                                                                break;
                                                        }
                                                        break;
                                                    }
                                                }
                                                break;
                                            case 'giveaway':
                                                switch (c.giveaway_select) {
                                                    case 'categories':
                                                        if (c.give_categories.length > 1) {
                                                            let temp = "";
                                                            c.give_categories.map((category, index) => {
                                                                if (index > 0) {
                                                                    temp += "、";
                                                                }
                                                                let name = category.name;
                                                                name = name.replace("=== ", "");
                                                                name = name.replace(" ===", "");
                                                                temp += name;
                                                            });
                                                            text += `即贈 ${temp} 任選 1 個`;
                                                        }
                                                        else {
                                                            let temp = c.give_categories[0].name;
                                                            temp = temp.replace("=== ", "");
                                                            temp = temp.replace(" ===", "");
                                                            text += `即贈 ${temp} 任選 1 個`;
                                                        }
                                                        break;
                                                    case 'products':
                                                        if (c.give_products.length > 1) {
                                                            let temp = "";
                                                            c.give_products.map((category, index) => {
                                                                if (index > 0) {
                                                                    temp += "、";
                                                                }
                                                                let name = category.name;
                                                                name = name.replace("=== ", "");
                                                                name = name.replace(" ===", "");
                                                                temp += name;
                                                            });
                                                            text += `即贈 ${temp}  1 個`;
                                                        }
                                                        else {
                                                            let temp = c.give_products[0].name;
                                                            temp = temp.replace("=== ", "");
                                                            temp = temp.replace(" ===", "");
                                                            text += `即贈 ${temp}  1 個`;
                                                        }
                                                        break;
                                                }
                                                break;
                                        }
                                        return text;
                                    })(),
                                    subTitle: (() => {
                                        let text = '';
                                        return dd.config.name;
                                    })(),
                                    isUse: view === 'History',
                                    lowCostText: (() => {
                                        if (c.accord == "consum" && c.accord_rule == "least" && c.howToPlay != "giveaway") {
                                            return "最低消費：";
                                        }
                                        else {
                                            return "適用：";
                                        }
                                    })(),
                                    lowCostNumber: (() => {
                                        let returnText = "";
                                        if (c.accord == "consum" && c.accord_rule == "least" && c.howToPlay != "giveaway") {
                                            return `NT$ ${c.accord_number.toLocaleString()}`;
                                        }
                                        let text = "";
                                        switch (c.applicability_product) {
                                            case 'all':
                                                return `所有商品（全館）`;
                                            case 'categories':
                                                if (c.app_categories.length > 1) {
                                                    c.app_categories.map((data, index) => {
                                                        if (index != 0) {
                                                            text += "、";
                                                        }
                                                        let temp = data.name;
                                                        temp = temp.replace("=== ", "");
                                                        temp = temp.replace(" ===", "");
                                                        text += temp;
                                                    });
                                                    return text;
                                                }
                                                else {
                                                    let temp = c.app_categories[0].name;
                                                    temp = temp.replace("=== ", "");
                                                    temp = temp.replace(" ===", "");
                                                    return temp;
                                                }
                                            case 'products':
                                                if (c.app_products.length > 1) {
                                                    c.app_products.map((data, index) => {
                                                        if (index != 0) {
                                                            text += "、";
                                                        }
                                                        text += data.name;
                                                    });
                                                    return text;
                                                }
                                                else {
                                                    return c.app_products[0].name;
                                                }
                                        }
                                    })(),
                                };
                            }));
                        },
                        error: () => callback(false),
                    });
                }
            });
        }, () => {
        });
    }
    static getOrderList(obj) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/order`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static checkOut(obj) {
        obj.data.mainURL = appConfig().serverURL;
        appConfig().getUserData({
            callback: (response) => {
                obj.data.customerInfo = {
                    "email": response.email
                };
                $.ajax({
                    url: `${appConfig().serverURL}/api/bm/checkout`,
                    type: 'post',
                    headers: { Authorization: response.token },
                    data: JSON.stringify(obj.data),
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        obj.callback(response);
                    },
                    error: (err) => {
                        obj.callback(false);
                    },
                });
            }
        });
    }
    static getRebat(callback) {
        appConfig().getUserData({
            callback: (response) => {
                let rebundUrl = `${appConfig().serverURL}/api/v1/user/customerRebate?l=1&p=1&s=${response.email}`;
                $.ajax({
                    url: rebundUrl,
                    type: 'get',
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        callback(response);
                    },
                    error: (err) => {
                    },
                });
            }
        });
    }
}
Checkout.cartTag = "njasndjnui32hi2";
