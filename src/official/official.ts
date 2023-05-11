'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {appConfig} from "../config.js";
Plugin.create(import.meta.url,(glitter)=>{
    function escape (text: string){
        return text.replace(/&/g, '&').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "'");
    }
    return {
        container: {
            defaultData:{
                setting:[]
            },
            render:(gvc, widget, setting, hoverID) => {

                widget.data.setting = widget.data.setting ?? []
                const htmlGenerate = new glitter.htmlGenerate(widget.data.setting,hoverID);
                return {
                    view: ()=>{
                        return htmlGenerate.render(gvc, {class:`m-0 ${widget.data.layout} ${widget.data.alignItems} ${widget.data.justifyContent} ${widget.data.class}`,style:`${widget.data.style}`})
                    },
                    editor: (() => {
                        return gvc.map([
                            `<div class="my-2"></div>
                            <span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">排版方式</span>
                            <select class="form-select mt-2" onchange="${gvc.event((e:any) => {
                                widget.data.layout=e.value
                                widget.refreshAll!()
                            })}" >
                                ${(() => {
                                    const data = [
                                        {tit: "d-block", value: `d-block`},
                                        {tit: "d-inline-block", value: `d-inline-block`},
                                        {tit: "d-inline-flex", value: `d-inline-flex`},
                                        {tit: "d-flex", value: `d-flex`},
                                        {tit: "row", value: `row`},
                                        {tit:"瀑布流" , value: `waterfall`}
                                    ]
    
                                    return gvc.map(data.map((it) => {
                                        return `<option value="${it.value}" ${(widget.data.layout === it.value) ? `selected`:``} >${it.tit}</option>`
                                    }))
                                })()}
                            </select>
                            ${(()=>{
                                if (widget.data.layout == "d-flex"){
                                    return `                                    
                                        <span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">垂直對齊</span>
                                        <select class="form-select mt-2 " onchange="${gvc.event((e:any) => {
                                            widget.data.alignItems=e.value
                                            widget.refreshAll!()
                                        })}" >
                                        ${(() => {
                                            const data = [
                                                {tit: "無", value: ``},
                                                {tit: "對齊最上方", value: `align-items-start`},
                                                {tit: "對齊最下方", value: `align-items-end`},
                                                {tit: "對齊中間", value: `align-items-center`},
                                                {tit: "元素的基線置中對齊", value: `align-items-baseline`},
                                                {tit: "元件拉伸填滿高度並對齊", value: `align-items-stretch`},
                                            ]
    
                                            return gvc.map(data.map((it) => {
                                                return `<option value="${it.value}" ${(widget.data.alignItems === it.value) ? `selected`:``} >${it.tit}</option>`
                                            }))
                                        })()}
                                        </select>
                                    
                                    `
                                }
                                return ``
                            })()}
                            ${(()=>{
                                if (widget.data.layout == "d-flex"){
                                    return `
                                        <span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">水平對齊</span>
                                        <select class="form-select mt-2 " onchange="${gvc.event((e:any) => {
                                            widget.data.justifyContent=e.value
                                            widget.refreshAll!()
                                        })}" >
                                        ${(() => {
                                        const data = [
                                            {tit: "無", value: ``},
                                            {tit: "水平置左", value: `justify-content-start`},
                                            {tit: "水平置右", value: `justify-content-end`},
                                            {tit: "水平置中", value: `justify-content-center`},
                                            {tit: "水平平均分布不留左右", value: `justify-content-between`},
                                            {tit: "水平平均分布留左右", value: `justify-content-around`},
                                            {tit: "水平和左右接平均分布", value: `justify-content-evenly`},
                                        ]

                                        return gvc.map(data.map((it) => {
                                            return `<option value="${it.value}" ${(widget.data.justifyContent === it.value) ? `selected`:``} >${it.tit}</option>`
                                        }))
                                    })()}
                                        </select>
                                    
                                    `
                                }
                                return ``
                            })()}
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                                widget.data.class=e.value
                                widget.refreshAll!()
                            })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                                widget.data.style=e.value
                                widget.refreshAll!()
                            })}">
`, (() => {
                                if (widget.data.setting.length > 0) {
                                    return htmlGenerate.editor(gvc, {
                                        return_: true,
                                        refreshAll: widget.refreshAll!
                                    })
                                } else {
                                    return ``
                                }
                            })()
                        ])

                    })
                }
            }
        },
        productWaterfallContainer:{
            defaultData:{
                setting:[],
                data:[],
                product:[]
            },
            render:(gvc, widget, setting, hoverID) => {

                widget.data.setting = widget.data.setting ?? []
                let viewModel = {
                    loading:false,
                    product:[],
                }
                return {
                    view: ()=>{

                        return `${gvc.bindView({
                            bind: "cardGroup",
                            view: () => {
                                console.log("資料")
                                console.log(widget.data.product)
                                if (viewModel.loading) {
                                    let returnHTML = `
                                        <div class="w-100">
                                            <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                                <div class="spinner-border" role="status"></div>
                                            </div>
                                        </div>`;
                                    return returnHTML
                                } else {
                                    return new glitter.htmlGenerate([
                                        {
                                            "id": "s4sas4s0sesbs6s3-sasds2se-4s3scs6-s8s8s1sa-s3sascs6s6s0sds5s3sfs0s7",
                                            "js": "$homee/official/official.js",
                                            "data": {
                                                "style": "",
                                                "layout": "",
                                                "marginB": "0px",
                                                "marginL": "0px",
                                                "marginR": "0px",
                                                "setting": widget.data.product.map((modelData:any,index:number)=>{
                                                    let dd = modelData?.data;
                                                    if (dd){
                                                        return {
                                                            "js": "$homee/homee/homee_home.js",
                                                            "data": {
                                                                "data": {
                                                                    "id": dd.id,
                                                                    "name": dd.name,
                                                                    "price": dd.price,
                                                                    "images":dd.images,
                                                                    "quantity": dd?.quantity ?? 1,
                                                                    "sale_price": dd.sale_price,
                                                                    "preview_image": dd.preview_image,
                                                                    "showUp":dd.showUp

                                                                },
                                                                "style": "",

                                                                "paddingL": "",
                                                                "paddingR": "",
                                                                "clickEvent": {
                                                                    "src": "$homee/homee/event.js",
                                                                    "route": "toProductDetail"
                                                                }
                                                            },

                                                            "type": "productItem",
                                                            "label": "商品",
                                                            "route": "homee_home",
                                                            "style": "width:100%",
                                                            "class" : "d-flex ",
                                                            "expandStyle": false,
                                                            "refreshAllParameter": {},
                                                            "refreshComponentParameter": {}
                                                        }
                                                    }else{
                                                        return ``;
                                                    }
                                                        
                                                }),
                                                "class": "productCardParent",
                                                "paddingB": "",
                                                "paddingL": "",
                                                "paddingR": ""
                                            },
                                            "type": "container",
                                            "label": "元件容器",
                                            "route": "Glitter",
                                            "style": ""
                                        }
                                    ], []).render(gvc)

                                }

                            },
                            divCreate: {style: ``, class: ``},
                            onCreate : ()=>{

                                setTimeout(()=>{
                                    let element = window.document?.querySelector('.productCardParent') ?? "";

                                    if (element){
                                        element = element as HTMLElement
                                        if (!(document.querySelector(".colum-left"))){
                                            element.innerHTML = `<div class="colum-left w-50" style="padding-right:8px;"></div>`+`<div class="colum-right w-50" style="padding-right:8px;"></div>`+ element.innerHTML
                                            let leftElement = (document.querySelector(".colum-left")) as HTMLElement;
                                            let rightElement = (document.querySelector(".colum-right")) as HTMLElement;
                                            // leftElement.innerHTML += element.innerHTML;
                                            while (element.children.length > 2){
                                                
                                                if (leftElement.getBoundingClientRect().height <= rightElement.getBoundingClientRect().height){
                                                    leftElement.appendChild(element.children[2]) ;
                                                }else {
                                                    rightElement.appendChild(element.children[2]) ;
                                                }
                                            }

                                            element.classList.add("d-flex");

                                        }


                                    }
                                },100)


                            }
                        })}`
                    },
                    editor: (() => {
                        return gvc.map([
                            `
                            ${(()=>{
                                let returnHTML = ``;
                                for (let i = 0 ; i < widget.data.product?.length ; i++){
                                    returnHTML += ClickEvent.editer(gvc, widget, widget.data.product[i], {
                                        option: ['toProductDetail'],
                                        hover: true
                                    })
                                }
                                return returnHTML
                            })()}
                            `,

                            `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    widget.data.product.push({});
                                    
                                    widget.refreshAll();
                                })
                            }">添加商品</div>`
                        ])


                    })
                }
            }
        },
        image:{
            defaultData:{},
            render:(gvc, widget, setting, hoverID)=>{
                widget.data.clickEvent=widget.data.clickEvent ?? {}
                return {
                    view:()=>{
                        return ` <img class="w-100 ${widget.data.layout} ${widget.data.class}" style="${widget.data.style}" src="${widget.data.link ?? `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`}"
                        onclick="${gvc.event(()=>{
                            ClickEvent.trigger({
                                gvc,
                                widget,
                                clickEvent:widget.data.clickEvent
                            })
                        })}">`
                    },
                    editor:()=>{
                        return `
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.class=e.value
                            widget.refreshAll!()
                        })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.style=e.value
                            widget.refreshAll!()
                        })}">
<div class="mt-2"></div>
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
<div class="d-flex align-items-center mb-3">
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.link}">
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                            glitter.ut.chooseMediaCallback({
                                single:true,
                                accept:'image/*',
                                callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                    appConfig().uploadImage(data[0].file,(link:string)=>{
                                        widget.data.link=link;
                                        widget.refreshAll!()
                                    })
                                }
                            })
                        })}"></i>
</div>
${ClickEvent.editer(gvc,widget,widget.data.clickEvent)}
                `
                    }
                }
            }
        },
        imageTitle:{
            defaultData:{
                title:"",
            },
            render:(gvc, widget, setting, hoverID)=>{
                widget.data.clickEvent=widget.data.clickEvent ?? {}
                return {
                    view:()=>{
                        return `
                        <div class="w-100 h-100" style="position: relative">
                            <img class="w-100 ${widget.data.layout} ${widget.data.class}" style="${widget.data.style}" src="${widget.data.link ?? `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`}"
                                onclick="${gvc.event(()=>{
                                    ClickEvent.trigger({
                                        gvc,
                                        widget,
                                        clickEvent:widget.data.clickEvent
                                    })
                                })}">
                            <div style="position: absolute;left: 12px;top: 8px;${widget.data.testStyle??''}">${widget.data.title??""}</div>
                        </div> 
                        `
                    },
                    editor:()=>{
                        return `
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.class=e.value
                            widget.refreshAll!()
                        })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.style=e.value
                            widget.refreshAll!()
                        })}">
<div class="mt-2"></div>
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">標題文字</span>
<input class="form-control" placeholder="請輸入標題文字" value="${widget.data.title ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.title=e.value
                            widget.refreshAll!()
                        })}">
<div class="mt-2"></div>
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">字體Style</span>
<input class="form-control" value="${widget.data.testStyle ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.testStyle=e.value
                            widget.refreshAll!()
                        })}">
<div class="mt-2"></div>
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
<div class="d-flex align-items-center mb-3">
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.link}">
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                            glitter.ut.chooseMediaCallback({
                                single:true,
                                accept:'image/*',
                                callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                    appConfig().uploadImage(data[0].file,(link:string)=>{
                                        widget.data.link=link;
                                        widget.refreshAll!()
                                    })
                                }
                            })
                        })}"></i>
</div>
${ClickEvent.editer(gvc,widget,widget.data.clickEvent)}
                `
                    }
                }
            }
        },
        label:{
            defaultData:{},
            render:(gvc, widget, setting, hoverID)=>{
                return {
                    view:()=>{
                        return `<h3 style="${widget.data.style ?? ""}" class="${widget.data.class ?? ""}">${widget.label}</h3>`
                    },
                    editor:()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc, title: "Class", default: widget.data.class, placeHolder: "請輸入Class", callback: (text:string) => {
                                    widget.data.class=text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeText({
                                gvc: gvc, title: "Style", default: widget.data.style , placeHolder: "請輸入標題Style", callback: (text:string) => {
                                    widget.data.style=text
                                    widget.refreshAll()
                                }
                            })
                        ])
                    }
                }
            }
        },
        containerV2: {
            defaultData:{
                setting:[]
            },
            render:(gvc, widget, setting, hoverID) => {

                widget.data.setting = widget.data.setting ?? []
                const htmlGenerate = new glitter.htmlGenerate(widget.data.setting,hoverID);
                return {
                    view: ()=>{
                        return htmlGenerate.render(gvc, {class:`m-0 ${widget.data.layout} ${widget.data.class}`,style:`${widget.data.style}`})
                    },
                    editor: (() => {
                        return gvc.map([
                            `<div class="my-2"></div>
<span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">排版方式</span>
<select class="form-select mt-2" onchange="${gvc.event((e:any) => {
                                widget.data.layout=e.value
                                widget.refreshAll!()
                            })}" >
${(() => {
                                const data = [
                                    {tit: "d-block", value: `d-block`},
                                    {tit: "d-inline-block", value: `d-inline-block`},
                                    {tit: "d-inline-flex", value: `d-inline-flex`},
                                    {tit: "d-flex", value: `d-flex`},
                                    {tit: "row", value: `row`},
                                ]

                                return gvc.map(data.map((it) => {
                                    return `<option value="${it.value}" ${(widget.data.layout === it.value) ? `selected`:``} >${it.tit}</option>`
                                }))
                            })()}
</select>
<span class=" w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                                widget.data.class=e.value
                                widget.refreshAll!()
                            })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                                widget.data.style=e.value
                                widget.refreshAll!()
                            })}">
`, (() => {
                                if (widget.data.setting.length > 0) {
                                    return htmlGenerate.editor(gvc, {
                                        return_: true,
                                        refreshAll: widget.refreshAll!
                                    })
                                } else {
                                    return ``
                                }
                            })()
                        ])

                    })
                }
            }
        },
    }
});



