'use strict';
import {init} from '../../glitterBundle/GVController.js';

import {Dialog} from "../../widget/dialog.js"
import {SharedView} from "../../widget/sharedView.js"
import {ViewModel} from "../../view/categoryViewApi.js";
import {Category, ProductData} from "../../api/category.js";


init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
     
        nav{
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
        }

        main {
            padding: 24px 35px 44px;
      
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
        }
        .sortRawText{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 19px;
            /* identical to box height */
            
            display: flex;
            align-items: center;
            text-align: center;
            
            /* HOMEE dark grey */
            
            color: #858585;

        }
        a{
        
        }

        `)
    const dialog = new Dialog(gvc);
    let shareView = new SharedView(gvc);
    const viewModel = new ViewModel(gvc)
    const categoryAPI = new Category(gvc.glitter);
    let sortSelect = 0;
    //todo get title 父標題
    let title = gBundle.title;
    let sortPriceOrder = -1;
    let origData:ProductData[] = [];
    glitter.share.productData = {};
    let sortRow = [
        {
            text: '綜合', img: '', click: (e:HTMLElement) => {
                //reset orderPrice
                sortPriceOrder = -1;
                sortRow[1].img = glitter.share.getLink('img/sample/category/sort.svg');
                sortSelect = 0;
                if (origData.length != 0){
                    glitter.share.productData = origData;
                }
                gvc.notifyDataChange('sortBar');
                gvc.notifyDataChange('cardGroup');
            }
        },
        // {
        //     text: '銷量', img: '', click: (e:HTMLElement) => {
        //         if (!origData){
        //             origData = glitter.share.productData;
        //         }
        //
        //         //reset orderPrice
        //         sortPriceOrder = -1;
        //         sortRow[2].img = 'img/sample/category/sort.svg';
        //
        //         sortSelect = 1;
        //         // todo sort by 銷量 目前沒有
        //         gvc.notifyDataChange('sortBar');
        //         gvc.notifyDataChange('cardGroup');
        //     }
        // },
        (()=>{
            const map={
                text: '價格', img: glitter.share.getLink('img/sample/category/sort.svg'), click: (e:HTMLElement) => {
                    if (!origData){
                        origData = glitter.share.productData;
                    }
                    //
                    sortSelect = 1;
                    sortPriceOrder *= -1;
                    if (sortPriceOrder==1){
                        map.img = glitter.share.getLink('img/sample/category/sortSmaller.svg');
                    }else if (sortPriceOrder){
                        map.img = glitter.share.getLink('img/sample/category/sortHigher.svg');
                    }
                    glitter.share.productData.sort((a:ProductData, b:ProductData)=>(a.sale_price - b.sale_price) * sortPriceOrder);
                    gvc.notifyDataChange('sortBar');
                    gvc.notifyDataChange('cardGroup');
                }
            }
            return map
        })()
    ]
    glitter.share.selectSubCategory = gBundle?.index + 1 || 0;
    return {
        onCreateView: () => {
            let topInset: number = 0
            let bottomInset: number = 0
            topInset = glitter.share.topInset;
            bottomInset = glitter.share.bottomInset;
            glitter.share.subCategoryVM = {
                setSubCategoryRow: ``,
                parameter: gBundle.category,
                parentCategory : gBundle.parent_category_id,
                parameter_value: gBundle.category_id,
                productLoading: false
            };
            //todo 跳過來的時候預設的分類
            viewModel.setSubCategoryRow(gBundle.parent_category_id, (text) => {
                glitter.share.subCategoryVM.setSubCategoryRow = text
                gvc.notifyDataChange('mainView')
            })
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined && bottomInset !== undefined) {
                        return /* HTML */ `
                        <nav class="bg-white w-100 position-fixed z-index-99"  style="padding-top: ${topInset - 20}px;width: 100vw;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);z-index: 9999;">
                            <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 16px; background: #FFFFFF;position:relative;">
                                <div class="me-auto p-0 d-flex align-items-center" style="">
                                    <img class="" src="${glitter.share.getLink('img/sample/category/left-arrow.svg')}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            //todo 回哪裡
                            glitter.goBack()
                        })}">
                                </div>
                                <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="color: #292929;;position: absolute;top: 50%;   font-family: 'Noto Sans TC';font-style: normal;font-size: 16px;font-weight: 700;">
                                    ${title}
                                </div>
                         
                            </div>
                            <banner style="">
                               ${glitter.share.subCategoryVM.setSubCategoryRow}
    <!--                            todo 之後如果有需要要加東西-->
                                ${gvc.bindView({
                            bind: 'sortBar',
                            view: () => {
                                let returnHTML = ``;
                                sortRow.forEach((element, index: number) => {
                                    let style = (index == sortSelect) ? "color: #292929;font-weight: 500;" : ""
                                    returnHTML += `
                                    <div class="sortRawText" style="padding: 0 24px;${style}" onclick="${gvc.event((e)=>{
                                        element.click(e);    
                                    })}">
                                        ${element.text}
                                        ${gvc.bindView({
                                        bind: "",
                                        view: () => {
                                            if (element.img) {
                                                return `<img src="${element.img}" style="height: 16px;width: 16px;">`
                                            }
                                            return ``
                                        }
                                        })}
                                    </div>
                                    `
                                    //直槓
                                    if (index != sortRow.length - 1) {
                                        returnHTML += `
                                                <div style="background: #858585; height: 5px;width: 1px;"></div>
                                            `
                                    }
                                })
                                return returnHTML
                            },
                            divCreate: {style: `margin-top:${(glitter.share.subCategoryVM.setSubCategoryRow === '') ? ``:`24px;`}px;padding-bottom:9px;`, class: `d-flex align-items-center`}
                        })}
                            </banner>       
                        </nav>
                        <main style="background: white;padding-top: ${topInset - 20 + ((glitter.share.subCategoryVM.setSubCategoryRow === '') ? 125:150)}px;padding-left: 23px;padding-right: 23px;">
                            ${gvc.bindView({
                            bind: "cardGroup",
                            view: () => {
                                
                                if (glitter.share.subCategoryVM.productLoading) {
                                    let returnHTML = ``;
                                
                                    glitter.share.productData.forEach((data: ProductData, index: number) => {
                                        returnHTML += viewModel.setProductCard(data, index);

                                    })
                                    return returnHTML
                                } else {
                                    return    viewModel.loadingView()
                                }

                            },
                            divCreate: {style: ``, class: `d-flex flex-wrap`}
                        })}
                        </main>                         
                        `
                    } else {
                        return `
                            
                        `
                    }

                }, divCreate: {class: ``, style: `min-height : 100vh;padding-bottom:100px;`},
                onCreate: () => {
                    if (!glitter.share.subCategoryVM.productLoading){
                        // 3183515
                        console.log(glitter.share.subCategoryVM.parameter)
                        console.log(glitter.share.subCategoryVM.parameter_value)
                        categoryAPI.getCategoryData(glitter.share.subCategoryVM.parameter , glitter.share.subCategoryVM.parameter_value , (response)=>{
                            glitter.share.productData = response
                            glitter.share.subCategoryVM.productLoading = true;

                            gvc.notifyDataChange('cardGroup')
                        });
                    }

                }
            })
        }
    }
})