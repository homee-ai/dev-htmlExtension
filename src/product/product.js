'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { Product } from "../api/product.js";
import { Checkout } from "../api/checkout.js";
import { Dialog } from "../dialog/dialog-mobile.js";
import { appConfig } from "../config.js";
Plugin.create(import.meta.url, (glitter, editMode) => {
    return {
        allPage: {
            defaultData: {
                "qty": 1,
                "intro": [{
                        "text": "<p>OLVAN 檯燈外形簡約優雅，能為您的睡房添加充滿格調，同時具有極佳質感的照明單品。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈底座採用實木材料，具有優良出色的穩固承重力，整體厚實穩固。棉布或百頁材質燈罩讓燈光更柔和，輕鬆營造朦朧浪漫的氛圍，為你快節奏的生活中帶來一些平靜和溫柔，別有一番浪漫情懷。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈有多重款式任你選擇，很適合自用或作為禮品送給親友。HOMEE 成就每一個明亮溫馨的家，與您一同構建理想中的質感生活！</p>\n<p> </p>\n<p> </p>\n<h4>商品規格</h4>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>直徑</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>棉布款：26 公分，百頁：24 公分</p>\n</td>\n</tr>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>寬</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>32 公分</p>\n</td>\n</tr>\n</tbody>\n</table>\n<br>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p data-mce-style=\"text-align: left;\"><strong>材質說明</strong></p>\n</td>\n<td data-mce-style=\"width: 70%;\">\n<p>底座：原木，燈罩：棉布 / PVC</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p> </p>\n<p> </p>\n<h4>相關說明</h4>\n<p>※ 訂購前敬請詳閱<a href=\"https://homee.cc/legal/refund-policy\" target=\"_blank\">退換貨說明</a>，您送出訂單的同時將視同您已詳閱、同意以下規定。</p>\n<p>※ 顏色差異：商品顏色或布料會因您觀看的裝置 (手機、平板或電腦等) 而無法100%相同，商品顏色與布料以實品為主。</p>\n<p>※ 尺寸誤差：所有產品尺寸皆為人工丈量，可能因測量不同而存在誤差，0.5 - 2 公分 屬正常。</p>\n<p>※ 溫馨提醒：家具類商品長途運輸難免有碰撞風險，HOMEE 將盡力協助您服務至商品完善，您可放心選購。</p>\n<p>※ 商品交期：HOMEE 提供平台讓您使用合宜價錢直接向供應廠採購因此交期會因工廠有無現貨而有異動，有現貨約 1 週配送，無現貨需等約 2~4 週。 </p>",
                        "title": "商品介紹"
                    }],
                "price": "9960",
                "marginL": "10px",
                "marginR": "10px",
                "sale_price": "13500",
                "preview_image": "",
                "attribute_list": [{
                        "attribute_key": "定制款式",
                        "display_order": 1,
                        "attribute_values": [{ "value": "棉布款", "display_order": 1, "selected": true }, {
                                "value": "百頁款",
                                "display_order": 2
                            }]
                    }],
                "name": "OLVAN 檯燈",
                "productData": {
                    "attribute_list": [{
                            "attribute_key": "定制款式",
                            "display_order": 1,
                            "attribute_values": [{
                                    "value": "棉布款",
                                    "display_order": 1,
                                    "selected": true
                                }, { "value": "百頁款", "display_order": 2 }]
                        }],
                    "product_detail": {
                        "id": 8129130922284,
                        "name": "OLVAN 檯燈",
                        "handle": "olvan-檯燈",
                        "images": ["https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44609065.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471483.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471451.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471499.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471468.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471467.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471477.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44609066.jpg?v=1675167898&width=720"],
                        "created_time": 1675166918000,
                        "updated_time": 1675175826000,
                        "bodyHtml": "<p>OLVAN 檯燈外形簡約優雅，能為您的睡房添加充滿格調，同時具有極佳質感的照明單品。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈底座採用實木材料，具有優良出色的穩固承重力，整體厚實穩固。棉布或百頁材質燈罩讓燈光更柔和，輕鬆營造朦朧浪漫的氛圍，為你快節奏的生活中帶來一些平靜和溫柔，別有一番浪漫情懷。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈有多重款式任你選擇，很適合自用或作為禮品送給親友。HOMEE 成就每一個明亮溫馨的家，與您一同構建理想中的質感生活！</p>\n<p> </p>\n<p> </p>\n<h4>商品規格</h4>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>直徑</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>棉布款：26 公分，百頁：24 公分</p>\n</td>\n</tr>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>寬</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>32 公分</p>\n</td>\n</tr>\n</tbody>\n</table>\n<br>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p data-mce-style=\"text-align: left;\"><strong>材質說明</strong></p>\n</td>\n<td data-mce-style=\"width: 70%;\">\n<p>底座：原木，燈罩：棉布 / PVC</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p> </p>\n<p> </p>\n<h4>相關說明</h4>\n<p>※ 訂購前敬請詳閱<a href=\"https://homee.cc/legal/refund-policy\" target=\"_blank\">退換貨說明</a>，您送出訂單的同時將視同您已詳閱、同意以下規定。</p>\n<p>※ 顏色差異：商品顏色或布料會因您觀看的裝置 (手機、平板或電腦等) 而無法100%相同，商品顏色與布料以實品為主。</p>\n<p>※ 尺寸誤差：所有產品尺寸皆為人工丈量，可能因測量不同而存在誤差，0.5 - 2 公分 屬正常。</p>\n<p>※ 溫馨提醒：家具類商品長途運輸難免有碰撞風險，HOMEE 將盡力協助您服務至商品完善，您可放心選購。</p>\n<p>※ 商品交期：HOMEE 提供平台讓您使用合宜價錢直接向供應廠採購因此交期會因工廠有無現貨而有異動，有現貨約 1 週配送，無現貨需等約 2~4 週。 </p>"
                    },
                    "sku_list": {
                        "棉布款": {
                            "sku_id": "G010025-1",
                            "attribute_key": "棉布款",
                            "attribute_value": "棉布款",
                            "attribute_list": ["棉布款", null, null],
                            "isEnabled": true,
                            "sale_price": 519,
                            "price": 519,
                            "image_index": 0
                        },
                        "百頁款": {
                            "sku_id": "G010025-2",
                            "attribute_key": "百頁款",
                            "attribute_value": "百頁款",
                            "attribute_list": ["百頁款", null, null],
                            "isEnabled": true,
                            "sale_price": 519,
                            "price": 519,
                            "image_index": 7
                        }
                    }
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let bottomInset = 0;
                gvc.addStyle(`
                   
                    .productTitle{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        color: #292929;
                    }
                    .productPriceRow .sale_price{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 20px;
                        color: #FD6A58;
                    }
                    .productPriceRow .price{
                        font-family: 'Noto Sans TC';
                        font-weight: 400;
                        font-size: 15px;
                        font-size: 20px;
                        color: #858585;
                        text-decoration-line: line-through;
                        
                        margin-left:40px;
                        padding-top:6px;
                    }
                    .productQTYRow .qtyBar{
                        width:40px;
                        height:2px;
                        background:#292929;
                    }
                    .productQTYRow .qtyNumber{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        margin:0 16px;
                        color: #292929;
                    }
                    .kindUnselected{                                        
                        border: 1px solid #D6D6D6;
                        border-radius: 5px;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 14px;
                        color: #292929;
                        margin-right : 8px;
                        padding: 4px 12px 3px;
                    }
                    .kindSelected{                                        
                        background: rgba(41, 41, 41, 0.1);                                                                                
                        border: 1px solid #292929;
                        border-radius: 5px;
        
                    }
                    .sizeSelectTitle{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 15px;
                        color: #292929;
                    }
                `);
                function addThousandSeparator(numStr) {
                    const num = Number(numStr);
                    return num.toLocaleString();
                }
                function qtyChange(action = true) {
                    widget.data.qty += (action) ? 1 : -1;
                    if (widget.data.qty < 0) {
                        widget.data.qty = 0;
                    }
                    gvc.notifyDataChange("qtyNumber");
                }
                function goToSlide(index) {
                    const oldActiveEl = document.querySelector('.swiper-pagination .swiper-pagination-bullet-active');
                    if (oldActiveEl) {
                        oldActiveEl.classList.remove('swiper-pagination-bullet-active');
                    }
                    const newActiveEl = document.querySelectorAll('.swiper-pagination .swiper-pagination-bullet')[index];
                    if (newActiveEl) {
                        newActiveEl.classList.add('swiper-pagination-bullet-active');
                    }
                    glitter.share.swiper.map((dd) => {
                        try {
                            dd.slideTo(index + 1);
                        }
                        catch (e) { }
                    });
                }
                return {
                    view: () => {
                        var _a, _b, _c;
                        let posterID = ((_b = (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data) === null || _b === void 0 ? void 0 : _b.poster_id) || undefined;
                        if (widget.data.loading) {
                            return `                            
                            <div class="w-100">
                                <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                    <div class="spinner-border" role="status"></div>
                                </div>
                            </div>`;
                        }
                        let sku_list = (_c = (widget.data.productData && widget.data.productData.sku_list)) !== null && _c !== void 0 ? _c : {};
                        let key = [];
                        widget.data.attribute_list.map((dd) => {
                            const select = dd.attribute_values.find((d2) => {
                                return d2.selected;
                            });
                            select && key.push(select.value);
                        });
                        const selectSku = sku_list[key.join(' / ')];
                        setTimeout(() => {
                            goToSlide(selectSku.image_index);
                        }, 250);
                        return `       
                       ${gvc.bindView({
                            bind: 'productTitle',
                            view: () => {
                                return `  
                            <div class="productTitle" style="white-space:normal;word-wrap:break-word;word-break:break-all;">${widget.data.name}</div>
                            <div class="d-flex productPriceRow" style="">
                                <div class="sale_price">NT$ ${addThousandSeparator(selectSku.sale_price)}</div>
                                <div class="price ${selectSku && (selectSku.sale_price === selectSku.price) ? 'd-none' : ''}">NT$ ${addThousandSeparator(selectSku.price)}</div>
                            </div>`;
                            },
                            divCreate: { class: `d-flex flex-column` }
                        })}   
                        
                        <div class="productQTYRow d-flex align-items-center justify-content-between " style="margin: 16px 0;">
                            <div class="qtyBar"></div>
                            <div class="d-flex">
                                <img src="${new URL('../img/component/minusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                            qtyChange(false);
                        })}">
                                ${gvc.bindView({
                            bind: "qtyNumber",
                            view: () => {
                                return `
                                        <input class="border-0 text-center" style="width: 45px;"  value="${widget.data.qty}" onchange="${gvc.event((e) => {
                                    widget.data.qty = e.value;
                                    if (widget.data.qty < 0) {
                                        widget.data.qty = 0;
                                        gvc.notifyDataChange("qtyNumber");
                                    }
                                })}">`;
                            }, divCreate: { class: `qtyNumber d-flex align-items-center justify-content-center`, style: `` }
                        })}
                                <img src="${new URL('../img/component/plusCircle.svg', import.meta.url)}" onclick="${gvc.event(() => {
                            qtyChange();
                        })}">
                                
                            </div>
                        </div>
                        
                        ${gvc.bindView({
                            bind: "sizeSelect",
                            view: () => {
                                function productKindDom(index, sizeType) {
                                    return `
                                        ${gvc.bindView({
                                        bind: `type${index}`,
                                        view: () => {
                                            return `
                                                <div class="sizeSelectTitle">
                                                    ${sizeType.attribute_key}
                                                </div>
                                                <div class="d-flex flex-wrap" style="overflow: scroll;">
                                                    ${gvc.map(sizeType.attribute_values.map((data, index) => {
                                                let className = "kindUnselected";
                                                if (data.selected) {
                                                    className += " kindSelected";
                                                }
                                                return `
                                                    <div class="${className}" style="margin-top: 8px;" onclick="${gvc.event(() => {
                                                    sizeType.attribute_values.map((dd) => {
                                                        dd.selected = false;
                                                    });
                                                    data.selected = true;
                                                    widget.refreshComponent();
                                                })}">${data.value}
                                                    </div>
                                                        `;
                                            }))}
                                                </div>      
                                                `;
                                        }, divCreate: { class: ``, style: `margin-bottom:8px;` },
                                    })}
                                        
                                    `;
                                }
                                return gvc.map(widget.data.attribute_list.map((sizeType, index) => {
                                    if (sizeType.attribute_key != "Title") {
                                        return productKindDom(index, sizeType);
                                    }
                                    else
                                        return ``;
                                }));
                            }, divCreate: { class: ``, style: "padding-bottom:32px;border-bottom:1px solid rgb(30,30,30,0.1);" },
                        })}
                        
                        ${gvc.bindView({
                            bind: `intro`,
                            view: () => {
                                gvc.addStyle(`
                                    .intro{
                                        padding-bottom : 90px;
                                    }
                                    .intro img{
                                      max-width:100%;
                                    }
                                    .introTitle{
                                        font-family : 'Noto Sans TC';
                                        font-style : normal;
                                        font-weight : 700;
                                        font-size : 24px;
                                        color : #292929;
                                        margin-bottom : 16px;
                                    }
                                    .introText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #292929;
                                        white-space:normal;
                                        word-wrap:break-word;
                                        word-break:break-all;        
                                                                       
                                    }
                                    
                                `);
                                return `
                                    ${gvc.map(widget.data.intro.map((intro) => {
                                    return `
                                            <div class="intro">
                                                <div class="introTitle">${intro.title}</div>
                                                <div class="introText">${intro.text}</div>
                                            </div>
                                        `;
                                }))}
                                `;
                            }, divCreate: { class: `productIntroText`, style: `padding-top:40px;` },
                            onCreate: () => {
                                let intro = document.querySelector('.productIntroText');
                                let links = intro.querySelectorAll('a');
                                links.forEach(link => {
                                    link.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        gvc.glitter.runJsInterFace("openWeb", {
                                            url: link.href
                                        }, (data) => {
                                        }, {
                                            webFunction(data, callback) {
                                                gvc.glitter.openNewTab(link.href);
                                            }
                                        });
                                    });
                                });
                            }
                        })}
                        
                        ${gvc.bindView({
                            bind: "footer",
                            view: () => {
                                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                                    if (bottomInset != response.data) {
                                        bottomInset = response.data;
                                        gvc.notifyDataChange("footer");
                                    }
                                }, {
                                    webFunction: () => {
                                        return { data: 20 };
                                    }
                                });
                                gvc.addStyle(`
                                    .footerIMG {
                                        width: 22px;
                                        height: 20px;
                                    }
                                    .footerText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                        text-align: center;
                                        color: #858585;
                                    }
                                    .footerBTN{
                                        
                                    }
                                    .footerBTNLeft{
                                        background: #FFDC6A;
                                        padding:14px 29px;
                                        border-radius: 24px 0px 0px 24px;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 14px;
                                        color: #1E1E1E;
                                    }
                                    .footerBTNRight{
                                        background: #FE5541;
                                        padding:14px 29px;
                                        border-radius: 0px 24px 24px 0px;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 14px;
                                        color: #FFFFFF;
                                    }
                                `);
                                return `
                                <div class="footer d-flex align-items-center " style="padding:12px 20px ${bottomInset}px;background: #FFFFFF;box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);">
                                    <div class="d-flex flex-column align-items-center" style="width: 40px;" onclick="${gvc.event(() => {
                                    gvc.glitter.runJsInterFace("intentOutSide", {
                                        url: "fb-messenger-public://user-thread/142541949661977?intent_trigger=mme&source_id=1441792&nav=discover"
                                    }, (data) => { }, {
                                        webFunction(data, callback) {
                                            gvc.glitter.openNewTab(data.data.url);
                                        }
                                    });
                                })}">
                                        <img class="footerIMG" src="${new URL('../img/component/customer_service.png', import.meta.url)}" >
                                        <div class="footerText">
                                            客服
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column align-items-center d-none" style="width: 40px;">
                                        <img class="footerIMG" src="${new URL('../img/component/send.svg', import.meta.url)}">
                                        <div class="footerText">
                                            分享給
                                        </div>
                                        
                                    </div>
                                    
                                    <div class="footerBTN  flex-fill ${selectSku.t3dModel ? `d-none` : ``} d-flex flex-fill align-items-center justify-content-center text-white" style="background: #FFDC6A;
                                        padding:14px 29px;
                                        border-radius: 24px;
                                        background: ${(selectSku.availableForSale) ? `#FE5541` : `grey`};
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 14px;
                                        margin-left: 20px;" onclick="${gvc.event((e) => {
                                    const dialog = new Dialog(gvc);
                                    if (selectSku.availableForSale) {
                                        Checkout.addToCart({
                                            category: "購物車",
                                            skuID: selectSku.sku_id,
                                            amount: widget.data.qty,
                                            callback: (response) => {
                                                dialog.showInfo('已加入購物車');
                                            }
                                        });
                                    }
                                    else {
                                        dialog.showInfo("產品已售完");
                                    }
                                })}">${(selectSku.availableForSale) ? `加入購物車` : `已售完`}
                                    </div>
                                    <div class="footerBTN ms-auto d-flex  flex-fill ${selectSku.t3dModel ? `` : `d-none`}">
                                        <div class="footerBTNLeft d-flex align-items-center justify-content-center flex-fill" onclick="${gvc.event(() => {
                                    const data = {
                                        data: widget.data.productData.product_detail,
                                        sku: selectSku
                                    };
                                    appConfig().changePage(gvc, 'more_space', {
                                        product: data
                                    }, {});
                                })}">加入至空間</div>
                                        <div class="footerBTNRight d-flex align-items-center justify-content-center flex-fill" style="background: ${(selectSku.availableForSale) ? `#FE5541` : `grey`};" onclick="${gvc.event((e) => {
                                    const dialog = new Dialog(gvc);
                                    if (selectSku.availableForSale) {
                                        Checkout.addToCart({
                                            category: "購物車",
                                            skuID: selectSku.sku_id,
                                            amount: widget.data.qty,
                                            callback: (response) => {
                                                dialog.showInfo('已加入購物車');
                                            }
                                        });
                                    }
                                    else {
                                        dialog.showInfo("產品已售完");
                                    }
                                })}">${(selectSku.availableForSale) ? `加入購物車` : `已售完`}</div>
                                    </div>
                                </div>
                                `;
                            }, divCreate: { style: `left: 0px;`, class: `position-fixed bottom-0 w-100 m-0 left-0 p-0` }
                        })}
                    `;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        code: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        var _a, _b;
                        console.log("資料");
                        console.log(gvc.parameter.pageConfig);
                        const config = (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.config;
                        const data = (_b = gvc.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.obj.data;
                        console.log("data::::" + JSON.stringify(data));
                        const nav = config.find((dd) => {
                            return dd.type === 'navigationBar';
                        });
                        nav && (nav.data.title = data.name);
                        const dialog = new Dialog(gvc);
                        if (!editMode) {
                            dialog.dataLoading(true);
                            const banner = config.find((dd) => {
                                return dd.type === 'banner';
                            });
                            banner && (banner.data.link = ['https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg']);
                            banner.refreshComponent();
                            const allPage = config.find((dd) => {
                                return dd.type === 'allPage' || dd.type === 'productDetail';
                            });
                            allPage.data.loading = true;
                            allPage.refreshComponent();
                        }
                        if (data.id) {
                            Product.productDetail(data.id, (result) => {
                                dialog.dataLoading(false);
                                if (!result) {
                                    dialog.showInfo('加載失敗');
                                    setTimeout(() => {
                                        gvc.glitter.goBack();
                                    }, 500);
                                }
                                else {
                                    const banner = config.find((dd) => {
                                        return dd.type === 'banner';
                                    });
                                    nav && (nav.data.title = result.product_detail.name);
                                    banner && (banner.data.link = result.product_detail.images.map((dd) => {
                                        return {
                                            "img": dd
                                        };
                                    }));
                                    banner.refreshComponent();
                                    const allPage = config.find((dd) => {
                                        return dd.type === 'allPage' || dd.type === 'productDetail';
                                    });
                                    allPage.data.attribute_list = result.attribute_list.map((dd) => {
                                        dd.attribute_values[0].selected = true;
                                        return dd;
                                    });
                                    allPage.data.loading = false;
                                    allPage && (allPage.data.name = result.product_detail.name);
                                    allPage && (allPage.data.intro[0].text = result.product_detail.bodyHtml);
                                    allPage.data.productData = result;
                                    allPage.refreshComponent();
                                }
                            });
                        }
                        return ``;
                    },
                    editor: () => {
                        return `<div class="alert-warning alert mt-2">程式碼區塊</div>`;
                    }
                };
            }
        }
    };
});
