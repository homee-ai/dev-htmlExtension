'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {ViewModel} from "./view/ideaViewApi.js";
import {Idea, IdeaData, UserData} from "./api/idea.js";
import {Dialog} from "../homee/legacy/widget/dialog.js";
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js";
// @ts-ignore
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'
function getDateDiff(a:any){return ``}
function detectIMG(a:any){return ``}
Plugin.create(import.meta.url,(glitter)=>{
    const api={
        upload:(photoFile:any,callback:(link:string)=>void)=>{
            // glitter.share.dialog.dataLoading({text:'上傳中',visible:true})
            $.ajax({
                url: Api.serverURL+'/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name:`${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible:false})
                            glitter.share.dialog.successMessage({text:"上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text:"上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.successMessage({text:"上傳失敗"})
                },
            });
        }
    }
    return {
        mainPage: {
            defaultData:{
                ideaPostData:undefined,

            },
            render:(gvc, widget, setting, hoverID) => {
                const vm = {loading: true}
                const viewModel = new ViewModel(gvc)
                const ideaAPI = new Idea(gvc.glitter);
                const dialog=new Dialog(gvc)
                let shareView = new SharedView(gvc)
                let ideaPostData:IdeaData[]
                let charCount = '';
                let noticeOpen = false;
                let viewType = '' //原先是gBundle.user
                let viewLoading = false;
                let userData :any;
                initGetData();
                // getCharNumber();
                function initGetData() {
                    vm.loading=true;
                    appConfig().getUserData({
                        callback: (response: any) => {
                            userData = response;
                            gvc.notifyDataChange('mainView')
                        }})
                    gvc.notifyDataChange('mainView')
                    //todo 判斷進入怎樣的idea主頁的方法沒動
                    ideaAPI.getData((()=>{
                        // switch (gBundle.viewType) {
                        //     case "user":
                        //         const dd=gBundle.data as UserData
                        //         return {
                        //             poster_id: dd.userID,
                        //             idea_id:gBundle.idea_id
                        //         }
                        //     default:
                        //         return {
                        //             poster_id:gBundle.poster_id,
                        //             idea_id:gBundle.idea_id
                        //         }
                        // }
                        //測試端的資料
                        //12052350
                        return {
                            poster_id:userData.user_id,
                            idea_id:""
                        }
                    })(),(response) => {
                        vm.loading = false
                        widget.data.ideaPostData = response
                        // ideaPostData = response
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
                                // gvc.notifyDataChange(`message${data.idea_id}`)
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
                function changeSearch() {
                    //todo  帶歷史資料
                    appConfig().changePage(gvc, "idea_search", {})
                    // glitter.setHome('jsPage/idea/idea_search.js','idea_search',{})
                }
                function createIdea() {
                    //todo openDialog?
                    glitter.openDiaLog(`${new URL!(`../component/idea/ideaAdd.js`, import.meta.url)}`,'ideaAdd',{},{animation:glitter.animation.topToBottom})
                }


                return {
                    view: ()=>{
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
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                var nava=(()=>{
                                    switch (viewType){
                                    case 'user':
                                        // var data=gBundle.data as UserData
                                        //${data.name}的貼文

                                        return shareView.navigationBar({
                                            title: `${userData.name}的貼文`,
                                            leftIcon:`<img class="" src="${new URL!(`../img/component/left-arrow.png`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(()=>{
                                                glitter.goBack()
                                            })}">`,
                                            rightIcon:``
                                        })
                                    default:
                                        return shareView.navigationBar({
                                            title: "靈感",
                                            leftIcon:`<div class="me-auto p-0 d-flex align-items-center " style="width: 116px;">
                                                <img class="me-auto my-auto" src="${new URL!(`../img/search-black.svg`, import.meta.url)}" style="width: 20px;height: 20px;" onclick="${gvc.event(() => {
                                                    changeSearch()
                                                })}">
                                            </div>`,
                                            rightIcon:`
                                                <div style="width: 23px;height: 23px; position: relative;margin: 0 16px 0 0;">
                                                    <img src="${new URL!(`../img/plus.svg`, import.meta.url)}" style="width: 23px;height: 23px;" onclick=" ${
                                                        gvc.event(() => {
                                                            createIdea()
                                                    })}">
                                                </div>       
                                                <div style="width: 23px;height: 23px; position: relative;margin: 0 16px 0 0;">
                                                    <div class="redDot d-none" style="width: 10px;height: 10px;background: #FD6A58;position: absolute;right:0;top: 0;z-index: 2;border-radius: 50%"></div>
                                                    <img src="${new URL!(`../img/sample/idea/notify.svg`, import.meta.url)}"   class="w-100 h-100" onclick="${gvc.event(() => {
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
                                                    <img src="${new URL!(`../img/sample/idea/chat.svg`, import.meta.url)}" style="width: 23px;height: 23px;" onclick="${gvc.event(()=>{
                                                        dialog.showInfo('共同搭配功能即將上線，敬請期待!')
                                                    })}">
                                                </div>`
                                        })
                                }})()
                                if (!vm.loading) {
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
                                                    
                                                    if (widget.data.ideaPostData) {
                                                        return viewModel.postView(widget.data.ideaPostData , userData);
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
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        board: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {

                return {
                    view: ()=>{
                        gvc.addStyle(`          
                        main{
                            padding-bottom:70px;
                        }
                        .intro{
                            padding:16px;
                            word-break: break-all;
                            white-space:normal;
                        }
                        .posterPhoto{
                            width:36px;
                            height:36px;
                
                        }
                        .introBlock{
                            margin-left:8px;
                        }
                        .intro-text{
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE black */
                
                            color: #292929;
                        }
                        .intro-text .poster{
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE black */
                
                            color: #292929;
                        }
                        .intro-date{
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE grey */
                
                            color: #858585;
                        }
                        .leaveRow{
                                width:100%;
                                /* Noto Sans TC - Regular - 14 */
                
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 150%;
                
                                padding:8px 24px;
                
                
                                background: #FFFFFF;
                                box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                                border-radius: 30px 30px 0px 0px;
                                position:fixed;
                                bottom:0px
                
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
                            right: 40px;
                            top: calc(50% - 8px)
                        }
                        .leaveEvent{
                            opacity: 1;
                        }
                        .date{
                            /* Noto Sans TC - Regular - 12 */
                
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                
                            /* HOMEE grey */
                
                            color: #858585;
                        }
                        .HOMEE-grey{
                            color: #858585;
                        }
                
                       `)

                        let data = gvc.parameter.pageConfig?.obj.data.postData as IdeaData;
                        let vm = {
                            id: glitter.getUUID(),
                            loading: true,
                            dataList: <any>[],
                        };
                        const dialog=new Dialog(gvc)
                        const ideaApi = new Idea(glitter)
                        const viewModel=new ViewModel(gvc)
                        let shareView = new SharedView(gvc)
                        let topInset: number = 0
                        let bottomInset:number = 0
                        let userData:any;
                        function getData() {
                            vm.loading=true
                            gvc.notifyDataChange('mainView')
                            ideaApi.getMessage({
                                count: false,
                                idea_id: data.idea_id
                            }, (response) => {

                                data.message = response.message
                                vm.loading = false
                                gvc.notifyDataChange('mainView')
                                document.body.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: 'smooth'
                                })
                            })
                        }
                        //輸入的時間必須是 YYYY/MM/DD的格式
                        function getDateDiff(dateTimeStamp: number): string {
                            let minute = 1000 * 60;
                            let hour = minute * 60;
                            let day = hour * 24;
                            let halfamonth = day * 15;
                            let month = day * 30;
                            let now = new Date().getTime();
                            let timestamp = new Date((new Date(dateTimeStamp)).getTime() + 8 * 60 * 60 * 1000).getTime()
                            let diffValue = now - timestamp;
                            if (diffValue < 0) {
                                return "";
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
                            } else
                                result = "剛剛";
                            return result;
                        }
                        //留言事件
                        function leaveEvent() {
                            let leaveBTN = document.querySelector('.leaveBTN');
                            let input = document.querySelector('.leaveInput') as HTMLInputElement;
                            if (input.value == "") {
                                if (leaveBTN?.classList.contains('leaveEvent')) {
                                    leaveBTN.classList.remove('leaveEvent')
                                }
                            } else {

                                if (!leaveBTN?.classList.contains('leaveEvent')) {

                                    leaveBTN?.classList.add('leaveEvent')
                                }
                            }
                        }
                        //轉換內容至圖片
                        function detectIMG(content: any , userData:any): string {
                            if (content["appendix"]) {
                                return `
                                <div class="" style="max-width: 320px; background: #292929;border-radius: 20px;background:50% / cover url(${content["appendix"]});width: 100%;
                                padding-bottom: 60%;margin-top: 10px;" onclick="${gvc.event(()=>{
                                    const dd={
                                        config: JSON.stringify(content.config),
                                        scene: content.scene,
                                        userName:data.poster
                                    }
                                    glitter.runJsInterFace("leaveModelToBoard", dd, function (response) {
                                        let jsonData = {
                                            idea_id: data["idea_id"],
                                            messager: userData.user_id,
                                            content: {
                                                appendix: `${response["preview_image"]}`,
                                                scene: response["scene"],
                                                config: JSON.parse(response["config"]),
                                            }
                                        }
                                        dialog.dataLoading(true)
                                        $.ajax({
                                            url: `${appConfig().serverURL}/api/v1/idea/board`,
                                            type: 'POST',
                                            data: JSON.stringify(jsonData),
                                            contentType: 'application/json; charset=utf-8',
                                            headers: {Authorization: userData.token},
                                            success: (resposnse: any) => {
                                                dialog.dataLoading(false)
                                                getData()
                                            },
                                            error: () => {
                                            },
                                        });

                                    }, {
                                        webFunction(data: {}): any {
                                            return {
                                                preview_image: "img/sample/idea/postimg.png",
                                                scene: "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz",
                                                config: JSON.parse(JSON.stringify({
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
                                                }))
                                            }
                                        }
                                    })
                                })}">
                                </div>
                            `

                            } else {
                                return content["text"] as string
                            }
                        }
                        getData();

                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (!userData){
                                    appConfig().getUserData({
                                        callback: (response: any) => {
                                            userData = response;
                                            gvc.notifyDataChange('mainView')
                                        }})
                                }

                                glitter.runJsInterFace("getTopInset", {}, (response) => {
                                    if (topInset!=response.data){
                                        topInset = (response.data);
                                        gvc.notifyDataChange('mainView');
                                    }

                                }, {
                                    webFunction: () => {
                                        return {data: 10}
                                    }
                                })
                                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                                    if (bottomInset != response.data){
                                        bottomInset = (response.data)
                                        gvc.notifyDataChange('mainView')
                                    }

                                }, {
                                    webFunction: () => {
                                        return {data: 10}
                                    }
                                })
                                if (topInset !== undefined  && bottomInset !== undefined) {

                                    return `

                                    ${shareView.navigationBar({
                                        title: "留言",
                                        leftIcon:`<img class="" src="${new URL!(`../img/component/left-arrow.png`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack("idea")
                                        })}">`,
                                        rightIcon:`
                                            <img src="${new URL!(`../img/component/send.svg`, import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                        `
                                    })}
                                    <main class="d-flex flex-column" style="">
                                        <div class="intro d-flex" style="border-bottom: 1px solid #D6D6D6;">
                                            <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;background: 50% / cover url('${data['posterPhoto']}') no-repeat;" onclick="${gvc.event(()=>{
                                               
                                                appConfig().changePage(gvc, "idea_profile", {poster_id : data['poster_id']} )
                                            })}"></div>
                                            <div class="introBlock">
                                                <div class="intro-text">
                                                    <span class="poster">${data['poster']}</span>
                                                    ${data?.['content']?.['intro']}
                                                </div>
                                                <div class="intro-date">${getDateDiff(data?.['datetime'])}</div>
                                            </div>
                                        </div>
                                        <div class="w-100" style="margin-bottom:${bottomInset + 100}px;">  
                                            ${(()=>{
                                                if(vm.loading){
                                                    return viewModel.loadingView()
                                                }else{
                                                    let messageArray = data["message"];
                                                    let returnHTML = ``
                    
                                                    messageArray.forEach((item: any) => {
                                                        item.photo = item.photo ?? `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center"`                                                             
                                                        returnHTML += `
                                                        <div class="intro d-flex" style="">
                                                            <div class="posterPhoto rounded-circle" style="width: 36px;height: 36px;background: 50% / cover url('${item.photo}') no-repeat;" onclick="${gvc.event(()=>{
                                                            
                                                                appConfig().changePage(gvc, "idea_profile", {poster_id : item.messager_id} )
                                                                
                                                            })}"></div>
                                                            <div class="introBlock" style="width: calc(100% - 50px);">
                                                                <div class="intro-text w-100 d-flex " style="word-break: break-all;white-space: normal;overflow-x: hidden;">
                                                                    <span class="poster" style="margin-right: 8px;white-space: nowrap;">${item['last_name'] + item['first_name']}</span>
                                                                    ${detectIMG(item['content'] , userData)} 
                                                                </div>
                                                                <div class="intro-date d-flex align-items-end">${getDateDiff(item['time'])}</div>
                                                            </div>
                                                        </div>
                                                    `
                                                        })
                                                    return returnHTML
                                                }
                                            })()}
                                        </div>
                                         <!--發布-->
                                        ${gvc.bindView(() => {
                                            let message: 
                                            {
                                                idea_id: string,
                                                messager: string,
                                                content: {
                                                    appendix: string,
                                                    text: string
                                                }
                                            } = 
                                            {
                                                idea_id: data.idea_id,
                                                messager: userData.user_id,
                                                content: {
                                                    appendix: '',
                                                    text: ''
                                                }
                                            }
                                            
                                            return {
                                                bind: `senderMessage`,
                                                view: () => {
                                                   
                                                    var sendView=glitter.getUUID()
                                                    return `
                                                    <div id="${sendView}" class="d-flex leaveRow" style="position: fixed;bottom: ${bottomInset + 48}px;">
                                                        <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;margin-right: 8px;background: 50% / cover url('${userData['photo']}') no-repeat;"></div>
                                                        <div class="flex-fill leaveInput d-flex align-items-center" >
                                                        <!--發佈欄-->
                                                            <div class="w-100 my-auto d-flex align-items-center HOMEE-grey" contenteditable="true" style="line-height: 34px;border: none;background: transparent;margin-right: 50px;word-break: break-word;white-space: normal" onblur="${gvc.event((e) => {
                                                                $(`#${sendView}`).css('bottom',`${bottomInset + 48}px`);
                                                                    message.content.text = e.innerHTML
                                                                    if (message.content.text === '') {
                                                                        $(e).parent().children('.leaveBTN').removeClass('leaveEvent')
                                                                        e.innerHTML = `以${userData.name}新增留言`;
                                                                        e.classList.add("HOMEE-grey")
                                                                    } else {
                                                                        $(e).parent().children('.leaveBTN').addClass('leaveEvent')
                                                                    }
                                                            })}" onfocus="${
                                                                gvc.event((e)=>{
                                                                $(`#${sendView}`).css('bottom',`${0}px`);
                                                                let text = e.innerHTML;
                                                                if (text == `<span>以${userData.name}新增留言</span>`){
                                                                    e.classList.remove("HOMEE-grey");
                                                                }
                                                                $(e).parent().children('.leaveBTN').addClass('leaveEvent')
                                                                setTimeout(()=>{
                                                                    e.innerHTML = ``;
                                                                },100)
                                                        })}" onclick="${gvc.event((e)=>{
                                                            e.innerHTML = ``;
                                                            e.classList.remove("HOMEE-grey");
                                                        })}" style="margin-right: 40px;"><span>以${userData.name}新增留言</span></div>
                                    <!--                       發佈按鍵-->
                                                            <div class="leaveBTN ${(message.content.text === '') ? "" : "leaveEvent"}" style="" onclick="${gvc.event((e, event) => {
                                                                if (message.content.text !== '') {
                                                                    ideaApi.leaveMessage(message, (response) => {
                                                                    })
                                                                     message.content.text = ''
                                                                    data.messageCount = (data.messageCount ?? 0) + 1
                                                                    gvc.notifyDataChange(`senderMessage`)
                                                                    getData()
                                                                }
                                                            })}">發佈</div>
                                                      </div>
                                                    </div>
                                                    `
                                                    },
                                                    divCreate: {}
                                                }
                                        })}
                        
                        
                                    </main>
                                `
                                } else {
                                    return `
                                    ${shareView.navigationBar({
                                        title: "留言",
                                        leftIcon:`<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack("idea")
                                        })}">`,
                                        rightIcon:`
                                            <img src="img/sample/idea/send.svg" alt="" style="width: 24px;height: 24px;">
                                        `
                                    })}
                                    ${viewModel.loadingView()}
                                `
                                }
                            },
                            divCreate: {class: ``, style: ``}
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        search: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {
                let topInset: number = 0
                let iCount = 0
                const vm = {
                    loading: false,
                    searchUserLoading : false,
                }
                return {
                    view: ()=>{
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
                       `)
                        let shareView = new SharedView(gvc)
                        const viewModel = new ViewModel(gvc)
                        const ideaAPI = new Idea(gvc.glitter);
                        let searchData:IdeaData[];
                        let ideaPostData:IdeaData[];
                        let searchAllow = false
                        let clock:any;
                        let searchWord = ""
                        let dataArray = ["Victor Chang", "簡約設計", "客廳"]
                        let keyword = ["北歐風"]
                        let searchUserHTML = ``;
                        let searchUserData:UserData[];
                        let searchLimit = 3;
                        let userData:any;
                        function searchDataTimer(element: HTMLInputElement){
                            let value = element.value as string;
                            clearTimeout(clock);
                            clock = setTimeout(()=>{
                                vm.loading=true
                                vm.searchUserLoading=true
                                searchWord = value;
                                searchUserHTML = "";
                                gvc.notifyDataChange("userSearch")
                                gvc.notifyDataChange(`postGroup`);
                            } , 1000);

                        }
                        return gvc.bindView(    {
                            bind: `mainView`,
                            view: () => {
                                if (!userData){
                                    appConfig().getUserData({
                                        callback: (response: any) => {
                                            userData = response;
                                            gvc.notifyDataChange('mainView')
                                        }})
                                }
                                if (topInset !== undefined) {
                                    return `
                                    ${shareView.navigationBar({
                                        title: ``,
                                        leftIcon:`<i class="fa-regular fa-arrow-left" style="font-size: 20px;" onclick="${gvc.event(()=>{
                                            glitter.goBack("idea")
                                        })}"></i>`,
                                        rightIcon:` <div class="search-bar d-flex ms-auto" style="width: calc(100vw - 80px);">
                                            <img class="search-icon" src="img/search-black.svg" alt="" >
                                            <input class="w-100 search-input" placeholder="大家都在搜尋:${keyword}" oninput="${gvc.event((e)=>{
                                                searchDataTimer(e)
                                            })}">
                                        </div>`
                                    })}
                
                                    <main style="padding-top: ${topInset}px;">
                                        ${gvc.bindView({
                                        bind:"userSearch",
                                        view : ()=>{
                                            if(vm.searchUserLoading&&(searchWord!=='')){
                                                searchLimit = 3;
                                                return viewModel.loadingView()
                                            }else if (searchUserData) {
                                                searchLimit = (searchLimit==-1)?searchUserData.length:searchLimit;

                                                for (let i = 0 ; i < searchLimit ; i++){
                                                    let userData = searchUserData[i];

                                                    userData.photo = userData?.photo || `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${userData.last_name}&txtfont=Helvetica&txtalign=middle,center`
                                                    searchUserHTML += `
                                                    <div class="d-flex align-items-center" onclick="${gvc.event(()=>{
                                                        appConfig().changePage(gvc, 'idea_profile', {poster_id: userData.userID})
                                                    })}">
                                                        <img src="${userData.photo}" style="width: 50px;height: 50px;margin-right: 8px;">
                                                        <div class="" style="font-size: 16px;color: #292929">
                                                            ${userData.first_name}  ${userData.last_name}
                                                        </div>
                                                    </div>`
                                                }
                                                return `
                                                <div class="d-flex flex-column align-items-baseline">
                                                    ${searchUserHTML}
                                                    <div class="w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                                                        searchLimit = -1;
                                                        searchUserHTML = "";
                                                        vm.searchUserLoading = true;
                                                        gvc.notifyDataChange("userSearch");
    
                                                    })}"                                    
                                                    >點擊顯示更多</div>
                                                </div>
                                            `
                                            } else {
                                                return ``
                                            }


                                        },divCreate:{style:`` , class:``}
                                        ,onCreate:()=>{
                                            if (!searchUserData && searchWord != ""){
                                                ideaAPI.searchUser(userData, searchWord,(response)=>{
                                                    searchUserData = response;
                                                    vm.searchUserLoading = false;
                                                    gvc.notifyDataChange("userSearch")
                                                })
                                            }

                                        }
                                    })}
                                    ${(() => {
                                        let id = 'postGroup'
                                        //方法

                                        //畫面
                                        return gvc.bindView({
                                            bind: id,
                                            view: () => {
                                                if(vm.loading&&(searchWord!=='')){
                                                    return viewModel.loadingView()
                                                }else if (searchData) {
                                                    return viewModel.postView(searchData , userData);
                                                } else {
                                                    return ``
                                                }
                                            },
                                            divCreate: {
                                                class: ``,
                                                style: `padding-bottom:60px;`
                                            },
                                            onCreate: () => {
                                                if (searchWord){
                                                    ideaAPI.searchData( userData, searchWord,(response) => {
                                                        vm.loading = false;
                                                        searchData = response
                                                        response.map((data)=>{
                                                            data.posterPhoto = (data["photo"]) ? data["photo"] : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center`
                                                            data.poster = data['first_name'] + data['last_name']
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
                                                        searchWord = ""
                                                        gvc.notifyDataChange('postGroup')
                                                    })
                                                }

                                            }
                                        })
                                    })()}
                </main>    `
                                } else {
                                    return ``
                                }
                            },
                            divCreate: {class: ``, style: ``}
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        profile: {
            defaultData:{
            },
            render:(gvc, widget, setting, hoverID) => {
                let vm = {
                    id: glitter.getUUID(),
                    loading: true,
                    dataList: <any>[],
                    model:{
                        followText:"追蹤",
                        followFUN:"POST",
                        //追隨他的人
                        Fans:["1"],
                        //他追隨的人
                        Following:["1"]
                    }
                };

                return {
                    view: ()=>{
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
        
       `)
                        let topInset: number = 0
                        const ideaApi = new Idea(glitter);
                        const viewModel=new ViewModel(gvc);
                        let shareView = new SharedView(gvc);
                        let ideaDataArray : IdeaData[];
                        let userInf:any; //這邊跟上面不一樣 Inf跟上面data一樣 這裡的data則是那個人的貼文相關資料
                        let userData:UserData;
                        let posterID = gvc.parameter.pageConfig?.obj.data.poster_id;
                        if (!userInf){
                            appConfig().getUserData({
                                callback: (response: any) => {
                                    userInf = response;
                                    initGetData();
                                    gvc.notifyDataChange('mainView')
                                }})
                        }

                        function initGetData(){
                            //拿個人資料
                            ideaApi.getUserInfo(userInf,posterID,(response)=>{
                                userData=response
                                vm.model.Fans=(response?.fans ?? "").split(",") || [];
                                vm.model.Following=(response?.following ?? "").split(",") || [];
                                //拿貼文資料
                                ideaApi.getPersonalData(userInf,posterID,((response)=>{
                                    vm.loading = false;
                                    //
                                    // console.log(vm.model.Fans.find(x => x ==userInf.user_id))
                                    vm.model.Fans.forEach((x)=>{

                                    })
                                    if (userInf.user_id != posterID && vm.model.Fans.find(x => x == userInf.user_id)){
                                        //    todo 追蹤判別
                                        vm.model.followFUN = "DELETE";
                                        vm.model.followText = "取消追蹤";
                                    }
                                    ideaDataArray = response;
                                    gvc.notifyDataChange('mainView')
                                }));
                            })
                        }

                        function follow(){
                            let jsonData = {
                                target_id: posterID,
                                follower_id:userInf.user_id
                            }
                            $.ajax({
                                url: `${appConfig().serverURL}/api/v1/idea/follow`,
                                type: vm.model.followFUN,
                                data: JSON.stringify(jsonData) ,
                                contentType: 'application/json; charset=utf-8',
                                headers: {Authorization: userInf.token},
                                success: (resposnse: any) => {
                                    //todo alert行為結果 追蹤成功or失敗
                                    console.log(resposnse)
                                    gvc.notifyDataChange('mainView')

                                },
                                error: (e) => {

                                },
                            });
                        }

                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data){
                                topInset = (response.data)
                                gvc.notifyDataChange('mainView')
                            }
                        }, {
                            webFunction: () => {
                                return {data: 50}
                            }
                        })
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (topInset !== undefined && !vm.loading) {
                                    return `
                                    ${shareView.navigationBar({
                                        title: userData.name,
                                        leftIcon:`<img class="" src="${new URL!(`../img/component/left-arrow.png`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack()
                                        })}">`,
                                        rightIcon:`
                                            <img src="${new URL!(`../img/sample/idea/send.svg`, import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                        `
                                    })}
                                    <main class="d-flex flex-column" style="padding-bottom: 100px;">                    
                                        ${(()=>{
                                            return gvc.bindView({
                                                bind:`inf`,
                                                view:()=>{
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
                                                    ${(()=>{
                                                        if(userInf.user_id === posterID){
                                                            return  ``
                                                        }else{
                                                            return `  <div class="w-100 d-flex" style="margin-top: 16px">
                                                                <div class="follow w-50 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                                                                    follow();
                                                                })}">${vm.model.followText}</div>
                                                                <div class="message w-50 d-flex align-items-center justify-content-center" >發訊息</div>
                                                            </div>`
                                                        }
                                                    })()}
                                                    `
                                                },
                                                divCreate:{class:`panel d-flex flex-column`, style:`` },
                                                onCreate: () => {}
                                            })
                                        })()}
                                        <div class="w-100" style="background-color: lightgrey;height: 1px;"></div>
                                        ${(()=>{
                                            let returnHtml = ``
    
                                            ideaDataArray.forEach((ideaAData)=>{
                                                returnHtml += `
                                                <div class="w-50 imgBlock" style="padding-bottom:33%; background:50% / cover url(${ideaAData.preview_image[0]})" onclick="${gvc.event(()=>{
                                                    glitter.changePage("jsPage/idea/idea.js", "idea", true, {
                                                        viewType:'user',
                                                        data:userData,
                                                        idea_id:ideaAData.idea_id
                                                    })
                                                })}"></div>
                                            `
                                            })
                                            return gvc.bindView({
                                                bind:`ImgCardGroup`,
                                                view:()=>{return returnHtml},
                                                divCreate:{class:`d-flex flex-wrap` , style:``},
                                                onCreate:()=>{}
                                            })
                                        })()}
                                    </main>
                                    `
                                } else {

                                return `
                                    ${shareView.navigationBar({
                                        title: "",
                                        leftIcon:`<img class="" src="${new URL!(`../img/component/left-arrow.png`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack()
                                        })}">`,
                                        rightIcon:`
                                        <img src="${new URL!(`../img/sample/idea/send.svg`, import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                        `
                                    })}
                                <div class="" style="padding-top: 100px;"> ${viewModel.loadingView()}</div>
                              
                                `
                                }
                            },
                            divCreate: {class: ``, style: ``}
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        selectPostImg: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {
                let interact: any = null
                gvc.addMtScript([{src: 'https://unpkg.com/interactjs/dist/interact.min.js'}], () => {
                    interact = ((window as any).interact)

                    gvc.notifyDataChange('mainView')
                }, () => {

                })



                return {
                    view: ()=>{
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
                    
                            html{
                                margin: 0;
                                box-sizing: border-box;
                            }
                    
                            body {
                                width: 100%;
                                height: 100%;
                    
                            }
                            
                            .nextStep{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 17px;
                                line-height: 63px;
                                /* identical to box height */
                                
                                text-align: center;
                                
                                /* HOMEE red */
                                
                                color: #FD6A58;
                            }
                    
                            main {
                                height : calc(100vh - 63px);
                                font-family: 'Noto Sans TC';
                    
                            }
                            .imgBlock{
                                overflow: scroll;
                                flex-direction: row;
                                justify-content: flex-start;
                            }
                            .imgBlock::-webkit-scrollbar{
                                display:none;
                            }
                            .selectImg{
                                position:relative;       
                            }
                            
                            .selectImgLong{
                                touch-action: none;            
                            }
                            .edit-btn{
                                width:40px;
                                height:40px;
                                background:white;
                                position:absolute;
                                right : 11px;
                                bottom : 11px;
                                z-index : 3;
                            }
                            
                            .deleteImg{
                                width : 48px;
                                height : 48px;
                                position : fixed;
                                left : calc(50% - 24px);
                                bottom : 114px;
                    
                            }
                            .drop-active{
                                transform: scale(1.25);
                            }
                            .selectedBorder{
                                border: 5px solid green;
                            }                    
                        `)
                        let viewModel = new ViewModel(gvc)
                        let dialog = new Dialog(gvc)
                        let shareView = new SharedView(gvc)
                        let imgArray: string[] = gvc.parameter.pageConfig?.obj?.preview_image ?? ["https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg" , "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg" , "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg"];
                        let deleteIMGArray: number[] = [];
                        let userData:any;
                        function appendBorder(element :HTMLElement){
                            deleteIMGArray=deleteIMGArray.filter((dd)=>{
                                return dd!==Number(element?.getAttribute("index"))
                            })
                            if (element.classList.contains("selectedBorder")){
                                element.classList.remove("selectedBorder")
                            }else{
                                element.classList.add("selectedBorder")
                                deleteIMGArray.push(Number(element?.getAttribute("index")))
                            }
                            if(deleteIMGArray.length>0){
                                $('.deleteImg').show()
                            }else{
                                $('.deleteImg').hide()
                            }
                        }
                        function deleteIMG(){
                            dialog.confirm(`確認刪除${deleteIMGArray.length}張圖片?`,(response)=>{
                                if (response){
                                    if (imgArray.length > 1) {
                                        deleteIMGArray.forEach((v)=>{
                                            imgArray.splice(v ,1);
                                        })
                                        gvc.notifyDataChange('slideImg');
                                    }else {
                                        alert("請至少留一張")
                                    }

                                }
                            })

                        }
                        function editImg(index:number , event:any){
                            event.stopImmediatePropagation();
                        }
                        if (!userData){
                            appConfig().getUserData({
                                callback: (response: any) => {
                                    userData = response;
                                    gvc.notifyDataChange('mainView')
                                }})
                        }
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (interact == null) {
                                    return ``
                                }
                                return `
                                ${shareView.navigationBar({
                                    title: "新貼文",
                                    leftIcon: `  <img class="" src="${new URL!(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                                        viewModel.checkDismiss()
                                    })}">`,
                                    rightIcon: `<div class="nextStep"  onclick="${gvc.event(() => {
                                        //todo bring what data?
                                        // let jsonData = {
                                        //     poster:userData.user_id,
                                        //     scene:passData?.scene,
                                        //     config:passData.config,
                                        //     preview_image:imgArray
                                        // }
                                        appConfig().changePage(gvc, "idea_post", {})
                                    })}">
                                    下一步
                                </div>`
                                })}
                                <main class="d-flex align-items-center w-100" style="">                    
                                ${(() => {
                                    return gvc.bindView({
                                        bind: `slideImg`,
                                        view: () => {
                                            let returnHtml = ``;
                                            imgArray.forEach((img, index) => {
                                                returnHtml += `
                                                <div class="selectImg flex-shrink-0" index=${index} onclick="${gvc.event((e)=>{appendBorder(e);})}" style="width: 92%; height: 220px;margin-right: 3%;background: 50% / cover url(${img})">
                                                    <div class="edit-btn rounded" style="background: 50% / cover url('${new URL!(`../img/sample/idea/pen.svg`, import.meta.url)}')" index=${index} onclick="${gvc.event((html,event)=>{editImg(index,event);})}"></div>
                                                </div>
                                            `
                                            })
                                            return returnHtml
                                        },
                                        divCreate: {class: `d-flex imgBlock w-100 h-100 align-items-center`, style: ``},
                                        onCreate: () => {


                                        }
                                    })
                                })()}
                                ${(()=>{
                                    return  `<img class="deleteImg" alt="trash" src="${new URL!(`../img/sample/idea/delete.svg`, import.meta.url)}" style="display: none;" onclick="${gvc.event(()=>{deleteIMG();})}"></img>`

                                })()}
                   
                                </main>
                            `
                            },
                            divCreate: {class: ``, style: ``},
                            onCreate: () => {
                                let deleteable = true
                                // if (interact) {
                                //     interact('.deleteImg').dropzone({
                                //         // only accept elements matching this CSS selector
                                //         accept: '.selectImg',
                                //         // Require a 75% element overlap for a drop to be possible
                                //         overlap: 0.01,
                                //
                                //         // listen for drop related events:
                                //
                                //         ondropactivate: function (event: any) {
                                //             // 抓著的時候
                                //             event.relatedTarget.classList.add('drop-active')
                                //         },
                                //         ondragenter: function (event: any) {
                                //             //確定放進去還沒放手
                                //
                                //         },
                                //         ondragleave: function (event: any) {
                                //             //在外面
                                //             //     console.log("test")
                                //             //     event.target.classList.remove('drop-active')
                                //             //     gvc.notifyDataChange('slideImg')
                                //             event.stopImmediatePropagation();
                                //         },
                                //         ondrop: function (event: any) {
                                //             // 放進去之後
                                //             event.stopImmediatePropagation();
                                //             dialog.confirm("確認刪除?",
                                //                 (result) => {
                                //                     if (result) {
                                //                         if (imgArray.length > 1) {
                                //                             imgArray.splice(event.relatedTarget, 1)
                                //                             gBundle.preview_image = imgArray
                                //                             event.stopImmediatePropagation();
                                //                         } else {
                                //                             alert("最少得留一個")
                                //                         }
                                //                     }
                                //                     gvc.notifyDataChange('slideImg')
                                //                 })
                                //
                                //         },
                                //         ondropdeactivate: function (event: any) {
                                //             // 拿出來
                                //             event.target.classList.remove('drop-active')
                                //         }
                                //     })
                                //
                                //
                                // interact('.selectImg')
                                //     .draggable({
                                //         inertia: true,
                                //         modifiers: [
                                //             interact.modifiers.restrictRect({
                                //                 restriction: 'parent',
                                //                 endOnly: true
                                //             })
                                //         ],
                                //         autoScroll: true,
                                //
                                //         listeners: {move: dragMoveListener}
                                //     })
                                // }

                                // enable draggables to be dropped into this
                                // function dragMoveListener(event: any) {
                                //     let target = event.target
                                //     // keep the dragged position in the data-x/data-y attributes
                                //     // let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                                //     let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                                //     let x = 1;
                                //
                                //     // translate the element
                                //     target.style.webkitTransform =
                                //         target.style.transform =
                                //             'translate(' + x + 'px, ' + y + 'px)'
                                //
                                //     // update the posiion attributes
                                //     target.setAttribute('data-x', x)
                                //     target.setAttribute('data-y', y)
                                // }

                            }
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        post: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {

                gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
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
                    html{
                        margin: 0;
                        box-sizing: border-box;
                    }
                  
                    .confirm{
                        height: 24px;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 17px;
                        line-height: 24px;
                        /* HOMEE red */
                        color: #FD6A58;
                    }
                    main{
                        height:100vh;
                        padding:16px
                    }
                    .chooseImg{
                        border
                    }
                    .swiper-slide{
                        width: 100%;
                        background-repeat: no-repeat;
                    }
                    .userPhoto{
                        width: 48px;
                        height: 48px;
                        margin-right: 16px;
                        border: 0.6px solid #DDDDDD;      
                    }
                    .input{
                        height:48px;
                        min-width : 200px;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 48px;
                        /* HOMEE black */
                        color: #292929;
                
                    }
                    .grey{
                        /* HOMEE dark grey */
                
                        color: #858585;
                    }
                    .input:focus{
                        outline: none;
                        
                    }    
                `)
                const viewModel=new ViewModel(gvc)
                const ideaAPI=new Idea(glitter)
                const shareView=new SharedView(gvc)
                const dialog=new Dialog(gvc)
                //todo 是否不需要預設
                let passData = gvc.parameter.pageConfig?.obj
                let imgArray: string[] = passData?.preview_image ?? ["https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg" , "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg" , "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg"];
                let userData:any;
                let topInset: number = 0;
                appConfig().getUserData({
                    callback: (response: any) => {
                        userData = response;
                        gvc.notifyDataChange('mainView')
                    }})
                function upload(){
                    let content = document.querySelector('.input')
                    if (content?.innerHTML == "撰寫貼文內容......"){}else{
                        let jsonData = {
                            poster:userData.user_id,
                            content:{
                                intro:content?.innerHTML,
                            },
                            scene:passData?.scene,
                            config:passData.config,
                            preview_image:imgArray
                        }
                        dialog.dataLoading(true)
                        ideaAPI.uploadArticle(jsonData,(response)=>{
                            dialog.dataLoading(false)
                            if(passData.firstPageIsIdea){
                                glitter.goMenu()
                            }else{
                                viewModel.checkDismiss()
                            }
                        })
                    }
                }
                function changeInput(){
                    let inputElement = document.querySelector('.input');

                    if (inputElement?.classList.contains("grey")){
                        inputElement?.classList.remove("grey");
                        inputElement.innerHTML = ``;

                        inputElement.dispatchEvent(new Event('click'));
                    }
                }
                function fillInput(){
                    let inputElement = document.querySelector('.input');
                    if (inputElement?.innerHTML == ""){
                        inputElement.classList.add("grey");
                        inputElement.innerHTML = `撰寫貼文內容......`;
                    }
                }
                return {
                    view: ()=>{
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data){
                                topInset = response.data
                                gvc.notifyDataChange('mainView')
                            }
                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })

                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (topInset !== undefined) {
                                    return `
                                    ${shareView.navigationBar({
                                        title: "新貼文",
                                        leftIcon: `  <img class="" src="${new URL!(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 27px" alt="" onclick="${gvc.event(() => {
                                            viewModel.checkDismiss()
                                        })}">`,
                                        rightIcon: `<div class="nextStep confirm"  onclick="${gvc.event(() => {
                                            upload()
                                            })}">
                                            確定
                                        </div>`
                                    })}
                                    <div class="w-100" style="padding-top: ${topInset}px;">
                                        <banner class="w-100" >
                                            ${(() => {
                                                let slidePage = ``
                                                imgArray.forEach((img: any) => {
                                                    slidePage += `
                                                    <div class="swiper-slide" style="height:276px;background:50% / cover url(${img})"></div>
                                                    `
                                                })
        
                                                return gvc.bindView({
                                                    bind: `slide`,
                                                    view: () => {
                                                        return `
                                                        <div class="swiper-wrapper">
                                                            ${slidePage}
                                                        </div>
                                                        <div class="swiper-pagination"></div>
                                                        `
                                                    },
                                                    divCreate: {class: `w-100 swiper`, style: `height:276px`},
                                                    onCreate: () => {
                                                        const swiper = new Swiper(`.swiper`, {
                                                            // Optional parameters
                                                            direction: 'horizontal',
                                                            loop: true,
        
                                                            pagination: {
                                                                el: `.swiper-pagination`,
                                                            },
                                                        });
                                                    }
                                                })
                                            })()}
                                        </banner>
                                    </div>
               
                                    <main class="" >                    
                                        <div class="w-100 h-100" style="min-height: 24px;white-space: normal;word-break: break-all;overflow-x: hidden;display: inline-block;">
                                            <img class="userPhoto rounded-circle" src="${userData.photo}">
                                            <span class="input grey " contenteditable="true" style="" onblur="${gvc.event(() => {
                                                fillInput()
                                            })}" onclick="${gvc.event(() => {
                                                changeInput()
                                            })}">撰寫貼文內容......</span>                        
                                        </div>
                                    </main>
                                    `
                                } else {
                                    return ``
                                }
                            },
                            divCreate: {class: ``, style: `width:100%;`},
                            onCreate : ()=>{

                            }
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        empty: {
            defaultData:{
                link:[]
            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{return ``},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },

    }
});