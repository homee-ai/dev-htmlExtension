"use strict";
import {GVC} from '../../glitterBundle/GVController.js';
// @ts-ignore
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'

import {Idea, IdeaData} from "../api/idea.js";
import {Dialog} from "../../homee/legacy/widget/dialog.js";
import {appConfig} from "../../config.js";


export class ViewModel {
    public gvc: GVC = new GVC()
    public postView: (ideaPostData: any , userData:any) => string;
    public loadingView: () => string;
    public checkDismiss: () => void;

    constructor(gvc: GVC) {
        this.gvc = gvc;
        const glitter = gvc.glitter;
        const $ = gvc.glitter.$;
        const ideaAPI = new Idea(gvc.glitter);
        const dialog = new Dialog(gvc)

        function getDateDiff(dateTimeStamp: number) {
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            let now = new Date().getTime();
            let timestamp = new Date((new Date(dateTimeStamp)).getTime() + 8 * 60 * 60 * 1000).getTime()
            let diffValue = now - timestamp;
            if (diffValue < 0) {
                return "剛剛";
            }
            let monthC = diffValue / month;
            let weekC = diffValue / (7 * day);
            let dayC = diffValue / day;
            let hourC = diffValue / hour;
            let minC = diffValue / minute;
            let result = undefined;
            if (monthC >= 1) {
                result = `${parseInt(monthC.toString())}月前`;
            } else if (weekC >= 1) {
                result = `${parseInt(weekC.toString())}周前`;
            } else if (dayC >= 1) {
                result = `${parseInt(dayC.toString())}天前`;
            } else if (hourC >= 1) {
                result = `${parseInt(hourC.toString())}小時前`;
            } else if (minC >= 1) {
                result = `${parseInt(minC.toString())}分鐘前`;
            } else {
                result = "剛剛";
            }

            return result;
        }


        function leaveModel(postData: IdeaData , userData:any) {
            glitter.share.postData = postData;
            const data = {
                config: JSON.stringify(postData.config),
                scene: postData.scene,
                userName: postData.poster
            }

            //todo 留言model
            glitter.runJsInterFace("leaveModelToBoard", data, function (response) {
                let jsonData = {
                    idea_id: postData["idea_id"],
                    messager: userData.user_id,
                    content: {
                        appendix: `${response["preview_image"]}`,
                        scene: response["scene"],
                        config: JSON.parse(response["config"]),
                    }
                }
                dialog.dataLoading(true)
                appConfig().getUserData({
                    callback:(response:any)=>{
                        $.ajax({
                            url: `${appConfig().serverURL}/api/v1/idea/board`,
                            type: 'POST',
                            data: JSON.stringify(jsonData),
                            contentType: 'application/json; charset=utf-8',
                            headers: {Authorization: response.token},
                            success: (resposnse: any) => {
                                dialog.dataLoading(false)
                                appConfig().changePage(gvc, 'idea_board', {postData: postData}, {});
                            },
                            error: () => {
                            },
                        });
                    }
                })


            }, {
                webFunction(data: {}): any {
                    return {
                        preview_image: "img/sample/idea/postimg.png",
                        scene: "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz",
                        config: JSON.stringify({
                            "id": "E9ED7F76-116D-42A3-B616-C83684F36F01",
                            "key": "hhh",
                            "data": [{
                                "x": -1.5339330434799194,
                                "y": -1.2596129179000854,
                                "z": -0.35074079036712646,
                                "prodult": {
                                    "id": 7324687,
                                    "sku": "F010060-1-1",
                                    "name": "MARSILLY 餐椅",
                                    "spec": "",
                                    "price": 4890,
                                    "multiple": false,
                                    "is_select": false,
                                    "model_url": "https://machi-app.com/api/v1/assets/sku/20221027T020021-F010060-1-1.usdz",
                                    "select_count": 1,
                                    "preview_image": "https://cdn.store-assets.com/s/349867/i/41820128.png?width=720"
                                },
                                "rotation": 0
                            }],
                            "rout": "Documents/MySpace/1668048250482.usdz",
                            "time": 689741055.022742,
                            "store_time": "2022-11-10 10:44:15",
                            "server_rout": "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz"
                        })
                    }
                }
            })
        }


        function changeToBoard(postData: any) {
            // glitter.share.postData = postData
            // glitter.changePage('jsPage/idea/idea_board.js', 'idea_board', true, {data: postData})
            appConfig().changePage(gvc, "idea_board", {
                postData: postData
            }, {

            })
        }

        gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
        /*
         * 控制side 但是要記得引css
         * 參數分別為 分頁資料 不同分頁會顯示的下面三個點 左右箭頭 跟分頁進度的scrollbar 預設false
         * */
        this.postView = (ideaPostData: IdeaData[] , userData:any): string => {
            const gvc = this.gvc
            const glitter = gvc.glitter

            let postDataArray: IdeaData[] = ideaPostData

            gvc.addStyle(`
            .post{
                margin-top:16px;
            }
            .posterName{
                /* Noto Sans TC - Regular - 14 */

                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 150%;
                /* identical to box height, or 21px */


                /* HOMEE black */

                color: #292929;
            }
            .titleFont{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 500;
                font-size: 14px;
                line-height: 32px;
                color: #292929;
            }
            .introTitle{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 17px;
                height:17px;
                margin-right:8px;
                /* HOMEE black */

                color: #292929;
            }
            .introText{
                /* Noto Sans TC - Regular - 12 */

                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 13px;
                line-height: 17px;
                word-break: break-all;
                white-space:normal;


                /* HOMEE black */

                color: #292929;
            }
            .messageRow{
                /* Noto Sans TC - Regular - 12 */

                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                padding:0 16px;
                margin:8px 0;
                /* HOMEE grey */

                color: #858585;
            }
            .HOMEE-Grey{
                color: #858585;
            }
            .leaveRow{
                /* Noto Sans TC - Regular - 12 */

                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;

                padding:0 16px;

            }
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
            }
            .leaveInput{
                /* HOMEE light grey */

                border: 1px solid #D6D6D6;
                border-radius: 20px;

                /* Noto Sans TC - Regular - 12 */

                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;

                /* HOMEE light grey */

                color: #292929;

                padding-left:8px;
            }
            .leaveBTN{
                color: #00A3FF;
                opacity: 0.3;
                position: absolute;
                right: 25px;
                top: calc(50% - 8px)
            }
            .leaveEvent{
                opacity: 1;
            }
            .all-message:hover{
                cursor: pointer;
            }
            .likeCount{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                line-height: 100%;
                /* identical to box height, or 21px */


                /* HOMEE black */

                color: #292929;
            }
        `)
            const pageID = gvc.glitter.getUUID()
            let postHtml = undefined;
            let ignoreID: string[] = []
            let returnHtml = ``;
            let firstPost = true

            for (const b of ideaPostData) {
                let trigger = (firstPost) ? "trigger" : ""
                const key = b.idea_id
                const postData: IdeaData = b
                postHtml = ``;
                let slideBarDOM = ``; // slide
                let timeDiffDOM = getDateDiff(new Date(postData['datetime']).getTime())
                slideBarDOM = this.slideControl(postData["preview_image"], postData["idea_id"],`
            .swiper-slide{
                padding-bottom: 66%;
                width:100%;
                background-repeat: no-repeat;
            }

        `);
                if(ignoreID.indexOf(key)===-1){
                    postHtml = `
                <div class="trigger" style="margin-bottom: 32px" data-idea="${postData["idea_id"]}" id="ideaComp${postData["idea_id"]}">
                    <!--頭貼列-->
                    ${gvc.bindView({
                        bind: `user${key}`,
                        view: () => {
                            return ` <img src="${postData['posterPhoto']}" class="rounded-circle" style="width: 32px;height: 32px;margin-right: 8px;" alt=""
                            onclick="${gvc.event(() => {
                                appConfig().changePage(gvc, 'idea_profile', {poster_id: postData['poster_id']})
                            })}">
                            <div class="titleFont" onclick="${gvc.event(() => {
                                appConfig().changePage(gvc, 'idea_profile', {poster_id: postData['poster_id']})
                            })}">${postData['poster']}</div>
                            <div class="flex-fill"></div>
                            
                            <img src="${new URL!(`../../img/more_vertical.png`, import.meta.url)}" style="width: 20px;height: 20px;" onclick="${gvc.event((e) => {
                                glitter.runJsInterFace("moreAction", {}, (response) => {
                                    if (response.result == "ignore") {
                                        ignoreID.push(postData["idea_id"])
                                    }
                                    gvc.notifyDataChange(pageID)
                                })
                            })}">
`
                        },
                        divCreate: {class: `w-100 d-flex align-items-center`, style: `padding: 12px`}
                    })}
                    ${slideBarDOM}
                    <!--功能列-->
                    ${gvc.bindView(() => {
                        return {
                            bind: `toolBar${postData["idea_id"]}`,
                            view: () => {
                                
                                let isLike = (postData['dislike']) ? "../../img/sample/idea/like.svg" : "../../img/sample/idea/unlike.svg"
                                return ` <div class="me-auto d-flex">
                                    <img class="likeIMG" src="${new URL!(isLike, import.meta.url)}" style="width: 23px; height: 23px;margin-right: 16px;" onclick=" ${gvc.event(() => {
                                        postData['dislike'] = !postData['dislike']
                                        if (postData['dislike']) {
                                            postData["likeCount"]++
                                        } else {
                                            postData["likeCount"]--
                                        }
                                        ideaAPI.liked({
                                            user_id: userData.user_id,
                                            idea_id: key
                                        }, userData.token , postData['dislike'], (result) => {
                                        })
                                        gvc.notifyDataChange(`toolBar${postData["idea_id"]}`)
                                        gvc.notifyDataChange(`likeCount${key}`)
                                    })}">
                                    <img src="${new URL!('../../img/sample/idea/boardChat.svg', import.meta.url)}" style="width: 23px; height: 23px;margin-right: 16px;" onclick="${gvc.event(() => {
                                        changeToBoard(postData)
                                    })}">
                        <img src="${new URL!('../../img/sample/idea/send.svg', import.meta.url)}" style="width: 23px; height: 23px;;" onclick="">
                    </div>
                    ${(postData['scene'] === 'noImage') ? ``:` <img class="ms-auto" src="${new URL!('../../img/sample/idea/edit.svg', import.meta.url)}" style="width: 23px; height: 23px;" onclick="${gvc.event(() => {
                                    leaveModel(postData , userData)
                                })}">`}
                   `
                            },
                            divCreate: {
                                class: `d-flex`, style: `padding-left: 12px; padding-right: 18px;margin-top:12px;`
                            }
                        }
                    })}
                    <!--按讚數-->
                    ${gvc.bindView(() => {
                        return {
                            bind: `likeCount${key}`,
                            view: () => {
                                if (postData["likeCount"] !== undefined) {
                                    return ` ${postData["likeCount"]} 個讚`
                                } else {
                                    return ``
                                }
                            },
                            divCreate: {class: `d-flex likeCount`, style: `padding: 0 16px;margin-top: 12px;`}
                        }
                    })}
                    <!--文章內文-->
                    ${gvc.bindView(() => {
                        const viewModel = {
                            open: false,
                            id: glitter.getUUID()
                        }
                        return {
                            bind: viewModel.id,
                            view: () => {
                                if (viewModel.open || postData["content"]["intro"].length < 30) {
                                    return `  <div class="introText " style="word-break: break-all;white-space: normal;">
                        ${postData["content"]["intro"]}
                    </div>`
                                } else {
                                    return `  <div class="introText " onclick="${gvc.event(() => {
                                        viewModel.open = true;
                                        gvc.notifyDataChange(viewModel.id)
                                    })}" style="word-break: break-all;white-space: normal;">
                        ${postData["content"]["intro"].substring(0, 30)}...<span style="color: #858585;" >更多</span>
                    </div>`
                                }

                            },
                            divCreate: {
                                class: `d-flex`, style: `padding: 0 16px;margin-top: 8px;`
                            }
                        }
                    })}
                    <!--留言-->
                    ${gvc.bindView(
                        () => {
                            var message: {
                                idea_id: string,
                                messager: string,
                                content: {
                                    appendix: string,
                                    text: string
                                }
                            } = {
                                idea_id: postData.idea_id,
                                messager: userData.user_id,
                                content: {
                                    appendix: '',
                                    text: ''
                                }
                            }
                            return {
                                bind: `message${key}`,
                                view: () => {
                                    return `
                            ${(() => {
                                        if (postData["messageCount"] == undefined || postData["messageCount"] == 0) {
                                            return `<div style="height: 10px;"></div>`
                                        } else {
                                            return `  
                                    <div class="d-flex messageRow">
                                        <div class="me-auto all-message" onclick="${gvc.event(() => {
                                                changeToBoard(postData)
                                            })}">
                                            查看全部${postData["messageCount"]}則留言
                                        </div>
                                        <div class="ms-auto">
                                            ${timeDiffDOM}
                                        </div>
                                    </div>`
                                        }
                                    })()}
                            <div class="d-flex leaveRow" style="position: relative">
                            <div class="rounded-circle" style="width: 32px !important;height: 32px;margin-right: 8px;
                            background: 50% / cover url('${userData['photo']}') no-repeat;"></div>
                                <div class="flex-fill leaveInput d-flex align-items-center border-0" >
                                   <div class="w-100 my-auto d-flex align-items-center HOMEE-Grey"  style="line-height: 32px;border: none;background: transparent;margin-right: 50px;"
                                   onclick="${gvc.event(() => {
                                        changeToBoard(postData)
                                    })}" style="margin-right: 40px;">以${userData['name']}新增留言</div>           
                                </div>
                            </div>
                            `
                                },
                                divCreate: {}
                            }
                        }
                    )}
                </div>
                `
                    returnHtml += postHtml;
                }
            }

            return gvc.bindView({
                bind: pageID, view: () => {
                    return returnHtml
                },
                divCreate: {}
            });
        }

        this.loadingView = (): string => {
            return `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`
        }
        //判斷要返回還是關閉整個頁面
        this.checkDismiss = () => {
            if (glitter.share.firstPageIsIdea) {
                glitter.goMenu()
            } else {
                glitter.runJsInterFace("dismiss", {}, () => {
                })
            }
        }
    }

    public slideControl = (pageImgArray: any, postID: string,style:string): string => {
        const gvc = this.gvc
        const glitter = gvc.glitter
        gvc.addStyle(style)

        let slidePage = ``

        pageImgArray.forEach((item: any, index: number) => {
            //todo 點照片的時候要幹嘛
            slidePage += `
                <div class="swiper-slide" style=" background:50% / cover url(${item})" onclick="${gvc.event(() => {
            })}">
                </div>
            `
        })
        let slideID = `slide${postID.toString()}`

        return `
            ${gvc.bindView({
            bind: slideID,
            view: () => {

                return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              <div class="swiper-pagination"></div>
              `
            },
            divCreate: {class: `swiper ${slideID}`},
            onCreate: () => {
                setTimeout(()=>{
                    const swiper = new Swiper(`#${gvc.id(slideID)}`, {
                        // Optional parameters
                        direction: 'horizontal',
                        // loop: true,
                        //
                        spaceBetween: 100,

                        pagination: {
                            el: `#${gvc.id(slideID)} .swiper-pagination`,
                        },

                    });
                },100)
         


            }
        })}
        `;
    }
    public message = (messageDataArray: any): String => {
        return ''
    }

}

