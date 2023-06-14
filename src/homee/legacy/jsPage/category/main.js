'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from "../../view/categoryViewApi.js";
import { SharedView } from "../../widget/sharedView.js";
import { Category } from "../../api/category.js";
init((gvc, glitter, gBundle) => {
    let hotCategoryList = [
        {
            id: "1",
            modelUrl: "",
            multiple: "",
            name: "MERETA 茶几",
            preview_image: "img/sample/category/hotProduct/img.png",
            price: 3990,
            sale_price: 3990,
            sku: "",
            spec: "",
        },
        {
            id: "2",
            modelUrl: "",
            multiple: "",
            name: "SALICA 岩板餐桌",
            preview_image: "img/sample/category/hotProduct/img_1.png",
            price: 13560,
            sale_price: 13560,
            sku: "",
            spec: "",
        },
        {
            id: "3",
            modelUrl: "",
            multiple: "",
            name: "MAZAN 餐椅",
            preview_image: "img/sample/category/hotProduct/img_2.png",
            price: 1590,
            sale_price: 1590,
            sku: "",
            spec: "",
        },
        {
            id: "4",
            modelUrl: "",
            multiple: "",
            name: "BREDA 床頭櫃",
            preview_image: "img/sample/category/hotProduct/img_3.png",
            price: 9550,
            sale_price: 9550,
            sku: "",
            spec: "",
        },
    ];
    const vm = {
        loading: false,
        productPuzzle: [
            {
                title: "精選人氣商品",
                img: "img/sample/category/mainLeft.png",
                click: () => {
                }
            },
            {
                title: "岩板餐桌系列",
                img: "img/sample/category/mainRight1.png",
                click: () => {
                }
            },
            {
                title: "本週新品（ NEW ）",
                img: "img/sample/category/mainRight2.png",
                click: () => {
                }
            },
        ],
        productBookcase: [
            {
                name: "餐桌",
                img: "img/sample/category/bookcase/img.png",
                click: () => { }
            },
            {
                name: "椅子",
                img: "img/sample/category/bookcase/img_1.png",
                click: () => { }
            },
            {
                name: "沙發",
                img: "img/sample/category/bookcase/img_2.png",
                click: () => { }
            },
            {
                name: "茶几",
                img: "img/sample/category/bookcase/img_3.png",
                click: () => { }
            },
            {
                name: "TERA\n系統儲物",
                img: "img/sample/category/bookcase/img_4.png",
                click: () => { }
            },
            {
                name: "BANFF\n系統儲物",
                img: "img/sample/category/bookcase/img_5.png",
                click: () => { }
            },
            {
                name: "床架",
                img: "img/sample/category/bookcase/img_6.png",
                click: () => { }
            },
            {
                name: "裝飾畫",
                img: "img/sample/category/bookcase/img_7.png",
                click: () => { }
            },
            {
                name: "生活用品",
                img: "img/sample/category/bookcase/img_8.png",
                click: () => { }
            },
            {
                name: "全部",
                img: "img/sample/category/bookcase/img_9.png",
                click: () => { }
            },
        ],
        topList: [{
                title: "熱門商品",
                list: hotCategoryList
            }]
    };
    gvc.addStyle(`
        html{
            margin: 0;
            box-sizing: border-box;
        }
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Bold.otf);
            font-weight: bold;
        }

        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Regular.otf);
            font-weight: normal;
        }
        .search-bar{
            /* Noto Sans TC - Regular - 14 */

            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 150%;
            /* identical to box height, or 21px */


            /* HOMEE grey */

            color: #858585;

            position: relative;
            height: 40px;
        }
        .search-input{
            padding-left: 40px;
            height : 40px;
            background: rgba(51, 51, 51, 0.1);
            border: 1px solid #FFFFFF;
            border-radius: 20px;
        }
        .search-bar .search-icon{
            position: absolute;
            left: 13px;
            top: 13px;
            width: 15px;
            height: 15px;

        }

        
       `);
    let shareView = new SharedView(gvc);
    const viewModel = new ViewModel(gvc);
    const categoryAPI = new Category(gvc.glitter);
    return {
        onCreateView: () => {
            let topInset = glitter.share.topInset;
            let iCount = 0;
            let keyword = "沙發";
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined) {
                        return `
                    <nav class="d-flex" style="padding-top: ${topInset}px">
                        <div class="d-flex align-items-center" style="margin: 0 16px;">
                            <img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            glitter.goBack("idea");
                        })}">
                        </div>
                        <div class="search-bar d-flex w-100 align-items-center" style="">
                            <img class="search-icon" src="img/search-black.svg" alt="" >
                            <input class="w-100 search-input" placeholder="大家都在搜尋:${keyword}" oninput="${gvc.event((e) => {
                        })}">
                        </div>
                        <div class="d-flex align-items-center">
                            <img class="" src="img/notify.svg" style="width: 24px;height: 24px;margin:0 16px" alt="" onclick="${gvc.event(() => {
                        })}">
                            <img class="" src="img/scan-black.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                        })}">
                        </div>
                    </nav>                
                
                <main style="">
                    ${gvc.bindView({
                            bind: "productPuzzle",
                            view: () => {
                                return `                            
                            <div class="d-flex w-100" style=" padding: 8px 7px 0 12px;background:50% / cover url(${vm.productPuzzle[0].img});border-radius: 18px;" onclick="${gvc.event(() => {
                                    vm.productPuzzle[0].click();
                                })}">
                                <div style="font-style: normal;font-weight: 700;font-size: 14px;line-height: 20px;color: #292929;">
                                    ${vm.productPuzzle[0].title}
                                </div>
                            </div>
                           
                            <div class="d-flex flex-column w-100" style="padding-left: 7px;">
                                <div class="d-flex w-100 h-50" style="margin-bottom: 6px; padding: 8px 0 0 12px;background:50% / cover url(${vm.productPuzzle[1].img});border-radius: 18px;" onclick="${gvc.event(() => {
                                    vm.productPuzzle[0].click();
                                })}">
                                    <div style="font-style: normal;font-weight: 700;font-size: 14px;line-height: 20px;color: #292929;border-radius: 18px;">
                                        ${vm.productPuzzle[1].title}
                                    </div>
                                </div>
                                <div class="d-flex w-100 h-50" style="margin-bottom: 6px; padding: 8px 0 0 12px;background:50% / cover url(${vm.productPuzzle[2].img});border-radius: 18px;" onclick="${gvc.event(() => {
                                    vm.productPuzzle[0].click();
                                })}">
                                    <div style="font-style: normal;font-weight: 700;font-size: 14px;line-height: 20px;color: #292929;border-radius: 18px;">
                                        ${vm.productPuzzle[2].title}
                                    </div>
                                </div>
                            </div>
                           `;
                            }, divCreate: { class: `d-flex`, style: `height:184px;padding:0 16px;margin-top: 30px;` }
                        })}
                    ${gvc.bindView({
                            bind: "bookcase",
                            view: () => {
                                let returnHTML = ``;
                                vm.productBookcase.forEach((data) => {
                                    returnHTML += `
                                    <div class="d-flex flex-column " style="width:20%;padding-right: 16px;" onclick="${gvc.event(() => {
                                        data.click();
                                    })}">                                        
                                        <div style="width:100%;height:auto;padding: 0 4px 100%;background: #FBF9F6 url(${data.img}) no-repeat center;background-size: contain;margin-right: 18px;"></div>
                                        <div class="w-100 d-flex align-items-center justify-content-center" style="font-weight: 400;font-size: 14px;line-height: 20px;display: flex;align-items: center;text-align: center;color: #1E1E1E;word-break:break-word;white-space: normal;">${data.name}</div>
                                    </div>
                                `;
                                });
                                return `
                                <div style="margin-bottom:12px;padding-left:16px;font-weight: 700;font-size: 18px;line-height: 26px;color: #1E1E1E;">品類</div>
                                <div class="d-flex flex-wrap" style="padding-left:16px">
                                    ${returnHTML}
                                </div>
                            `;
                            },
                            divCreate: { class: `d-flex flex-column `, style: `margin-top:32px;` }
                        })}
                    ${gvc.bindView({
                            bind: "topList",
                            view: () => {
                                let returnHTML = ``;
                                vm.topList.forEach((blockData) => {
                                    returnHTML += `
                                    ${gvc.bindView({
                                        bind: blockData.title,
                                        view: () => {
                                            return ``;
                                        }
                                    })}
                                `;
                                });
                                return ``;
                            }
                        })}
                </main>    `;
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: { class: ``, style: `` }
            });
        }
    };
});
