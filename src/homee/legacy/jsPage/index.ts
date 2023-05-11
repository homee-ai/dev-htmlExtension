'use strict';
import {init} from '../glitterBundle/GVController.js';
import {ViewModel} from '../view/indexViewApi.js'

init((gvc, glitter, gBundle)=>{
    const viewModel=new ViewModel(gvc);
    
    gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css"`)

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
            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            background: #E5E5E5;

        }
        nav{
            display: flex;
            padding: 26px 25px 16px 32px;
            width: 100%;
            height: 65px;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 2;
            background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);

            animation: 50s;

        }
        .navWhite{
            animation:bgWhite 1s ; /*IE*/
            -moz-animation:bgWhite 1s; /*FireFox*/
            -webkit-animation:bgWhite 1s ; /*Chrome, Safari*/
            animation-fill-mode: forwards; /*轉變完要保留*/
        }

        @keyframes bgWhite{
            from {background: transparent}
            to {background: white}
        }

        @-moz-keyframes bgWhite{
            from {background: transparent}
            to {background: white}
        }

        @-webkit-keyframes bgWhite{
            from {background: transparent}
            to {background: white}
        }

        .logo{

        }

        main {


            width: 100vw;
            min-height: 100vh;

            /*background: black;*/
        }
        .fontTitle{
            width: 100%;
            font-weight: 700;
            font-size: 24px;
            line-height: 35px;
            font-family: 'Noto Sans TC',serif;
            margin-bottom: 16px;
            /* identical to box height */

            font-feature-settings: 'pnum' on, 'lnum' on;

            /* HOMEE black */
            text-align: center;

            color: #292929;
        }
        .slideNEWS{
            width: 100%;
            padding: 0 23px 0;

        }
       `)

    gvc.addMtScript([{
        src: 'js/indexViewApi.js'
    },{
        src:'slideControl.js'
    }], () => {
    }, () => {
    })
    let topInset: number
    glitter.runJsInterFace("getTopInset", {}, (response) => {
        topInset = response.data
        gvc.notifyDataChange('mainView')
    }, {
        webFunction: () => {
            return {data: 10}
        }
    })
    return {
        onCreateView:()=>{
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined) {
                        return `
                    <nav style="">
                        <img src="img/whiteLOGO.svg" alt="whiteLOGO" >
                        <div class="ms-auto d-flex ">
                            <img src="img/search-black.svg" alt="" style="width: 20px; height: 20px">
                            <img src="img/big-notify.svg" alt="" style="width: 17px; height: 20px;margin-left: 21px;margin-right: 22px;">
                            <img src="img/scan-black.svg" alt="" style="width: 22px; height: 18px">
                        </div>
                    </nav>
                    <banner>
                        ${(()=>{
                            //屬性
                            let model:any = {
                                loading:true,
                                data:[],
                            }
                            let id = "slideWindow";
                            //方法

                            //畫面

                            return gvc.bindView({
                                bind : id,
                                view : ()=>{
                                    return viewModel.slideControl(model.data , true)
                                },
                                divCreate:{},
                                onCreate:()=>{
                                    //todo input slide page photo
                                    if (model.loading){
                                        model.data = [{
                                            img : "img/indexBG.jpg",
                                            click : ()=>{}
                                        },{
                                            img : "img/indexBG.jpg",
                                            click : ()=>{}
                                        },{
                                            img : "https://cdn.store-assets.com/s/349867/f/9405260.jpg",
                                            click : ()=>{}
                                        }]
                                        model.loading = false
                                        gvc.notifyDataChange('slideWindow')
                                    }
                                }
                            })
                        })()}
                    </banner>
                    <main>
                    <!--商品分類的第一格 -->
                        ${(()=>{
                            //屬性
                            let id = "productGrid"
                            let model:any = {
                                loading : true,
                                data:[]
                            }
                            //方法
                            //畫面
                            return gvc.bindView({
                                bind : "productGrid",
                                view : ()=>{
                                    return viewModel.productGrid(model.data)
                                },
                                divCreate:{class:`d-flex flex-wrap` , style:`padding:0 23px 0;margin-top : 54px`},
                                onCreate:()=>{
                                    //todo input product Grid photo and click fun
                                    if (model.loading){
                                        model.data = [{
                                            img : "img/indexBG.jpg",
                                            click : ()=>{}
                                        },{
                                            img : "img/indexBG.jpg",
                                            click : ()=>{}
                                        },{
                                            img : "https://cdn.store-assets.com/s/349867/f/9405260.jpg",
                                            click : ()=>{}
                                        }];

                                        model.loading = false;
                                        gvc.notifyDataChange('productGrid');

                                    }
                                }
                            })
                        })()}
                        <!-- 第二格 商品單品推薦 -->
                        ${(()=>{
                            //屬性
                            let id = "weeklyProduct"
                            let model:any = {
                                loading : true,
                                data : [],
                                title : '超萬項系列商品 週週更新'
                            }
                            //方法

                            //畫面
                            return gvc.bindView({
                                bind : "weeklyProduct",
                                view : ()=>{
                                    let returnHTML = `
                                        <div class="fontTitle">${model.title}</div>
                                    `
                                    // return returnHTML
                                    return returnHTML + viewModel.weeklyProduct(model.data)
                                },
                                divCreate:{class:`` , style:`padding:0 23px 0;margin-top : 40px;margin-bot : 16px;`},
                                onCreate:()=>{
                                    //todo input product Grid photo and click fun
                                    //todo price display
                                    if (model.loading){
                                        model.data = [{
                                            img : "img/sample/weeklyPro/img.png",
                                            title: "MERETA 茶几",
                                            price : "NT$ 3,990",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_4.png",
                                            title: "SALICA 岩板餐桌",
                                            price : "NT$ 13,560 up",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_5.png",
                                            title: "MAZAN 餐椅",
                                            price : "NT$ 1,590",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_6.png",
                                            title: "BREDA 床頭櫃",
                                            price : "NT$ 9,550",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_3.png",
                                            title: "SANZA 儲物櫃",
                                            price : "NT$ 14,550",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_7.png",
                                            title: "TUDELA 藤編托盤",
                                            price : "NT$ 290",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_8.png",
                                            title: "BRACO 系列裝飾畫",
                                            price : "NT$ 880 up",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/weeklyPro/img_9.png",
                                            title: "ALMAGRO 抱枕",
                                            price : "NT$ 520",
                                            click : ()=>{}
                                        }];

                                        model.loading = false;

                                        gvc.notifyDataChange('weeklyProduct');

                                    }
                                }
                            })
                        })()}
                        <!--第三格 最新消息-->
                        ${(()=>{
                            //屬性
                            let model:any = {
                                loading:true,
                                data : [],
                                title : '最新消息'
                            }
                            let id = "news";
                            //方法

                            //畫面

                            return gvc.bindView({
                                bind : id,
                                view : ()=>{
                                    let returnHTML = `
                                    <div class="fontTitle" style="margin-top: 20px">${model.title}</div>

                                `
                                    return returnHTML + viewModel.slideNEWSControl(model.data )
                                },
                                divCreate:{class:`slideNEWS`},
                                onCreate:()=>{
                                    //todo input slide page photo
                                    if (model.loading){
                                        model.data = [{
                                            img : "img/sample/NEWS/img.png",
                                            click : ()=>{}
                                        },{
                                            img : "img/indexBG.jpg",
                                            click : ()=>{}
                                        },{
                                            img : "https://cdn.store-assets.com/s/349867/f/9405260.jpg",
                                            click : ()=>{}
                                        }]
                                        model.loading = false
                                        gvc.notifyDataChange('news')
                                    }
                                }
                            })
                        })()}
                        <!--第四格 readMoreInf-->
                        ${(()=>{
                            //屬性
                            let id = "readMoreInf"
                            let model:any = {
                                loading : true,
                                data : [],
                                title : '放心生活'
                            }
                            //方法

                            //畫面
                            return gvc.bindView({
                                bind : id,
                                view : ()=>{
                                    let returnHTML = `
                                    <div class="fontTitle" style="margin-bottom: 16px">${model.title}</div>
                                `
                                    // return returnHTML
                                    return returnHTML + viewModel.readMoreInf(model.data)
                                },
                                divCreate:{class:`` , style:`padding:0 23px 0;margin-top : 40px;margin-bot : 16px;`},
                                onCreate:()=>{
                                    //todo input product Grid photo and click fun
                                    //todo price display
                                    if (model.loading){
                                        model.data = [{
                                            img : "img/sample/INFORMATION/img.png",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/INFORMATION/img_1.png",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/INFORMATION/img_2.png",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/INFORMATION/img_3.png",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/INFORMATION/img_4.png",
                                            click : ()=>{}
                                        },{
                                            img : "img/sample/INFORMATION/img_5.png",
                                            click : ()=>{}
                                        }];

                                        model.loading = false;

                                        gvc.notifyDataChange('readMoreInf');
                                    }
                                }
                            })
                        })()}

                    </main>
                    <!--todo infinished-->
                    <footer>

                    </footer>

                `
                    } else {
                        return ``
                    }
                },
                divCreate: {class: ``, style: ``}
            })
        }
    }
})




