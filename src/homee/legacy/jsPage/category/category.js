'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from "../../view/categoryViewApi.js";
import { Dialog } from "../../widget/dialog.js";
import { SharedView } from "../../widget/sharedView.js";
import { Category } from "../../api/category.js";
init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
        main {
            padding: 24px 35px 44px;
       
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
            height:100vh;
        }
        
        `);
    const dialog = new Dialog(gvc);
    let shareView = new SharedView(gvc);
    const viewModel = new ViewModel(gvc);
    const categoryAPI = new Category(gvc.glitter);
    let vm = {
        loading: false,
        selectIndex: 0,
    };
    let categoryList = [];
    return {
        onCreateView: () => {
            let topInset = 0;
            let bottomInset = 0;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data);
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => {
                    return { data: 0 };
                }
            });
            glitter.runJsInterFace("getBottomInset", {}, (response) => {
                bottomInset = (response.data);
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => {
                    return { data: 50 };
                }
            });
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
                    ${shareView.navigationBar({
                        title: "分類",
                        leftIcon: `<img class="" src="${glitter.share.getLink('img/sample/idea/left-arrow.svg')}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.goBack();
                            glitter.runJsInterFace("dismiss", {}, () => { });
                        })}">`,
                        rightIcon: `
                        
                        `
                    })}
                    ${gvc.bindView({
                        bind: 'main',
                        view: () => {
                            if (vm.loading) {
                                return `              
                                <div style="padding-left: 15px;"></div>                     
                                    ${gvc.bindView({
                                    bind: "leftMain",
                                    view: () => {
                                        return viewModel.setCategoryLeft(categoryList, vm);
                                    },
                                    divCreate: { style: `width:30%;border-right: 0.5px solid #E0E0E0;position:fixed;overflow-y: scroll;padding-left: 15px;padding-right: 15px;`, class: `h-100` }
                                })}
                                    ${gvc.bindView({
                                    bind: "rightMain",
                                    view: () => {
                                        let returnHtml = ``;
                                        categoryList.forEach((data, index) => {
                                            const id = glitter.getUUID();
                                            returnHtml += gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    return viewModel.setCategoryRight(data);
                                                },
                                                divCreate: {},
                                                onCreate: () => {
                                                    if (index === vm.selectIndex) {
                                                        setTimeout(() => {
                                                            const scrollTOP = (gvc.glitter.$('#' + gvc.id(id)).offset().top) - (gvc.glitter.$('#' + gvc.id('rightMain')).offset().top) +
                                                                (gvc.glitter.$('#' + gvc.id('rightMain')).scrollTop());
                                                            gvc.glitter.$('#' + gvc.id('rightMain')).animate({ scrollTop: scrollTOP }, 500);
                                                        }, 100);
                                                        console.log('as');
                                                    }
                                                }
                                            });
                                        });
                                        returnHtml += `
                                                <div class="w-100" style="height: 30vh"></div>
                                            `;
                                        return returnHtml;
                                    },
                                    divCreate: { style: `width:70%;overflow-y:scroll;position:fixed;margin-left:26%`, class: `h-100` },
                                    onCreate: () => {
                                        let div = document.getElementById(`${gvc.id('rightMain')}`);
                                        div === null || div === void 0 ? void 0 : div.addEventListener("scroll", (e) => {
                                            let distance = div.scrollTop;
                                            let elementNodes = [];
                                            for (let i = 0; i < div.childNodes.length; i++) {
                                                if (div.childNodes[i].nodeType === 1) {
                                                    elementNodes.push(div.childNodes[i]);
                                                }
                                            }
                                            for (let i = 0; i < elementNodes.length; i++) {
                                                let e = elementNodes[i];
                                                if (distance < e.offsetTop - 100) {
                                                    if (vm.selectIndex != i - 1) {
                                                        vm.selectIndex = i - 1;
                                                        gvc.notifyDataChange('leftMain');
                                                    }
                                                    break;
                                                }
                                            }
                                        });
                                    }
                                })}
                             
                                `;
                            }
                            else {
                                return viewModel.loadingView();
                            }
                        },
                        divCreate: { style: `min-height:100vh;`, class: `d-flex w-100` }
                    })}
                    
                        `;
                },
                divCreate: { class: `d-flex w-100 flex-column`, style: `` },
                onCreate: () => {
                    if (!vm.loading) {
                        setTimeout(() => {
                            categoryAPI.getCategoryAllList((data) => {
                                categoryList = data;
                                console.log(data);
                                vm.loading = true;
                                gvc.notifyDataChange('main');
                            });
                        }, 100);
                    }
                }
            });
        }
    };
});
