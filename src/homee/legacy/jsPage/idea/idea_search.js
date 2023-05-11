'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from "../../view/ideaViewApi.js";
import { SharedView } from "../../widget/sharedView.js";
import { Idea } from "../../api/idea.js";
init((gvc, glitter, gBundle) => {
    const vm = {
        loading: false,
        searchUserLoading: false,
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
        main{
            padding: 0 ;
            width:w-100;
        }
        .mainTitle{
            /* Noto Sans TC - Regular - 18 */

            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            font-weight: 400;
            font-size: 18px;
            line-height: 26px;

            /* HOMEE black */

            color: #292929;

            margin-bottom: 9px;
            margin-top: 24px;
        }
        .search-history-item{

            height: 24px;

            background: rgba(41, 41, 41, 0.1);
            /* HOMEE light grey */

            border: 1px solid #D6D6D6;
            border-radius: 12px;


            padding-right: 8px;
            margin-right: 16px;
            margin-bottom: 9px;
        }

        .search-history-cross{
            /* HOMEE grey */

            fill: #858585;
            width: 7px;
            height: 7px;
            margin: 0 8px;
        }
        .search-history-text{
            /* Noto Sans TC - Regular - 14 */

            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 150%;
            /* identical to box height, or 21px */

            text-align: center;

            /* HOMEE grey */

            color: #858585;
        }
       `);
    let shareView = new SharedView(gvc);
    const viewModel = new ViewModel(gvc);
    const ideaAPI = new Idea(gvc.glitter);
    let searchData;
    let ideaPostData;
    let searchAllow = false;
    let clock;
    let searchWord = "";
    let dataArray = ["Victor Chang", "簡約設計", "客廳"];
    let keyword = ["北歐風"];
    let searchUserHTML = ``;
    let searchUserData;
    let searchLimit = 3;
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
                    if (topInset !== undefined) {
                        return `
                ${shareView.navigationBar({
                            title: `
                   `,
                            leftIcon: `<i class="fa-regular fa-arrow-left" style="font-size: 20px;" onclick="${gvc.event(() => {
                                glitter.goBack("idea");
                            })}"></i>`,
                            rightIcon: ` <div class="search-bar d-flex ms-auto" style="width: calc(100vw - 80px);">
                        <img class="search-icon" src="img/search-black.svg" alt="" >
                        <input class="w-100 search-input" placeholder="大家都在搜尋:${keyword}" oninput="${gvc.event((e) => {
                                searchDataTimer(e);
                            })}">
                    </div>`
                        })}
                
                <main style="padding-top: ${topInset}px;">
                    ${gvc.bindView({
                            bind: "userSearch",
                            view: () => {
                                if (vm.searchUserLoading && (searchWord !== '')) {
                                    searchLimit = 3;
                                    return viewModel.loadingView();
                                }
                                else if (searchUserData) {
                                    searchLimit = (searchLimit == -1) ? searchUserData.length : searchLimit;
                                    for (let i = 0; i < searchLimit; i++) {
                                        let userData = searchUserData[i];
                                        userData.photo = (userData === null || userData === void 0 ? void 0 : userData.photo) || `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${userData.last_name}&txtfont=Helvetica&txtalign=middle,center`;
                                        searchUserHTML += `
                                        <div class="d-flex align-items-center" onclick="${gvc.event(() => {
                                            console.log(userData.userID);
                                            glitter.changePage('jsPage/idea/idea_profile.js', 'idea_profile', true, {
                                                poster_id: userData.userID
                                            });
                                        })}">
                                            <img src="${userData.photo}" style="width: 50px;height: 50px;margin-right: 8px;">
                                            <div class="" style="font-size: 16px;color: #292929">
                                                ${userData.first_name}  ${userData.last_name}
                                            </div>
                                        </div>`;
                                    }
                                    return `
                                <div class="d-flex flex-column align-items-baseline">
                                    ${searchUserHTML}
                                    <div class="w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(() => {
                                        searchLimit = -1;
                                        searchUserHTML = "";
                                        vm.searchUserLoading = true;
                                        gvc.notifyDataChange("userSearch");
                                    })}"                                    
                                    >點擊顯示更多</div>
                                </div>
                            `;
                                }
                                else {
                                    return ``;
                                }
                            }, divCreate: { style: ``, class: `` },
                            onCreate: () => {
                                if (!searchUserData && searchWord != "") {
                                    ideaAPI.searchUser(searchWord, (response) => {
                                        searchUserData = response;
                                        vm.searchUserLoading = false;
                                        gvc.notifyDataChange("userSearch");
                                    });
                                }
                            }
                        })}
                    ${(() => {
                            let id = 'postGroup';
                            return gvc.bindView({
                                bind: id,
                                view: () => {
                                    if (vm.loading && (searchWord !== '')) {
                                        return viewModel.loadingView();
                                    }
                                    else if (searchData) {
                                        return viewModel.postView(searchData);
                                    }
                                    else {
                                        return ``;
                                    }
                                },
                                divCreate: {
                                    class: ``,
                                    style: `padding-bottom:60px;`
                                },
                                onCreate: () => {
                                    if (searchWord) {
                                        ideaAPI.searchData(searchWord, (response) => {
                                            vm.loading = false;
                                            searchData = response;
                                            response.map((data) => {
                                                data.posterPhoto = (data["photo"]) ? data["photo"] : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center`;
                                                data.poster = data['first_name'] + data['last_name'];
                                                ideaAPI.detectLike(data.idea_id, (response) => {
                                                    data.dislike = response;
                                                    gvc.notifyDataChange(`toolBar${data.idea_id}`);
                                                });
                                                ideaAPI.getMessage({
                                                    idea_id: data.idea_id,
                                                    count: true
                                                }, (response) => {
                                                    data['messageCount'] = response.messageCount;
                                                    gvc.notifyDataChange(`message${data.idea_id}`);
                                                });
                                                ideaAPI.getLikeCount(data.idea_id, (response) => {
                                                    data.likeCount = response;
                                                    gvc.notifyDataChange(`likeCount${data.idea_id}`);
                                                });
                                            });
                                            searchWord = "";
                                            gvc.notifyDataChange('postGroup');
                                        });
                                    }
                                }
                            });
                        })()}
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
    function search(element) {
        let value = element.value;
    }
    function searchDataTimer(element) {
        let value = element.value;
        clearTimeout(clock);
        clock = setTimeout(() => {
            vm.loading = true;
            vm.searchUserLoading = true;
            searchWord = value;
            searchUserHTML = "";
            gvc.notifyDataChange("userSearch");
            gvc.notifyDataChange(`postGroup`);
        }, 1000);
    }
});
