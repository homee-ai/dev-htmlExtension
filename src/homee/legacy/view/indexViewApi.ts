"use strict";
import { GVC} from '../glitterBundle/GVController.js';
// @ts-ignore
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'


export class ViewModel {
    public gvc: GVC = new GVC()

    constructor(gvc: GVC) {
        this.gvc = gvc;
        gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
    }

    /*
    * 控制side 但是要記得引css
    * 參數分別為 分頁資料 不同分頁會顯示的下面三個點 左右箭頭 跟分頁進度的scrollbar 預設false
    * */
    public slideControl = (pageImgArray: any, pagination = false, navigation = false, scrollbar = false) => {
        const gvc = this.gvc
        const  glitter=gvc.glitter
        gvc.addStyle(`
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
            }
        `)
        let slidePage = ``
        pageImgArray.forEach((item: any, index: number) => {
            // <!-- Slides -->
            slidePage += `
                <div class="swiper-slide" style="padding-bottom: 128%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                item.click()
            })}">
                </div>
            `
        })
        let iCount: number = 1
        if (glitter.share.sideCount) {
            glitter.share.sideCount++;
            iCount = glitter.share.sideCount;
        } else {
            glitter.share.sideCount = 1
        }


        let id = `slide${iCount}`

        return `
            <!-- Slider main container -->
            ${gvc.bindView({
            bind: id,
            view: () => {
                return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              <!-- If we need pagination -->

              ${(() => {
                    if (pagination) {
                        return `<div class="swiper-pagination"></div>`
                    } else {
                        return ``
                    }
                })()}

              <!-- If we need navigation buttons -->
              ${(() => {
                    if (navigation) {
                        return `
                          <div class="swiper-button-prev"></div>
                          <div class="swiper-button-next"></div>`
                    } else {
                        return ''
                    }
                })()}


              <!-- If we need scrollbar -->
              ${(() => {
                    if (scrollbar) {
                        return `<div class="swiper-scrollbar"></div>`
                    } else {
                        return ``
                    }

                })()}

              `
            },
            divCreate: {class: `swiper ${id}`},
            onCreate: () => {

                const swiper = new Swiper(`.${id}`, {
                    // Optional parameters
                    direction: 'horizontal',
                    loop: true,

                    // If we need pagination
                    pagination: {
                        el: `.${id} .swiper-pagination`,
                    },

                    // Navigation arrows
                    navigation: {
                        nextEl: `.${id} .swiper-button-next`,
                        prevEl: `.${id} .swiper-button-prev`,
                    },

                    // And if we need scrollbar
                    scrollbar: {
                        el: `.${id} .swiper-scrollbar`,
                    },


                });

            }
        })}
        `;
    }

    productGrid = (productData: any) => {
        const gvc = this.gvc
        const  glitter=gvc.glitter
        gvc.addStyle(`
            .productGrid{
                width: calc(50% - 8px);
                background-repeat: no-repeat;

                margin-bottom:16px;
            }
            .gridDiff{
                margin-right:16px;
            }
        `)
        let returnHTML = ``;

        productData.forEach((item: any, index: number) => {

            if (index % 2 === 0) {
                returnHTML += `
                    <div class="productGrid gridDiff" style="padding-bottom: 61%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                    item.click()
                })}">
                    </div>
                `
            } else {
                returnHTML += `
                    <div class="productGrid" style="padding-bottom: 61%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                    item.click()
                })}">
                    </div>
                `
            }

        })
        return returnHTML
    }
    weeklyProduct = (productData: any) => {
        const gvc = this.gvc
        const  glitter=gvc.glitter
        gvc.addStyle(`
             .grid-group{
                display:flex;
                flex-wrap: wrap;
                width:100%;

            }
            .grid{
                width: calc(50% - 8px);

                margin-bottom:16px;
                background: #FFFFFF;
                box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.1);
                border-radius: 20px;
                padding-bottom:7px
            }
            .gridDiff{
                margin-right:16px;
            }
            .gridIMG{
                width:100%;
                height:0;

            }
            .gridTitle{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                line-height: 120%;
                padding-left : 8px;
            }
            .gridPrice{
                padding-left : 8px;
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 150%;
                color: #FD6A58;
            }
        `)
        let returnHTML = ``;
        let grid = ``
        productData.forEach((item: any, index: number) => {
            //loading IMG
            let productIMG = `
                <div class="gridIMG" style="padding-bottom: 90%; background:50% / cover url(${item.img})" >
                </div>
            `

            //loading TITLE
            let title = `
                <div class="gridTitle">
                    ${item.title}
                </div>
            `
            //loading price
            let price = `
                <div class="gridPrice">
                    ${item.price}
                </div>
            `
            if (index % 2 === 0) {
                grid += `
                    <div class="grid gridDiff">
                        ${productIMG}
                        ${title}
                        ${price}
                    </div>
                `
            } else {
                grid += `
                    <div class="grid" onclick="${gvc.event(() => {
                    item.click()
                })}">
                        ${productIMG}
                        ${title}
                        ${price}
                    </div>

                `
            }

            returnHTML = `
                <div class="grid-group">
                    ${grid}
                </div>
            `

        })
        return returnHTML
    }
    slideNEWSControl = (pageImgArray: any, pagination = false, navigation = false, scrollbar = false) => {
        const gvc = this.gvc
        const  glitter=gvc.glitter
        gvc.addStyle(`
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
                border-radius: 10px;
            }
        `)

        let slidePage = ``
        pageImgArray.forEach((item: any, index: number) => {
            // Slides
            slidePage += `
                <div class="swiper-slide" style="padding-bottom: 50%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                item.click()
            })}">
                </div>
            `
        })

        let iCount: number = 1
        if (glitter.share.sideCount) {
            glitter.share.sideCount++;
            iCount = glitter.share.sideCount;
        } else {
            glitter.share.sideCount = 1
        }
        let id = gvc.id(`slide${iCount}`)
        return `
            <!-- Slider main container -->
            ${gvc.bindView({
            bind: `slide${iCount}`,
            view: () => {
                return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              <!-- If we need pagination -->

              ${(() => {
                    if (pagination) {
                        return `<div class="swiper-pagination"></div>`
                    } else {
                        return ``
                    }
                })()}

              <!-- If we need navigation buttons -->
              ${(() => {
                    if (navigation) {
                        return `
                          <div class="swiper-button-prev"></div>
                          <div class="swiper-button-next"></div>`
                    } else {
                        return ''
                    }
                })()}


              <!-- If we need scrollbar -->
              ${(() => {
                    if (scrollbar) {
                        return `<div class="swiper-scrollbar"></div>`
                    } else {
                        return ``
                    }

                })()}

              `
            },

            divCreate: {class: `swiper`},
            onCreate: () => {
                console.log(id)
                const swiper = new Swiper(`#${id}`, {
                    // Optional parameters
                    direction: 'horizontal',
                    loop: true,

                    // If we need pagination
                    pagination: {
                        el: `#${id} .swiper-pagination`,
                    },

                    // Navigation arrows
                    navigation: {
                        nextEl: `#${id} .swiper-button-next`,
                        prevEl: `#${id} .swiper-button-prev`,
                    },

                    // And if we need scrollbar
                    scrollbar: {
                        el: `#${id} .swiper-scrollbar`,
                    },


                });
            }
        })}
        `;
    }
    readMoreInf = (inf: any) => {
        const gvc = this.gvc
        const  glitter=gvc.glitter
        gvc.addStyle(`
             .maginInfDiff{
                margin-top: 32px
             }
        `)
        let returnHTML = ``;
        let grid = ``
        inf.forEach((item: any, index: number) => {

            if (index !== 0) {
                returnHTML += `
                    <div class="w-100 maginInfDiff" style=";padding-bottom: 87%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                    item.click()
                })}">
                    </div>
                `
            } else {
                returnHTML += `
                    <div class="w-100 maginInfDiff" style=";padding-bottom: 87%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                    item.click()
                })}">
                    </div>
                `
            }


        })
        return returnHTML
    }
    footer = (element: any) => {
        const gvc = this.gvc
        const  glitter=gvc.glitter
        gvc.addStyle(`

        `)
        let returnHTML = ``;
        let grid = ``
        element.forEach((item: any, index: number) => {

            if (index !== 0) {
                returnHTML += `
                    <div class="w-100 maginInfDiff" style=";padding-bottom: 87%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                    item.click()
                })}">
                    </div>
                `
            } else {
                returnHTML += `
                    <div class="w-100 maginInfDiff" style=";padding-bottom: 87%; background:50% / cover url(${item.img})" onclick="${gvc.event(() => {
                    item.click()
                })}">
                    </div>
                `
            }


        })
        return returnHTML
    }
}