'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {SharedView} from "../homee/shareView.js";
import {appConfig} from "../config.js";
import {Dialog} from "../homee/legacy/widget/dialog.js";
import {Category, CategoryListData, ProductData} from "../api/category.js";
import {ViewModel} from "./view/categoryViewApi.js";
import {Api} from '../homee/api/homee-api.js';
import {ProductSharedView} from "../product/shareView.js";
import * as events from "events";

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
        nav: {
            defaultData:{
                searchDefault:"大家都在搜尋:沙發"
            },
            render:(gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getTopInset", {}, (response:any) => {
                    if (widget.data?.topInset != response.data){
                        widget.data.topInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
                return {
                    view:()=>{
                        const sharedView=new SharedView(gvc)
                        return sharedView.navigationBar({
                            title:``,
                            leftIcon:`<img class="" src="${new URL('../img/component/left-arrow.svg',import.meta.url).href}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                if (gvc.glitter.pageConfig.length <= 1) {
                                    appConfig().setHome(gvc, "home", {})
                                } else {
                                    gvc.glitter.goBack()
                                }
                            })}">
                            <div class="  form-control flex-fill" style="
border-radius: 20px;
font-family: 'Noto Sans TC';
padding-left: 30px;
font-style: normal;
font-weight: 400;
background: url(https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061987473) no-repeat scroll 7px 7px,rgba(41, 41, 41, 0.1);;
background-size: 20px;
font-size: 14px;
line-height: 150%;
color: #858585;
width: calc(100vw - 180px);
" placeholder="${widget.data.searchDefault}" onclick="${gvc.event(()=>{
                               glitter.changePage(new URL('../homee/jspage/search-page.js',import.meta.url).href,'searchPage',true,{},{animation:glitter.animation.fade})
                            })}" >${widget.data.searchDefault}</div>
                            `,
                            rightIcon:`
                             <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061894470" style="width: 28px;height: 28px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("noticeBell",{},()=>{})
                            })}">
                                <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061418331" style="width: 28px;height: 28px;" alt="" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("qrcodeScanner",{},()=>{})
                            })}">
                            `
                        })
                    },
                    editor:()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "預設搜尋內容",
                                default: widget.data.searchDefault,
                                placeHolder: "大家都在搜尋:沙發",
                                callback: (text: string) => {
                                    widget.data.searchDefault= text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }

                }
            },
        },
        banner:{
            defaultData:{
                dataList:[
                    {title:"精選人氣商品" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063161788"},
                    {title:"岩板餐桌系列" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063296082"},
                    {title:"本週新品（ NEW ）" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063314153"}
                ],
            },
            render:(gvc, widget, setting, hoverID)=>{
                gvc.addStyle(`
                        .bannerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 14px;
                            line-height: 20px;
                            color: #292929;
                            
                            position:absolute;
                            top:8px;
                            left:12px;
                            
                        }
                        .banner-card{
                            border-radius: 12px;
                        }
                    `)
                return {
                    //分為二 view決定中間該顯示的樣子
                    //editor決定右方供人輸入的樣子
                    view: ()=>{
                        return `
                        <div class="w-100 d-flex" style="padding: 16px;">
                            <div class="w-50 banner-card" style="margin-right:7px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[0].img});position: relative" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data.dataList[0]
                            })
                        })}">
                                <div class="bannerTitle">${widget.data.dataList[0].title}</div>
                            </div>
                            <div class="w-50 d-flex flex-column" style="margin-left: 7px;" >
                                <div class="banner-card" style="margin-bottom:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[1].img});position: relative;" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data.dataList[1]
                            })
                        })}">
                                    <div class="bannerTitle">${widget.data.dataList[1].title}</div>
                                </div>
                                <div class="banner-card" style="margin-top:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[2].img});position: relative;" onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data.dataList[2]
                            })
                        })}">
                                    <div class="bannerTitle">${widget.data.dataList[2].title}</div>
                                </div>
                            </div>
                        </div>
                    `
                    },
                    editor: ()=>{
                        return gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return `<div class="alert alert-dark mt-2">
                                ${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `banner標題${index+1}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        dd.title = text
                                        widget.refreshAll!()
                                    }
                                })}
                                
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">banner圖片${index+1}</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].img}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2 " style="cursor: pointer;" onclick="${gvc.event(() => {
                                        glitter.ut.chooseMediaCallback({
                                            single: true,
                                            accept: 'image/*',
                                            callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                                appConfig().uploadImage(data[0].file, (link) => {
                                                    dd.img = link;
                                                    widget.refreshAll()
                                                })
                                            }
                                        })
                                    })}"></i>
                                </div>
                            ${ClickEvent.editer(gvc,widget,dd)}
                            </div>`
                        }))
                    }

                    // glitter.htmlGenerate.editeInput({
                    //     gvc: gvc,
                    //     title: "banner標題1",
                    //     default: widget.data.title[0],
                    //     placeHolder: "精選人氣商品",
                    //     callback: (text: string) => {
                    //         widget.data.searchDefault= text
                    //         widget.refreshAll!()
                    //     }
                    // }),

                }
            }
        },
        category12:{
            defaultData:{
                dataList:[
                    {title:"餐桌" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675071897159", toPage:""},
                    {title:"椅子" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700" , toPage:""},
                    {title:"沙發" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072481671" , toPage:""},
                    {title:"茶几" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072593723" , toPage:""},
                    {title:"TERA\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072618992" , toPage:""},
                    {title:"BANFF\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072650712" , toPage:""},
                    {title:"床架" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072676832" , toPage:""},
                    {title:"裝飾畫" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072699256" , toPage:""},
                    {title:"生活用品" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072721565" , toPage:""},
                    {title:"全部" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031" , toPage:""},
                ],
            },
            render:(gvc, widget, setting, hoverID)=>{
                gvc.addStyle(`
                        .bannerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 14px;
                            line-height: 20px;
                            color: #292929;
                            
                            position:absolute;
                            top:8px;
                            left:12px;
                            
                        }
                        .banner-card{
                            border-radius: 12px;
                        }
                    `)
                return {
                    //分為二 view決定中間該顯示的樣子
                    //editor決定右方供人輸入的樣子 https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031
                    view: ()=>{
                        return gvc.bindView({
                            bind:"bookcase",
                            view : ()=>{
                                let returnHTML = gvc.map(widget.data.dataList.map((data:any)=>{
                                    return `
                                     <div class="d-flex flex-column " style="width:20%;padding-right: 16px;" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({
                                            gvc,widget,clickEvent:data
                                        })
                                    })}">                                        
                                        <div style="width:64px;height:64px;border-radius: 18px;width:100%;height:auto;padding: 0 4px 100%;background: #FBF9F6 url(${data.img}) no-repeat center;background-size: contain;margin-right: 18px;"></div>
                                        <div class="w-100 d-flex align-items-center justify-content-center" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 100%;
white-space: normal;
word-break: break-all;
display: flex;
align-items: center;
text-align: center;
margin-bottom: 16px;
margin-top: 4px;
color: #1E1E1E;">${data.title}</div>
                                    </div>
                                
                                `
                                }));

                                return `
                            <div style="margin-bottom:12px;padding-left:16px;font-weight: 700;font-size: 18px;line-height: 26px;color: #1E1E1E;">品類</div>
                            <div class="d-flex flex-wrap" style="padding-left:16px;">
                            ${returnHTML}
                            </div>
                        `

                            },
                            divCreate: {class: `d-flex flex-column `, style: `margin-top:16px;`}
                        })
                    },
                    editor: ()=>{
                        return `<div class="d-flex flex-column">                   
                        ${gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return `
                            <div class="d-flex flex-column my-3 alert alert-dark">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;display: inline-block" onclick="${gvc.event(() => {
                                    widget.data.dataList.splice(index, 1)
                                    widget.refreshAll()
                                })}"></i>區塊${index + 1}
                                </div>
                                ${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `標題${index+1}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })}     
                                 <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片${index+1}</h3>
                                    <div class="mt-2"></div>
                                    <div class="d-flex align-items-center mb-3">
                                        <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].img}">
                                        <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                        <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        appConfig().uploadImage(data[0].file,(link)=>{
                                            widget.data.dataList[index].img=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                                    </div>
                                ${ClickEvent.editer(gvc,widget,dd)}  
                            </div>                 
                                `
                        }))}
                        ${(()=>{
                            gvc.addStyle(`
                                    .add-btn:hover{
                                        cursor: pointer;
                                    }
                                `)
                            return `
                                    <div class="add-btn text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    widget.data.dataList.push({img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg` , title : `` , toPage : ``})
                                    widget.refreshAll()
                                })
                            }">添加目錄區塊</div>
                                `
                        })()}
                    </div>`
                    }

                }
            }
        },
        footer:{
            defaultData:{
                dataList:[
                    {
                        title : "首頁",
                        icon : new URL('../img/component/footer/home.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "靈感",
                        icon : new URL('../img/component/footer/idea.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "我的空間",
                        icon : new URL('../img/component/footer/myspace.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "購物車",
                        icon : new URL('../img/component/footer/shoopingCart.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },
                    {
                        title : "會員",
                        icon : new URL('../img/component/footer/user.svg',import.meta.url).href,
                        toPage:"",
                        click : ()=>{

                        }
                    },

                ],
            },
            render:(gvc, widget, setting, hoverID)=>{
                glitter.runJsInterFace("getBottomInset", {}, (response:any) => {
                    if (widget.data?.bottomInset != response.data){
                        widget.data.bottomInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
                gvc.addStyle(`
                        footer{
                            background:white;
                            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                            padding-top:18px;
                        }
                        .footerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                            text-align: center;
                            color: #1E1E1E;
                        }
                        .selected{
                            color:#FE5541;
                        }
                    `)

                return {
                    view: ()=>{
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data:any , index:number)=>{
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e)=>{
                                    ClickEvent.trigger({
                                        gvc,widget,clickEvent:data
                                    })
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle ${(() => {if (index==0) return "selected"})()}">${data.title}</div>
                                </div>
                                `
                            }))
                        })()}
                        </footer>
                    `
                    },
                    editor: ()=>{
                        return gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `footer icon ${index+1}`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })+
                                `
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">icon圖片${index+1}</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].icon}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                    glitter.ut.chooseMediaCallback({
                                        single:true,
                                        accept:'image/*',
                                        callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                            glitter.share.publicInterface["glitter"].upload(data[0].file,(link:string)=>{
                                                widget.data.dataList[index].icon=link;
                                                widget.refreshAll!()
                                            })
                                        }
                                    })
                                })}"></i>
                                </div>
                            `
                                +ClickEvent.editer(gvc,widget,dd)
                        }))
                    }
                }
            }
        },
        subCategory:{
            defaultData:{},
            render:(gvc, widget, setting, hoverID)=>{
                return {
                    view:()=>{
                        let isScrollListenerRegistered = false;
                        gvc.addStyle(`     
                        nav{
                            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
                        }
                
                        main {
                            padding: 24px 35px 44px;
                      
                            font-family: 'Noto Sans TC';
                            margin: 0;
                            box-sizing: border-box;
                        }
                        .sortRawText{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 13px;
                            line-height: 19px;
                            /* identical to box height */
                            
                            display: flex;
                            align-items: center;
                            text-align: center;
                            
                            /* HOMEE dark grey */
                            
                            color: #858585;
                
                        }
                        a{
                        
                        }
                
                        `)
                        const gBundle=(gvc.parameter.pageConfig?.obj.data.object && gvc.parameter.pageConfig?.obj.data) ?? {"title":"本週新品","object":{"link":"https://mitblog.pixnet.net/blog/post/37708222","name":"本週新品","value":"gid://shopify/Collection/435249512748","clickEvent":{"src":"$homee/homee/event.js","route":"category"},"selectPage":{"tag":"product_show","name":"產品展示頁面","group":"產品頁"},"subCategory":[{"name":"銀標福利品","value":"gid://shopify/Collection/435260719404"},{"name":"布沙發 ( 更多商品即將更新 )","value":"gid://shopify/Collection/432946676012"}]},"category":"sub_category_id","index":0}
                        const viewModel:{
                            select:number,
                            setSubCategoryRow:(category: string)=>string,
                            loading:boolean,
                            product:any,
                            allData:any
                        } = {
                            select:gBundle.selectIndex??0,
                            setSubCategoryRow:(category: string) => {
                                gvc.addStyle(`
                                .subcateTitle{
                                    font-weight: 400;
                                    font-size: 14px;
                                    line-height: 20px;
                                    display: flex;
                                    align-items: center;
                                    text-align: center;
                                    /* HOMEE dark grey */
                                    margin-left: 16px;
                                    color: #858585;
                                }
                                .selectTitle{
                                    /* HOMEE black */
                                    color: #292929;
                                    font-weight: 700;
                                }
                            `)
                                return  gvc.bindView({
                                    bind: "subCategoryRow",
                                    view: () => {
                                        //全部先拿掉

                                        // return gvc.map(gBundle.object.subCategory ?? [].map((data: any, index: number)=>{
                                        return gvc.map([].concat(gBundle.object.subCategory ?? []).map((data: any, index: number)=>{
                                        // return gvc.map([{name:"全部",id:gBundle.object.id}].concat(gBundle.object.subCategory ?? []).map((data: any, index: number)=>{

                                            return `
                                            <div class="subcateTitle ${(viewModel.select === index) ? `selectTitle`:``}" style="" onclick="${gvc.event(() => {
                                                    viewModel.loading=true
                                                    viewModel.select=index
                                                    gvc.notifyDataChange('mainView')
                                                    gvc.notifyDataChange('cardGroup')
                                                    gvc.notifyDataChange('subCategoryRow')
                                                })}">
                                                ${data["name"]}
                                                
                                            </div>
                                `
                                        }))
                                    }, divCreate: {class: `d-flex rowBar`, style: `margin-left:8px;overflow-x: scroll;padding-right:8px;`},
                                    onCreate:()=>{
                                        const parent = document.querySelector('.rowBar') as HTMLElement;
                                        const center = document.querySelector('.selectTitle') as HTMLElement;


                                        const centerOffsetLeft = center.offsetLeft;
                                        const centerWidth = center.offsetWidth;
                                        const parentWidth = parent.offsetWidth;


                                        let sumWidth = 0;
                                        let scrollTo = 0;
                                        const children = Array.from(parent.children);
                                        for (const data of children) {
                                            let child = data as HTMLElement;
                                            sumWidth += child.offsetWidth + parseInt(window.getComputedStyle(child).marginLeft);
                                            if (child.offsetLeft + child.offsetWidth / 2 >= centerOffsetLeft + centerWidth / 2) {
                                                scrollTo = sumWidth - parentWidth / 2 - child.offsetWidth / 2 - parseInt(window.getComputedStyle(child).marginLeft);
                                                break;
                                            }
                                        }

                                        parent.scrollLeft = scrollTo;



                                    }
                                })

                        },
                            loading:true,
                            product:[],
                            allData:[]
                        }

                        let sortSelect = 0;
                        //todo get title 父標題
                        let title = gBundle.title ?? "分類頁";
                        let sortPriceOrder = -1;
                        let origData:ProductData[] = [];
                        let cursor = "";
                        let sortBy = "manual";
                        let productSharedView = new ProductSharedView(gvc)
                        const handleScroll = () => {

                        };



                        glitter.share.productData = {};
                        function resetSort(){
                            sortRow[2].img = new URL('../img/sample/category/sort.svg',import.meta.url).href;
                            sortPriceOrder = -1;

                        }
                        function handleClick(event:Event) {
                            if(viewModel.loading){
                                return
                            }
                            if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight && cursor) {
                                isScrollListenerRegistered = true;
                                const id = gBundle.object.subCategory[viewModel?.select].value
                                viewModel.loading = true;
                                new Category(glitter).getPageCategoryData("sub_category_id",id, 6 , cursor,(response:any)=>{
                                    cursor = "";
                                    viewModel.product.push(response["product_list"]);
                                    if (response["product_list"].length == 0){
                                        let spinnerBlcok = document.querySelector('.spinnerBlcok') as HTMLElement;
                                        spinnerBlcok.classList.add("d-none");
                                        viewModel.loading = true;
                                    }
                                    response["product_list"].forEach((productData:any)=>{
                                        let element = productSharedView.productCard({class:``,style:``} , productData)
                                        let leftElement = document.querySelector('.left-line') as HTMLElement;
                                        let rightElement = document.querySelector('.right-line') as HTMLElement;
                                        if (leftElement.getBoundingClientRect().height <= rightElement.getBoundingClientRect().height){
                                            leftElement.innerHTML += element
                                        }else {
                                            rightElement.innerHTML += element
                                        }

                                    })

                                    cursor = response["cursor"];
                                    // viewModel.allData.push(response);
                                    viewModel.loading=false

                                },sortBy)
                            }
                        }
                        // sort_by: 'manual' | 'best-selling' | 'alpha' | 'alpha-desc' | 'price' | 'price-desc' | 'lastest' | 'lastest-desc';
                        let sortRow = [
                            (()=>{
                                const map={
                                    text: '精選', img: '', click: (e:HTMLElement) => {
                                        const id = gBundle.object.subCategory[viewModel.select].value
                                        window.scrollTo(0, 0);
                                        viewModel.loading=true

                                        resetSort();
                                        sortSelect = 0;
                                        sortBy = "manual";
                                        cursor = "";

                                        window.removeEventListener('scroll' ,handleClick);



                                        new Category(glitter).getPageCategoryData("sub_category_id",id, 6 ,"", (response:any)=>{

                                            viewModel.product = response["product_list"];
                                            cursor = response["cursor"];
                                            viewModel.loading=false
                                            let spinnerBlcok = document.querySelector('.spinnerBlcok') as HTMLElement;
                                            spinnerBlcok.classList.remove("d-none");
                                            gvc.notifyDataChange(['sortBar' , 'cardGroup']);
                                        },sortBy)
                                        // new Category(glitter).getCategoryData("sub_category_id",id,(response)=>{
                                        //     viewModel.product=response
                                        //
                                        //
                                        //
                                        // },"manual")
                                    }
                                }
                                return map
                            })(),
                            (()=>{
                                const map={
                                    text: '銷量', img: '', click: (e:HTMLElement) => {
                                        const id = gBundle.object.subCategory[viewModel.select].value
                                        viewModel.loading=true
                                        resetSort();
                                        sortSelect = 1;
                                        sortBy = "best-selling";
                                        cursor = "";
                                        window.scrollTo(0, 0);
                                        window.removeEventListener('scroll' ,handleClick);


                                        new Category(glitter).getPageCategoryData("sub_category_id",id, 6 ,"", (response:any)=>{

                                            viewModel.product = response["product_list"];
                                            cursor = response["cursor"];
                                            viewModel.loading=false
                                            let spinnerBlcok = document.querySelector('.spinnerBlcok') as HTMLElement;
                                            spinnerBlcok.classList.remove("d-none");
                                            gvc.notifyDataChange(['sortBar' , 'cardGroup']);
                                        },sortBy)

                                    }
                                }
                                return map
                            })(),
                            (()=>{
                                const map={
                                    text: '價格', img: new URL('../img/sample/category/sort.svg',import.meta.url).href, click: (e:HTMLElement) => {
                                        // if (!origData){
                                        //     origData = glitter.share.productData;
                                        // }
                                        //
                                        const id = gBundle.object.subCategory[viewModel.select].value
                                        window.scrollTo(0, 0);

                                        sortSelect = 2;
                                        sortPriceOrder *= -1;
                                        cursor = "";
                                        let spinnerBlcok = document.querySelector('.spinnerBlcok') as HTMLElement;
                                        spinnerBlcok.classList.remove("d-none");

                                        window.removeEventListener('scroll' ,handleClick);


                                        if (sortSelect==2){
                                            if (sortPriceOrder == 1){
                                                sortRow[2].img = new URL('../img/sample/category/sortHigher.svg',import.meta.url).href ;
                                                sortBy = "price"
                                                new Category(glitter).getPageCategoryData("sub_category_id",id, 6 ,"", (response:any)=>{
                                                    viewModel.product = response["product_list"];
                                                    cursor = response["cursor"];
                                                    viewModel.loading=false
                                                    gvc.notifyDataChange(['sortBar' , 'cardGroup']);
                                                },sortBy)
                                            }else{
                                                sortBy = "price-desc"
                                                sortRow[2].img = new URL('../img/sample/category/sortSmaller.svg',import.meta.url).href ;
                                                new Category(glitter).getPageCategoryData("sub_category_id",id, 6 ,"", (response:any)=>{
                                                    viewModel.product = response["product_list"];
                                                    cursor = response["cursor"];
                                                    viewModel.loading=false
                                                    gvc.notifyDataChange(['sortBar' , 'cardGroup']);
                                                },sortBy)
                                            }
                                        }
                                        viewModel.product.sort((a:any, b:any)=>(a.sale_price - b.sale_price) * sortPriceOrder);
                                        gvc.notifyDataChange(['sortBar' , 'cardGroup']);
                                    }
                                }
                                return map
                            })(),

                        ]
                        return (()=>{
                            let topInset: number = 0
                            let bottomInset: number = 0

                            let leftHeight = 0;
                            let rightHeight = 0;
                            glitter.runJsInterFace("getTopInset", {}, (response) => {
                                topInset=response.data
                                gvc.notifyDataChange(['mainView'])
                            }, {
                                webFunction: () => {
                                    return {data: 0}
                                }
                            })

                            return gvc.bindView({
                                bind: `mainView`,
                                view: () => {
                                    if (topInset !== undefined && bottomInset !== undefined) {
                                        return /* HTML */ `
                                        <nav class="bg-white w-100 position-fixed z-index-99"  style="padding-top: ${topInset - 20}px;width: 100vw;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);z-index: 9999;">
                                            <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 16px; background: #FFFFFF;position:relative;">
                                                <div class="me-auto p-0 d-flex align-items-center" style="">
                                                    <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1676803803897" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                                            //todo 回哪裡
                                                            glitter.goBack()
                                                        })}">
                                                </div>
                                                <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="color: #292929;;position: absolute;top: 50%;   font-family: 'Noto Sans TC';font-style: normal;font-size: 16px;font-weight: 700;">
                                                    ${title}
                                                </div>
                                            
                                            </div>
                                            <banner style="">
                                               ${((gBundle.object.subCategory ?? []).length>0) ? viewModel.setSubCategoryRow(gBundle.parent_category_id):``}
                    <!--                            todo 之後如果有需要要加東西-->
                                                ${gvc.bindView({
                                                            bind: 'sortBar',
                                                            view: () => {
                                                                
                                                                let returnHTML = ``;
                                                                // alert(sortSelect)
                                                                sortRow.forEach((element, index: number) => {
                                                                    let style = (index == sortSelect) ? "color: #1E1E1E;" : "color: #858585;"
                                                                    
                                                                    returnHTML += `
                                                    <div class="sortRawText" style="padding: 0 24px;font-weight: 500;${style}" onclick="${gvc.event((e)=>{
                                                            element.click(e);
                                                        })}">
                                                        ${element.text}
                                                        ${gvc.bindView({
                                                            bind: "",
                                                            view: () => {
                                                                if (element.img) {
                                                                    return `<img src="${element.img}" style="height: 16px;width: 16px;">`
                                                                }
                                                                return ``
                                                            }
                                                        })}
                                                    </div>
                                                    `
                                                                    //直槓
                                                                    if (index != sortRow.length - 1) {
                                                                        returnHTML += `
                                                                            <div style="background: #858585; height: 5px;width: 1px;"></div>
                                                                        `
                                                                    }
                                                                })
                                                                return returnHTML
                                                            },
                                                            divCreate: {style: `margin-top:${(((gBundle.object.subCategory ?? []).length>0) ? 24:0)}px;padding-bottom:9px;`, class: `d-flex align-items-center`}
                                                        })}
                                            </banner>       
                                        </nav>
                                        <main style="background: white;padding-top:${topInset - 20 + (((gBundle.object.subCategory ?? []).length>0) ? 150:120)}px;padding-left: 23px;padding-right: 23px;">
                                            ${gvc.bindView({
                                                bind:"cardGroup",
                                                view :()=>{                                                     
                                                    if (viewModel.loading) {
                                                        
                                                        return ``
                                                    }else{
                                                        return `
                                                        <div class="left-line w-50" style="height:auto; padding-right:8px;"></div>
                                                        <div class="right-line w-50" style="height:auto;padding-left:8px;"></div>                                                        
                                                        `
                                                    }

                                                },divCreate:{class:`CardGroup d-flex align-items-start`}
                                                ,onCreate : ()=>{
                                                    
                                                    let leftElement = document.querySelector('.left-line') as HTMLElement;
                                                    let rightElement = document.querySelector('.right-line') as HTMLElement;
                                                    let CardGroup = document.querySelector('.CardGroup') as HTMLElement;
                                                // productSharedView.productCard({class:``,style:``} , viewModel.product[0])
                                                    if (!viewModel.loading){
                                                        
                                                        
                                                        viewModel.product.forEach((productData:any)=>{
                                                            let element = productSharedView.productCard({class:``,style:``} , productData)
                                                            
                                                            if (leftElement.getBoundingClientRect().height <= rightElement.getBoundingClientRect().height){
                                                                leftElement.innerHTML += element
                                                            }else {
                                                                rightElement.innerHTML += element
                                                            }
                                                            
                                                        })
                                                        gvc.addStyle(`
                                                            .swiper-pagination-bullet {
                                                                background: #E0E0E0!important;;                    
                                                            }
                                                            .swiper-pagination-bullet-active{
                                                                background: #FE5541!important;;
                                                            }
                                                        `)

                                                        
                                                        let test = document.querySelector('main') as HTMLElement;
                                                        
                                                      
                                                        
                                                        

                                                        
                                                        window.addEventListener('scroll', handleClick);
                                                        

                                                    }
                                                    
                                                }
                                            })} 
                                            <div class="w-100 spinnerBlcok">
                                                <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                                    <div class="spinner-border" role="status"></div>
                                                </div>
                                            </div>                                          
                                        </main>                         
                                        `
                                    } else {
                                        return `
                            
                        `
                                    }

                                }, divCreate: {class: ``, style: `min-height : 100vh;padding-bottom:100px;`},
                                onCreate: () => {
                                    if(viewModel.loading){
                                        // const id=[{name:"全部",id:"0"}].concat((gBundle.object.subCategory ?? []).map((dd:any)=>{
                                        //     return {name:dd.title,id:dd.value}
                                        // }))[viewModel.select].id

                                        if (gBundle.object.subCategory){
                                            const id = gBundle.object.subCategory[viewModel?.select].value

                                            new Category(glitter).getPageCategoryData("sub_category_id",id, 6 , "",(response:any)=>{
                                                viewModel.product = response["product_list"];
                                                cursor = response["cursor"];
                                                viewModel.allData.push(response);
                                                viewModel.loading=false
                                                gvc.notifyDataChange(['cardGroup'])
                                            },sortBy)

                                            // new Category(glitter).getCategoryData("sub_category_id",id,(response)=>{
                                            //     viewModel.product=response;
                                            //     viewModel.allData.push(response);
                                            //     viewModel.loading=false
                                            //     gvc.notifyDataChange('cardGroup')
                                            // },"manual")
                                            viewModel.allData.push([]);
                                            // new Category(glitter).getCategoryData("sub_category_id",id,(response)=>{
                                            //     viewModel.allData.push(response);
                                            //
                                            //     gvc.notifyDataChange('cardGroup')
                                            // },"best-selling")
                                        }else{
                                            viewModel.loading=false;
                                        }



                                    }

                                }
                            })
                        })()
                    },
                    editor:()=>{
                        return ``
                    }
                }
            }
        },
        indexStatic: {
            defaultData:{
                selectIndex : 0,
                loading:false,
                leftList:[],
            },
            render:(gvc, widget, setting, hoverID) => {
                let topInset: number = 0;
                let bottomInset: number = 0;
                const dialog = new Dialog(gvc);
                let shareView = new SharedView(gvc);
                const viewModel = new ViewModel(gvc)
                const categoryAPI = new Category(gvc.glitter);
                let categoryList:CategoryListData[] = [];
                let loading = false
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
                    
                            html {
                                width: 100%;
                                height: 100%;
                                background: #F8F3ED;
                                overflow-y: auto;
                                background : white;
                            }
                    
                            body {
                                width: 100%;
                                height: 100%;
                                background : white;
                                
                            }
                    
                            main {
                                padding: 24px 35px 44px;
                           
                                font-family: 'Noto Sans TC';
                                margin: 0;
                                box-sizing: border-box;
                                height:100vh;
                            }
                            
                            `)

                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
                                ${shareView.navigationBar({
                                    title: "分類",
                                    leftIcon:`<img class="" src="${new URL!(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                        if( gvc.glitter.pageConfig.length <= 1){
                                            appConfig().setHome(gvc, "home", {})
                                        }else{
                                            gvc.glitter.goBack()
                                        }
                                    })}">`,
                                    rightIcon:`                        
                                    `           
                                })}
                                ${gvc.bindView({
                                    bind : 'mainDom',
                                    view : () => {
                                        
                                        if (loading){
                                            
                                        return `              
                                            <div style="padding-left: 15px;"></div>                                                                 
                                            ${gvc.bindView({
                                                bind : "leftMain",
                                                view : ()=>{
                                                    gvc.addStyle(`
                a {
                  all: initial;
                }
                .left-title *{
                    width: 100%;
                    height: 56px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 120%;
                    word-break: break-word;
                    white-space:pre-line;  
                    color: #858585;
                }
                .selectClass *{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 17px;
                    line-height: 100%;
                    /* HOMEE red */
                    color: #FD6A58;
                }
            `)
                                                    let returnData = ``;
                                                    // console.log(widget.data.leftList)
                                                    // widget.data.leftList.forEach((data:string,index)=>{
                                                    //     let selectClass = (index == widget.data.selectIndex) ? "selectClass" : "";
                                                    //
                                                    //     returnData += `
                                                    //     <div class="left-title  ${selectClass}" onclick="${gvc.event(()=>{
                                                    //             widget.data.selectIndex = index;
                                                    //             gvc.notifyDataChange('leftMain');
                                                    //             gvc.notifyDataChange('rightMain');
                                                    //         })}">                        
                                                    //         <a class="d-flex align-items-center justify-content-start" href="#${data}"
                                                    //         style="color:${(index == widget.data.selectIndex) ? `#FD6A58`:`#858585`};text-decoration: inherit;"
                                                    //         >${data}</a>
                                                    //     </div>
                                                    // `
                                                    // })
                                                    // return `
                                                    //     <div class="d-flex flex-column w-100">
                                                    //         ${returnData}
                                                    //     </div>
                                                    // `
                                                    return viewModel.setCategoryLeft(categoryList , widget.data);
                                                },
                                                divCreate : {style:`width:30%;border-right: 0.5px solid #E0E0E0;position:fixed;overflow-y: scroll;padding-left: 15px;padding-right: 15px;` , class:`h-100`}
                                            })}
                                            ${gvc.bindView({
                                                bind : "rightMain",
                                                view : ()=>{
                                                    let returnHtml = ``

                                                    categoryList.forEach((data)=>{
                                                        returnHtml += viewModel.setCategoryRight(data);
                                                    })
                                                    returnHtml += `
                                                    <div class="w-100" style="height: 30vh"></div>
                                                `
                                                    return returnHtml;
                                                },
                                                divCreate : {style:`width:70%;overflow-y:scroll;position:fixed;margin-left:26%` , class:`h-100`},
                                                onCreate : ()=>{
                                                    let div = document.getElementById(`${gvc.id('rightMain')}`);

                                                    //左方的導覽要同步更新 函式定義位置
                                                    div?.addEventListener("scroll",(e)=>{
                                                        let distance = div!.scrollTop;
                                                        let elementNodes = [];
                                                        for (let i = 0; i < div!.childNodes.length; i++) {
                                                            if (div!.childNodes[i].nodeType === 1) {
                                                                elementNodes.push(div!.childNodes[i]);
                                                            }
                                                        }

                                                        for (let i = 0 ; i < elementNodes.length ; i++){
                                                            let e = elementNodes[i] as HTMLElement;

                                                            if (distance < e.offsetTop - 50){
                                                                if (widget.data.selectIndex != i - 1){
                                                                    widget.data.selectIndex = i-1;
                                                                    gvc.notifyDataChange('leftMain')
                                                                }
                                                                break;

                                                            }
                                                        }
                                                    })
                                                }
                                            })}                             
                                        `
                                        }else {
                                            return viewModel.loadingView()
                                        }

                                    },
                                    divCreate : {style :`min-height:100vh;` , class : `d-flex w-100`}
                                })}     
                        `
                            },
                            divCreate: {class: `d-flex w-100 flex-column`, style: ``},
                            onCreate : ()=>{
                                const api = new Api()

                                if (!loading){
                                    categoryAPI.getCategoryAllList((data:CategoryListData[])=>{

                                        data.forEach((element)=>{
                                            if (!widget.data.loading){
                                                widget.data.leftList.push(element.name)
                                            }
                                        })
                                        widget.data.loading = true;

                                        categoryList = data ;
                                        loading = true;

                                        gvc.notifyDataChange('mainDom');
                                    })
                                }



                            }
                        })
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },
        indexDynamic: {
            defaultData:{
                selectIndex : 0,
                dataList:[
                    {title:"人氣活動" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700" , toPage:""},
                    {title:"桌子" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675071897159", toPage:""},
                    {title:"沙發" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072481671" , toPage:""},
                    {title:"椅子" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700" , toPage:""},
                    {title:"TERA\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072618992" , toPage:""},
                    {title:"BANFF\n系統儲物" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072650712" , toPage:""},
                    {title:"床組/寢具" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072676832" , toPage:""},
                    {title:"居家生活" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072699256" , toPage:""},
                    {title:"生活方式" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072721565" , toPage:""},
                    {title:"福利品專區" , img:"https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031" , toPage:""},
                ],
            },
            render:(gvc, widget, setting, hoverID) => {
                let topInset: number = 0;
                let bottomInset: number = 0;
                const dialog = new Dialog(gvc);
                let shareView = new SharedView(gvc);
                const viewModel = new ViewModel(gvc)
                let categoryList:CategoryListData[] = [];
                let loading = true
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
                    
                            html {
                                width: 100%;
                                height: 100%;
                                background: #F8F3ED;
                                overflow-y: auto;
                                background : white;
                            }
                    
                            body {
                                width: 100%;
                                height: 100%;
                                background : white;
                                
                            }
                    
                            main {
                                padding: 24px 35px 44px;
                           
                                font-family: 'Noto Sans TC';
                                margin: 0;
                                box-sizing: border-box;
                                height:100vh;
                            }
                            
                            `)

                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
                                ${shareView.navigationBar({
                                    title: "分類",
                                    leftIcon:`<img class="" src="https://homee-ai.github.io/glitter-htmlExtension/src/img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                        if( gvc.glitter.pageConfig.length <= 1){
                                            appConfig().setHome(gvc, "home", {})
                                        }else{
                                            gvc.glitter.goBack()
                                        }
                                    })}">`,
                                    rightIcon:`                        
                                    `
                                })}
                                ${gvc.bindView({
                                    bind : 'mainDom',
                                    view : () => {

                                        if (loading){
                                            return `              
                                            <div style="padding-left: 15px;"></div>                                                                 
                                            ${gvc.bindView({
                                                bind : "leftMain",
                                                view : ()=>{
                                                    gvc.addStyle(`
                                                        a {
                                                          all: initial;
                                                        }
                                                        .left-title *{
                                                            width: 100%;
                                                            height: 56px;
                                                            font-family: 'Noto Sans TC';
                                                            font-style: normal;
                                                            font-weight: 400;
                                                            font-size: 15px;
                                                            line-height: 120%;
                                                            word-break: break-word;
                                                            white-space:pre-line;  
                                                            color: #858585;
                                                        }
                                                        .selectClass *{
                                                            font-family: 'Noto Sans TC';
                                                            font-style: normal;
                                                            font-weight: 700;
                                                            font-size: 17px;
                                                            line-height: 100%;
                                                            /* HOMEE red */
                                                            color: #FD6A58;
                                                        }
                                                    `)
                                                    let returnData = ``;
                                                  
                                                    // console.log(widget.data.leftList)
                                                    widget.data.dataList.forEach((data:any,index:number)=>{
                                                        let selectClass = (index == widget.data.selectIndex) ? "selectClass" : "";

                                                        returnData += `
                                                        <div class="left-title  ${selectClass}" onclick="${gvc.event(()=>{
                                                                
                                                                widget.data.selectIndex = index;
                                                                gvc.notifyDataChange('leftMain');
                                                                gvc.notifyDataChange('rightMain');
                                                            })}">                        
                                                            <a class="d-flex align-items-center justify-content-start" target="_self" href="#pageIndex${data.title}"
                                                            style="color:${(index == widget.data.selectIndex) ? `#FD6A58`:`#858585`};text-decoration: inherit;" onclick="${gvc.event(()=>{
                                                                event?.preventDefault();
                                                                const section1 = document.getElementById(`pageIndex${data.title}`);
                                                                section1?.scrollIntoView({ behavior: "smooth" });
                                                            })}"
                                                            >${data.title}</a>
                                                        </div>
                                                    `
                                                    })
                                                    return `
                                                        <div class="d-flex flex-column w-100">
                                                            ${returnData}
                                                        </div>
                                                    `
                                                    // return viewModel.setCategoryLeft(categoryList , widget.data);
                                                },
                                                divCreate : {style:`width:30%;border-right: 0.5px solid #E0E0E0;position:fixed;overflow-y: scroll;padding-left: 15px;padding-right: 15px;` , class:`h-100`}
                                            })}
                                            ${gvc.bindView({
                                                bind : "rightMain",
                                                view : ()=>{
                                                    let returnHtml = ``
                                                    widget.data.dataList.forEach((data:any)=>{
                                                        let title = data.pageTitile??data.title;

                                                        let dataList = data.subCategory;
                                                     
                                                        // let parentCategory = data.store_id;
                                                        gvc.addStyle(`
                                                            .rightCategoryTitle{
                                                                height: 25px;
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 500;
                                                                font-size: 17px;
                                                                line-height: 25px;
                                                                color: #292929;
                                                               
                                                            }
                                                            .cardTitle{
                                                                height: 40px;
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 14px;
                                                                line-height: 120%;
                                                                color: #292929;
                                                                word-break: break-word;
                                                                white-space:pre-line;  
                                            
                                                            }
                                                        `)
                                                        let CardGroup = ``;
                                           
                                                     
                                                        if (dataList){
                                                            dataList.forEach((element:any,index:number)=>{
                                                                let margin = (index%2) ? "" : "margin-right: 22px;"
                                                                // if (element.name){
                                                                //     console.log(element)
                                                                // }
                                                                if (element.name){

                                                                    CardGroup += `
                                                                    <div class="rounded" style="width: calc(50% - 11px); ${margin}" onclick="${gvc.event((e)=>{
                                                                        data.subCategory.forEach((sub:any)=>{
                                                                            sub.name = (sub.appearText)?sub.appearText:sub.name;
                                                                        })
                                                                            appConfig().changePage(gvc,"sub_category",{
                                                                                title: title,
                                                                                object: data,
                                                                                category: "sub_category_id",
                                                                                selectIndex: index
                                                                            })                                                                         
                                                                        })}">
                                                                        <div class="w-100 rounded" style="padding-top: 86%;background:50% / cover url(${element.img})"></div>
                                                                        <div class="cardTitle d-flex justify-content-center align-items-baseline mt-1 text-center">${element?.appearText??element.name}</div>
                                                                    </div>
                                                                    `
                                                                }

                                                            })
                                                        }
                                                        returnHtml += `
                                                            <div class="d-flex flex-column" style="padding:40px 16px 24px 24px;">
                                                                <div class="d-flex rightCategoryTitle" id="pageIndex${title}">${title}</div>
                                                                <div class="d-flex flex-wrap w-100">
                                                                    ${CardGroup}
                                                                </div>
                                                            </div>
                                                        `
                                                    })
                                                    returnHtml += `
                                                        <div class="w-100" style="height: 30vh"></div>
                                                    `
                                                    return returnHtml;
                                                },
                                                divCreate : {style:`width:70%;overflow-y:scroll;position:fixed;margin-left:26%` , class:`h-100`},
                                                onCreate : ()=>{
                                                    let div = document.getElementById(`${gvc.id('rightMain')}`);

                                                    //左方的導覽要同步更新 函式定義位置
                                                    div?.addEventListener("scroll",(e)=>{
                                                        let distance = div!.scrollTop;
                                                        let elementNodes = [];
                                                        for (let i = 0; i < div!.childNodes.length; i++) {
                                                            if (div!.childNodes[i].nodeType === 1) {
                                                                elementNodes.push(div!.childNodes[i]);
                                                            }
                                                        }

                                                        for (let i = 0 ; i < elementNodes.length ; i++){
                                                            let e = elementNodes[i] as HTMLElement;

                                                            if (distance < e.offsetTop - 50){
                                                                if (widget.data.selectIndex != i - 1){
                                                                    widget.data.selectIndex = i-1;
                                                                    gvc.notifyDataChange('leftMain')
                                                                }
                                                                break;

                                                            }
                                                        }
                                                    })
                                                }
                                            })}                             
                                        `
                                        }else {
                                            return viewModel.loadingView()
                                        }

                                    },
                                    divCreate : {style :`min-height:100vh;` , class : `d-flex w-100`}
                                })}     
                        `
                            },
                            divCreate: {class: `d-flex w-100 flex-column`, style: ``},
                            onCreate : ()=>{
                            }
                        })
                    },
                    editor: ()=>{

                        return `${gvc.map(widget.data.dataList.map((dd:any,index:number)=>{
                            return `
                            <div class="d-flex flex-column my-3 alert alert-dark">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;display: inline-block" onclick="${gvc.event(() => {
                                    widget.data.dataList.splice(index, 1)
                                    widget.refreshAll()
                                })}"></i>區塊${index + 1}
                                </div>
                                ${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `左標題`,
                                    default: dd.title,
                                    placeHolder: dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].title = text
                                        widget.refreshAll!()
                                    }
                                })}                            
                                 ${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `大標題`,
                                    default: dd.pageTitile??dd.title,
                                    placeHolder: dd.pageTitile??dd.title,
                                    callback: (text: string) => {
                                        widget.data.dataList[index].pageTitile = text
                                        widget.refreshAll!()
                                    }
                                })}               
                                ${(()=>{
                                    let returnHTML = ``
                                    if (dd?.subCategory){
                                        gvc.map(dd?.subCategory.map((data:any)=>{
                                            returnHTML += `
                                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" contenteditable="true" class="mt-2" onblur="${gvc.event((e:HTMLElement)=>{
                                                data.appearText = e.innerHTML;
                                                widget.refreshAll()
                                            })}">${data?.appearText??data.name}</h3>
                                            <div class="mt-2"></div>
                                            <div class="d-flex align-items-center mb-3">
                                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${data.img}">
                                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                                    glitter.ut.chooseMediaCallback({
                                                        single:true,
                                                        accept:'image/*',
                                                        callback(imgData: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                                            appConfig().uploadImage(imgData[0].file,(link)=>{
                                                                data.img=link;
                                                                widget.refreshAll()
                                                            })
                                                        }
                                                    })
                                                })}"></i>
                                            </div>
                                            `
                               
                                        }))    
                                    }
                                    return returnHTML   
                                })()}     
                                ${ClickEvent.editer(gvc,widget,dd)}  
                                </div>
                                
                            </div>                 
                                `
                        }))}
                        ${(()=>{
                            gvc.addStyle(`
                                    .add-btn:hover{
                                        cursor: pointer;
                                    }
                                `)
                            return `
                                    <div class="add-btn text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    widget.data.dataList.push({img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg` , title : `` , toPage : ``})
                                    widget.refreshAll()
                                })
                            }">添加目錄區塊</div>
                                `
                        })()}`
                    }
                }
            },
        },
    }
});