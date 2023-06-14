'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {Checkout} from "../api/checkout.js";
import {appConfig} from "../config.js";
import {ViewModel} from "../homee/legacy/view/mainViewApi.js";

Plugin.create(import.meta.url, (glitter, editMode) => {
    return {
        orderHistory: {
            defaultData: {
                //maxlength is 6
                orderData: [{
                    number: "20220718",
                    date: "2022-07-18",
                    paysStatus: 3,
                    processingStatus: 0,
                    amount: 470,
                },
                    {
                        number: "20211108",
                        date: "2021-11-08",
                        paysStatus: 3,
                        processingStatus: 2,
                        amount: 470,
                    }],
                event: {},
                payStatus: ["未付款", "付款失敗", "超過付款時間", "已付款", "退款中", "以退款"],
                processingStatus: ["待出貨", "出貨中", "已出貨", "已取消"]
            },
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data
                const id = gvc.glitter.getUUID()
                const vm = {
                    loading: true
                }
                if (true) {
                    vm.loading = true
                    Checkout.getOrderList({
                        callback: (result) => {
                            console.log(result)
                            vm.loading = false
                            gvc.notifyDataChange(id)
                            if (result){
                                widget.data.orderData = result.map((orderData: any) => {
                                    return {
                                        number: orderData.name,
                                        date: orderData.created_at.substring(0, 10),
                                        paysStatus: (() => {
                                            if (orderData.financial_status === 'paid') {
                                                return `已付款`
                                            } else {
                                                return `未付款`
                                            }
                                        })(),
                                        processingStatus: (() => {
                                            if (orderData.fulfillment_status === 'fulfilled') {
                                                return `已出貨`
                                            } else {
                                                return `待出貨`
                                            }
                                        })(),
                                        amount: orderData.subtotal_price,
                                        origin: orderData
                                    }
                                })
                            }else{
                                widget.data.orderData =[];
                            }
                            gvc.notifyDataChange(id)
                        }
                    })
                } else {
                    vm.loading=false
                    widget.data.orderData = [{
                        "number": 5274857668908,
                        "date": "2023-03-02",
                        "paysStatus": "已付款",
                        "processingStatus": "已出貨",
                        "amount": "4100.00"
                    }, {
                        "number": 5274857668908,
                        "date": "2023-03-02",
                        "paysStatus": "已付款",
                        "processingStatus": "已出貨",
                        "amount": "4100.00"
                    }, {
                        "number": 5274857668908,
                        "date": "2023-03-02",
                        "paysStatus": "已付款",
                        "processingStatus": "已出貨",
                        "amount": "4100.00"
                    }]

                }
                return {
                    view: () => {
                        gvc.addStyle(`
                            .fontHomee *{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                            }
                        `)
                        let classStyle = {
                            ticket: `padding: 11px 24px 12px;gap: 8px;background: #FBF9F6;border-radius: 20px;margin-bottom:12px;`,
                            title: `font-weight: 400;font-size: 18px;line-height: 26px;margin-right:8px;`,
                            orderNo: `font-weight: 400;font-size: 18px;line-height: 26px;color: #FD6A58;`,
                            bar: `background:#D6D6D6;height:1px;margin:4px 0`,
                            status: `width:25%;font-weight: 400;font-size: 12px;line-height: 17px;color: #292929;`,
                            statusValue: `width:25%;font-weight: 400;font-size: 10px;line-height: 14px;color: #292929;`,
                            moreOrder: `font-weight: 400;font-size: 15px;color: #1E1E1E;`
                        };
                        return `${gvc.bindView({
                            bind: id,
                            view: () => {
                                if (vm.loading) {
                                    return `<div class="w-100">
                                    <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                        <div class="spinner-border" role="status"></div>
                                    </div>
                                </div>`
                                }
                                return `${gvc.map(widget.data.orderData.map((orderData: any) => {
                                    return `
                                <div class="d-flex flex-column fontHomee" style="${classStyle.ticket}" onclick="${
                                        gvc.event(() => {
                                            appConfig().changePage(gvc, "order_detail", {orderData: orderData}, {})
                                        })
                                    }">
                                    <div class="d-flex">
                                        <div class="" style="${classStyle.title}">訂單</div>
                                        <div class="" style="${classStyle.orderNo}">#${orderData.number}</div>
                                    </div>
                                    <div class="w-100">
                                        <div class="d-flex">
                                            <div style="${classStyle.status}">日期</div>
                                            <div style="${classStyle.status}">付款狀態</div>
                                            <div style="${classStyle.status}">處理狀態</div>
                                            <div style="${classStyle.status}">總共</div>
                                        </div>
                                        <div class="w-100" style="${classStyle.bar}"></div>
                                        <div class="d-flex">
                                            <div style="${classStyle.statusValue}">${orderData.date}</div>
                                            <div style="${classStyle.statusValue}">${orderData.paysStatus}</div>
                                            <div style="${classStyle.statusValue}">${orderData.processingStatus}</div>
                                            <div style="${classStyle.statusValue}">NT$${orderData.amount}</div>                                            
                                        </div>
                                    </div>
                                </div>
                            `
                                }))}
                            <div class="d-flex align-items-center justify-content-center d-none" style="${classStyle.moreOrder}" onclick="${gvc.event(() => {
                                    ClickEvent.trigger({
                                        gvc, widget, clickEvent: widget.data.event
                                    })
                                })}">
                                更多訂單
                            </div>`
                            },
                            divCreate: {}
                        })}
                        `
                    },
                    editor: () => {
                        return `${ClickEvent.editer(gvc, widget, widget.data.event)}`
                    }
                }
            },
        },
        orderAllHistory: {
            defaultData: {
                orderData: [{
                    number: "20220718",
                    date: "2022-07-18",
                    paysStatus: 3,
                    processingStatus: 0,
                    amount: 470,
                },
                    {
                        number: "20211108",
                        date: "2021-11-08",
                        paysStatus: 3,
                        processingStatus: 2,
                        amount: 470,
                    },],
                event: {},
                payStatus: ["未付款", "付款失敗", "超過付款時間", "已付款", "退款中", "以退款"],
                processingStatus: ["待出貨", "出貨中", "已出貨", "已取消"]
            },
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data
                Checkout.getOrderList({
                    callback: (response) => {
                        alert(JSON.stringify(response))
                    }
                })
                return {
                    view: () => {
                        gvc.addStyle(`
                            .fontHomee *{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                            }
                        `)
                        let classStyle = {
                            ticket: `padding: 11px 24px 12px;gap: 8px;background: #FBF9F6;border-radius: 20px;margin-bottom:12px;`,
                            title: `font-weight: 400;font-size: 18px;line-height: 26px;margin-right:8px;`,
                            orderNo: `font-weight: 400;font-size: 18px;line-height: 26px;color: #FD6A58;`,
                            bar: `background:#D6D6D6;height:1px;margin:4px 0`,
                            status: `width:25%;font-weight: 400;font-size: 12px;line-height: 17px;color: #292929;`,
                            statusValue: `width:25%;font-weight: 400;font-size: 10px;line-height: 14px;color: #292929;`,
                            moreOrder: `font-weight: 400;font-size: 15px;color: #1E1E1E;`
                        };
                        return `${gvc.map(widget.data.orderData.map((orderData: any) => {

                            return `
                                <div class="d-flex flex-column fontHomee" style="${classStyle.ticket}">
                                    <div class="d-flex">
                                        <div class="" style="${classStyle.title}">訂單</div>
                                        <div class="" style="${classStyle.orderNo}">#${orderData.number}</div>
                                    </div>
                                    <div class="w-100">
                                        <div class="d-flex">
                                            <div style="${classStyle.status}">日期</div>
                                            <div style="${classStyle.status}">付款狀態</div>
                                            <div style="${classStyle.status}">處理狀態</div>
                                            <div style="${classStyle.status}">總共</div>
                                        </div>
                                        <div class="w-100" style="${classStyle.bar}"></div>
                                        <div class="d-flex">
                                            <div style="${classStyle.statusValue}">${orderData.date}</div>
                                            <div style="${classStyle.statusValue}">${widget.data.payStatus[orderData.paysStatus]}</div>
                                            <div style="${classStyle.statusValue}">${widget.data.processingStatus[orderData.processingStatus]}</div>
                                            <div style="${classStyle.statusValue}">NT$${orderData.amount}</div>                                            
                                        </div>
                                    </div>
                                </div>
                            `
                        }))}                            
                        `
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        orderDetail: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                //@ts-ignore
                const viewModel = new ViewModel(gvc);
                const data: any = gvc.parameter.pageConfig?.obj.data
                const origin = data.orderData.origin
                return {
                    view: () => {
                        //

                        gvc.addStyle(` @font-face {
      font-family: 'Noto Sans TC';
      src:   url(assets/Font/NotoSansTC-Bold.otf);
      font-weight: bold;
    }
    @font-face {
      font-family: 'Noto Sans TC';
      src:   url(assets/Font/NotoSansTC-Regular.otf);
      font-weight: normal;
    }
    .order-container {
      padding-left: 15%;
      padding-right: 15%;
    }
    .item{
      margin-bottom: 2rem;
      background: #FFFFFF;
      box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);
      border-radius: 20px;
      padding: 16px;
    }
    .addr {
      background: #FFFFFF;
      box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);
      border-radius: 20px;
      padding: 16px;
      margin-top: 24px;
    }

    .item h1,
    .item h3,
    .addr h1 {
      text-align: center;
      margin-bottom: 0.5rem;
      color: #292929;
      font-family: 'Noto Sans TC';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 35px;
    }
    .addr h4{
      font-family: 'Noto Sans TC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;

      /* HOMEE black */

      color: #292929;
    }
    .addr h4 span{
      font-family: 'Noto Sans TC';
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      color: #292929;
      line-height: 20px;
    }
    .addr h2 {
      font-family: 'Noto Sans TC';
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 35px;
      /* identical to box height */

      font-feature-settings: 'pnum' on, 'lnum' on;

      /* HOMEE black */

      color: #292929;
    }


    .fff {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      margin: 1.5rem 1rem;
    }

    @media only screen and (max-width: 600px) {
      .order-container {
       padding: 24px;
        background-color: white;
      }
    }

    body{
      background-color: white;
    }`)

                        let order: any = {}
                        var subTotal = 0;
                        var b = ["1.5", "1.3", "1.3", "1", "1"]
                        var st1 = `font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;
color: #292929;`
                        var st2 = `font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 12px;
line-height: 17px;
color: #292929;`
                        var loading = true
                        loading = false
                        origin.billing_address=origin.billing_address??{}
                        order =  {
                            total: origin.current_total_price,
                            subtotal: origin.current_subtotal_price,
                            discount:origin.current_total_discounts,
                            status: (() => {
                                if (origin.paysStatus === '已付款') {
                                    if (origin.processingStatus === '已出貨') {
                                        return '2'
                                    }else{
                                        return '1'
                                    }
                                }else {
                                    return '0'
                                }

                            })(),
                            order_number: "#" + data.orderData.number,
                            datetime: data.orderData.date,
                            line_items: origin.line_items.map((dd: any) => {
                                return {
                                    product_name: dd.name,
                                    sku: dd.sku,
                                    price: dd.price,
                                    quantity: dd.quantity,
                                    subtotal: dd.price,
                                }
                            }),
                            shipping_fees: origin.total_shipping_price_set.shop_money.amount,
                            billing_address: {
                                state: data.orderData.paysStatus,
                                first_name: origin.billing_address.first_name,
                                last_name: origin.billing_address.last_name,
                                address1: origin.billing_address.address1,
                                phone: origin.billing_address.phone,
                            },
                            shipping_address: {
                                state: data.orderData.processingStatus,
                                first_name: origin.billing_address.first_name,
                                last_name: origin.billing_address.last_name,
                                address1: origin.billing_address.address1,
                                phone: origin.billing_address.phone,
                            },
                        }
                        let topInset = 0;
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            topInset = response.data;
                            gvc.notifyDataChange('order-container');
                        }, {
                            webFunction: () => {
                                return {data: 10};
                            }
                        });
                        return `${gvc.bindView({
                            bind: `order-container`,
                            view: () => {
                                if (loading) {
                                    return ``
                                }
                                
                                return ` <div class="item" style="margin-top: ${10 + topInset}px;">
            <h1 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 24px;
line-height: 35px;
text-align: center;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #292929;">訂單編號：${order.order_number}</h1>
            <h3 class="mb-3" style="
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
color: #292929;">${order.datetime}</h3>
<div class="d-flex" style="height: 25px;border-bottom: 1px solid #D6D6D6;width: 100%;">
${glitter.print(() => {
                                    var a = ["商品", "SKU", "價錢", "數量", "總數"]
                                    var html = ""
                                    a.map((data, index) => {
                                        html += `<div style="
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 12px;
color: #292929;
line-height: 17px;
flex: ${b[index]};
text-align: ${(() => {
                                            switch (index) {
                                                case 0:
                                                    return "start;"
                                                case 4:
                                                    return "end;"
                                                case 3:
                                                    return "center;"
                                                default:
                                                    return "start"
                                            }
                                        })()};
">${data}</div>`
                                    })
                                    return html
                                })}
</div>
        ${glitter.print(function () {
                                    var tmp = "";

                                    order.line_items.map((o: any, index: number) => {
                                        tmp += `<div class="bg-white d-flex align-items-center" style="min-height: 46px;">`;
                                        var array = ['product_name', 'sku', 'price', 'quantity', 'subtotal']
                                        array.map((v, index) => {
                                            var textAlign = (() => {
                                                switch (index) {
                                                    case 0:
                                                        return "start;"
                                                    case 4:
                                                        return "end;"
                                                    case 3:
                                                        return "center;"
                                                    default:
                                                        return "start"
                                                }
                                            })()
                                            switch (v) {
                                                case "price":
                                                case "subtotal":
                                                    tmp += `<div style="${glitter.print(() => {
                                                        return `
                    text-align: ${textAlign};
flex: ${b[index]};
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
color: #292929;
line-height: 14px;`
                                                    })}">NT$ ${viewModel.addQuantile(parseInt(o[v]))}</div>`;
                                                    break;
                                                default:
                                                    tmp += `<div style="${glitter.print(() => {
                                                        if (index === 0) {
                                                            return `
                text-align: ${textAlign};
                      flex: ${b[index]};
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
color: #292929;
box-sizing: content-box;
font-size: 10px;
line-height: 14px;
text-decoration-line: underline;
color: #FD6A58;
white-space: normal;
word-break:all;
padding-right:2px;
`
                                                        } else {
                                                            return `
text-align: ${textAlign};
flex: ${b[index]};
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
color: #292929;
font-size: 10px;
line-height: 14px;
                      `
                                                        }
                                                    })}">${o[v]}</div>`;
                                                    break;
                                            }
                                        })
                                        tmp += "</div>";
                                        tmp += "<div class='w-100' style='border-bottom: 1px solid #D6D6D6;width: 100%;margin-top: 3px;'></div>"
                                        subTotal += parseInt(o.subtotal);
                                    });
                                    return tmp;
                                })}
            <div class="w-100 d-flex align-items-center" style="height: 46px;border-bottom: 1px solid #D6D6D6;width: 100%;">
              <span style="${st1}">小計</span>
              <div class="flex-fill"></div>
              <span style="${st1}">NT$ ${viewModel.addQuantile(subTotal)}</span>
            </div>
            <div class="w-100 d-flex align-items-center" style="height: 46px;border-bottom: 1px solid #D6D6D6;width: 100%;">
              <span style="${st1}">折扣</span>
              <div class="flex-fill"></div>
              <span style="${st1}">-NT$ ${viewModel.addQuantile(parseInt(order.discount))}</span>
            </div>
             <div class="w-100 d-flex align-items-center" style="height: 46px;border-bottom: 1px solid #D6D6D6;width: 100%;">
              <span style="${st1}">運費 (專業物流及組裝服務)</span>
              <div class="flex-fill"></div>
              <span style="${st1}">NT$ ${viewModel.addQuantile(parseInt(order.shipping_fees))}</span>
            </div>
             <div class="w-100 d-flex align-items-center" style="height: 46px;">
              <span style="${st2}">總數</span>
              <div class="flex-fill"></div>
              <span style="${st2}">NT$ ${viewModel.addQuantile(order.total)}</span>
            </div>
            <div class="d-flex" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;
text-align: right;

/* HOMEE black */

color: #292929;">
            ${
                                    (order.billing_address.state === "未付款") ? `
                                    <div class="me-auto d-flex align-items-center justify-content-center" style="background: #FE5541;
padding: 7px 32px;border-radius: 20px;font-family: 'Noto Sans TC';font-style: normal;font-weight: 700;font-size: 18px;line-height: 150%;letter-spacing: 0.15em;color: #FFFFFF;" onclick="${
                                        gvc.event(()=>{
                                            origin.homeeCartToken
                                            gvc.glitter.runJsInterFace("openWeb", {
                                                url: `${appConfig().serverURL}/store-front/index.html?cart_token=${origin.homeeCartToken}&page=checkout`
                                            }, (data) => {
                                            }, {
                                                webFunction(data: any, callback: (data: any) => void): any {
                                                    gvc.glitter.openNewTab(data.data.url)
                                                }
                                            })
                                        })
                                    }">立刻付款</div>
                                    `:``
                                }
            此筆交易總額: NT$ ${viewModel.addQuantile(order.total)}<br />
            總退款總額: NT$ ${viewModel.addQuantile(order.refunds) ?? 0}
            </div>
          </div>
          <div class="addr">
           <h1>處理狀態</h1>
           <div class="w-100 d-flex position-relative" style="background: #F8F3ED;height: 8px;margin-top: 24px;
border-radius: 4px;z-index: 2;">

<div class="position-absolute" style="background: #FD6A58;width: ${(() => {
                                    switch (order.status) {
                                        case "0":
                                            return "24px;"
                                        case "1":
                                            return "calc(100%/3 + 24px);"
                                        case "2":
                                            return "calc(100%/3*2 + 12px);"
                                        case "3":
                                            return "100%;"
                                    }
                                })()};height: 8px;z-index: 0;
border-radius: 4px;">

</div>
${(() => {
                                    var dot = `<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="3" cy="3" r="2.5" fill="white" stroke="#292929"/>
</svg>`
                                    var array = ['12px', 'calc(calc(100% - 48px)/3)', 'calc(calc(100% - 48px)/3)', 'calc(calc(100% - 48px)/3)']
                                    var html = ''
                                    array.map((data) => {
                                        html += `<div class="d-flex position-relative" style="z-index: 2;margin-left: ${data};">${dot}</div>`
                                    })
                                    return html
                                })()}

</div>
 <div class="w-100 d-flex position-relative" style="height: 8px;margin-top: -2px;
border-radius: 4px; z-index: 3;">
${(() => {
                                    var dot = `<div style="width: 1px;height: 16px;background-color: #858585;"></div>`
                                    var array = ['15px', 'calc(calc(100% - 36px)/3)', 'calc(calc(100% - 32px)/3)', 'calc(calc(100% - 34px)/3)']
                                    var html = ''
                                    array.map((data) => {
                                        html += `<div class="d-flex" style="margin-left: ${data};text-align: center;">${dot}</div>`
                                    })
                                    return html
                                })()}

</div>
 <div class="w-100 d-flex" style="height: 8px;
border-radius: 4px;margin-top: 10px;margin-bottom: 10px;">
${(() => {
                                    var dot = `<div style="width: 1px;height: 16px;background-color: #858585;"></div>`
                                    var array = ['0px', 'calc(calc(100% - 120px)/3)', 'calc(calc(100% - 120px)/3)', 'calc(calc(100% - 120px)/3)']
                                    var index2 = ['已下單', '製作中', '配送中', '已送達']
                                    var html = ''
                                    array.map((data, index) => {
                                        html += `<div class="" style="white-space:nowrap;word-break:break-all;margin-left: ${data};text-align: center;font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;">${index2[index]}</div>`
                                    })
                                    return html
                                })()}

</div>
</div>
          <div class="addr">
            <h1>帳單地址</h1>
            <h4><span class="fw-bolder">付款狀態：</span>${order.billing_address.state}</h4>
            <h2 style="margin-bottom: 0px;">${order.billing_address.first_name} ${order.billing_address.last_name}</h2>
            <h4 style="margin-top: 16px;margin-bottom: 0px;">${order.billing_address.address1}</h4>
            <h4 style="margin-top: 0px;margin-bottom: 0px;">${order.billing_address.phone}</h4>
          </div>
          <div class="addr" style="margin-bottom: 100px;">
            <h1>送貨地址</h1>
            <h4><span class="fw-bolder">處理狀態：</span>${order.shipping_address.state}</h4>
            <h2>${order.shipping_address.first_name} ${order.shipping_address.last_name}</h2>
            <h4>${order.shipping_address.address1}</h4>
            <h4>${order.shipping_address.phone}</h4></div>`
                            },
                            divCreate: {class: `order-container`, style: `padding-top: 50px;`},
                            onCreate: () => {
                            }
                        })}`
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        empty: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data

                return {
                    view: () => {
                        return ``
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },

    }
});