import {appConfig} from "../config.js"

export interface CheckOutData {
    product_list: { variant_id: number; sku_id: string; name: string; preview_image: string; price: number; attribute_value: string; amount: number }[];
    total_amount: number;
    discount: number;
    voucherArray: { name: string; code: null | string; used: true; discount: number }[];
    voucherCode: false;
    voucherText: string;
    easterEggCode: false
}


export class Checkout {
    public static cartTag = "njasndjnui32hi2"

    public static addToCart(obj: { category: string, skuID: string, amount: number, callback: (response: boolean) => void }) {
        const glitter = (window as any).glitter
        Checkout.getCart((cartData) => {
            cartData[obj.category] = cartData[obj.category] ?? {}
            cartData[obj.category]!![obj.skuID] = cartData[obj.category]!![obj.skuID] ?? {
                count: 0,
                sku: obj.skuID,
                isSelect: true
            }
            cartData[obj.category]!![obj.skuID].count += obj.amount
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response: any) => {
                obj.callback(true)
                glitter.share.cart = glitter.share.cart ?? {}
                glitter.share.cart.callback = glitter.share.cart.callback ?? []
                glitter.share.cart.callback.map((dd: any) => {
                    dd();
                });
            })
        })
    }

    public static setCart({cartData, callback}: { cartData: any, callback: (response: boolean) => void }) {
        const glitter = (window as any).glitter
        console.log(`setCart:${JSON.stringify(cartData)}`)
        glitter.runJsInterFace("setSpaceCartData", {
            data: JSON.stringify({cartData: cartData})
        }, (response2: any) => {
            glitter.setPro(Checkout.cartTag, JSON.stringify(cartData), (response: any) => {
                callback(true)
                glitter.share.cart = glitter.share.cart ?? {}
                glitter.share.cart.callback = glitter.share.cart.callback ?? []
                glitter.share.cart.callback.map((dd: any) => {
                    dd();
                });
            })
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                }
            }
        })

    }

    public static getCart(callback: (response: {
        [name: string]: {
            [skuID: string]: {
                sku: string,
                count: number,
                select: boolean
            }
        }
    }) => void) {
        const glitter = (window as any).glitter;
        glitter.runJsInterFace("getSpaceCartData", {}, (response2: any) => {
            glitter.getPro(Checkout.cartTag, (response: any) => {
                callback((() => {
                    try {
                        const data1 = JSON.parse(response2.data)
                        console.log(`getSpaceCartData:${JSON.stringify(data1)}`)
                        let data = JSON.parse(response.data)
                        console.log('parse' + JSON.stringify(data))
                        Object.keys(data1).map((dd) => {
                            data[dd] = data1[dd];
                        })
                        return data
                    } catch (e) {
                        return {}
                    }
                })())
            })
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                }
            }
        })
    }

    public static deleteCart(callback: () => void) {
        const glitter = (window as any).glitter;
        glitter.runJsInterFace("setSpaceCartData", {
            data: ''
        }, (response2: any) => {

            glitter.setPro(Checkout.cartTag, '', (response: any) => {
                callback()
            })
        }, {
            webFunction: () => {
                return {
                    data: JSON.stringify({})
                }
            }
        })

    }

    public static getCartSkuInfo({skuID, next}: { skuID: string[], next: (response: any) => void }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/getCartSkuInfo`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    data: {sku: skuID},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {

                        next(response.data)
                    },
                    error: (err: any) => {
                        next(false)
                    },
                });
            }
        })

    }

    public static setCheckOut({
                                  data,
                                  callback
                              }: { data: { sku_id: string; amount: number }[], callback: (data: CheckOutData | boolean) => void }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/setCart`,
                    type: 'post',
                    headers: {Authorization: response.token},
                    data: JSON.stringify({sku_ids: data}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        callback(response)
                    },
                    error: (err: any) => {
                        callback(false)
                    },
                });
            }
        })
    }

    public static setVoucher(obj: {
        code: string,
        callback: (result: boolean) => void
    }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'post',
                    headers: {Authorization: response.token},
                    data: JSON.stringify({code: obj.code}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });
            }
        })

    }

    public static deleteVoucher(obj: {
        callback: (result: boolean) => void
    }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/cart/v2/voucher`,
                    type: 'delete',
                    headers: {Authorization: response.token},
                    data: JSON.stringify({}),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });
            }
        })
    }

    public static getVoucher(view: string, callback: (data: VoucherModel[] | boolean) => void) {
        const glitter = (window as any).glitter;
        glitter.addMtScript(
            [{src: 'https://momentjs.com/downloads/moment-with-locales.js'}],
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
                            end = moment(moment(t, 'YYYY-MM-DD HH:mm:ss')).format('YYYY/MM/DD');
                        }
                    } else {
                        end = t;
                    }
                    return end;
                };
                function addThousandSeparator(number: string): string {

                    let temp = number.toString();
                    return temp.toLocaleString();
                }

                const apiURL = (() => {
                    if (view === 'History') {
                        return `${appConfig().serverURL}/api/v1/cart/v2/voucherHistory`;
                    } else {
                        return `${appConfig().serverURL}/api/v1/cart/v2/voucher`;
                    }
                })();

                appConfig().getUserData({

                    callback: (response: any) => {

                        $.ajax({
                            url: apiURL,
                            type: 'get',
                            contentType: 'application/json; charset=utf-8',
                            headers: {Authorization: response.token},
                            success: (res: any) => {

                                callback(
                                    res.voucherList.map((dd: any) => {

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
                                                console.log(dd)

                                                switch (c.howToPlay) {
                                                    case 'discount':
                                                        switch (c.accord_rule){
                                                            case "least":{
                                                                switch (c.accord){
                                                                    case "consum":{
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
                                                                    case "product":{
                                                                        text += `滿 ${c.accord_number} 件 `;
                                                                        break;
                                                                    }
                                                                }

                                                                switch (c.discount_rebate_select) {
                                                                    case 'basic_price':
                                                                        text += `現折 ${c.discount_rebate_value} 元`;
                                                                        break;
                                                                    case 'percent':
                                                                    function transToChinese(value:number){
                                                                        let ten = Math.floor(value / 10 );
                                                                        let digit = value % 10;

                                                                        function convertToChineseNumber(number:number) {
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
                                                                        if (ten!=0){

                                                                            if (digit==0){
                                                                                return convertToChineseNumber(ten);
                                                                            }else {
                                                                                return `${convertToChineseNumber(ten)}${convertToChineseNumber(digit)}`
                                                                            }
                                                                        }else{

                                                                        }
                                                                    }
                                                                        text += `即享 ${transToChinese(c.discount_rebate_value as number)}折 優惠`;
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
                                                            case "every":{
                                                                switch (c.accord){
                                                                    case "consum":{
                                                                        text += `每滿 ${c.accord_number} 元 `;
                                                                        break;
                                                                    }
                                                                    case "product":{
                                                                        text += `每滿 ${c.accord_number} 件 `;
                                                                        break;
                                                                    }
                                                                }

                                                                switch (c.discount_rebate_select) {
                                                                    case 'basic_price':
                                                                        text += `現折 ${c.discount_rebate_value} 元`;
                                                                        break;
                                                                    case 'percent':
                                                                    function transToChinese(value:number){
                                                                        let ten = value / 10;
                                                                        let digit = value % 10;
                                                                        function convertToChineseNumber(number:number) {
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
                                                                        if (ten!=0){
                                                                            if (digit==0){
                                                                                return convertToChineseNumber(ten);
                                                                            }else {
                                                                                return `${convertToChineseNumber(ten)}${convertToChineseNumber(digit)}`
                                                                            }
                                                                        }else{

                                                                        }
                                                                    }
                                                                        text += `即享 ${transToChinese(c.discount_rebate_value as number)}折 優惠`;
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
                                                        let rebateImg = `<img style="height:23px;width: 20px;margin-left: 4px;" src="${new URL('../img/rebate.svg', import.meta.url)}">`
                                                        switch (c.accord_rule){
                                                            case "least":{
                                                                switch (c.accord){
                                                                    case "consum":{
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
                                                                    case "product":{
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
                                                            case "every":{
                                                                switch (c.accord){
                                                                    case "consum":{
                                                                        text += `每滿 ${c.accord_number} 元 `;
                                                                        break;
                                                                    }
                                                                    case "product":{
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
                                                                if (c.give_categories.length>1){
                                                                    let temp = "";
                                                                    c.give_categories.map((category:any , index:number)=>{
                                                                        if (index>0){
                                                                            temp += "、"
                                                                        }
                                                                        let name:string = category.name;
                                                                        name = name.replace("=== " , "");
                                                                        name = name.replace(" ===" , "");
                                                                        temp += name
                                                                    })
                                                                    text += `即贈 ${temp} 任選 1 個`
                                                                }else {

                                                                    let temp:string = c.give_categories[0].name;
                                                                    temp = temp.replace("=== " , "");
                                                                    temp = temp.replace(" ===" , "");
                                                                    text += `即贈 ${temp} 任選 1 個`;
                                                                }

                                                                break;
                                                            case 'products':
                                                                if (c.give_products.length>1){
                                                                    let temp = "";
                                                                    c.give_products.map((category:any , index:number)=>{
                                                                        if (index>0){
                                                                            temp += "、"
                                                                        }
                                                                        let name:string = category.name;
                                                                        name = name.replace("=== " , "");
                                                                        name = name.replace(" ===" , "");
                                                                        temp += name
                                                                    })
                                                                    text += `即贈 ${temp}  1 個`
                                                                }else {

                                                                    let temp:string = c.give_products[0].name;
                                                                    temp = temp.replace("=== " , "");
                                                                    temp = temp.replace(" ===" , "");
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
                                                // switch (dd.config.type) {
                                                //     case 4:
                                                //         text += '彩蛋優惠券';
                                                //         break;
                                                //     default:
                                                //
                                                // }
                                                // switch (c.applicability_product) {
                                                //     case 'all':
                                                //         text += '全館商品';
                                                //         break;
                                                //     case 'categories':
                                                //         text += '指定商品類別';
                                                //         break;
                                                //     case 'products':
                                                //         text += '指定商品';
                                                //         break;
                                                // }
                                                // switch (c.accord_rule) {
                                                //     case 'least':
                                                //         text += `消費滿 ${c.accord_number} `;
                                                //         break;
                                                //     case 'every':
                                                //         text += `每消費 ${c.accord_number} `;
                                                //         break;
                                                // }
                                                // switch (c.accord) {
                                                //     case 'consum':
                                                //         text += '元';
                                                //         break;
                                                //     case 'product':
                                                //         text += '件';
                                                //         break;
                                                // }

                                                return dd.config.name;
                                            })(),
                                            isUse: view === 'History',
                                            lowCostText : (()=>{
                                                if (c.accord=="consum" && c.accord_rule == "least" && c.howToPlay != "giveaway"){
                                                    return "最低消費："
                                                }else {
                                                    return "適用："
                                                }

                                            })(),
                                            lowCostNumber : (()=>{

                                                let returnText = ""

                                                if (c.accord=="consum" && c.accord_rule == "least" && c.howToPlay != "giveaway"){
                                                    return `NT$ ${c.accord_number.toLocaleString()}`
                                                }
                                                let text = ""
                                                switch (c.applicability_product) {
                                                    case 'all':
                                                        return `所有商品（全館）`
                                                    case 'categories':
                                                        if (c.app_categories.length > 1){
                                                            c.app_categories.map((data:any,index:number)=>{
                                                                if (index!=0){
                                                                    text += "、"
                                                                }
                                                                let temp:string = data.name;
                                                                temp = temp.replace("=== " , "");
                                                                temp = temp.replace(" ===" , "");
                                                                text += temp
                                                            })
                                                            return text
                                                        }else {
                                                            let temp:string = c.app_categories[0].name;
                                                            temp = temp.replace("=== " , "");
                                                            temp = temp.replace(" ===" , "");
                                                            return temp;
                                                        }

                                                    case 'products':
                                                        if (c.app_products.length > 1){
                                                            c.app_products.map((data:any,index:number)=>{
                                                                if (index!=0){
                                                                    text += "、"
                                                                }
                                                                text += data.name
                                                            })
                                                            return text
                                                        }else {
                                                            return c.app_products[0].name;
                                                        }
                                                }



                                            })(),

                                        };
                                    })
                                );
                            },
                            error: () => callback(false),
                        });
                    }
                })

            },
            () => {
            }
        );
    }

    public static getOrderList(obj: {
        callback: (result: any) => void
    }) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/order`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });
            }
        })
    }

    public static checkOut(obj: {
        data: {
            "cartInfo": {
                "sku": string,
                "quantity": number
            }[],
            "customerInfo"?: {
                "email": string
            },
            "mainURL"?: string,
            "voucherArray": string[],
            use_rebate:number
        }
        callback: (response: boolean | {
            "result": boolean,
            "message": string,
            "create_time": string,
            "redirect": string
        }) => void
    }) {
        obj.data.mainURL = appConfig().serverURL
        appConfig().getUserData({
            callback: (response: any) => {
                obj.data.customerInfo = {
                    "email": response.email
                }

                $.ajax({
                    url: `${appConfig().serverURL}/api/bm/checkout`,
                    type: 'post',
                    headers: {Authorization: response.token},
                    data: JSON.stringify(obj.data),
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        obj.callback(response)
                    },
                    error: (err: any) => {
                        obj.callback(false)
                    },
                });

            }
        })
    }

    public static getRebat(callback:(response:any)=>void){
        appConfig().getUserData({
            callback: (response: any) => {
                let rebundUrl = `${appConfig().serverURL}/api/v1/user/customerRebate?l=1&p=1&s=${response.email}`
                $.ajax({
                    url: rebundUrl,
                    type: 'get',
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        callback(response);
                    },
                    error: (err: any) => {

                    },
                });
            }
        })
    }
}