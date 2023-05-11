import { init } from '../glitterBundle/GVController.js';
init((gvc, glitter, gBundle) => {
    const id = glitter.getUUID();
    let botInset = 0;
    glitter.runJsInterFace("getBottom", {}, function (response) {
        botInset = response.data;
        gvc.notifyDataChange(id);
    }, {
        webFunction(data, callback) {
            return { data: 10 };
        }
    });
    return {
        onCreateView: () => {
            gvc.addStyle(`
                .product{
                    background: #FFFFFF;
                    box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                    padding:0 20px;
                }
                .footerLeft{
                    width: 128px;
                    height: 48px;
                    left: 138px;
                    top: 28px;
                    
                    /* HOMEE yellow 2 */
                    
                    background: #FFDC6A;
                    border-radius: 24px 0px 0px 24px;
                    
                    color: #292929;
                }
                .footerRight{
                    width: 128px;
                    height: 48px;
                    left: 266px;
                    top: 28px;
                    
                    /* HOMEE red */
                    
                    background: #FD6A58;
                    border-radius: 0px 24px 24px 0px; 
                    
                    color: #FFFFFF;

                }
                .footerTwinBTNFont *{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 20px;
                    text-align: center;
                    font-feature-settings: 'pnum' on, 'lnum' on;
                }
            `);
            return `
            ${gvc.bindView({
                bind: "productFooter",
                view: () => {
                    return `
                    <div class="w-100 d-flex product" style="height: 72px;padding-bottom: ${botInset}">
                        ${gvc.bindView({
                        bind: "btnGroup",
                        view: () => {
                            let btnModel = [
                                {
                                    img: "img/sample/product/customerService.png",
                                    text: "客服",
                                    click: () => {
                                    }
                                },
                                {
                                    img: "img/sample/product/send.svg",
                                    text: "分享給",
                                    click: () => {
                                    }
                                }
                            ];
                            let returnHTML = ``;
                            gvc.addStyle(`
                                    .footerBtnText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                        text-align: center;
                                        
                                        /* HOMEE dark grey */
                                        
                                        color: #858585;

                                    }
                                    
                                    `);
                            btnModel.forEach((btn) => {
                                returnHTML += `
                                        <div class="d-flex flex-column align-items-center" style="margin-right: 18px;">
                                            <img src="${btn.img}" style="width: 24px;height: 24px;">
                                            <div class="footerBtnText">${btn.text}</div>
                                        </div>
                                    `;
                            });
                            return returnHTML;
                        }
                    })}
                        <div class="d-flex ms-auto footerTwinBTNFont position-fixed" style="">
                            <div class="footerLeft d-flex align-items-center justify-content-center">加入至dd空間</div>
                            <div class="footerRight d-flex align-items-center justify-content-center">加入購物車</div>
                        </div>                        
                        
                    </div>`;
                }, divCreate: {}
            })}
            `;
        }
    };
});
