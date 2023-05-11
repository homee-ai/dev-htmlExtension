'use strict';
import {init} from '../../glitterBundle/GVController.js';
import {ViewModel} from "../../view/ideaViewApi.js";
import {Idea} from "../../api/idea.js"
import {SharedView} from "../../widget/sharedView.js"
import {Dialog} from "../../widget/dialog.js"
// @ts-ignore
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'

init((gvc, glitter, gBundle)=>{
    const $=glitter.$
    const viewModel=new ViewModel(gvc)
    const ideaAPI=new Idea(glitter)
    const shareView=new SharedView(gvc)
    const dialog=new Dialog(gvc)
    
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

    function upload(){
        let content = document.querySelector('.input')
        if (content?.innerHTML == "撰寫貼文內容......"){}else{
            let jsonData = {
                poster:glitter.share.userData.user_id,
                content:{
                    intro:content?.innerHTML,
                },
                scene:gBundle.scene,
                config:gBundle.config,
                preview_image:imgArray
            }
            dialog.dataLoading(true)
            ideaAPI.uploadArticle(jsonData,(response)=>{
                dialog.dataLoading(false)
                if(glitter.share.firstPageIsIdea){
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
    let imgArray = gBundle.preview_image

    return {
        onCreateView:()=>{
            let topInset: number = 0
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 0}
                }
            })
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined) {
                        return `
                 ${shareView.navigationBar({
                            title: "新貼文",
                            leftIcon: `  <img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 27px" alt="" onclick="${gvc.event(() => {
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
                        <img class="userPhoto rounded-circle" src="${glitter.share.userData.photo}">
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
                    console.log(glitter.share.userData)
                }
            })
        }

    }

})




