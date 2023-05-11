'use strict';
import {init} from '../glitterBundle/GVController.js';
import {ViewModel} from '../view/mainViewApi.js'
import {SharedView} from "../widget/sharedView.js"


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

        `)
    let viewModel = new ViewModel(gvc)
    let shareView = new SharedView(gvc)
    let vm = {
        empty:true,
        model:{
            banner:"img/serviceBanner.png",
            section:[
                {
                    title:"產品相關",
                    service:[
                        {
                            text:"免費線上規劃軟體",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"品質保證",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"國際認證",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"試睡保證",
                            onclick:()=>{

                            }
                        },
                    ]
                },
                {
                    title:"購物相關",
                    service:[
                        {
                            text:"HOMEE 分店",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"付款方式說明",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"隱私權保護及網站使用與購物政策   ",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"折讓單作業說明",
                            onclick:()=>{

                            }
                        },
                    ]
                },
                {
                    title:"服務相關",
                    service:[
                        {
                            text:"運送服務",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"組裝服務",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"舊家具搬運 / 舊床墊回收服務",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"空間規劃 / 丈量服務",
                            onclick:()=>{

                            }
                        },
                        {
                            text:"驗房服務",
                            onclick:()=>{

                            }
                        },
                    ]
                }

            ],
            lastSection:{
                contactUs:{
                    title:"聯絡我們",
                    servicePhoneTitle:"客服專線",
                    servicePhone:"8729-5939 （手機用戶請加02）",
                    serviceTimeTitle:"服務時間",
                    physicalStore : "分店：週一 ~ 週日 10:00-21:00",
                    onlineStore : "線上購物：週一 ~ 週日 09:00-18:00",
                    service1v1:{
                        title:"線上專人服務",
                        onclick:()=>{}
                    }
                },
                kanban:"img/kanban.png"

            }
        }
    }


    let model:any = undefined;


    gvc.addStyle(`
      
        main{
            width:100%;
            padding-left:19px;
            padding-right:19px;
        }
        .addr-add{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
      
            
            
            /* HOMEE red */
            
            color: #FD6A58;
        }
        .addr-edit{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #FD6A58;
            margin-right : 12px;
        }
        .addr-del{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #858585;
           
        }
    `)
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
           ${gvc.bindView({
               bind:"nav",
               view : ()=>{
                   return`
                   <nav class="bg-white w-100" style="position: fixed;z-index: 3;padding-top: ${topInset - 20}px;width: 100vw;">
                        <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 26px; background: #FFFFFF;position:relative;">
                            <div class="me-auto p-0 d-flex align-items-center" style="">
                                <img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                   glitter.goBack()
                               })}">
                            </div>
                            <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="position: absolute;top: 50%;   font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-size: 16px;
                    font-weight: 700;"></div>
                        </div>
                    </nav>
                   `
               }         
           })}            
        </div>
        <main style="padding: ${63 + topInset}px 17px 0;">                                                                 
            ${gvc.bindView({
                bind:"banner",
                view:()=>{
                    return `
                        <img class="w-100" src="${vm.model.banner}">
                    `
                },divCreate:{style:`` , class:``}    
            })}
            ${gvc.bindView({
                bind:"serviceListGroup",
                view:()=>{
                    gvc.addStyle(`
                        .serviceCard{
                            background: #FBF9F6;
                            border-radius: 24px;
                            padding: 16px 0px 7px;
                            margin-bottom:16px;
                        }
                        
                        .serviceTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 24px;
                            line-height: 35px;
                            color: #292929;
                            margin-bottom:24px;
                        }
                        .serviceText{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 15px;
                            line-height: 150%;
                            color: #858585;
                        }
                    `)
                    let returnHTML = ``;
                    vm.model.section.forEach((serviceList)=>{
                        returnHTML += `                           
                            ${gvc.bindView({
                                bind:"service",
                                view : ()=>{
                                    
                                    let serviceGroup = ``;
                                    serviceList.service.forEach((service)=>{
                                        serviceGroup += viewModel.ourServiceRow(service.text , "" , service.onclick);
                                    })
                                    return `
                                        <div class="d-flex align-items-center flex-column serviceCard">
                                            <div class="serviceTitle">${serviceList.title}</div>
                                            ${serviceGroup}
                                        </div>
                                    `
                                    
                                }
                            })}
                        `
                          
                    })
                    return returnHTML
                },divCreate:{style:`margin-top: 26px;` , class:``}
            })}
            ${gvc.bindView({
                bind:"lastSection",
                view : ()=>{          
                    gvc.addStyle(`
                        .lastSectionTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 24px;
                            line-height: 35px;
                            
                            color: #292929;
                            
                            margin-bottom : 24px;
                        }
                        .serviceTimeBlock * ,.servicePhoneBlock *{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 15px;
                            line-height: 150%;
                            color: #858585;
                        }
                        .serviceBTN{
                            height: 48px;
                            margin-top:24px;
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 18px;
                            line-height: 26px;
                            
                            text-align: center;
                            letter-spacing: 0.15em;

                            background: #FD6A58;
                            border-radius: 28px;
                            
                            
                            color: #FFFFFF;
                            
                            
                        }
                    `)
                    let thisModel = vm.model.lastSection
                    return`
                        
                        <div class="lastSectionTitle d-flex justify-content-center align-items-center">${thisModel.contactUs.title}</div>
                        <div class="servicePhoneBlock d-flex flex-column align-items-start justify-content-start" style="margin-bottom: 16px;">
                            <div>${thisModel.contactUs.servicePhoneTitle}</div>
                            <div>${thisModel.contactUs.servicePhone}</div>
                        </div>
                        <div class="serviceTimeBlock" >
                            <div>${thisModel.contactUs.serviceTimeTitle}</div>
                            <div>${thisModel.contactUs.physicalStore}</div>
                            <div>${thisModel.contactUs.onlineStore}</div>
                        </div>
                        <button class="w-100 serviceBTN border-0" onclick="${gvc.event(()=>{
                            thisModel.contactUs.service1v1.onclick();  
                        })}">${thisModel.contactUs.service1v1.title}</button>
                    `
                },divCreate:{class:`` , style:`background: #FBF9F6;border-radius: 24px;padding: 16px 32px 24px;`}
            })}
            
            
        </main>
        ${gvc.bindView({
                        bind : "kanban",
                        view : ()=>{

                            return `
                        <div class="" style="padding-top: 57%;width : 100%;background:50% / cover url(${vm.model.lastSection.kanban})"></div>
                    `
                        },
                        divCreate:{class:`` , style:`width : 100%;`}
                    })}        
`
                },
                divCreate: {class: ``, style: ``}
            })
        },
        onResume: function () {
        },
        onCreate: () => {

        }
    }
    function initModel(){
        model = [



        ]

    }
})

