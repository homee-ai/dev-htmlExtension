'use strict';
import {init} from '../../glitterBundle/GVController.js';
import {ViewModel} from "../../view/ideaViewApi.js";
import {Idea, IdeaData,UserData} from "../../api/idea.js";
import {SharedView} from "../../widget/sharedView.js"
import {Dialog} from "../../widget/dialog.js";



init((gvc, glitter, gBundle) => {
    const vm = {loading: true}
    const viewModel = new ViewModel(gvc)
    const $ = glitter.$
    const ideaAPI = new Idea(gvc.glitter);
    const dialog=new Dialog(gvc)

    gvc.addStyle(`
        html{
            margin: 0;
            box-sizing: border-box;
        }
        body{
         padding:0;
         margin:0;
        }

        main{
           font-family: 'Noto Sans TC';
        }
        .chatCount{
            background: #FD6A58;
            line-height:100%;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 500;
            font-size: 10px;
            line-height: 14px;
            color:white;
       `)
    let shareView = new SharedView(gvc)
    let ideaPostData:IdeaData[]
    let charCount = '';
    let noticeOpen = false;
    initGetData();
    getCharNumber();
    return {
        onCreateView: () => {
            let topInset: number = 0
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data)
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 0}
                }
            })
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    var nava=(()=>{  switch (gBundle.viewType){
                        case 'user':
                            var data=gBundle.data as UserData
                            return shareView.navigationBar({
                                title: `${data.name}的貼文`,
                                leftIcon:`<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(()=>{
                                    glitter.goBack()
                                })}">`,
                                rightIcon:``
                            })
                        default:
                            return shareView.navigationBar({
                                title: "靈感",
                                leftIcon:`<div class="me-auto p-0 d-flex align-items-center " style="width: 116px;">
                        <img class="me-auto my-auto" src="img/search-black.svg" style="width: 20px;height: 20px;" onclick="${gvc.event(() => {
                                    changeSearch()
                                })}">
                        </div>`,
                                rightIcon:`
<div style="width: 23px;height: 23px; position: relative;margin: 0 16px 0 0;">
<img src="img/plus.svg" style="width: 23px;height: 23px;" onclick=" ${
                                    gvc.event(() => {
                                        createIdea()
                                    })}">
</div>       
                            <div style="width: 23px;height: 23px; position: relative;margin: 0 16px 0 0;">
                                <div class="redDot d-none" style="width: 10px;height: 10px;background: #FD6A58;position: absolute;right:0;top: 0;z-index: 2;border-radius: 50%"></div>
                                <img src="img/sample/idea/notify.svg"   class="w-100 h-100" onclick="${gvc.event(() => {
                                    glitter.runJsInterFace("noticeBell", {}, () => {
                                        if (!noticeOpen){
                                            noticeOpen = true;
                                            glitter.openDiaLog("jsPage/dialog/noticeBell.js","noticeList" , {},{animation:glitter.animation.fade})    
                                        }else {
                                            noticeOpen = false;
                                            glitter.closeDiaLog("noticeList")
                                        }
                                            
                                        
                                    })
                                })}">
                            </div>
                            <div style="width: 23px;height: 23px;position:relative;" class="" >                                                 
                                <img src="img/sample/idea/chat.svg" style="width: 23px;height: 23px;" onclick="${gvc.event(()=>{
                                    dialog.showInfo('共同搭配功能即將上線，敬請期待!')
                                })}">
                            </div>`
                            })
                    }})()
                    if (glitter.share.topInset !== undefined && !vm.loading) {
                        return  `
                 ${nava}
                <main style="">
                    ${(() => {
                            let model = {
                                loading: true,
                                data: [],
                            }
                            let id = 'postGroup'
                            //方法

                            //畫面
                            return gvc.bindView({
                                bind: id,
                                view: () => {
                                    if (ideaPostData) {
                                        return viewModel.postView(ideaPostData);
                                    } else {
                                        return ``
                                    }

                                },
                                divCreate: {
                                    class: `main`,
                                    style: `box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);border-radius: 20px;padding-bottom:60px;`
                                },
                                onCreate: () => {
                                    gvc.addMtScript([{
                                        src: 'https://cdnjs.cloudflare.com/ajax/libs/pulltorefreshjs/0.1.22/index.umd.js'
                                    }], () => {
                                        let iCount = 0
                                        //下拉更新
                                        // @ts-ignore
                                        const ptr = PullToRefresh.init({
                                            mainElement: `.main`,
                                            triggerElement : `.trigger`,
                                            onRefresh() {
                                                iCount++;
                                                console.log(iCount);
                                                initGetData();
                                            }
                                        });

                                    }, () => {
                                    })
                                }
                            })
                        })()}
                </main> `
                    } else {
                        return `
                        ${nava}
                        <div class="w-100 translate-middle-y position-absolute " style="top: 50%;"> ${viewModel.loadingView()}</div>
                       `
                    }


                },
                divCreate: {class: ``, style: ``},
                onCreate: () => {
                    //
                    // PullToRefresh.init({
                    //     mainElement: '#main',
                    //     onRefresh: function() { alert('refresh') }
                    // });
                }
            })
        },
        onCreate: () => {

        }
    }

    function createIdea() {
        glitter.openDiaLog('component/idea/ideaAdd.js','ideaAdd',{},{animation:glitter.animation.topToBottom})
    }

    function initGetData() {
        vm.loading=true
        gvc.notifyDataChange('mainView')
        ideaAPI.getData((()=>{
            switch (gBundle.viewType) {
                case "user":
                    const dd=gBundle.data as UserData
                    return {
                        poster_id: dd.userID,
                        idea_id:gBundle.idea_id
                    }
                default:
                    return {
                        poster_id:gBundle.poster_id,
                        idea_id:gBundle.idea_id
                    }
            }
        })(),(response) => {
            vm.loading = false
            glitter.share.ideaPostData = response
            ideaPostData = response
            response.map((data)=>{
                data.posterPhoto = (data["photo"]) ? data["photo"] : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center`
                data.poster =  data['last_name'] + data['first_name']
                //判斷是否按讚
                ideaAPI.detectLike(data.idea_id, (response) => {
                    data.dislike = response
                    gvc.notifyDataChange(`toolBar${data.idea_id}`)
                })
                //取得文章留言
                ideaAPI.getMessage({
                    idea_id: data.idea_id,
                    count: true
                }, (response) => {
                    data['messageCount'] = response.messageCount;
                    // data['message'] = response.message
                    gvc.notifyDataChange(`message${data.idea_id}`)
                })
                //取得按讚數量
                ideaAPI.getLikeCount(data.idea_id, (response) => {
                    data.likeCount = response
                    gvc.notifyDataChange(`likeCount${data.idea_id}`)
                })
            })
            gvc.notifyDataChange('mainView')
        })
    }
    function changeSearch() {
        //todo  帶歷史資料
        glitter.changePage("jsPage/idea/idea_search.js", "idea_search", true, {})
        // glitter.setHome('jsPage/idea/idea_search.js','idea_search',{})
    }

    function getCharNumber() {
        glitter.runJsInterFace("getCharNumber", {}, function (response) {
            if(response.charNumber){
                charCount = `
                <div class="chatCount d-flex justify-content-center align-items-center" style="width: 16px;height: 16px;background: #FD6A58;position: absolute;right:-6px;top: -6px;z-index: 2;border-radius: 50%">
                     ${response.charNumber}
                </div>`
            }
            gvc.notifyDataChange('nav');
            // console.log(document.querySelector(''))
            // glitter.setHome('jsPage/idea/idea_post.js',"idea_post",response)
        }, {
            webFunction(data: {}): any {
                return {
                    charNumber: 3
                }

            }
        })
    }
})






