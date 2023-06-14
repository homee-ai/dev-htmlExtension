'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js"
import {Checkout, CheckOutData} from "../api/checkout.js";
import {Dialog} from "../dialog/dialog-mobile.js"
import {Product} from "../api/product.js";

Plugin.create(import.meta.url, (glitter, editMode) => {
    return {
        nav: {
            defaultData: {
                nav: {
                    rightIcon: new URL('../img/component/service.png', import.meta.url),
                    rightPage: "",

                },

            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    
                    
                `)
                const sharedView = new SharedView(gvc);

                return {
                    view: () => {
                        return sharedView.navigationBar({
                            title: "購物車",
                            leftIcon: ``,
                            rightIcon: `<img class="" src="${widget.data.nav.rightIcon}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                            })}">
                            `

                        })

                    },
                    editor: () => {
                        return gvc.map([
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
                                    callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.nav.rightIcon = link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                                })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `右方icon跳轉的頁面`,
                                default: widget.data.nav.rightPage,
                                placeHolder: widget.data.nav.rightPage,
                                callback: (text: string) => {
                                    widget.data.nav.rightPage = text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }

                }
            },
        },
        allPage: {
            defaultData: {
                cartItem: [
                    {
                        category: "HOMEE 商城",
                        category_id: "1",
                        item: [
                            {
                                item_id: "1",//variant
                                name: "SORIA 雙抽玻璃移門電視櫃",
                                img: `${new URL('../img/component/shoppingCart/img.png', import.meta.url)}`,
                                kind: "150公分",
                                qty: 1,
                                price: 11520,
                                subtotal: 11520,
                                select: true,
                            }
                        ]
                    },
                    {
                        category: "客廳沙發區",
                        category_id: "2",
                        item: [
                            {
                                item_id: "2",
                                name: "LINZ 三人座羽絨沙發",
                                kind: "四人座沙發布套 淺灰藍色",
                                qty: 1,
                                price: 40500,
                                subtotal: 40500,
                                select: false,
                            },
                            {
                                item_id: "3",
                                name: "SORIA 儲物櫃",
                                kind: "",
                                qty: 1,
                                price: 16100,
                                subtotal: 16100,
                                select: false,
                            }
                        ]
                    },
                    {
                        category: "媽媽新家搭配",
                        category_id: "3",
                        item: [
                            {
                                item_id: "4",
                                name: "SORIA 雙抽玻璃移門電視櫃",
                                kind: "150 公分",
                                qty: 1,
                                price: 11520,
                                subtotal: 11520,
                                select: false,
                            },
                            {
                                item_id: "5",
                                name: "SORIA 儲物櫃",
                                kind: "",
                                qty: 1,
                                price: 16100,
                                subtotal: 16100,
                                select: false,
                            },
                            {
                                item_id: "6",
                                name: "SORIA 玻璃移門儲物書櫃",
                                kind: "小儲物書櫃",
                                qty: 1,
                                price: 9665,
                                subtotal: 9665,
                                select: false,
                            },
                        ]
                    },
                    {
                        category: "電視區搭配",
                        category_id: "4",
                        item: [
                            {
                                item_id: "7",
                                name: "SORIA 雙抽玻璃移門電視櫃",
                                kind: "150 公分",
                                qty: 1,
                                price: 11520,
                                subtotal: 11520,
                                select: true,
                            },
                            {
                                item_id: "8",
                                name: "SORIA 儲物櫃",
                                kind: "",
                                qty: 1,
                                price: 16100,
                                subtotal: 16100,
                                select: false,
                            },
                            {
                                item_id: "9",
                                name: "SORIA 玻璃移門儲物書櫃",
                                kind: "小儲物書櫃",
                                qty: 1,
                                price: 9665,
                                subtotal: 9665,
                                select: false,
                            },
                        ]
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                     html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                        font-style: normal;
                        background:#F8F3ED;
                    }
                    input[type="number"]::-webkit-inner-spin-button, 
                    input[type="number"]::-webkit-outer-spin-button { 
                      margin: 0;
                      -webkit-appearance: none;
                      appearance: none;
                    } 
                                    .item-title{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #1E1E1E;
                                    }
                                    .item-edit{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #858585;
                                    }
                                    .checkboxImg{
                                        width:20px;
                                        height:20px;
                                        margin-right:10px;
                                    }
                                `)
                widget.data.cartItem = []
                const cartSubTotalVM: {
                    loading: boolean,
                    result: boolean,
                    data?: CheckOutData,
                    skuData?: any
                } = {
                    loading: true,
                    result: false
                }
                const sharedView = new SharedView(gvc);
                let cartIn: any[] = [];
                let cartOut: any[] = [];
                let itemIndex = -1;
                let categoryIndex = -1;
                let voucherUse = 0;
                let voucher = 0;
                let subTotal = 0;
                let total = 0;

                let refreshTimer: any = 0

                function storeLocal(){
                    let mapData:any={}
                    widget.data.cartItem.map((data:any)=>{
                        const map2:any={}
                        data.item.map((d2:any)=>{

                            map2[d2.item_id]={"count":d2.qty,"sku":d2.item_id,"isSelect":d2.select}
                        })
                        mapData[data.category]=map2;
                    })
                    console.log(`storeLocal:`+JSON.stringify(mapData))
                    Checkout.setCart({
                        cartData: mapData, callback: (response) => {

                        }
                    })
                }
                function refreshCart() {
                    initial()
                    gvc.notifyDataChange(['cartIn', 'cartSubtotal', 'cartOut'])
                    storeLocal();
                    console.log('cartData---'+JSON.stringify(cartData))
                    cartSubTotalVM.loading = true
                    clearInterval(refreshTimer)
                    refreshTimer = setTimeout(() => {
                        let skuAmount: { sku_id: string, amount: number }[] = []
                        widget.data.cartItem.map((d3: any) => {
                            d3.item.map((dd: any) => {
                                if (dd.select) {
                                    const it = skuAmount.find((d2) => {
                                        return dd.item_id === d2.sku_id
                                    })
                                    if (!it) {
                                        skuAmount.push({sku_id: dd.item_id, amount: dd.qty})
                                    } else {
                                        it!.amount += dd.qty
                                    }
                                }
                            })
                        })
                        cartSubTotalVM.skuData = skuAmount
                        Checkout.setCheckOut({
                            data: skuAmount, callback: (data) => {
                                if (data) {
                                    cartSubTotalVM.data = data as CheckOutData
                                    cartSubTotalVM.loading = false
                                    total = cartSubTotalVM.data.total_amount + cartSubTotalVM.data.discount
                                }
                            }
                        })

                    }, 1000)
                }

                function tryReturn(vo: () => any, defaultt: any) {
                    try {
                        return vo();
                    } catch (e) {
                        return defaultt
                    }
                }

                const skuDataInfo: any = {}
                let cartData: any = undefined

                const dialog = new Dialog(gvc);
                let rebat = 0;
                Checkout.getRebat((response:any)=>{
                    rebat = response.data[0].credit_balance;
                });
                dialog.dataLoading(true)

                function getCartProData() {
                    Checkout.getCart((cdata) => {
                        cartData = cdata
                        let needGetInfoSku: string[] = []
                        Object.keys(cartData).map((dd: any) => {
                            const obj: any = cartData[dd]
                            return {
                                item:
                                    Object.keys(obj).map((d4) => {
                                        if (needGetInfoSku.indexOf(d4) === -1) {
                                            needGetInfoSku.push(d4)
                                        }
                                    })
                            }
                        })
                        Checkout.getCartSkuInfo({skuID: needGetInfoSku, next: (response) => {
                            dialog.dataLoading(false)
                            if (!response) {
                                widget.data.cartItem = []
                                // dialog.showInfo("取得資料異常．")
                            } else {
                                console.log("getCartSkuInfo:"+JSON.stringify(response))
                                response.map((dd: any) => {
                                    skuDataInfo[dd.sku_id] = dd;
                                })
                                widget.data.cartItem = Object.keys(cartData).map((dd: any) => {
                                    const obj: any = cartData[dd]

                                    return {
                                        category: dd,
                                        category_id: dd,
                                        item: Object.keys(obj).filter((d2)=>{
                                            return skuDataInfo[d2].availableForSale
                                        }).map((d4) => {
                                            const oc = obj[d4]
                                            needGetInfoSku.push(d4)
                                            if (!skuDataInfo[d4]) {
                                                return {
                                                    item_id: d4,//variant
                                                    name: "error",
                                                    img: ``,
                                                    kind: "error",
                                                    price: oc.price ?? 0,
                                                    subtotal: oc.price ?? 0,
                                                    deleteEvent: () => {
                                                        obj[d4] = undefined
                                                    },
                                                    get qty() {
                                                        return oc.count
                                                    },
                                                    set qty(newValue) {
                                                        oc.count = parseInt(newValue, 10)
                                                    },
                                                    get select() {
                                                        return oc.isSelect
                                                    },
                                                    set select(newValue) {
                                                        oc.isSelect = newValue;
                                                    }
                                                }
                                            } else {
                                                return {
                                                    item_id: d4,//variant
                                                    name: skuDataInfo[d4].name,
                                                    img: skuDataInfo[d4].preview_image,
                                                    kind: skuDataInfo[d4].attribute_value,
                                                    price: skuDataInfo[d4].price,
                                                    subtotal: skuDataInfo[d4].price * oc.count,
                                                    deleteEvent: () => {
                                                        obj[d4] = undefined
                                                    },
                                                    get qty() {
                                                        return oc.count
                                                    },
                                                    set qty(newValue) {
                                                        oc.count = parseInt(newValue, 10)
                                                    },
                                                    get select() {
                                                        return oc.isSelect
                                                    },
                                                    set select(newValue) {
                                                        oc.isSelect = newValue;
                                                    }
                                                }
                                            }
                                        })
                                    }
                                })
                                widget.data.cartItem = widget.data.cartItem.filter((d4: any) => {
                                    return d4.item.length > 0
                                })
                            }
                            refreshCart()
                        }})

                    })
                }
                getCartProData()
                function initial() {
                    cartIn = []
                    cartOut = []
                    widget.data.cartItem.forEach((cartCategory: any) => {
                        let checkPush = false;
                        cartCategory.item.forEach((item: any) => {
                            if (item.select) {
                                checkPush = true;
                            }
                        })
                        if (checkPush) {
                            cartIn.push(cartCategory);
                        } else {
                            cartOut.push(cartCategory);
                        }
                    })
                }

                initial()

                function addThousandSeparator(item: any): string {
                    item.subtotal = item.qty * item.price;
                    return (item.subtotal).toLocaleString();
                }

                //todo nextstep?
                function checkOut() {
                    if (cartSubTotalVM.loading) {
                        dialog.showInfo('請先等待金額計算完畢!')
                        return;
                    }
                    dialog.dataLoading(true)
                    let skuAmount: { sku_id: string, amount: number }[] = cartSubTotalVM.skuData;
                    // dialog.dataLoading(true)
                    Checkout.checkOut({
                        data: {
                            cartInfo: skuAmount.map((dd) => {
                                return {sku: dd.sku_id, quantity: dd.amount}
                            }),
                            voucherArray: (((cartSubTotalVM.data as any).voucherArray) as any).filter((d2: any) => {
                                return d2.code
                            }).map((dd: any) => {
                                return dd.code
                            }),
                            use_rebate:voucherUse
                        },
                        callback: (response) => {
                            dialog.dataLoading(false)

                            if (response) {
                                console.log(`redirect:${(response as any).redirect}`)
                                // return
                                Checkout.deleteCart(() => {
                                    getCartProData();
                                    gvc.glitter.runJsInterFace("openWeb", {
                                        url: (response as any).redirect
                                    }, (data) => { }, {
                                        webFunction(data: any, callback: (data: any) => void): any {
                                           location.href=(response as any).redirect
                                        }
                                    })
                                })
                            } else {
                                dialog.showInfo('訂單新增異常!');
                            }
                        }
                    })
                }

                return {
                    view: () => {

                        return `
                        <div style="">
                        ${gvc.bindView({
                            bind: "cartIn",
                            view: () => {
                                return gvc.map(cartIn.map((category: any, categoryIndex) => {
                                    return gvc.bindView({
                                        bind: category.category_id,
                                        view: () => {
                                            let categoryCheck = true;
                                            category.item.forEach((item: any) => {
                                                if (!item.select) {
                                                    categoryCheck = false;
                                                }
                                            })
                                            let checkPic = (categoryCheck) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                            return `
                                            <div class="w-100 d-flex align-items-center" style="padding: 12px;">
                                                <img class="checkboxImg" alt="選擇" src="${new URL(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                category.item.forEach((item: any) => {
                                                    item.select = !categoryCheck;
                                                })
                                                refreshCart()
                                            })}">
                                                <div class="item-category">${category.category}</div>
                                                <div class="ms-auto item-edit" onclick="${gvc.event(() => {
                                                category.delete = (category?.delete) ? !category.delete : true;
                                                if (widget.data.DomText == "完成" ){
                                                    widget.data.DomText = "編輯"
                                                }else{
                                                   
                                                    widget.data.DomText = "完成"
                                                }
                                                refreshCart()
                                                
                                                 
                                            })}">${widget.data?.DomText??"編輯"}</div>
                                            </div>
                                            <div style="height:1px; width: 100%;background: #E0E0E0;margin-bottom:12px;"></div>
                                            <div style="padding:0 12px;">   
                                                ${gvc.bindView({
                                                bind: `itemGroup${category.category_id}`,
                                                view: () => {
                                                    gvc.addStyle(`
                                                            .item-name{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #1E1E1E;
                                                            }
                                                            .item-kind{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 10px;
                                                                color: #858585;
                                                            }
                                                            .itemImg{
                                                                width:64px;
                                                                height:64px;
                                                                border-radius: 12px;
                                                                background:white;
                                                                margin-right:16px;
                                                            }
                                                            .item-price{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #FE5541;
                                                            }
                                                        `)
                                                    return gvc.map(category.item.map((item: any, itemIndex: number) => {
                                                        if(item.select){  item.subtotal = item.qty * item.price;}
                                                      
                                                        return gvc.bindView({
                                                            bind: `item${category.category_id}${item.item_id}`,
                                                            view: () => {
                                                                let chooseEvent = () => {
                                                                    item.select = !item.select;
                                                                    refreshCart();
                                                                    // gvc.notifyDataChange(`item${item.item_id}`);
                                                                    // gvc.notifyDataChange('cartinCount');
                                                                }
                                                                let checkPic = (item.select) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                                                if (category.delete) {
                                                                    checkPic = '../img/component/shoppingCart/deleteCircle.png'
                                                                    chooseEvent = () => {
                                                                        dialog.confirm("確定要刪除嘛?", (result) => {
                                                                            if (result == true) {
                                                                                item.deleteEvent()
                                                                                category.item.splice(itemIndex, 1);
                                                                                if (category.item.length == 0) {
                                                                                    let indexToRemove = widget.data.cartItem.findIndex((item: any) => item.category_id == category.category_id);
                                                                                    widget.data.cartItem.splice(indexToRemove, 1);
                                                                                    refreshCart();
                                                                                } else {
                                                                                    refreshCart();
                                                                                }

                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                                return `
                                                                    <img class="checkboxImg" alt="選擇" src="${new URL(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                                    chooseEvent();
                                                                })}">
                                                                    <img class="itemImg" src="${item.img}">
                                                                    <div class="d-flex flex-column flex-grow-1">
                                                                        <div class="item-name" style="white-space:normal;word-wrap:break-word;word-break:break-all;">${item.name}</div>
                                                                        <div class="d-flex" onclick="${gvc.event(()=>{
                                                                            if (item.kind){
                                                                                const dialog = new Dialog()
                                                                                dialog.dataLoading(true);
                                                                                Product.productDetailwithSkuid(item.item_id, (result: any) => {

                                                                                    dialog.dataLoading(false);
                                                                                    glitter.openDiaLog(`${new URL!(`../component/shoppingCart/selectProductKind.js`, import.meta.url)}`, 'changeSku', {
                                                                                        item: item,
                                                                                        other: result,
                                                                                        callback: () => {
                                                                                            refreshCart()
                                                                                        }
                                                                                    }, {
                                                                                        animation: glitter.animation.fade
                                                                                    })
                                                                                })
                                                                            }
                                                                        })}">
                                                                            ${(() => {
                                                                            if (item.kind && item.kind != "Default Title") {
                                                                                return `
                                                                                <div class="item-kind" onclick="${gvc.event(() => {
                                                                                    
                                                                                })}">${item.kind}</div>
                                                                                <img style="width:16px;height:16px;margin-left: 8px;" src="${new URL('../img/component/shoppingCart/downArrow.svg', import.meta.url)}">
                                                                                                `
                                                                            }
                                                                            return ``
                                                                        })()}                                                                        
                                                                        </div>
                                                                        <div class="d-flex " style="margin-top: 13px;">
                                                                            <div class="d-flex" style="">
                                                                                <img style="width: 24px;height: 24px;" src="${new URL('../img/component/minusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                    item.qty--;
                                                                    if (item.qty == 0) {
                                                                        dialog.confirm("確定要刪除嘛?", (result) => {
                                                                            if (result == true) {
                                                                                item.deleteEvent()
                                                                                category.item.splice(itemIndex, 1);

                                                                                if (category.item.length == 0) {
                                                                                    let indexToRemove = widget.data.cartItem.findIndex((item: any) => item.category_id == category.category_id);
                                                                                    widget.data.cartItem.splice(indexToRemove, 1);
                                                                                    refreshCart();
                                                                                } else {
                                                                                    refreshCart();
                                                                                }

                                                                            }
                                                                        })
                                                                    } else {
                                                                        refreshCart();
                                                                    }


                                                                })}">
                                                                    ${gvc.bindView({
                                                                    bind: `qtyNumber${item.item_id}`,
                                                                    view: () => {
                                                                        return `
                                                                        <input class="border-0" style="width: 48px;text-align: center;" type="number" value="${item.qty}" onchange="${gvc.event((e: HTMLInputElement) => {
                                                                            item.qty = e.value
                                                                            if (widget.data.qty < 1) {
                                                                                item.qty = 1;
                                                                            }
                                                                            item.subtotal = item.qty * item.price;
                                                                            refreshCart()
                                                                        })}">`
                                                                    },
                                                                    divCreate: {class: `qtyNumber`, style: ``}
                                                                })}
                                                                <img style="width: 24px;height: 24px;" src="${new URL('../img/component/plusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                    item.qty++;
                                                                    item.subtotal = item.qty * item.price;
                                                                    refreshCart()
                                                                })}">                                        
                                                                            </div>
                                                                            ${gvc.bindView({
                                                                    bind: `itemTotal${item.item_id}`,
                                                                    view: () => {
                                                                        return `NT$ ${addThousandSeparator(item)}`
                                                                    },
                                                                    divCreate: {class: `item-price ms-auto`, style: ``}
                                                                })}                                                                        
                                                                        </div>
                                                                    </div>                                                            
                                                                `
                                                            },
                                                            divCreate: {
                                                                class: `d-flex align-items-center`,
                                                                style: `margin-bottom:16px;`
                                                            }
                                                        })
                                                    }))
                                                }, divCreate: {style: ``, class: ``}
                                            })}   
                                            </div>
                                            `
                                        }
                                        ,
                                        divCreate: {
                                            class: `border`,
                                            style: `background: #FFFFFF;border-radius: 20px;margin:12px`
                                        }
                                    })
                                }))
                            },
                            divCreate: {class: `d-flex flex-column`, style: ``}
                        })}
                        ${gvc.bindView(() => {
                            return {
                                dataList: [{
                                    obj: cartSubTotalVM,
                                    key: "loading",
                                }],
                                bind: "cartSubtotal",
                                view: () => {
                                    gvc.addStyle(`
                                    .subTotal{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #1E1E1E;
                                    }
                                    .voucherBlock{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 15px;
                                        color: #FE5541;
                                    }
                                    .voucher{
                                        color: #FE5541;
                                    }
                                    .voucherInput{
                                        height:100%;
                                        width:24px;
                                    }
                                    .shippingText{
                                        font-weight: 400;
                                        font-size: 12px;
                                        color: #1E1E1E;
                                        padding-top:9px;
                                    }
                                    .totalText{                                        
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #858585;
                                        padding-top:3px;
                                    }
                                    .total{
                                        font-weight: 500;
                                        font-size: 18px;
                                        color: #1E1E1E;
                                        margin-left:8px;
                                    }
                                    .checkout-left{
                                        width:60%;
                                        background:#FFDC6A;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 500;
                                        font-size: 24px;
                                        border-radius: 26px 0px 0px 26px;
                                        padding-left:28px;
                                        color: #1E1E1E;
                                    }
                                    .checkout-right{
                                        width:40%;
                                        background:#FE5541;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 20px;
                                        border-radius: 0px 26px 26px 0px;
                                        color: #FFFFFF;                                        
                                        letter-spacing: 0.15em;
                                    }
                                `)
                                    subTotal = 0;
                                    cartIn.forEach((category: any) => {
                                        category.item.forEach((item: any) => {
                                            console.log(`category.item--`+JSON.stringify(item))
                                            if (item.select) {
                                                subTotal += item.subtotal;
                                            }
                                        })
                                    })
                                    total = subTotal - voucherUse;
                                    return `
                                    <div class="d-flex align-items-center justify-content-between subTotal" style="padding:12px;">
                                        <div>小計金額</div>
                                        <div>${(cartSubTotalVM.loading) ? `計算中...` : subTotal.toLocaleString()}</div>
                                    </div>
                                    <div class="d-flex align-items-center" style="padding:0 12px; margin-bottom:7px;">
                                        <img style="width: 20px;height: 16px;margin-right:10px;" src="${new URL(`../img/component/ticket.svg`, import.meta.url)}">
                                        <div class="voucherBlock" onclick="${gvc.event(() => {
                                        appConfig().changePage(gvc, "voucher", {
                                            callback: (code: string) => {
                                                dialog.dataLoading(true)
                                                Checkout.setVoucher({
                                                    code,
                                                    callback: (result: any) => {
                                                        dialog.dataLoading(false)
                                                        if (!result) {
                                                            dialog.showInfo("無法使用此優惠券!")
                                                        }
                                                        refreshCart()
                                                    }
                                                })
                                            }
                                        })
                                    })}">使用優惠卷或輸入優惠代碼</div>
                                    </div>
                                    ${(() => {
                                        if (cartSubTotalVM.data) {
                                            return gvc.map(cartSubTotalVM.data.voucherArray.map((dd) => {
                                                return `<div class="d-flex w-100 align-items-center" style="padding-left: 12px;padding-right: 12px;margin-top: 12px;margin-bottom: 12px;">
                                      
                                        <span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: left;
word-break: break-all;
white-space: normal;
color: #1E1E1E;">${dd.name}</span>
                                        <span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 500;
font-size: 15px;
margin-left: 10px;
line-height: 150%;
color: #FE5541;
margin-right: 10px;
" onclick="${gvc.event(() => {
                                                    dialog.confirm("是否確認刪除優惠券?", (result) => {
                                                        if (result) {
                                                            dialog.dataLoading(true)
                                                            Checkout.deleteVoucher({
                                                                callback: (result) => {
                                                                    dialog.dataLoading(false)
                                                                    widget.refreshComponent()
                                                                }
                                                            })
                                                        }
                                                    })

                                                })}">${(dd.code) ? "刪除" : ""}</span>
<div class="flex-fill"></div>
  <span class="" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 150%;
/* identical to box height, or 22px */

text-align: right;

/* HOMEE black */

color: #1E1E1E;">${dd.discount}</span>
</div>       `
                                            }))
                                        } else {
                                            return ``
                                        }
                                    })()}
                                    ${gvc.bindView({
                                        bind : "rebat",
                                        view : ()=>{
                                            return `                                                
                                                <div style="font-size: 12px;">你有<span class="voucher mx-1" style="font-size: 15px;">${rebat.toLocaleString()}</span>點數回饋</div>
                                                <div class="d-flex align-items-center">- NT$
                                                    <input class="voucherInput ms-1" type="number" value="${voucherUse}" style="border: 1px solid #E0E0E0;
                                                        border-radius: 4px;text-align: center;width: 48px;" onchange="${gvc.event((e: HTMLInputElement) => {
                                                        voucherUse = (Number(e.value) > rebat) ? rebat : Number(e.value);
                                                        gvc.notifyDataChange('cartSubtotal');
                                                    })}">
                                                </div>                                                                           
                                            `
                                        },
                                        divCreate:{class : `d-flex align-items-center justify-content-between subTotal` , style : `padding:0 12px;margin-bottom:13px;`}
                                    })}                                    
                                    
                                    
                                    <div style="height:1px; width: 100%;background: #E0E0E0;"></div>
                                    <div class="d-flex justify-content-between" style="padding:12px;">
                                        <div class="shippingText">運費將在結帳時計算</div>
                                        <div class="d-flex">
                                            <div class="totalText">總計金額:</div>
                                            <div class="total">
                                                NT$ ${(cartSubTotalVM.loading) ? `計算中...` : (cartSubTotalVM.data!.total_amount + cartSubTotalVM.data!.discount - voucherUse).toLocaleString()}
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div class="d-flex" style="position:fixed;left:0;bottom:${widget.data.buttonPadding ?? 106}px;height:52px;width: calc(100% - 24px);margin-left: 12px;">
                                        <div class="checkout-left d-flex align-items-center">NT$ ${(cartSubTotalVM.loading) ? `計算中...` : (cartSubTotalVM.data!.total_amount + cartSubTotalVM.data!.discount - voucherUse).toLocaleString()}</div>
                                        <div class="checkout-right d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                        checkOut();
                                    })}">結帳</div>
                                    </div>
                                `
                                },
                                divCreate: {
                                    class: `d-flex flex-column border`,
                                    style: `border-radius: 20px;margin:12px;background: #FFFFFF;`
                                },
                                onCreate: () => {
                                }
                            }
                        })}
                        ${gvc.bindView({
                            bind: "cartOut",
                            view: () => {
                                return gvc.map(cartOut.map((category: any, categoryIndex) => {
                                    return `
                                    ${gvc.bindView({
                                        bind: `cartOut` + category.category_id,
                                        view: () => {
                                            let categoryCheck = true;
                                            category.item.forEach((item: any) => {
                                                if (!item.select) {
                                                    categoryCheck = false;
                                                }
                                            })
                                            let checkPic = (categoryCheck) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                            return `
                                            <div class="w-100 d-flex align-items-center" style="padding: 12px;">
                                                <img class="checkboxImg" alt="選擇" src="${new URL(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                category.item.forEach((item: any) => {
                                                    item.select = !categoryCheck;
                                                    // gvc.notifyDataChange(category.category_id)
                                                })
                                                refreshCart()
                                            })}">
                                                <div class="item-category">${category.category}</div>
                                                <div class="ms-auto item-edit" onclick="${gvc.event(() => {
                                                category.delete = (category?.delete) ? !category.delete : true;
                                                refreshCart()
                                            })}">編輯</div>
                                            </div>
                                            <div style="height:1px; width: 100%;background: #E0E0E0;margin-bottom:12px;"></div>
                                            <div style="padding:0 12px;">  
                                            ${(() => {
                                                gvc.addStyle(`
                                                            .item-name{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #1E1E1E;
                                                            }
                                                            .item-kind{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 10px;
                                                                color: #858585;
                                                            }
                                                            .itemImg{
                                                                width:64px;
                                                                height:64px;
                                                                border-radius: 12px;
                                                                background:white;
                                                                margin-right:16px;
                                                            }
                                                            .item-price{
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 15px;
                                                                color: #FE5541;
                                                            }
                                                        `)
                                                return gvc.map(category.item.map((item: any, itemIndex: number) => {
                                                    return gvc.bindView({
                                                        bind: `item${item.item_id}`,
                                                        view: () => {
                                                            let chooseEvent = () => {
                                                                item.select = !item.select;
                                                                refreshCart();
                                                            }
                                                            let checkPic = (item.select) ? '../img/component/shoppingCart/select.png' : '../img/component/shoppingCart/unselect.png'
                                                            if (category.delete) {
                                                                checkPic = '../img/component/shoppingCart/deleteCircle.png'
                                                                chooseEvent = () => {
                                                                    dialog.confirm("確定要刪除嘛?", (check) => {
                                                                        if (check) {
                                                                            item.deleteEvent()
                                                                            category.item.splice(itemIndex, 1);

                                                                            if (category.item.length == 0) {
                                                                                let indexToRemove = widget.data.cartItem.findIndex((item: any) => item.category_id == category.category_id);
                                                                                widget.data.cartItem.splice(indexToRemove, 1);
                                                                                refreshCart();
                                                                            } else {
                                                                                refreshCart();
                                                                            }

                                                                        }
                                                                    })
                                                                }
                                                            }

                                                            return `
                                                                    <img class="checkboxImg" alt="選擇" src="${new URL(`${checkPic}`, import.meta.url)}" onclick="${gvc.event(() => {
                                                                chooseEvent();
                                                            })}">
                                                                    <img class="itemImg" src="${item.img}">
                                                                    <div class="d-flex flex-column flex-grow-1">
                                                                        <div class="item-name">${item.name}</div>
                                                                        <div class="d-flex">
                                                                            ${(() => {
                                                                if (item.kind) {
                                                                    return `
                                                                        <div class="item-kind">${item.kind}</div>
                                                                        <img style="width:16px;height:16px;" src="${new URL('../img/component/shoppingCart/downArrow.svg', import.meta.url)}">
                                                                    `
                                                                }
                                                                return ``
                                                            })()}                                                                            
                                                                        </div>
                                                                        <div class="d-flex " style="margin-top: 13px;">
                                                                            <div class="d-flex" style="">
                                                                                <img style="width: 24px;height: 24px;" src="${new URL('../img/component/minusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                                                                item.qty--;
                                                                item.qty = (item.qty < 1) ? 1 : item.qty;
                                                                item.subtotal = item.qty * item.price;
                                                                refreshCart()
                                                            })}">
                                                                                ${gvc.bindView({
                                                                bind: `qtyNumber${item.item_id}`,
                                                                view: () => {
                                                                    return `
                                                                                            <input class="border-0" style="width: 48px;text-align: center;" type="number" value="${item.qty}" onchange="${gvc.event((e: HTMLInputElement) => {
                                                                        item.qty = e.value
                                                                        if (widget.data.qty < 1) {
                                                                            item.qty = 1;
                                                                        }
                                                                        item.subtotal = item.qty * item.price;
                                                                        refreshCart()
                                                                    })}">`
                                                                }, divCreate: {class: `qtyNumber`, style: ``}
                                                            })}
                                                                                <img style="width: 24px;height: 24px;" src="${new URL('../img/component/plusCircle.svg', import.meta.url)}" onclick="${gvc.event((e: any) => {
                                                                item.qty++;
                                                                item.subtotal = item.qty * item.price;
                                                                refreshCart()
                                                            })}">                                        
                                                                            </div>
                                                                            <div class="item-price ms-auto">NT$ ${addThousandSeparator(item)}</div>
                                                                        </div>
                                                                    </div>                                                            
                                                                `
                                                        },
                                                        divCreate: {
                                                            class: `d-flex align-items-center`,
                                                            style: `margin-bottom:16px;`
                                                        }
                                                    })
                                                }))
                                            })()}                                                                                
                                            </div>
                                            
                                            `
                                        }
                                        ,
                                        divCreate: {
                                            class: `border`,
                                            style: `background: #FFFFFF;border-radius: 20px;margin:12px;margin-bottom:16px`
                                        }
                                    })}
                                    `
                                }))
                            },
                            divCreate: {class: `d-flex flex-column`, style: `padding-bottom:100px;`}
                        })}
                        </div>
                        `
                    },
                    editor: () => {
                        return glitter.htmlGenerate.editeInput({
                            gvc,
                            title: "按鈕下方間距",
                            default: widget.data.buttonPadding ?? "106",
                            placeHolder: "",
                            callback: (text) => {
                                widget.data.buttonPadding = text
                                widget.refreshComponent()
                            }
                        })
                    }
                }
            },
        },
    }
});
