'use strict';
import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from '../../view/userProfile.js';
import { SharedView } from "../../widget/sharedView.js";
init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
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

        html {
            width: 100%;
            height: 100%;
            
        }

        body {
            width: 100%;
            height: 100%;     
        }
        .floor{
            animation-duration:2s;
        }
        .h80{
            height:80vh;
        }
        .h100{
            height:100vh;
        }
        .transBTN{
            height: 48px;
            background: #FD6A58;
            border-radius: 24px;
            font-weight: 700;
            font-size: 18px;
            line-height: 26px;
            letter-spacing: 0.15em;
            color: #FFFFFF;
        }
        
        


        
        `);
    let viewModel = new ViewModel(gvc);
    let shareView = new SharedView(gvc);
    let model = undefined;
    let top = 63 + glitter.share.topInset - 40;
    let frameHeight = "h80";
    let clock;
    let vm = {
        loading: false,
        model: {
            actionImg: "img/shareUP.svg",
            expandFun: () => {
                if (frameHeight == "h80") {
                    frameHeight = "h100";
                    vm.model.actionImg = "img/shareDown.svg";
                }
                else {
                    frameHeight = "h80";
                    vm.model.actionImg = "img/shareUP.svg";
                }
                console.log("test");
                gvc.notifyDataChange("mainView");
            },
            origList: [
                {
                    name: "",
                    img: "",
                    select: false,
                }
            ],
            friendList: [
                {
                    name: "",
                    img: "",
                    select: false,
                }
            ],
            searchUserLoading: false
        }
    };
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `                    
                    <div class="w-100 floor border ${frameHeight}" style="border-radius: 40px 40px 0px 0px;padding:0px 20px ${glitter.share.bottomInset + 80}px;">
                        <!--                    最上方箭頭-->
                        ${gvc.bindView({
                        bind: "actionRow",
                        view: () => {
                            return `                                
                                    <img src="${vm.model.actionImg}" alt="上箭頭" style="width: 46px;height: 4px;" onclick="${gvc.event(() => {
                                vm.model.expandFun();
                            })}">
                                    
                                `;
                        },
                        divCreate: { class: `d-flex w-100 align-items-center justify-content-center`, style: `padding: 12px 0` }
                    })}
    <!--                    搜尋-->
                        ${gvc.bindView({
                        bind: "searchRow",
                        view: () => {
                            return `
                                    <img src="img/search-gray.svg" alt="search" style="width: 18px;height: 18px; position: absolute;left: 12px; top: calc(50% - 9px)">
                                    <input class="w-100 align-items-center border-0" style="height:40px;padding-left: 40px;background: rgba(41, 41, 41, 0.1);border-radius: 20px;" placeholder="搜尋" oninput="${gvc.event((e) => {
                                searchDataTimer(e);
                            })}">
                                    <img src="img/upload.svg" alt="search" style="width: 24px;height: 24px; position: absolute;right: 8px; top: calc(50% - 12px)">
                                
                                `;
                        },
                        divCreate: { class: `w-100 d-flex align-items-center`, style: `position:relative;` }
                    })}
                        
    <!--                    朋友清單-->
                        ${gvc.bindView({
                        bind: "friendList",
                        view: () => {
                            let returnHTML = ``;
                            vm.model.friendList.forEach((friend, index) => {
                                returnHTML += `
                                        ${gvc.bindView({
                                    bind: `friend${index}`,
                                    view: () => {
                                        let checkIMG = (friend.select) ? "img/friendSelected.svg" : "img/friendUnSelected.svg";
                                        return `
                                                    <img src="${friend.img}" style="width: 56px;height: 56px;border-radius: 50%;">
                                                    <div style="font-weight: 500;font-size: 18px;line-height: 26px;color: #292929;margin-left:16px;">${friend.name}</div>
                                                    <img class="ms-auto " src="${checkIMG}" style="width: 32px;height: 32px;" onclick="${gvc.event(() => {
                                            vm.model.friendList[index].select = !vm.model.friendList[index].select;
                                            gvc.notifyDataChange(`friend${index}`);
                                        })}">
                                                `;
                                    },
                                    divCreate: { style: `margin-bottom:8px;`, class: `w-100 d-flex align-items-center` }
                                })}

                                    `;
                            });
                            return returnHTML;
                        },
                        divCreate: { class: `d-flex flex-column w-100 align-items-center justify-content-center`, style: `padding: 12px 0` }
                    })}
                    </div>                   
                    <!--                    傳送列-->
                    <div class="w-100" style="background: #FFFFFF;border-top: 1px solid #E0E0E0;padding:12px 20px ${glitter.share.bottomInset + 12}px;position: fixed;bottom: 0;left: 0;">
                        <button class="w-100 transBTN border-0">傳送</button>
                    </div>
                    
                `;
                },
                divCreate: { class: `w-100  d-flex flex-column justify-content-end`, style: `height:100vh; position: fixed;bottom: 0;left: 0;background: #FFFFFF;` }
            });
        },
        onResume: function () {
        },
        onCreate: () => {
            if (!vm.loading) {
                vm.loading = true;
                glitter.runJsInterFace("getFriendList", {}, (response) => {
                    vm.model.origList = response.data;
                    vm.model.friendList = response.data;
                    gvc.notifyDataChange("friendList");
                }, {
                    webFunction: () => {
                        return { data: [
                                {
                                    name: "kevin lu",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=lu&font=noto",
                                    select: false,
                                },
                                {
                                    name: "victor chang",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=chang&font=noto",
                                    select: false,
                                },
                                {
                                    name: "李政澐",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=李&font=noto",
                                    select: false,
                                },
                                {
                                    name: "林庭儒",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=林&font=noto",
                                    select: false,
                                },
                                {
                                    name: "janni yi",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=yi&font=noto",
                                    select: false,
                                },
                                {
                                    name: "李政澐",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=李&font=noto",
                                    select: false,
                                },
                                {
                                    name: "張巧雲",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=張&font=noto",
                                    select: false,
                                },
                                {
                                    name: "Alisa L",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=L&font=noto",
                                    select: false,
                                },
                                {
                                    name: "王卓文",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=王&font=noto",
                                    select: false,
                                },
                                {
                                    name: "陳凱希",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=陳&font=noto",
                                    select: false,
                                },
                                {
                                    name: "jason wang",
                                    img: "https://fakeimg.pl/56x56/?retina=1&text=wang&font=noto",
                                    select: false,
                                },
                            ]
                        };
                    }
                });
            }
        }
    };
    function searchDataTimer(element) {
        let value = element.value;
        clearTimeout(clock);
        clock = setTimeout(() => {
            vm.loading = true;
            if (value) {
                vm.model.friendList = [];
                vm.model.origList.forEach((data) => {
                    if (data.name.includes(value)) {
                        vm.model.friendList.push(data);
                        gvc.notifyDataChange("friendList");
                    }
                });
            }
            else {
                vm.model.friendList = vm.model.origList;
                gvc.notifyDataChange("friendList");
            }
        }, 100);
    }
});
