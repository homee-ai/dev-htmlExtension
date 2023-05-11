'use strict';
import {init} from '../../glitterBundle/GVController.js';
import {ViewModel} from "../../view/ideaViewApi.js";
import {Idea, IdeaData} from "../../api/idea.js"
import {Dialog} from "../../widget/dialog.js"
import {SharedView} from "../../widget/sharedView.js"
import {appConfig} from "../../../../config";

init((gvc, glitter, gBundle) => {



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

    let data = gBundle.data as IdeaData
    let vm = {
        id: glitter.getUUID(),
        loading: true,
        dataList: <any>[],
    };
    const dialog=new Dialog(gvc)
    const ideaApi = new Idea(glitter)
    const viewModel=new ViewModel(gvc)
    let shareView = new SharedView(gvc)
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

    getData()
    return {
        onCreateView: () => {
            let topInset: number = 0
            let bottomInset:number = 0
            let iCount = 0
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data)
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 50}
                }
            })
            glitter.runJsInterFace("getBottomInset", {}, (response) => {
                bottomInset = (response.data)
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 50}
                }
            })
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined  && bottomInset !== undefined) {
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
                <main class="d-flex flex-column" style="">
                    <div class="intro d-flex" style="border-bottom: 1px solid #D6D6D6;">
                        <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;background: 50% / cover url('${data['posterPhoto']}') no-repeat;" onclick="${gvc.event(()=>{
                            glitter.changePage("jsPage/idea/idea_profile.js", "idea_profile", true, {
                                poster_id : data['poster_id']
                            })
                        })}"></div>
                        <div class="introBlock">
                            <div class="intro-text">
                                <span class="poster">${data['poster']}</span>
                                ${data['content']['intro']}
                            </div>
                            <div class="intro-date">${getDateDiff(data['datetime'])}</div>
                        </div>
                    </div>
                    <div class="w-100" style="margin-bottom:${bottomInset + 100}px;">  ${(()=>{
                            if(vm.loading){
                                return viewModel.loadingView()
                            }else{
                                let messageArray = data["message"];
                                let returnHTML = ``

                                messageArray.forEach((item: any) => {
                                    item.photo = item.photo ?? `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${data['last_name']}&txtfont=Helvetica&txtalign=middle,center"`
                                    returnHTML += `
                                <div class="intro d-flex" style="">
  <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;background: 50% / cover url('${data['posterPhoto']}') no-repeat;" onclick="${gvc.event(()=>{
                                        glitter.changePage("jsPage/idea/idea_profile.js", "idea_profile", true, {
                                            poster_id:item.messager_id
                                        })
                                    })}"></div>
                                    <div class="introBlock" style="width: calc(100% - 50px);">
                                        <div class="intro-text w-100" style="word-break: break-all;white-space: normal;overflow-x: hidden;">
                                            <span class="poster">${data['last_name'] + data['first_name']}</span>
                                            ${detectIMG(item['content'])}
                                        </div>
                                        <div class="intro-date ">${getDateDiff(item['time'])}</div>
                                    </div>
                                </div>
                            `
                                })
                                return returnHTML
                            }
                        })()}</div>
                 <!--發布-->
                 ${gvc.bindView(() => {
                                var message: {
                                    idea_id: string,
                                    messager: string,
                                    content: {
                                        appendix: string,
                                        text: string
                                    }
                                } = {
                                    idea_id: data.idea_id,
                                    messager: glitter.share.userData.user_id,
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
                             <div class="posterPhoto rounded-circle" style="width: 48px;height: 48px;margin-right: 8px;background: 50% / cover url('${glitter.share.userData['photo']}') no-repeat;"></div>
                    <div class="flex-fill leaveInput d-flex align-items-center" >
<!--                    發佈欄-->
                       <div class="w-100 my-auto d-flex align-items-center HOMEE-grey" contenteditable="true" style="line-height: 34px;border: none;background: transparent;margin-right: 50px;word-break: break-word;white-space: normal" onblur="${gvc.event((e) => {
                                            $(`#${sendView}`).css('bottom',`${bottomInset + 48}px`);
                                            
                                            message.content.text = e.innerHTML
                                            if (message.content.text === '') {
                                                $(e).parent().children('.leaveBTN').removeClass('leaveEvent')
                                                e.innerHTML = `以${glitter.share.userData.name}新增留言`;
                                                e.classList.add("HOMEE-grey")
                                            } else {
                                                $(e).parent().children('.leaveBTN').addClass('leaveEvent')
                                            }
                                        })}" onfocus="${
                                            gvc.event((e)=>{
                                            $(`#${sendView}`).css('bottom',`${0}px`);
                                            let text = e.innerHTML;
                                            if (text == `<span>以${glitter.share.userData.name}新增留言</span>`){
                                               
                                                e.classList.remove("HOMEE-grey");
                                            }
                                            $(e).parent().children('.leaveBTN').addClass('leaveEvent')
                                           setTimeout(()=>{
                                               e.innerHTML = ``;
                                           },100)
                                        })}" onclick="${gvc.event((e)=>{
                                            e.innerHTML = ``;
                                            e.classList.remove("HOMEE-grey");
                                        })}" style="margin-right: 40px;"><span>以${glitter.share.userData.name}新增留言</span></div>
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
        }
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
    function detectIMG(content: any): string {
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
                        messager: glitter.share.userData.user_id,
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
                                    getData()
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

})
