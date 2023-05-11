import { appConfig } from "../config.js";
export class ProductSharedView {
    constructor(gvc) {
        const glitter = gvc.glitter;
        let topInset = 0;
        let bottomInset = 0;
        glitter.runJsInterFace("getTopInset", {}, (response) => {
            topInset = response.data;
            gvc.notifyDataChange(['nav', 'ddd']);
        }, {
            webFunction: () => {
                return { data: 0 };
            }
        });
        glitter.runJsInterFace("getBottomInset", {}, (response) => {
            if (bottomInset != response.data) {
                bottomInset = response.data;
                gvc.notifyDataChange("footer");
            }
        }, {
            webFunction: () => {
                return { data: 0 };
            }
        });
        this.productCard = (css, productData) => {
            var _a, _b, _c, _d;
            const pageID = glitter.getUUID();
            gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`);
            return `
                 <div class="${(_a = css.class) !== null && _a !== void 0 ? _a : ""}p-0 w-100" style="${(_b = css.style) !== null && _b !== void 0 ? _b : ""}; 
                    break-inside: avoid;margin-top: 16px;                                
                    height: auto;background: #FBF9F6;border-radius: 16px;" onclick="${gvc.event(() => {
                appConfig().changePage(gvc, "product_show", productData);
            })}">
                    
                    ${gvc.bindView({
                bind: pageID,
                view: () => {
                    return `
                                <!-- Additional required wrapper -->
                                <div class="swiper-wrapper w-100" style="background-clip: padding-box;">
                                <!-- Slides -->
                                ${(() => {
                        var _a;
                        let returnHTML = ``;
                        let images = (_a = productData === null || productData === void 0 ? void 0 : productData.images) !== null && _a !== void 0 ? _a : [];
                        for (let i = 0; i < 3 && i < images.length; i++) {
                            returnHTML += `
                                        <div class="swiper-slide" style="padding-bottom: 100%;background: 50%/cover no-repeat url('${images[i].url}') , white;"></div>
                                        `;
                        }
                        return returnHTML;
                    })()}                                                                                
                                </div>
                                <div class="w-100" style="position:absolute;left:0;top:0;height:100%;border: 4px solid rgba(248, 243, 237, 0.3);background:transparent;z-index: 3;border-radius: 16px;pointer-events:none;" onscroll=""></div>
                                <!-- If we need pagination -->
                                <div class="swiper-pagination" id="${pageID}"></div>                                                                                                                                                                          
                            `;
                }, divCreate: { class: `swiper ${pageID} w-100`, style: `border-radius: 16px;position: relative;` },
                onCreate: () => {
                    glitter.addMtScript([{
                            src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
                        }], () => {
                        var _a;
                        const Swiper = window.Swiper;
                        const swiper = new Swiper(`.${pageID}`, {
                            slidesPerView: 'auto',
                            direction: 'horizontal',
                            loop: false,
                            pagination: {
                                el: `#${pageID}`,
                            },
                        });
                        glitter.share.swiper = (_a = glitter.share.swiper) !== null && _a !== void 0 ? _a : [];
                        glitter.share.swiper.push(swiper);
                    }, () => {
                    });
                }
            })}
<!--                <div class="w-100 m-0" style="box-sizing:border-box;border-radius: 16px;padding-bottom: 100%;background: 50%/cover no-repeat url('${productData.preview_image}'), white;"></div>-->
                    <h3 class="w-100" style="padding:0 8px;font-family: 'Noto Sans TC';font-style: normal;font-weight: 700;font-size: 14px;margin-top: 8px;word-break: break-word;white-space: normal;margin-bottom: 0px;color: #292929;">
                        ${(_c = productData.name) !== null && _c !== void 0 ? _c : "尚未設定"}
                    </h3>
                    <div class="d-flex align-items-baseline" style="padding:0 8px;margin-top: 8px;padding-bottom: 8px;">
                        <span style="font-family: 'Noto Sans TC';font-style: normal;font-weight: 400;font-size: 14px;color: #FD6A58;line-height: 150%;">
                            NT$ ${(_d = productData.sale_price) !== null && _d !== void 0 ? _d : "尚未設定"} ${(() => {
                if (productData.showUp) {
                    return "up";
                }
                return "";
            })()}
                        </span>
                        <div class="flex-fill"></div>
                        <span class="${(productData.price === productData.sale_price) ? `d-none` : ``}" style="font-family: 'Noto Sans TC';font-style: normal;font-weight: 400;font-size: 10px;line-height: 14px;text-align: right;text-decoration-line: line-through;color: #858585;" >
                            NT$ ${productData.sale_price}
                        </span>
                    </div>
                </div>            
            `;
        };
    }
}
