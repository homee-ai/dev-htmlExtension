'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js";
import {Dialog} from "../dialog/dialog-mobile.js"
import {Myspace} from "../api/myspace.js";


Plugin.create(import.meta.url,(glitter)=>{
    const api={
        upload:(photoFile:any,callback:(link:string)=>void)=>{
            glitter.share.dialog.dataLoading({text:'上傳中',visible:true})
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
        start: {
            defaultData:{
                model:{
                    remind:"此功能需使用支援 LiDAR 光學感測功能之手機",
                    BTN:"邀請好友協助掃描"
                }
            },
            render:(gvc, widget, setting, hoverID) => {
                return {
                    view: ()=>{
                        gvc.addStyle(`
                            body{
                                background-color: transparent!important;
                            }
                            .laravel{
                                background: #FFFFFF;
                                box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.1);
                                border-radius: 20px;          
                                padding:32px 24px 16px;         
                            }
                            .remind{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 18px;
                                color: #292929;
                                margin-bottom:32px;
                                word-break: break-all;
                                white-space: normal;
                                text-align: center;
                            }
                            .startBTN{
                                height: 40px;
                                background: #FD6A58;
                                border-radius: 20px;
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 700;
                                font-size: 18px;
                                color: #FFFFFF;
                            }
                        
                        `)
                        return `
                            ${gvc.bindView({
                            bind:"laravel",
                            view : ()=>{
                                return `
                                    <div class="laravel" >
                                        <div class="remind d-flex flex-wrap justify-content-center align-items-center">
                                            ${widget.data.model.remind}
                                        </div>
                                        <button class="w-100 border-0 startBTN" onclick="${gvc.event(()=>{
                                            appConfig().changePage(gvc ,"guide1" )
                                            
                                        })}">${widget.data.model.BTN}</button>
                                    </div>
                                `
                            },
                            divCreate:{style:`padding : 0 55px;height:100vh ` , class:`w-100  d-flex justify-content-center align-items-center`}

                        })}
                        `
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        guide1: {
            defaultData:{
                model:{
                    title:"填充陰影完成空間掃描",
                    slogan:"探索空間搭配創意世界！",
                    BTN:"下一步",
                    nextPage:"guide2",
                    background:`${new URL!(`video/homee 操作教學(步驟一).mp4`, import.meta.url)}`
                }
            },
            render:(gvc, widget, setting, hoverID) => {
                let bottomInset = 0
                return {
                    view: ()=>{
                        let backBTN = false;
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
                                
                                
                            }
                            
                        
                        `)
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data){
                                bottomInset = (response.data)
                                gvc.notifyDataChange('laravel')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        const guideNav=glitter.getUUID()
                        return `      
                        ${gvc.bindView({
                            bind:guideNav,
                            view:()=>{
                                return `
                                    <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + glitter.share.topInset}px;">
                                        <div class="w-100" style="">
                                            <img class="" src="${new URL!(`../img/sample/idea/left-arrow-white.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + glitter.share.topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                    glitter.getPro("viewGuide",(response:any)=>{
                                        if((response.data)!=='true' && glitter.share.blockBack){
                                            glitter.openDiaLog(`${new URL!(`../component/guide/confirm.js`, import.meta.url)}`, 'leaveGuide', {
                                                callback: () => {

                                                }
                                            }, {
                                                backGroundColor:"rgba(41, 41, 41, 0.3)",
                                                animation: glitter.animation.fade
                                            })
                                        }else{
                                            appConfig().setHome(gvc, "myspace", {});
                                        }
                                    })
                                            })}">
                                        </div>
                                        <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%">
                                            <source src="${new URL!(`video/homee 操作教學(步驟一).mp4`, import.meta.url)}" type="video/mp4">
                                        </video>
                                        
                                    </div>
                                `
                            },
                            divCreate : {}
                        })}                          
                        
                        ${gvc.bindView({
                            bind:glitter.getUUID(),
                            view : ()=>{
                                return `
                                    <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${glitter.share?.bottomInset||10}px;">
                                        <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                            ${widget.data.model.title}
                                        </div>
                                        <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                            ${widget.data.model.slogan}
                                        </div>
                                        <button class="border-0 nextBTN" style="margin-top:38px;" onclick="${gvc.event(()=>{
                                            appConfig().changePage(gvc ,widget.data.model.nextPage)
                                           
                                        })}">${widget.data.model.BTN}</button>
                                    </div>
                                `
                            },
                            divCreate:{style:``}

                        })}
            `
                    },
                    editor: ()=>{
                        return gvc.map([ `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">背景影片</h3>
                            <div class="mt-2"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.model.background}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                    glitter.ut.chooseMediaCallback({
                                        single:true,
                                        accept:'image/*',
                                        callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                            glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                                widget.data.model.background=link;
                                                widget.refreshAll!()
                                            })
                                        }
                                    })
                                })}"></i>
                            </div>
                        `,
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "最上方文字",
                            default: widget.data.model.title ?? "",
                            placeHolder: `請輸入最上方文字內容`,
                            callback: (text: string) => {
                                widget.data.model.title = text
                                widget.refreshAll()
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "灰色文字",
                            default: widget.data.model.slogan ?? "",
                            placeHolder: `請輸入最上方文字內容`,
                            callback: (text: string) => {
                                widget.data.model.slogan = text
                                widget.refreshAll()
                            }
                        }),
                        glitter.htmlGenerate.editeInput({
                            gvc: gvc,
                            title: "按鍵文字",
                            default: widget.data.model.BTN ?? "",
                            placeHolder: `請輸入最上方文字內容`,
                            callback: (text: string) => {
                                widget.data.model.BTN = text
                                widget.refreshAll()
                            }
                        })
                        ])
                    }
                }
            },
        },
        guide2: {
            defaultData:{
                model:{
                    title:"平穩移動掃描",
                    slogan:"探索空間搭配創意世界！",
                    BTN:"下一步",
                    prevPage:"guide2",
                    nextPage:"guide3",
                    background:`${new URL!(`video/homee 操作教學(步驟二).mp4`, import.meta.url)}`
                }
            },
            render:(gvc, widget, setting, hoverID) => {
                let topInset = 0
                let bottomInset = 0
                return {
                    view: ()=>{
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
                                
                                
                            }
                            
                        
                        `)
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data){
                                topInset = (response.data)
                                gvc.notifyDataChange('mainView')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data){
                                bottomInset = (response.data)
                                gvc.notifyDataChange('laravel')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + glitter.share.topInset}px;">
                            <div class="w-100" style="">
                                <img class="" src="${new URL!(`../img/sample/idea/left-arrow-white.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + glitter.share.topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.getPro("viewGuide",(response:any)=>{
                                if((response.data)!=='true' && glitter.share.blockBack){
                                    glitter.openDiaLog(`${new URL!(`../component/guide/confirm.js`, import.meta.url)}`, 'leaveGuide', {
                                        callback: () => {

                                        }
                                    }, {
                                        backGroundColor:"rgba(41, 41, 41, 0.3)",
                                        animation: glitter.animation.fade
                                    })
                                }else{
                                    appConfig().setHome(gvc, "myspace", {});
                                }
                            })

                            })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%" muted>
                                <source src="${new URL!(`video/homee 操作教學(步驟二).mp4`, import.meta.url)}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind:glitter.getUUID(),
                            view : ()=>{

                                return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${glitter.share?.bottomInset||10}px;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.slogan}
                                </div>
                                <div class="d-flex align-items-center" style="margin-top:38px;">
                                         <img class="" src="${new URL!(`../img/guide-back.svg`, import.meta.url)}" style="width: 40px;height: 40px; margin-right: 10px;" alt="" onclick="${gvc.event(() => {
                                    glitter.goBack()
                                })}">        
                                    <button class="border-0 nextBTN" style="position: relative" onclick="${gvc.event(()=>{
                                        appConfig().changePage(gvc ,widget.data.model.nextPage)
                                    })}">${widget.data.model.BTN}
                                    </button>
                                </div>
                                
                            </div>
                        `
                            },
                            divCreate:{style:`animation-delay: 0s;`}

                        })}
                    `
                    },
                    editor: ()=>{
                        return gvc.map([ `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">背景影片</h3>
                            <div class="mt-2"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.model.background}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                            glitter.ut.chooseMediaCallback({
                                single:true,
                                accept:'image/*',
                                callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                    glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                        widget.data.model.background=link;
                                        widget.refreshAll!()
                                    })
                                }
                            })
                        })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "最上方文字",
                                default: widget.data.model.title ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.title = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "灰色文字",
                                default: widget.data.model.slogan ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.slogan = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "按鍵文字",
                                default: widget.data.model.BTN ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.BTN = text
                                    widget.refreshAll()
                                }
                            })
                        ])
                    }
                }
            },
        },
        guide3: {
            defaultData:{
                model:{
                    title:"前後移動掃描",
                    slogan:"捕捉更多空間細節！",
                    BTN:"下一步",
                    prevPage:"guide2",
                    nextPage:"guide4",
                    background:`${new URL!(`video/homee 操作教學(步驟三).mp4`, import.meta.url)}`
                }
            },
            render:(gvc, widget, setting, hoverID) => {
                let topInset = 0
                let bottomInset = 0
                return {
                    view: ()=>{
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
                                
                                
                            }
                            
                        
                        `)
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data){
                                topInset = (response.data)
                                gvc.notifyDataChange('mainView')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data){
                                bottomInset = (response.data)
                                gvc.notifyDataChange('laravel')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-top: ${10 + glitter.share.topInset}px;">
                            <div class="w-100" style="">
                                <img class="" src="${new URL!(`../img/sample/idea/left-arrow-white.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + glitter.share.topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.getPro("viewGuide",(response:any)=>{
                                if((response.data)!=='true' && glitter.share.blockBack){
                                    glitter.openDiaLog(`${new URL!(`../component/guide/confirm.js`, import.meta.url)}`, 'leaveGuide', {
                                        callback: () => {

                                        }
                                    }, {
                                        backGroundColor:"rgba(41, 41, 41, 0.3)",
                                        animation: glitter.animation.fade
                                    })
                                }else{
                                    appConfig().setHome(gvc, "myspace", {});
                                }
                            })
        
                                })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%" muted>
                                <source src="${new URL!(`video/homee 操作教學(步驟三).mp4`, import.meta.url)}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind:glitter.getUUID(),
                            view : ()=>{

                                return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${glitter.share?.bottomInset||10}px;font-family: 'Noto Sans TC';font-style: normal;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center" style="font-weight: 700;font-size: 32px;line-height: 46px;color: #1E1E1E;">
                                    ${widget.data.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center" style="font-weight: 400;font-size: 14px;line-height: 150%;color: #858585;">
                                    ${widget.data.model.slogan}
                                </div>
                                <div class="d-flex align-items-center" style="margin-top:38px;">   
                                 <img class="" src="${new URL!(`../img/guide-back.svg`, import.meta.url)}" style="width: 40px;height: 40px; margin-right: 10px;" alt="" onclick="${gvc.event(() => {
                                    glitter.goBack()
                                })}">                             
                                    <button class="border-0 nextBTN" style="position: relative" onclick="${gvc.event(()=>{
                                        appConfig().changePage(gvc ,widget.data.model.nextPage)
                                    })}">${widget.data.model.BTN}
                                    </button>
                                </div>
                                
                            </div>
                        `
                            },
                            divCreate:{style:`animation-delay: 0s;`}

                        })}
                    `
                    },
                    editor: ()=>{
                        return gvc.map([ `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">背景影片</h3>
                            <div class="mt-2"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.model.background}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                            glitter.ut.chooseMediaCallback({
                                single:true,
                                accept:'image/*',
                                callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                    glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                        widget.data.model.background=link;
                                        widget.refreshAll!()
                                    })
                                }
                            })
                        })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "最上方文字",
                                default: widget.data.model.title ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.title = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "灰色文字",
                                default: widget.data.model.slogan ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.slogan = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "按鍵文字",
                                default: widget.data.model.BTN ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.BTN = text
                                    widget.refreshAll()
                                }
                            })
                        ])
                    }
                }
            },
        },
        guide4: {
            defaultData:{
                model:{
                    title:"移動掃描被遮蔽空間",
                    slogan:"記錄所有空間樣貌！",
                    BTN:"開始掃描",
                    prevPage:"guide3",
                    nextPage:"",
                    background:`https://homee-ai.github.io/glitter-htmlExtension/src/guide/video/homee%20%E6%93%8D%E4%BD%9C%E6%95%99%E5%AD%B8(%E6%AD%A5%E9%A9%9F%E5%9B%9B).mp4`
                }
            },
            render:(gvc, widget, setting, hoverID) => {
                let topInset = 0
                let bottomInset = 0
                return {
                    view: ()=>{
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
                                
                                
                            }
                            
                        
                        `)
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (topInset != response.data){
                                topInset = (response.data)
                                gvc.notifyDataChange('mainView')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        glitter.runJsInterFace("getBottomInset", {}, (response) => {
                            if (bottomInset != response.data){
                                bottomInset = (response.data)
                                gvc.notifyDataChange('laravel')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        return `                                
                        <div class="w-100 background-guide" style="height: 100vh;padding-bottom: ${glitter.share?.bottomInset||10}px;padding-top: ${10 + glitter.share.topInset}px;">
                        
                            <div class="w-100" style="">
                            
                                <img class="" src="${new URL!(`../img/sample/idea/left-arrow-white.svg`, import.meta.url)}" style="position:absolute; left:19px;top:${10 + glitter.share.topInset};z-index:3;width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            glitter.getPro("viewGuide",(response:any)=>{
                                if((response.data)!=='true' && glitter.share.blockBack){
                                    glitter.openDiaLog(`${new URL!(`../component/guide/confirm.js`, import.meta.url)}`, 'leaveGuide', {
                                        callback: () => {

                                        }
                                    }, {
                                        backGroundColor:"rgba(41, 41, 41, 0.3)",
                                        animation: glitter.animation.fade
                                    })
                                }else{
                                    appConfig().setHome(gvc, "myspace", {});
                                }
                            })
        
                                })}">
                            </div>
                            <video autoplay loop muted playsinline defaultmuted preload="auto" style="height: 100%;width: 100%;position:absolute;left: 0;top: -10%" muted>
                                <source src="${new URL!(`video/homee 操作教學(步驟四).mp4`, import.meta.url)}" type="video/mp4">
                            </video>
                            
                        </div>
                        ${gvc.bindView({
                            bind:glitter.getUUID(),
                            view : ()=>{

                                return `
                            <div class="laravel w-100 d-flex flex-column align-items-center" style="padding-bottom: ${glitter.share?.bottomInset||10}px;">
                                <div class="titleText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.title}
                                </div>
                                <div class="sloganText d-flex flex-wrap justify-content-center align-items-center">
                                    ${widget.data.model.slogan}
                                </div>
                                 <div class="d-flex align-items-center" style="margin-top:38px;">   
                                  <img class="" src="${new URL!(`../img/guide-back.svg`, import.meta.url)}" style="width: 40px;height: 40px; margin-right: 10px;" alt="" onclick="${gvc.event(() => {
                                    glitter.goBack()
                                })}">                                
                                    <button class="border-0 nextBTN" style="position: relative" onclick="${gvc.event(()=>{
                                        glitter.goBack("myspace");
                                        glitter.runJsInterFace("startScan",{},()=>{})
                                    })}">${widget.data.model.BTN}
                                    </button>
                                   
                                </div>
                                
                            </div>
                        `
                            },
                            divCreate:{style:`animation-delay: 0s;`}

                        })}
                    `
                    },
                    editor: ()=>{
                        return gvc.map([ `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">背景影片</h3>
                            <div class="mt-2"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.model.background}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                            glitter.ut.chooseMediaCallback({
                                single:true,
                                accept:'image/*',
                                callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                    glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                        widget.data.model.background=link;
                                        widget.refreshAll!()
                                    })
                                }
                            })
                        })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "最上方文字",
                                default: widget.data.model.title ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.title = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "灰色文字",
                                default: widget.data.model.slogan ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.slogan = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "按鍵文字",
                                default: widget.data.model.BTN ?? "",
                                placeHolder: `請輸入最上方文字內容`,
                                callback: (text: string) => {
                                    widget.data.model.BTN = text
                                    widget.refreshAll()
                                }
                            })
                        ])
                    }
                }
            },
        },
        empty: {
            defaultData:{

            },
            render:(gvc, widget, setting, hoverID) => {
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