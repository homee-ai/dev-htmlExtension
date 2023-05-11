'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {appConfig} from "../config.js";
import {Dialog} from "../dialog/dialog-mobile.js";
import {Myspace, Space} from "../api/myspace.js";
import {Api} from "../homee/api/homee-api.js";
import {SharedView} from "../homee/shareView.js";
import {Checkout} from "../api/checkout.js";

Plugin.create(import.meta.url, (glitter) => {
    return {
        allPage: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
                        // glitter.setPro("firstMyspace" , undefined ,()=>{})


                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            let viewGuide = false;
                            let vm: {
                                loading: boolean,
                                height: string,
                                data: Space[],
                                showMore: boolean
                            } = {
                                loading: true,
                                height: `100vh`,
                                data: [],
                                showMore: true
                            }


                            function getData() {
                                vm.data =[]
                                vm.loading=true
                                glitter.getPro("viewGuide",(response:any)=>{
                                    viewGuide=(response.data)==='true'
                                    viewGuide=glitter.share.viewGuide||viewGuide
                                    gvc.notifyDataChange(id)
                                })


                                Myspace.getModelList((data) => {
                                    vm.loading=false
                                    if (data) {
                                        vm.data = data as Space[]
                                        vm.data = vm.data.sort(function (a, b) {
                                            return b.time - a.time;
                                        });
                                        vm.showMore = vm.data.length >= 4
                                        vm.data = vm.data.filter((dd, index) => {
                                            return index < 4
                                        })
                                        spaceData = vm.data.map((dd) => {
                                            return {title: dd.key, date: dd.store_time, img: dd.space_image, config: dd}
                                        })
                                    }
                                    gvc.notifyDataChange(id)
                                })
                            }

                            getData()

                            async function getPageHeight() {
                                let top = await new Promise((resolve, reject) => {
                                    appConfig().getTopInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                let bottom = await new Promise((resolve, reject) => {
                                    appConfig().getBottomInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                console.log(JSON.stringify({top: top, bottom: bottom}))
                                vm.height = `calc(100vh - ${63 + top + 63}px)`
                                gvc.notifyDataChange(id)
                            }

                            getPageHeight()

                            let topInset: number = 0
                            let spaceData: { title: string, date: string, img: string, config: Space }[] = []
                            let clickEvent = glitter.ut.clock()

                            glitter.runJsInterFace("getTopInset", {}, (response) => {
                                topInset=response.data
                                gvc.notifyDataChange(['coverGuide'])
                            }, {
                                webFunction: () => {
                                    return {data: 0}
                                }
                            })
                            return {
                                bind: id,
                                view: () => {
                                    if(vm.loading){
                                        return  `<div class="w-100">
                                            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                                <div class="spinner-border" role="status"></div>
                                            </div>
                                        </div>`
                                    }
                                    glitter.share.blockBack=false
                                    return `
                                    ${gvc.bindView({
                                        bind:"coverGuide",
                                        view : ()=>{
                                            
                                            if (!viewGuide){
                                                
                                                return `
                                                <div  style="position:fixed;z-index:999999;top:0;height: 100vh;width: 100vw;background: #1E1E1E;opacity: 0.5">
                                                    
                                                </div>
                                                <div style="position:fixed;z-index:999999;top:0;height: 100vh;width: 100vw;">
                                                    <div class="d-flex align-items-center justify-content-end" style="height: ${topInset+63}px; padding: 0 26px;">
                                                        <div style="padding:6px 9px;position:relative;background: white;opacity: 1;border-radius: 14px;color: #FE5541;font-family: 'Noto Sans TC';font-style: normal;font-weight: 500;font-size: 17px;line-height: 25px;text-align: center;" onclick="${gvc.event(()=>{
                                                    viewGuide=true
                                                    gvc.notifyDataChange('coverGuide')
                                                            appConfig().changePage(gvc , "guide1");
                                                    glitter.share.blockBack=true
                                                    glitter.share.viewGuide=true
                                                        })}">
                                                            掃描教學
                                                            <div style="background:white;border-radius: 16px;position: absolute;right:calc(100% + 2px);top:calc(100% + 4px);padding: 8px 12px;font-family: 'Noto Sans TC';font-style: normal;font-weight: 400;font-size: 18px;line-height: 26px;color: #1E1E1E;">觀看掃描教學影片</div>
                                                            <img  src="${new URL('../img/component/mysapce/leadingGuide.svg', import.meta.url).href}" class="" style="position:absolute;right:calc(100% - 5px);top:calc(100% + 4px);height:12px;width: 13px;">
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                `    
                                            }else {
                                                return ``
                                            }
                                            
                                        },divCreate:{}
                                    })}
<div class="w-100 position-fixed  d-flex align-items-center justify-content-center flex-column"
style="background: #F8F3ED;height: ${vm.height};">
<div class="d-flex flex-column align-items-center" style="width: calc(100% - 48px);transform: translateY(-40px);">

${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-bottom: 24px;"></div>
${spaceData.map((dd) => {
                                        return `
<div class="w-100 bg-white d-flex align-items-center position-relative" style="height: 100px;border-radius: 20px;"
onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                (dd.config as any).json = JSON.stringify(dd.config)
                                                    .replace(/server_rout/g, 'serverRout')
                                                    .replace(/store_time/g, 'storeTime')
                                                    .replace(/space_image/g, 'spaceImage')
                                                    .replace(/preview_image/g, 'previewImage')
                                                    .replace(/model_url/g, 'modelUrl')
                                                glitter.runJsInterFace("openMySpaceMd", dd.config, () => {
                                                    getData()
                                                })
                                            }
                                        })}">
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover; border-top-left-radius: 20px;border-bottom-left-radius: 20px;"></div>
<div class="d-flex flex-column align-items-baseline" style="margin-left: 24px;margin-right: 14px;">
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 23px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #1E1E1E;">${dd.title}</h3>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;
color: #858585;">儲存時間:${dd.date.substring(0, 16)}</span>
</div>
<img class="position-absolute top-0 right-0" src="${new URL('../img/more.svg', import.meta.url)}" style="width: 32px;height: 32px;right: 6px;" onclick="${
                                            gvc.event((e, event) => {
                                                if (clickEvent.stop() > 50) {
                                                    clickEvent.zeroing()
                                                    glitter.runJsInterFace("showSpaceAction", {
                                                        json:JSON.stringify(dd.config) .replace(/server_rout/g, 'serverRout')
                                                            .replace(/store_time/g, 'storeTime')
                                                            .replace(/space_image/g, 'spaceImage')
                                                            .replace(/preview_image/g, 'previewImage')
                                                            .replace(/model_url/g, 'modelUrl')
                                                    }, () => {
                                                        getData()
                                                    })
                                                }
                                            })
                                        }">
</div>`
                                    }).join('<div style="height: 16px;"></div>')}
<div class="w-100" style="height: 1px;background: #EAD8C2;width: calc(100% - 94px);margin-top: 14px;"></div>
`}

${(() => {
                                        if (vm.showMore) {
                                            return `<div style="font-family: 'Noto Sans TC';
font-style: normal;font-weight: 400;font-size: 15px;margin-top: 14px;line-height: 150%;color: #1E1E1E;
" onclick="${gvc.event(()=>{
    appConfig().changePage(gvc,'more_space',{})
                                            })}">更多空間</div>`
                                        } else {
                                            return ``
                                        }
                                    })()}
</div>
<div id="" class="position-absolute d-flex  flex-column align-items-center justify-content-center p-0" style="
padding: 0;margin: 0 59px;bottom:25px;width:calc(100vw - 108px);height:48px;
background: #FE5541;border-radius: 24px; " onclick="${
                                        gvc.event((e) => {
                                            const dialog = new Dialog()
                                            glitter.runJsInterFace("startScan", {}, () => {
                                                    getData()
                                                },
                                                {
                                                    webFunction: () => {
                                                        dialog.showInfo("僅支援APP版本")
                                                    }
                                                })
                                        })
                                    }">
<h3 style="
font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 18px;
text-align: center;
letter-spacing: 0.15em;
color: #FFFFFF;" class="m-0" >開始掃描</h3>
                                    </div>
</div>`
                                },
                                divCreate: {}
                            }
                        })
                    },
                    editor: () => {
                        return ``
                    }
                }
            }
        },
        allSpace: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        const product=(gvc.parameter.pageConfig?.obj.data ?? {}).product

                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            let vm: {
                                loading: boolean,
                                height: string,
                                data: Space[],
                                showMore: boolean
                            } = {
                                loading: true,
                                height: `100vh`,
                                data: [],
                                showMore: true
                            }

                            function getData() {
                                vm.data =[]
                                vm.loading=true
                                gvc.notifyDataChange(id)
                                Myspace.getModelList((data) => {
                                    vm.loading=false
                                    if (data) {
                                        vm.data = data as Space[]
                                        vm.data = vm.data.sort(function (a, b) {
                                            return b.time - a.time;
                                        });
                                        spaceData = vm.data.map((dd) => {
                                            return {title: dd.key, date: dd.store_time, img: dd.space_image, config: dd}
                                        })
                                    }
                                    gvc.notifyDataChange(id)
                                })
                            }
                            getData()
                            async function getPageHeight() {
                                let top = await new Promise((resolve, reject) => {
                                    appConfig().getTopInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                let bottom = await new Promise((resolve, reject) => {
                                    appConfig().getBottomInset((number) => {
                                        resolve(number)
                                    })
                                }) as number
                                console.log(JSON.stringify({top: top, bottom: bottom}))
                                vm.height = `calc(100vh - ${63 + top + 73}px)`
                                gvc.notifyDataChange(id)
                            }
                            getPageHeight()
                            let spaceData: { title: string, date: string, img: string, config: Space }[] = []
                            let clickEvent = glitter.ut.clock()
                            return {
                                bind: id,
                                view: () => {
                                    if(vm.loading){
                                        return  `<div class="w-100">
            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                <div class="spinner-border" role="status"></div>
            </div>
        </div>`
                                    }
                                    return `
<div class="d-flex flex-column align-items-center mx-auto pt-2" style="padding-left:24px;padding-right: 24px;min-height: 100vh;
background: #F8F3ED;padding-bottom: 24px;">
${spaceData.length === 0 ? `
<img src="${new URL('../img/noSpace.png', import.meta.url).href}" class="" style="width: calc(100% - 114px);">
` : `
${spaceData.map((dd) => {
                                        return `<div class="w-100 bg-white d-flex align-items-center position-relative" style="height: 100px;border-radius: 20px;"
onclick="${gvc.event((e, event) => {
                                            if (clickEvent.stop() > 50) {
                                                (dd.config as any).json = JSON.stringify(dd.config)
                                                    .replace(/server_rout/g, 'serverRout')
                                                    .replace(/store_time/g, 'storeTime')
                                                    .replace(/space_image/g, 'spaceImage')
                                                    .replace(/preview_image/g, 'previewImage')
                                                    .replace(/model_url/g, 'modelUrl')
                                                if(product){
                                                    (dd.config as any)['addPD']=product
                                                    console.log(JSON.stringify(product))
                                                    // return
                                                    glitter.runJsInterFace("selectSpaceToAdd",dd.config,()=>{})
                                                }else{
                                                    glitter.runJsInterFace("openMySpaceMd", dd.config, () => {
                                                        getData()
                                                    })
                                                }
                                                
                                            }
                                        })}">
<div class="h-100 bg-white" style="width: 160px;background: url('${dd.img}')  50% / cover;border-top-left-radius: 20px;border-bottom-left-radius: 20px;"></div>
<div class="d-flex flex-column align-items-baseline" style="margin-left: 24px;margin-right: 14px;">
<h3 style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 23px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #1E1E1E;">${dd.title}</h3>
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;
color: #858585;">儲存時間:${dd.date.substring(0, 16)}</span>
</div>
<img class="position-absolute top-0 right-0" src="${new URL('../img/more.svg', import.meta.url)}" style="width: 32px;height: 32px;right: 6px;" onclick="${
                                            gvc.event((e, event) => {
                                                if (clickEvent.stop() > 50) {
                                                    clickEvent.zeroing()
                                                    glitter.runJsInterFace("showSpaceAction", {
                                                        json:JSON.stringify(dd.config) .replace(/server_rout/g, 'serverRout')
                                                            .replace(/store_time/g, 'storeTime')
                                                            .replace(/space_image/g, 'spaceImage')
                                                            .replace(/preview_image/g, 'previewImage')
                                                            .replace(/model_url/g, 'modelUrl')
                                                    }, () => {
                                                        getData()
                                                    })
                                                }
                                            })
                                        }">
</div>`
                                    }).join('<div style="height: 16px;"></div>')}
`}
</div>
`
                                },
                                divCreate: {}
                            }
                        })
                    },
                    editor: () => {
                        return ``
                    }
                }
            }
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/home.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "靈感",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "我的空間",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "購物車",
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                    {
                        title: "會員",
                        icon: new URL('../img/component/footer/user.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
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
                    `);
                return {
                    view: () => {
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;top: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data: any, index: number) => {
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e) => {
                                    glitter.runJsInterFace("setSpaceHome",{
                                        page:data.selectPage.tag
                                    },()=>{
                                        
                                    })
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle" style="color:${data.color ?? `black`};">${data.title}</div>
                                </div>
                                `;
                            }));
                        })()}
                        </footer>
                    `;
                    },
                    editor: () => {
                        return `
`+gvc.map(widget.data.dataList.map((dd: any, index: number) => {
                            return `<div class="alert alert-dark mt-2">
<h3 style="color: white;font-size: 17px;color: orangered;">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.dataList.splice(index, 1)
                                widget.refreshComponent()
                            })}"></i>
選項.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `名稱`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].title = text;
                                    widget.refreshAll();
                                }
                            }) +
                            `
 ${glitter.htmlGenerate.editeInput({
                                gvc,
                                title: "字體顏色",
                                default: dd.color ?? "black",
                                placeHolder: "請輸入字體顏色",
                                callback: (text) => {
                                    dd.color = text
                                    widget.refreshComponent()
                                }
                            })}
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].icon}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link: string) => {
                                            widget.data.dataList[index].icon = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                                </div>
                            `
                            + ClickEvent.editer(gvc, widget, dd,{
                                option:['mySpaceSetHome'],hover:false
                            })
                            }
</div>`;
                        })) + `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                            gvc.event(() => {
                                widget.data.dataList.push({
                                    title: "標題",
                                    icon: new URL('../img/component/footer/home.svg', import.meta.url).href
                                })
                                widget.refreshComponent()
                            })
                        }">添加按鈕</div>`;
                    }
                };
            }
        },
        productDetail: {
            defaultData: {
                "orgSelectSku":"",
                "qty": 1,
                "intro": [{
                    "text": "<p>OLVAN 檯燈外形簡約優雅，能為您的睡房添加充滿格調，同時具有極佳質感的照明單品。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈底座採用實木材料，具有優良出色的穩固承重力，整體厚實穩固。棉布或百頁材質燈罩讓燈光更柔和，輕鬆營造朦朧浪漫的氛圍，為你快節奏的生活中帶來一些平靜和溫柔，別有一番浪漫情懷。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈有多重款式任你選擇，很適合自用或作為禮品送給親友。HOMEE 成就每一個明亮溫馨的家，與您一同構建理想中的質感生活！</p>\n<p> </p>\n<p> </p>\n<h4>商品規格</h4>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>直徑</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>棉布款：26 公分，百頁：24 公分</p>\n</td>\n</tr>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>寬</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>32 公分</p>\n</td>\n</tr>\n</tbody>\n</table>\n<br>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p data-mce-style=\"text-align: left;\"><strong>材質說明</strong></p>\n</td>\n<td data-mce-style=\"width: 70%;\">\n<p>底座：原木，燈罩：棉布 / PVC</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p> </p>\n<p> </p>\n<h4>相關說明</h4>\n<p>※ 訂購前敬請詳閱<a href=\"https://homee.cc/legal/refund-policy\" target=\"_blank\">退換貨說明</a>，您送出訂單的同時將視同您已詳閱、同意以下規定。</p>\n<p>※ 顏色差異：商品顏色或布料會因您觀看的裝置 (手機、平板或電腦等) 而無法100%相同，商品顏色與布料以實品為主。</p>\n<p>※ 尺寸誤差：所有產品尺寸皆為人工丈量，可能因測量不同而存在誤差，0.5 - 2 公分 屬正常。</p>\n<p>※ 溫馨提醒：家具類商品長途運輸難免有碰撞風險，HOMEE 將盡力協助您服務至商品完善，您可放心選購。</p>\n<p>※ 商品交期：HOMEE 提供平台讓您使用合宜價錢直接向供應廠採購因此交期會因工廠有無現貨而有異動，有現貨約 1 週配送，無現貨需等約 2~4 週。 </p>",
                    "title": "商品介紹"
                }],
                "price": "9960",
                "marginL": "10px",
                "marginR": "10px",
                "sale_price": "13500",
                "preview_image": "",
                "attribute_list": [{
                    "attribute_key": "定制款式",
                    "display_order": 1,
                    "attribute_values": [{"value": "棉布款", "display_order": 1, "selected": true}, {
                        "value": "百頁款",
                        "display_order": 2
                    }]
                }],
                "name": "OLVAN 檯燈",
                "productData": {
                    "attribute_list": [{
                        "attribute_key": "定制款式",
                        "display_order": 1,
                        "attribute_values": [{
                            "value": "棉布款",
                            "display_order": 1,
                            "selected": true
                        }, {"value": "百頁款", "display_order": 2}]
                    }],
                    "product_detail": {
                        "id": 8129130922284,
                        "name": "OLVAN 檯燈",
                        "handle": "olvan-檯燈",
                        "images": ["https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44609065.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471483.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471451.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471499.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471468.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471467.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44471477.jpg?v=1675167898&width=720", "https://cdn.shopify.com/s/files/1/0704/0158/9548/products/44609066.jpg?v=1675167898&width=720"],
                        "created_time": 1675166918000,
                        "updated_time": 1675175826000,
                        "bodyHtml": "<p>OLVAN 檯燈外形簡約優雅，能為您的睡房添加充滿格調，同時具有極佳質感的照明單品。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842090_1024x1024.jpg?v=1675167211\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈底座採用實木材料，具有優良出色的穩固承重力，整體厚實穩固。棉布或百頁材質燈罩讓燈光更柔和，輕鬆營造朦朧浪漫的氛圍，為你快節奏的生活中帶來一些平靜和溫柔，別有一番浪漫情懷。</p>\n<div style=\"text-align: center;\" data-mce-style=\"text-align: center;\"><img style=\"margin-bottom: 14px; float: none;\" alt=\"\" src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-src=\"https://cdn.shopify.com/s/files/1/0704/0158/9548/files/8842091_1024x1024.jpg?v=1675167329\" data-mce-style=\"margin-bottom: 14px; float: none;\"></div>\n<p>OLVAN 檯燈有多重款式任你選擇，很適合自用或作為禮品送給親友。HOMEE 成就每一個明亮溫馨的家，與您一同構建理想中的質感生活！</p>\n<p> </p>\n<p> </p>\n<h4>商品規格</h4>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>直徑</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>棉布款：26 公分，百頁：24 公分</p>\n</td>\n</tr>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p><strong>寬</strong></p>\n</td>\n<td style=\"width: 70%;\" data-mce-style=\"width: 70%;\">\n<p>32 公分</p>\n</td>\n</tr>\n</tbody>\n</table>\n<br>\n<table width=\"100%\">\n<tbody>\n<tr>\n<td style=\"width: 30%; text-align: center; background-color: #efefef;\" data-mce-style=\"width: 30%; text-align: center; background-color: #efefef;\">\n<p data-mce-style=\"text-align: left;\"><strong>材質說明</strong></p>\n</td>\n<td data-mce-style=\"width: 70%;\">\n<p>底座：原木，燈罩：棉布 / PVC</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p> </p>\n<p> </p>\n<h4>相關說明</h4>\n<p>※ 訂購前敬請詳閱<a href=\"https://homee.cc/legal/refund-policy\" target=\"_blank\">退換貨說明</a>，您送出訂單的同時將視同您已詳閱、同意以下規定。</p>\n<p>※ 顏色差異：商品顏色或布料會因您觀看的裝置 (手機、平板或電腦等) 而無法100%相同，商品顏色與布料以實品為主。</p>\n<p>※ 尺寸誤差：所有產品尺寸皆為人工丈量，可能因測量不同而存在誤差，0.5 - 2 公分 屬正常。</p>\n<p>※ 溫馨提醒：家具類商品長途運輸難免有碰撞風險，HOMEE 將盡力協助您服務至商品完善，您可放心選購。</p>\n<p>※ 商品交期：HOMEE 提供平台讓您使用合宜價錢直接向供應廠採購因此交期會因工廠有無現貨而有異動，有現貨約 1 週配送，無現貨需等約 2~4 週。 </p>"
                    },
                    "sku_list": {
                        "棉布款": {
                            "sku_id": "G010025-1",
                            "attribute_key": "棉布款",
                            "attribute_value": "棉布款",
                            "attribute_list": ["棉布款", null, null],
                            "isEnabled": true,
                            "sale_price": 519,
                            "price": 519,
                            "image_index": 0
                        },
                        "百頁款": {
                            "sku_id": "G010025-2",
                            "attribute_key": "百頁款",
                            "attribute_value": "百頁款",
                            "attribute_list": ["百頁款", null, null],
                            "isEnabled": true,
                            "sale_price": 519,
                            "price": 519,
                            "image_index": 7
                        }
                    }
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                let bottomInset = 0;
                gvc.addStyle(`
                    .productTitleRow{
                        margin-top:16px;
                    }
                    .productTitle{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        color: #292929;
                    }
                    .productPriceRow .sale_price{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 20px;
                        color: #FD6A58;
                    }
                    .productPriceRow .price{
                        font-family: 'Noto Sans TC';
                        font-weight: 400;
                        font-size: 15px;
                        font-size: 20px;
                        color: #858585;
                        text-decoration-line: line-through;
                        
                        margin-left:40px;
                        padding-top:6px;
                    }
                    .productQTYRow .qtyBar{
                        width:40px;
                        height:2px;
                        background:#1E1E1E;
                    }
                    .productQTYRow .qtyNumber{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        margin:0 16px;
                        color: #292929;
                    }
                    .kindUnselected{                                        
                        border: 1px solid #D6D6D6;
                        border-radius: 5px;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 14px;
                        color: #292929;
                        margin-right : 8px;
                        padding: 4px 12px 3px;
                    }
                    .kindSelected{                                        
                        background: rgba(41, 41, 41, 0.1);                                                                                
                        border: 1px solid #292929;
                        border-radius: 5px;
        
                    }
                    .kindArray{
                        margin-top : 8px;
                        margin-bottom: 20px;
                    }
                    .sizeSelectTitle{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 15px;
                        color: #292929;
                    }
                `)
                function addThousandSeparator(numStr: string): string {
                    const num = Number(numStr);
                    return num.toLocaleString();
                }
                function goToSlide(index: number): void {
                    const Swiper = (window as any).Swiper
                    let mySwiper = new Swiper('.swiper', {
                        // 選項設置
                    });

                    mySwiper.slideTo(index+1);

                    // 取消原本 active 的樣式
                    const oldActiveEl = document.querySelector('.swiper-pagination .swiper-pagination-bullet-active');
                    if (oldActiveEl) {
                        oldActiveEl.classList.remove('swiper-pagination-bullet-active');
                    }

                    // 給目前的 index 加上 active 的樣式
                    const newActiveEl = document.querySelectorAll('.swiper-pagination .swiper-pagination-bullet')[index];
                    if (newActiveEl) {
                        newActiveEl.classList.add('swiper-pagination-bullet-active');
                    }
                }

                return {
                    view: () => {

                        let posterID = gvc.parameter.pageConfig?.obj.data?.poster_id || undefined;
                        if(widget.data.loading){
                            return  `
                            
                            <div class="w-100">
                                <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                    <div class="spinner-border" role="status"></div>
                                </div>
                            </div>`
                        }
                        let sku_list = (widget.data.productData && widget.data.productData.sku_list) ?? {}
                        let key: string[] = [];
                        let btnChange = false;
                        const sel:any=Object.values(sku_list).find((dd:any)=>{
                            return dd.sku_id===glitter.getUrlParameter("reselect")
                        })
                        console.log(`widget.data.attribute_list===${glitter.getUrlParameter("reselect")}---${JSON.stringify(sel)}`)
                        widget.data.attribute_list?.map((dd: any) => {
                            const select = dd.attribute_values.find((d2: any) => {
                                if(!widget.data.orgSelectSku&&glitter.getUrlParameter("reselect")!="false" && sel){
                                    d2.selected=sel.attribute_key.indexOf(d2.value)!==-1
                                }
                                return d2.selected
                            })
                            select && key.push(select.value)
                        })
                        const selectSku = sku_list[key.join(' / ')]


                        if (!widget.data.orgSelectSku&&glitter.getUrlParameter("reselect")!="false" && sel){
                            widget.data.orgSelectSku = selectSku;
                        }
                        console.log(JSON.stringify(selectSku))
                        setTimeout(()=>{
                            goToSlide(selectSku.image_index);
                        },250)
                        return `       
                           ${gvc.bindView({
                            bind: 'productTitle',
                            view: () => {
                                return `  <div class="productTitle" style="white-space:normal;word-wrap:break-word;word-break:break-all;">${widget.data.name}</div>
                            <div class="d-flex productPriceRow" style="">
                                <div class="sale_price">NT$ ${addThousandSeparator(selectSku.sale_price)}</div>
                                <div class="price ${selectSku && (selectSku.sale_price === selectSku.price) ? 'd-none' : ''}">NT$ ${addThousandSeparator(selectSku.price)}</div>
                            </div>`
                            },
                            divCreate: {class: `productTitleRow d-flex flex-column` , style:`padding:0 24px`}
                        })}   
                        
                        <div class="productQTYRow d-flex align-items-center justify-content-between " style="padding:0 24px; margin-top: 34px;margin-bottom: 26px;">
                            <div class="qtyBar" style="width: 40px;"></div>                            
                        </div>
                        
                        ${gvc.bindView({
                            bind: "sizeSelect",
                            view: () => {
                                function productKindDom(index: number, sizeType: any) {
                                    return `
                                        ${gvc.bindView({
                                        bind: `type${index}`,
                                        view: () => {
                                            
                                            return `
                                                <div class="sizeSelectTitle">
                                                    ${sizeType.attribute_key}
                                                </div>

                                                <div class="d-flex flex-wrap" style="overflow: scroll;padding: 8px;">
                                                    ${gvc.map(sizeType.attribute_values.map((data: any, index: number) => {
                                                let className = "kindUnselected"
                                                if (data.selected) {
                                                    className += " kindSelected"
                                                }
                                                return `
                                                    <div class="${className}" style="margin-top: 8px;" onclick="${gvc.event(() => {
                                                        sizeType.attribute_values.map((dd: any) => {
                                                            dd.selected = false
                                                        })
                                                        data.selected = true
                                                        
                                                        
                                                        
                                                        widget.refreshComponent()
                                                    })}">${data.value}
                                                    </div>
                                                        `
                                            }))}
                                                </div>      
                                                `
                                        }, divCreate: {class: ``, style: `margin-bottom:8px;`},
                                    })}
                                        
                                    `
                                }
                                //todo 確認一下會不會有只有單規格的狀況
                                return gvc.map(widget.data.attribute_list.map((sizeType: any, index: number) => {
                                    if (sizeType.attribute_key != "Title"){
                                        return productKindDom(index, sizeType);
                                    }else
                                        return ``

                                }))

                            }, divCreate: {class: ``, style: "padding:0 24px 32px;"},

                        })}
                        ${gvc.bindView({
                            bind:"BTN",
                            view:()=>{
                                
                                if(!selectSku["t3dModel"]){
                                    return  ``
                                }
                               if(glitter.getUrlParameter('reselect')=="false"){
                                   return  `
                                   <div class="w-100 d-flex  flex-fill " style="padding: 0 59px;height: 48px;">
                                        <div class="d-flex align-items-center justify-content-center flex-fill" style="background: #FE5541;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;color: #FFFFFF;" onclick="${gvc.event(()=>{
                                       glitter.runJsInterFace("addToSpace",selectSku,()=>{})
                                   })}">加入空間</div>                                        
                                    </div>
                                   `
                               }else{
                                   if (widget.data.orgSelectSku!= selectSku){
                                       return `
                                    <div class="w-100 d-flex  flex-fill " style="padding: 0 59px;height: 48px;">
                                        <div class="d-flex align-items-center justify-content-center flex-fill" style="background: #FE5541;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;color: #FFFFFF;" onclick="${gvc.event(()=>{
                                           glitter.runJsInterFace("addToSpace",selectSku,()=>{

                                           })
                                       })}">更換規格</div>                                        
                                    </div>
                                `
                                   }else {
                                       return `
                                    <div class="w-100 d-flex  flex-fill " style="padding: 0 59px;height: 48px;">
                                        <div class="d-flex align-items-center justify-content-center flex-fill" style="background: #E0E0E0;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;color: #858585;" onclick="${gvc.event(()=>{
                                       })}">已加入至空間</div>                                        
                                    </div>
                                `
                                   } 
                               }
                                
                            },
                            divCreate:{}
                        })}
            
                        ${gvc.bindView({
                            bind: `intro`,
                            view: () => {
                                gvc.addStyle(`
                                    .intro{
                                        padding-bottom : 90px;
                                    }
                                    .intro img{
                                      max-width:100%;
                                    }
                                    .introTitle{
                                        font-family : 'Noto Sans TC';
                                        font-style : normal;
                                        font-weight : 700;
                                        font-size : 24px;
                                        color : #292929;
                                        margin-bottom : 16px;
                                    }
                                    .introText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        color: #292929;
                                        white-space:normal;
                                        word-wrap:break-word;
                                        word-break:break-all;        
                                                                       
                                    }
                                    
                                `)
                                return `
                                    ${gvc.map(widget.data.intro.map((intro: any) => {
                                    return `
                                            <div class="">
                                                <div class="introTitle">${intro.title}</div>
                                                <div class="introText">${intro.text}</div>
                                            </div>
                                        `
                                }))}
                                `
                            }, divCreate: {class: `productIntroText`, style: `padding:40px 24px 100px;`},
                            onCreate : ()=>{
                                let intro = document.querySelector('.productIntroText');
                                let links  = intro!.querySelectorAll('a');
                                links.forEach(link => {
                                    link.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        gvc.glitter.runJsInterFace("openWeb", {
                                            url: link.href
                                        }, (data) => {
                                        }, {
                                            webFunction(data: any, callback: (data: any) => void): any {
                                                gvc.glitter.openNewTab(link.href)
                                                // gvc.glitter.location.href=object.link
                                            }
                                        })
                                    });
                                });
                            }
                        })}
                        
                      
                    `
                    },
                    editor: () => {
                        return ``
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
})
ClickEvent.create(import.meta.url,{
    mySpaceSetHome: {
        title: "首頁設定",
        fun: (gvc, widget, object: { selectPage: { tag?: string, name?: string } }) => {
            return {
                editor: () => {
                    const vm: {
                        loading: boolean,
                        data: { name: string, tag: string }[]
                    } = {
                        loading: true,
                        data: []
                    }
                    const id = gvc.glitter.getUUID()
                    const api = new Api()
                    object.selectPage = object.selectPage ?? {}
                    api.homeeAJAX({
                        api: Api.serverURL,
                        route: '/api/v1/lowCode/pageConfig?query=tag,`group`,name',
                        method: 'get'
                    }, (res) => {
                        vm.data = res.result
                        vm.loading = false
                        gvc.notifyDataChange(id)
                    })
                    return `
<h3 class="m-0 mb-2 mt-2" style="font-size: 16px;">選擇頁面</h3>
${
                        gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<option value='${JSON.stringify(object.selectPage)}'>${object.selectPage.name ?? "尚未選擇"}</option>`
                                    }
                                    let haveData = false
                                    return gvc.map(vm.data.map((dd) => {
                                        haveData = haveData || object.selectPage.tag === dd.tag
                                        return `<option value='${JSON.stringify(dd)}' ${(object.selectPage.tag === dd.tag) ? `selected` : ``}>${dd.name}</option>`
                                    })) + ((haveData) ? `` : `<option selected>尚未定義</option>`)
                                },
                                divCreate: {
                                    class: `form-control`, elem: `select`, option: [
                                        {
                                            key: 'onChange',
                                            value: gvc.event((e, event) => {
                                                object.selectPage = JSON.parse(e.value)
                                                widget.refreshAll()
                                            })
                                        }
                                    ]
                                }
                            }
                        })
                    }
`
                },
                event: () => {
                    appConfig().setHome(gvc, object.selectPage.tag!)
                }
            }
        }
    },
    }
)
