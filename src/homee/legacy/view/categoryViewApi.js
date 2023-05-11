"use strict";
import { GVC } from '../glitterBundle/GVController.js';
import { Dialog } from "../widget/dialog.js";
import { Category } from "../api/category.js";
export class ViewModel {
    constructor(gvc) {
        this.gvc = new GVC();
        this.gvc = gvc;
        const glitter = gvc.glitter;
        const $ = gvc.glitter.$;
        const categoryAPI = new Category(gvc.glitter);
        const dialog = new Dialog(gvc);
        this.setSubCategoryRow = (category, getHtml) => {
            gvc.addStyle(`
                .subcateTitle{
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    /* HOMEE dark grey */
                    margin-left: 16px;
                    color: #858585;
                }
                .selectTitle{
                    /* HOMEE black */
                    color: #292929;
                    font-weight: 700;
                }
            `);
            categoryAPI.getSubcategoryList(category, (returnData) => {
                getHtml(gvc.bindView({
                    bind: "subCategoryRow",
                    view: () => {
                        let selectClass = new Array(returnData.length + 1).fill("");
                        selectClass[glitter.share.selectSubCategory] = "selectTitle";
                        let returnHTML = ``;
                        returnData.forEach((data, index) => {
                            returnHTML += `
                            <div class="subcateTitle ${selectClass[index + 1]}" style="" onclick="${gvc.event(() => {
                                glitter.share.subCategoryVM.productLoading = false;
                                gvc.notifyDataChange('cardGroup');
                                glitter.share.selectSubCategory = index + 1;
                                gvc.notifyDataChange('subCategoryRow');
                                console.log(data.easy_collection_id);
                                categoryAPI.getCategoryData("sub_category_id", data.easy_collection_id, (response) => {
                                    glitter.share.productData = response;
                                    glitter.share.subCategoryVM.productLoading = true;
                                    gvc.notifyDataChange('cardGroup');
                                });
                            })}">
                                ${data["name"]}
                                
                            </div>
                                `;
                        });
                        return returnHTML;
                    }, divCreate: { class: `d-flex`, style: `margin-left:8px;overflow-x: scroll;padding-right:8px;` }
                }));
            });
        };
        this.setProductCard = (product, index) => {
            gvc.addStyle(`
                .card{
                    width:45%
                    height: 238px;                    
                    background: #F8F3ED;
                    border-radius: 16px;
                    padding:8px;
                    margin-bottom:8px;
                }
                .img{
                    background: #FFFFFF;
                    border: 4px solid rgba(248, 243, 237, 0.3);
                    border-radius: 16px;
                    margin-bottom:8px;
                }
                .space{
                    margin-right:16px;
                }
                .sale{
                    /* Noto Sans TC - Regular - 14 */

                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 150%;
                    /* identical to box height, or 21px */
                    
                    
                    /* HOMEE red */
                    
                    color: #FD6A58;
                    
                    
                }
                .price{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 10px;
                    line-height: 14px;
                    text-align: right;
                    text-decoration-line: line-through;
                    
                    /* HOMEE grey */
                    
                    color: #858585;
                }
            `);
            return gvc.bindView({
                bind: 'productCard',
                view: () => {
                    let space = "";
                    if (index % 2 == 0) {
                        space = "space";
                    }
                    return `
                    <div class="d-flex flex-column ${space}" style=" width: calc(100vw/2 - 32px);margin-bottom: 16px; background: #FBF9F6;border-radius: 16px;" onclick="${gvc.event(() => {
                        glitter.runJsInterFace("toProductPage", {
                            id: product.id
                        }, (response) => {
                        });
                    })}">
                        <div class="w-100 img" style="position: relative;padding-top:100%;">
                            <img src="${product.preview_image}" style="position: absolute;top: 0;width: 100%;height: 100%">
                        </div>
                        <div style="margin-bottom:8px;padding: 0 8px;white-space: normal;word-break: break-all;">${product.name}</div>
                        <div class="flex-fill"></div>
                        <div class="d-flex justify-content-between align-items-center" style="padding: 0 8px 8px;">
                            <div class="sale">NT$ ${product.sale_price} up</div>
                            ${(product.sale_price !== product.price) ? ` <div class="price">NT$ ${product.price}</div>` : ``}
                        </div>
                    </div>`;
                }
            });
        };
        this.setCategoryLeft = (dataList, vm) => {
            gvc.addStyle(`
                a {
                  all: initial;
                }
                .left-title *{
                    width: 100%;
                    height: 56px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 120%;
                    word-break: break-word;
                    white-space:pre-line;  
                    color: #858585;
                }
                .selectClass *{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 17px;
                    line-height: 100%;
                    /* HOMEE red */
                    color: #FD6A58;
                }
            `);
            let returnData = ``;
            dataList.forEach((data, index) => {
                let selectClass = (index == vm.selectIndex) ? "selectClass" : "";
                returnData += `
                    <div class="left-title  ${selectClass}" onclick="${gvc.event(() => {
                    vm.selectIndex = index;
                    gvc.notifyDataChange(['leftMain', 'rightMain']);
                })}">                        
                        <a class="d-flex align-items-center justify-content-start" 
                        style="color:${(index == vm.selectIndex) ? `#FD6A58` : `#858585`};text-decoration: inherit;"
                        >${data.name}</a>
                    </div>
                `;
            });
            return `
                <div class="d-flex flex-column w-100">
                    ${returnData}
                </div>
            `;
        };
        this.setCategoryRight = (categoryListData) => {
            let title = categoryListData.name;
            let dataList = categoryListData.sub_category;
            let parentCategory = categoryListData.store_id;
            gvc.addStyle(`
                .rightCategoryTitle{
                    height: 25px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 17px;
                    line-height: 25px;
                    color: #292929;
                    margin-bottom:24px;
                }
                .cardTitle{
                    height: 40px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 120%;
                    color: #292929;
                    word-break: break-word;
                    white-space:pre-line;  

                }
            `);
            let CardGroup = ``;
            dataList.forEach((data, index) => {
                let margin = (index % 2) ? "" : "margin-right: 22px;";
                if (data.name) {
                    CardGroup += `
                    <div class="rounded" style="width: calc(50% - 11px); ${margin}" onclick="${gvc.event((e) => {
                        console.log(data.easy_collection_id);
                        glitter.changePage(glitter.share.getLink("jsPage/category/subCategory.js"), "subCategory", true, { title: categoryListData.name, parent_category_id: parentCategory, category: "sub_category_id", category_id: data.easy_collection_id, index: index });
                    })}">
                        <div class="w-100 rounded" style="padding-top: 86%;background:50% / cover url(${data.image_url})"></div>
                        <div class="cardTitle d-flex justify-content-center align-items-baseline mt-1 text-center">${data.name}</div>
                    </div>
                    `;
                }
            });
            return `
                <div class="d-flex flex-column" style="padding:40px 16px 24px 24px;">
                    <div class="d-flex rightCategoryTitle" id="${title}">${title}</div>
                    <div class="d-flex flex-wrap w-100">
                        ${CardGroup}
                    </div>
                </div>
            `;
        };
        this.setMainPuzzle = (viewJson) => {
            let returnHTML = ``;
            console.log(viewJson.length);
            viewJson.forEach((puzzle) => {
                if (puzzle === null || puzzle === void 0 ? void 0 : puzzle.box) {
                    returnHTML += this.setMainPuzzle(puzzle.box);
                }
                else {
                    returnHTML += `
                        <div class="d-flex " style="width:${100 / viewJson.length}% padding: 8px 0 0 12px;background:50% / cover url(${puzzle.img})">
                            <div style="font-style: normal;font-weight: 700;font-size: 14px;line-height: 20px;color: #292929;">
                                ${puzzle.title}
                            </div>
                        </div>
                    `;
                }
            });
            return `
                <div class="d-flex " style="width:${100 / viewJson.length}%">
                    ${returnHTML}
                </div>
            `;
        };
        this.loadingView = () => {
            return `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`;
        };
        this.checkDismiss = () => {
            if (glitter.share.firstPageIsIdea) {
                glitter.goMenu();
            }
            else {
                glitter.runJsInterFace("dismiss", {}, () => {
                });
            }
        };
    }
}
