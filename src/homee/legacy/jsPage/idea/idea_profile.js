import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from "../../view/ideaViewApi.js";
import { Idea } from "../../api/idea.js";
import { SharedView } from "../../widget/sharedView.js";
init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
        html{
            margin: 0;
            box-sizing: border-box;
        }
        nav{
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
        }
        body{
            padding:0;
            margin:0;
            font-family: 'Noto Sans TC';
        }
        .panel{
            padding: 16px 24px 32px;
            width:100%;

        }
        .posterPhoto{
            width: 104px;
            height: 104px;

        }
        .infCARD{
            width: 56px;
            height: 42px;
            font-family: 'Noto Sans TC';
            font-style: normal;
            color:#292929;
            font-size: 15px;
        }
        .name{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 18px;
            line-height: 26px;
            margin-top: 8px;
            color: #292929;
        }
        .follow{            
            height: 32px;
            
            /* HOMEE red */
            margin-right: 8px;
            background: #FD6A58;
            border-radius: 8px;
            
            color: #FFFFFF;
        }
        .message{

            height: 32px;
            
            /* HOMEE light grey */
            
            background: #E0E0E0;
            border-radius: 8px;
        }
        .imgBlock{
            border-width: 0px 1px 1px 0px;
            border-style: solid;
            border-color: #FFFFFF;
        }
        
       `);
    let vm = {
        id: glitter.getUUID(),
        loading: true,
        dataList: [],
        model: {
            followText: "追蹤",
            followFUN: "POST",
            Fans: ["1"],
            Following: ["1"]
        }
    };
    const ideaApi = new Idea(glitter);
    const viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    let ideaDataArray;
    let userData;
    initGetData();
    return {
        onCreateView: () => {
            let topInset = 0;
            let iCount = 0;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data);
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => {
                    return { data: 50 };
                }
            });
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined && !vm.loading) {
                        return `
                ${shareView.navigationBar({
                            title: userData.name,
                            leftIcon: `<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                glitter.goBack();
                            })}">`,
                            rightIcon: `
                        <img src="img/sample/idea/send.svg" alt="" style="width: 24px;height: 24px;">
                    `
                        })}
                <main class="d-flex flex-column" style="padding-bottom: 100px;">                    
                    ${(() => {
                            return gvc.bindView({
                                bind: `inf`,
                                view: () => {
                                    return `
                                    <div class="w-100 d-flex align-items-center ">
                                        <div class="posterPhoto rounded-circle" style="background: 50% / cover url('${userData.photo}') no-repeat;"></div>
                                        <div class="d-flex">
                                            <div class="d-flex flex-column align-items-center" style="margin-left: 38px">
                                                <div style="font-weight: 700;">0</div>
                                                <div style="font-weight: 400;">貼文</div>
                                            </div>
                                            <div class="d-flex flex-column align-items-center" style="margin-left: 38px">
                                                <div style="font-weight: 700;">${vm.model.Fans.length}</div>
                                                <div style="font-weight: 400;">粉絲</div>
                                            </div>
                                            <div class="d-flex flex-column align-items-center" style="margin-left: 38px">
                                                <div style="font-weight: 700;">${vm.model.Following.length}</div>
                                                <div style="font-weight: 400;">追蹤中</div>
                                            </div>
                                        </div>
                                    </div>
                                <div class="name">${userData.name}</div>
                                  ${(() => {
                                        if (glitter.share.userData.user_id === gBundle.poster_id) {
                                            return ``;
                                        }
                                        else {
                                            return `  <div class="w-100 d-flex" style="margin-top: 16px">
                                        <div class="follow w-50 d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                                follow();
                                            })}">${vm.model.followText}</div>
                                        <div class="message w-50 d-flex align-items-center justify-content-center" >發訊息</div>
                                    </div>`;
                                        }
                                    })()}
                                `;
                                },
                                divCreate: { class: `panel d-flex flex-column`, style: `` },
                                onCreate: () => { }
                            });
                        })()}
                    <div class="w-100" style="background-color: lightgrey;height: 1px;"></div>
                    ${(() => {
                            let returnHtml = ``;
                            ideaDataArray.forEach((ideaAData) => {
                                returnHtml += `
                                <div class="w-50 imgBlock" style="padding-bottom:33%; background:50% / cover url(${ideaAData.preview_image[0]})" onclick="${gvc.event(() => {
                                    glitter.changePage("jsPage/idea/idea.js", "idea", true, {
                                        viewType: 'user',
                                        data: userData,
                                        idea_id: ideaAData.idea_id
                                    });
                                })}"></div>
                            `;
                            });
                            return gvc.bindView({
                                bind: `ImgCardGroup`,
                                view: () => { return returnHtml; },
                                divCreate: { class: `d-flex flex-wrap`, style: `` },
                                onCreate: () => { }
                            });
                        })()}
                </main>
        `;
                    }
                    else {
                        return `
     ${shareView.navigationBar({
                            title: "",
                            leftIcon: `<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                glitter.goBack();
                            })}">`,
                            rightIcon: `
                        <img src="img/sample/idea/send.svg" alt="" style="width: 24px;height: 24px;">
                    `
                        })}
                        <div class="" style="padding-top: 100px;"> ${viewModel.loadingView()}</div>
                      
                        `;
                    }
                },
                divCreate: { class: ``, style: `` }
            });
        }
    };
    function initGetData() {
        ideaApi.getUserInfo(gBundle.poster_id, (response) => {
            var _a, _b;
            userData = response;
            vm.model.Fans = ((_a = response === null || response === void 0 ? void 0 : response.fans) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
            vm.model.Following = ((_b = response === null || response === void 0 ? void 0 : response.following) === null || _b === void 0 ? void 0 : _b.split(",")) || [];
            ideaApi.getPersonalData(gBundle.poster_id, ((response) => {
                vm.loading = false;
                console.log(response);
                vm.model.Fans.forEach((x) => {
                });
                if (glitter.share.userData.user_id != gBundle.poster_id && vm.model.Fans.find(x => x == glitter.share.userData.user_id)) {
                    vm.model.followFUN = "DELETE";
                    vm.model.followText = "取消追蹤";
                }
                else {
                    vm.model.followFUN = "POST";
                    vm.model.followText = "追蹤";
                }
                ideaDataArray = response;
                gvc.notifyDataChange('mainView');
            }));
        });
    }
    function follow() {
        ideaApi.changeFollow(vm.model.followFUN, gBundle.poster_id, glitter.share.userData.user_id, () => {
            vm.loading = true;
            gvc.notifyDataChange("mainView");
            initGetData();
        });
    }
});
