'use strict';
import {init} from '../../glitterBundle/GVController.js';
import {ViewModel} from '../../view/mainViewApi.js'
import {Dialog} from "../../widget/dialog.js";
import {User} from "../../api/user.js";


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

        main {
            padding: 24px 35px 44px;
         
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
        }

        .homeBlack {
            color: #292929;
        }

        .mySpaceCount {
            width: 18px;
            height: 18px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            line-height: 15px;
            text-align: center;
  
            /* HOMEE white */

            border: 1px solid #FFFFFF;
            border-radius: 8px;
            /* HOMEE white */

            color: #FFFFFF;

        }

        .indexTitle {
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;

            /* HOMEE white */
            color: #292929;
        }
        
        .last-name{
            margin-right:8px;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 35px;
            /* identical to box height */
            
            font-feature-settings: 'pnum' on, 'lnum' on;
            
            /* HOMEE black */
            
            color: #292929;
        }
        .first-name{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 35px;
            /* identical to box height */
            
            font-feature-settings: 'pnum' on, 'lnum' on;
            
            /* HOMEE black */
            
            color: #292929;
        }
        .name{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 26px;
            /* identical to box height */
            
            font-feature-settings: 'pnum' on, 'lnum' on;
            
            /* HOMEE dark grey */
            
            color: #858585;
        
        }
        `)
    let dialog=new Dialog(gvc)
    let viewModel = new ViewModel(gvc)
    return {
        onCreateView: () => {
            let topInset: number = 10
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 10}
                }
            })
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
        <div class="w-100 d-flex" style="padding-right: 26px;padding-top: ${10 + topInset}px;">
            ${gvc.bindView(() => {
                        var noticeCount = 0
                        glitter.runJsInterFace("setNotificationBadgeCallBack", {}, (response) => {
                            noticeCount = parseInt(response.data, 10)
                            gvc.notifyDataChange('notification')
                        })
                        return {
                            bind: `notification`,
                            view: () => {
                                return ` <img class="ms-auto" src="img/notify.svg" alt="" onclick="${gvc.event(() => {
                                    glitter.runJsInterFace("noticeBell", {}, () => {
                                    })
                                })}">
                         ${(noticeCount > 0) ? `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${noticeCount}</div>` : ``}
                 `
                            },
                            divCreate: {class: `ms-auto position-relative`},
                            onCreate: () => {
                            }
                        }
                    })}
            <img  src="img/setting.svg" alt="" style="margin-left: 20px" onclick="${gvc.event(() => {
                        glitter.changePage('jsPage/user/setting.js', "setting", true, {})
                    })}">
        </div>
        <main style="padding-bottom: 60px;">                                   
            ${gvc.bindView({
                bind : "baseUserInf",
                view : ()=>{
                    return `
                        <div class="d-flex align-items-center">
                            <div class="d-flex position-relative">
                                <img src="${glitter.share.userData.photo}" style="width: 88px;height: 88px;left: 8px;top: 0px;border-radius: 50%">
                                <img src="img/sample/main/edit.svg" style="position: absolute;right: 0;bottom: 0;" onclick="${gvc.event(()=>{
                                    glitter.changePage('jsPage/user/edit.js', "edit_Profile", true, {})    
                                })}">
                            </div>
                            <div class="d-flex flex-column justify-content-center align-baseline" style="margin-left: 32px;">
                                <div class="d-flex">
                                    <div class="last-name">${glitter.share.userData.last_name}</div><div class="first-name">${glitter.share.userData.first_name}</div>
                                </div>
                                <div class="name">
                                    ${glitter.share.userData.name}
                                </div>
                            </div>
                        </div>
                    `
                },
                divCreate : {style:`margin-bottom : 40px;`}        
            })}                                
            ${gvc.bindView({
                    bind : "topRow",
                    view : ()=>{
                        let model=[
                            {left : "編輯我的帳號" , right : "" , click : ()=>{
                                   glitter.changePage('jsPage/user/edit.js', "edit_Profile", true, {})
                            }},
                            {left : "我的訂單" , right : "查看全部" , click : ()=>{
                                    glitter.runJsInterFace("seeAllOrder", {}, () => {  })
                                }},
                        ]
                        let returnHtml = ``;
                        model.forEach((data)=>{
                            returnHtml += viewModel.mainServiceRow(data.left , data.right , data.click);
                        })


                        return returnHtml
                    }
            })}
            ${(() => {
                    let model = {
                        loading: true,
                        data: [
                            {
                                title: "我的空間",
                                icon: "img/myspace.svg",
                                count: 0,
                                click: () => {
                                    glitter.runJsInterFace("openMySpace", {}, () => {
                                    })
                                }
                            },
                            {
                                title: "我的靈感",
                                icon: "img/myidea.svg",
                                count: 0,
                                click: () => {
                                    glitter.changePage('jsPage/idea/idea_profile.js', 'idea_profile', true, {
                                        poster_id: glitter.getUrlParameter('poster_id') ?? glitter.share.userData.user_id
                                    })
                                }
                            },
                            {
                                title: "回饋優惠",
                                icon: "img/discount.svg",
                                count: 0,
                                click: () => {
                                    glitter.changePage('jsPage/user/couponTotal.js', 'couponTotal', true, {
                                        viewType: 'Preview'
                                    })
                                }
                            }]
                    }
                    let id = glitter.getUUID()
                    return gvc.bindView({
                        bind: id,
                        view: () => {
                            return viewModel.indexUserSpace(model.data)
                        },
                        divCreate: {
                            class: `d-flex justify-content-between`,
                            style: `padding: 28px 20px;box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);border-radius: 20px; gap: 8px; margin-top: 16px;margin-bottom: 12px;background : #FBF9F6;`
                        },
                        onCreate: () => {
                        }
                    })
                })()}
            ${gvc.bindView({
                bind : "topRow",
                view : ()=>{
                    let model=[
                        {left : "我們的服務" , right : "" , click : ()=>{
                                glitter.runJsInterFace("ourService", {}, () => {
                                })
                            }},
                        {left : "線上專人服務" , right : "" , click : ()=>{
                                glitter.runJsInterFace("onlineService", {}, () => {
                                })
                            }},
                        {left : "邀請朋友" , right : `獲得 $${glitter.share.inviteDiscount}` , click : ()=>{
                                dialog.showInfo("邀請朋友即將上線，敬請期待！")
                                // glitter.changePage('jsPage/user/inviteFriend.js', "inviteFriend", true, {})
                        }}
                    ]
                    let returnHtml = ``;
                    model.forEach((data)=>{
                        returnHtml += viewModel.mainServiceRow(data.left , data.right , data.click);
                    })


                    return returnHtml
                }
            })}
                
            
        </main>`
                },
                divCreate: {class: ``, style: `padding-bottom:10%;`}
            })
        },
        onResume: function () {
            setTimeout(()=>{
                dialog.dataLoading(true)
                User.getUserData(()=>{
                    dialog.dataLoading(false)
                    gvc.notifyDataChange('mainView')
                })
            },500)
        },
        onCreate: () => {
            console.log(glitter.share.userData)
        }
    }
})
