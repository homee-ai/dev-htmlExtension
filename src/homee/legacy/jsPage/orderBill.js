'use strict';
import { init } from '../glitterBundle/GVController.js';
import { ViewModel } from '../view/mainViewApi.js';
init((gvc, glitter, gBundle) => {
    const viewModel = new ViewModel(gvc);
    gvc.addStyleLink(`assets/css/app.min.css`);
    gvc.addStyle(`  @font-face {
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
    }`);
    return {
        onCreateView: () => {
            console.log('gg');
            let order = {};
            var subTotal = 0;
            var b = ["1.5", "1.3", "1.3", "1", "1"];
            var st1 = `font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;

/* HOMEE black */

color: #292929;`;
            var st2 = `font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 12px;
line-height: 17px;

/* HOMEE black */

color: #292929;`;
            var loading = true;
            glitter.runJsInterFace("getOrderDetail", {}, function (response) {
                try {
                    loading = false;
                    order = response.data;
                    gvc.notifyDataChange('order-container');
                }
                catch (e) {
                    glitter.runJsInterFace("logData", { data: e.stack }, function (response) {
                    });
                }
            }, {
                webFunction(data) {
                    return {
                        data: {
                            total: "100",
                            status: "2",
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
                        }
                    };
                }
            });
            let topInset = 0;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data;
                gvc.notifyDataChange('order-container');
            }, {
                webFunction: () => {
                    return { data: 10 };
                }
            });
            return `
         ${gvc.bindView({
                bind: `order-container`,
                view: () => {
                    var _a;
                    if (loading) {
                        return ``;
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
                        var a = ["商品", "SKU", "價錢", "數量", "總數"];
                        var html = "";
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
                                        return "start;";
                                    case 4:
                                        return "end;";
                                    case 3:
                                        return "center;";
                                    default:
                                        return "start";
                                }
                            })()};
">${data}</div>`;
                        });
                        return html;
                    })}
</div>
        ${glitter.print(function () {
                        var tmp = "";
                        order.line_items.map((o, index) => {
                            tmp += `<div class="bg-white d-flex align-items-center" style="min-height: 46px;">`;
                            var array = ['product_name', 'sku', 'price', 'quantity', 'subtotal'];
                            array.map((v, index) => {
                                var textAlign = (() => {
                                    switch (index) {
                                        case 0:
                                            return "start;";
                                        case 4:
                                            return "end;";
                                        case 3:
                                            return "center;";
                                        default:
                                            return "start";
                                    }
                                })();
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
line-height: 14px;`;
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
`;
                                            }
                                            else {
                                                return `
text-align: ${textAlign};
flex: ${b[index]};
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
color: #292929;
font-size: 10px;
line-height: 14px;
                      `;
                                            }
                                        })}">${o[v]}</div>`;
                                        break;
                                }
                            });
                            tmp += "</div>";
                            tmp += "<div class='w-100' style='border-bottom: 1px solid #D6D6D6;width: 100%;margin-top: 3px;'></div>";
                            subTotal += parseInt(o.subtotal);
                        });
                        return tmp;
                    })}
            <div class="w-100 d-flex align-items-center" style="height: 46px;border-bottom: 1px solid #D6D6D6;width: 100%;">
              <span style="${st1}">小總數</span>
              <div class="flex-fill"></div>
              <span style="${st1}">NT$ ${parseInt(order.total, 10) - parseInt(order.shipping_fees, 10)}</span>
            </div>
             <div class="w-100 d-flex align-items-center" style="height: 46px;border-bottom: 1px solid #D6D6D6;width: 100%;">
              <span style="${st1}">運費 (專業物流及組裝服務)</span>
              <div class="flex-fill"></div>
              <span style="${st1}">NT$ ${viewModel.addQuantile(parseInt(order.shipping_fees))}</span>
            </div>
             <div class="w-100 d-flex align-items-center" style="height: 46px;">
              <span style="${st2}">總數</span>
              <div class="flex-fill"></div>
              <span style="${st2}">NT$ ${order.total}</span>
            </div>
            <div class="text-end" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;
text-align: right;

/* HOMEE black */

color: #292929;">
            此筆交易總額: NT$ ${order.total}<br />
            總退款總額: NT$ ${(_a = order.refunds) !== null && _a !== void 0 ? _a : 0}
            </div>
          </div>
          <div class="addr">
           <h1>處理狀態</h1>
           <div class="w-100 d-flex position-relative" style="background: #F8F3ED;height: 8px;margin-top: 24px;
border-radius: 4px;z-index: 2;">

<div class="position-absolute" style="background: #FD6A58;width: ${(() => {
                        switch (order.status) {
                            case "0":
                                return "24px;";
                            case "1":
                                return "calc(100%/3 + 24px);";
                            case "2":
                                return "calc(100%/3*2 + 12px);";
                            case "3":
                                return "100%;";
                        }
                    })()};height: 8px;z-index: 0;
border-radius: 4px;">

</div>
${(() => {
                        var dot = `<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="3" cy="3" r="2.5" fill="white" stroke="#292929"/>
</svg>`;
                        var array = ['12px', 'calc(calc(100% - 48px)/3)', 'calc(calc(100% - 48px)/3)', 'calc(calc(100% - 48px)/3)'];
                        var html = '';
                        array.map((data) => {
                            html += `<div class="d-flex position-relative" style="z-index: 2;margin-left: ${data};">${dot}</div>`;
                        });
                        return html;
                    })()}

</div>
 <div class="w-100 d-flex position-relative" style="height: 8px;margin-top: -2px;
border-radius: 4px; z-index: 3;">
${(() => {
                        var dot = `<div style="width: 1px;height: 16px;background-color: #858585;"></div>`;
                        var array = ['15px', 'calc(calc(100% - 36px)/3)', 'calc(calc(100% - 32px)/3)', 'calc(calc(100% - 34px)/3)'];
                        var html = '';
                        array.map((data) => {
                            html += `<div class="d-flex" style="margin-left: ${data};text-align: center;">${dot}</div>`;
                        });
                        return html;
                    })()}

</div>
 <div class="w-100 d-flex" style="height: 8px;
border-radius: 4px;margin-top: 10px;margin-bottom: 10px;">
${(() => {
                        var dot = `<div style="width: 1px;height: 16px;background-color: #858585;"></div>`;
                        var array = ['0px', 'calc(calc(100% - 120px)/3)', 'calc(calc(100% - 120px)/3)', 'calc(calc(100% - 120px)/3)'];
                        var index2 = ['已下單', '製作中', '配送中', '已送達'];
                        var html = '';
                        array.map((data, index) => {
                            html += `<div class="" style="white-space:nowrap;word-break:break-all;margin-left: ${data};text-align: center;font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;">${index2[index]}</div>`;
                        });
                        return html;
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
            <h4>${order.shipping_address.phone}</h4></div>`;
                },
                divCreate: { class: `order-container`, style: `padding-top: 50px;` },
                onCreate: () => {
                }
            })}`;
        }
    };
});
