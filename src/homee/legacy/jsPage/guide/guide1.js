import { init } from '../../glitterBundle/GVController.js';
import { SharedView } from "../../widget/sharedView.js";
init((gvc, glitter, gBundle) => {
    let shareView = new SharedView(gvc);
    let vm = {
        model: {
            title: "點擊按鈕開始空間掃描",
            slogan: "探索空間搭配創意世界！",
            BTN: "下一步",
            nextPage: "jsPage/guide/guide2.js",
            background: "video/homee 操作教學(步驟一).mp4"
        }
    };
    return {
        onCreateView: () => {
            gvc.addStyle(`
                body{
                    background-color: transparent!important;
                }
                .laravel{
                    background: #F8F3ED;
                    box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1);
                    border-radius: 56px 56px 0px 0px;  
                    padding-top:50px;
                    position:fixed;
                    left:0;
                    bottom:0;
                }
                .titleText{
                    font-weight: 700;
                    font-size: 32px;
                    line-height: 46px;
                    color: #292929;
                }
                .sloganText{
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 150%;
                    color: #858585;
                    
                    margin-top:8px;
                }
                .nextBTN{
                    width: 256px;
                    height: 48px;
                    background: #FD6A58;
                    border-radius: 24px;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 26px;
                    letter-spacing: 0.15em;
                    color: #FFFFFF;
                    
                    margin-top:38px;
                }
                
            
            `);
            return `                                
                <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + glitter.share.topInset}px;">
                    <div class="w-100" style="">
                        <img class="" src="img/sample/idea/left-arrow.svg" style="position:absolute; left:19px;top:${10 + glitter.share.topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                glitter.goBack("scanStart");
            })}">
                    </div>
                    <video autoplay="true" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%">
                        <source src="${vm.model.background}" type="video/mp4">
                    </video>
                    
                </div>
                ${gvc.bindView({
                bind: "laravel",
                view: () => {
                    var _a;
                    return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${((_a = glitter.share) === null || _a === void 0 ? void 0 : _a.bottomInset) || 10}px;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                    ${vm.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                    ${vm.model.slogan}
                                </div>
                                <button class="border-0 nextBTN" onclick="${gvc.event(() => {
                        glitter.changePage(vm.model.nextPage, "guide2", true, {});
                    })}">${vm.model.BTN}</button>
                            </div>
                        `;
                },
                divCreate: { style: `` }
            })}
            `;
        }
    };
});
