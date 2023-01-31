"use strict";
import {Glitter} from './Glitter.js';
import {PageConfig,GVCType} from "./module/PageManager.js";
const $: any = (window as any).$;

class LifeCycle {
    public onResume = function () {
    }
    public onPause = function () {
    }
    public onDestroy = function () {
    }
    public onCreate = function () {
    }
    public onCreateView = function (): string {
        return ""
    }
    public cssInitial = function (): string {
        return ''
    }

    public notifyDataChange() {
        $('body').html(this.onCreateView())
    }

    constructor() {
    }
}

export class GVC {
    public glitter = (window as any).glitter as Glitter

    public parameter: {
        clickMap: any
        pageConfig?: PageConfig,
        bindViewList: any,
        clickID: number,
        styleList: { id: string, style: string }[],
        styleLinks: { id: string, src: string }[],
        jsList: { id: string, src: string }[],
    } = {
        clickMap: {},
        pageConfig: undefined,
        bindViewList: {},
        clickID: 0,
        styleList: [],
        jsList: [],
        styleLinks: [],
    }


    public notifyDataChange(id: any) {
        const gvc = this
        try {
            const refresh = (id: string) => {
                $(`#${gvc.parameter.pageConfig!.id}${id}`).html(gvc.parameter.bindViewList[id].view())
                if (gvc.parameter.bindViewList[id].onCreate) {
                    gvc.parameter.bindViewList[id].onCreate()
                }
            };

            if (typeof id === 'object') {
                id.map(function (id: string) {
                    refresh(id)
                })
            } else {
                refresh(id)
            }
        } catch (e:any) {
            if(gvc.glitter.debugMode){
                console.log(e);
                console.log(e.stack);  // this will work on chrome, FF. will no not work on safari
                console.log(e.line);
            }
        }
    }

    public addObserver(obj: any, callback: () => void, viewBind?: string) {
        const gvc = this
        try {
            if (obj.initial) {
                callback()
            }
            var map = obj.obj
            if (!map.GlitterJsonStringConversionGetData) {
                var tMap = {}
                map.GlitterJsonStringConversionGetData = function () {
                    return tMap
                }
            }
            if (!map.GlitterObServerCallBack) {
                var callba: any = []
                map.GlitterObServerCallBack = function () {
                    return callba
                }
            }
            if (viewBind) {
                if (map.GlitterObServerCallBack().filter(function (it: any) {
                    return it.viewBind === viewBind
                }).length === 0) {
                    map.GlitterObServerCallBack().push({key: obj.key, callback: callback, viewBind: viewBind});
                }
            } else {
                map.GlitterObServerCallBack().push({key: obj.key, callback: callback});
            }
            var keys = Object.keys(map);
            for (var a = 0; a < keys.length; a++) {
                let keyVa = keys[a];
                if (keyVa !== 'GlitterJsonStringConversionGetData' && (keyVa !== 'GlitterObServerCallBack') && (keyVa === obj.key)) {
                    gvc.glitter.deBugMessage("add-" + obj.key)
                    if (!map.GlitterJsonStringConversionGetData()[keyVa]) {
                        map.GlitterJsonStringConversionGetData()[keyVa] = map[keyVa];
                    }
                    Object.defineProperty(map, keyVa, {
                        get: function () {
                            return map.GlitterJsonStringConversionGetData()[keyVa];
                        },

                        set(v) {
                            map.GlitterJsonStringConversionGetData()[keyVa] = v;
                            map.GlitterObServerCallBack().map(function (it: any) {
                                try {
                                    if (it.key === keyVa) {
                                        it.callback({key: it.key, value: v})
                                    }
                                } catch (e: any) {
                                    gvc.glitter.deBugMessage(e)
                                    gvc.glitter.deBugMessage(e.stack)  // this will work on chrome, FF. will no not work on safari
                                    gvc.glitter.deBugMessage(e.line)  // this will work on safari but not on IPhone
                                }
                            });
                        }
                    });
                }
            }
            if (map[obj.key] === undefined) {
                map[obj.key] = ''
                Object.defineProperty(map, obj.key, {
                    get: function () {
                        return map.GlitterJsonStringConversionGetData()[obj.key];
                    },
                    set(v) {
                        map.GlitterJsonStringConversionGetData()[obj.key] = v;
                        map.GlitterObServerCallBack().map(function (it: any) {
                            try {
                                if (it.key === obj.key) {
                                    it.callback({key: it.key, value: v})
                                }
                            } catch (e: any) {
                                gvc.glitter.deBugMessage(e)
                                gvc.glitter.deBugMessage(e.stack)  // this will work on chrome, FF. will no not work on safari
                                gvc.glitter.deBugMessage(e.line)  // this will work on safari but not on IPhone
                            }
                        });
                    }
                });
            }
        } catch (e: any) {
            gvc.glitter.deBugMessage(e)
            gvc.glitter.deBugMessage(e.stack)  // this will work on chrome, FF. will no not work on safari
            gvc.glitter.deBugMessage(e.line)  // this will work on safari but not on IPhone
        }
    }

    public bindView(map: (
        () => { view: () => string, bind: string, divCreate?: { elem?: string, style?: string, class?: string,option?:{key:string,value:string}[] }, dataList?: {obj:any,key:string}[], onCreate?: () => void, initial?: () => void }) |
        { view: () => string, bind: string, divCreate?: { elem?: string, style?: string, class?: string,option?:{key:string,value:string}[]}, dataList?:  {obj:any,key:string}[], onCreate?: () => void, initial?: () => void }): string {
        const gvc = this

        if (typeof map === "function") {
            map = map()
        }

        if (map.dataList) {
            map.dataList.map(function (data) {
                $(`#${gvc.parameter.pageConfig?.id}${map.bind}`).html((map as any).view())
                gvc.addObserver(data, function () {
                    $(`#${gvc.parameter.pageConfig?.id}${map.bind}`).html((map as any).view())
                    if ((map as any).onCreate()) {
                        (map as any).onCreate()
                    }
                })
            })
        }

        gvc.parameter.bindViewList[map.bind] = map
        if (document.getElementById(gvc.parameter.pageConfig?.id + map.bind)) {
            $(`#${gvc.parameter.pageConfig?.id}${map.bind}`).html(map.view())
        }
        if ((map as any).onCreate) {
            var timer = setInterval(function () {
                if (document.getElementById(gvc.parameter.pageConfig!.id + map.bind)) {
                    (map as any).onCreate()
                    clearInterval(timer)
                }
            }, 100)
        }
        if ((map as any).inital) {
            (map as any).inital()
        }
        if ((map as any).divCreate) {
            return `
<${(map as any).divCreate.elem ?? 'div'} id="${gvc.parameter.pageConfig?.id}${map.bind}" class="${(map as any).divCreate.class ?? ""}" style="${(map as any).divCreate.style ?? ""}" 
${gvc.map(((map as any).divCreate.option ?? []).map((dd:any)=>{
                return ` ${dd.key}="${dd.value}"`
            }))}
>${map.view()}</${(map as any).divCreate.elem ?? 'div'}>
`
        } else {
            return map.view()
        }
    }

    public event(fun: (e: any,event:any) => void, noCycle?: string) {
        const gvc = this;
        if (noCycle === undefined) {
            gvc.parameter.clickID++
            gvc.parameter.clickMap[`${gvc.parameter.clickID}`] = {
                fun: fun,
                noCycle: false
            }
            return `clickMap['${gvc.parameter.pageConfig!.id}']['${gvc.parameter.clickID}'].fun(this,event);" data-gs-event-${gvc.parameter.clickID}="event`
        } else {
            gvc.parameter.clickMap[noCycle] = {
                fun: fun,
                noCycle: true
            }
            return `clickMap['${gvc.parameter.pageConfig!.id}']['${noCycle}'].fun(this,event);"  data-gs-event-${noCycle}="event`
        }
    }

    public addStyle(style: string) {
        const gvc = this;
        let sl = {
            id: gvc.glitter.getUUID(),
            style: style
        }
        if (!gvc.parameter.styleList.find((dd) => {
            return dd.style === style
        })) {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = sl.id
            if ((css as any).styleSheet)
                (css as any).styleSheet.cssText = style;
            else
                css.appendChild(document.createTextNode(style));
            /* Append style to the tag name */
            document.getElementsByTagName("head")[0].appendChild(css);
            gvc.parameter.styleList.push(sl)
        }
    }

    public addStyleLink(filePath: string) {
        const gvc = this;
        var head = document.head;
        const id = gvc.glitter.getUUID()
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = filePath;
        link.id = id;
        gvc.parameter.styleLinks.push({
            id: id,
            src: filePath
        })
        head.appendChild(link);
    }

    public addMtScript(urlArray: any[], success: () => void, error: (message: string) => void) {
        const glitter = this.glitter;
        const that = this;
        let index = 0

        function addScript() {
            if (index === urlArray.length) {
                success()
                return
            }
            var scritem: any = urlArray[index]
            scritem.id = glitter.getUUID()
            if (that.parameter.jsList.find((dd: any) => {
                return dd.src === scritem.src
            })) {
                index++
                addScript()
                return;
            }
            (that.parameter.jsList as any).push(scritem)
            let script: any = document.createElement('script');
            try {
                if (script.readyState) {  //IE
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            index++
                            addScript()
                        }
                    }
                } else {
                    //其餘瀏覽器支援onload
                    script.onload = () => {
                        if (success !== undefined) {
                            index++
                            addScript()
                        }
                    }
                }
                if (scritem.type === 'text/babel') {
                    glitter.$('body').append(`<script type="text/babel" src="${scritem.src}"></script>`)
                } else if (scritem.type !== undefined) {
                    script.setAttribute('type', scritem.type);
                    script.setAttribute('src', scritem.src ?? scritem);
                    script.setAttribute('id', scritem.id ?? undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                } else {
                    script.setAttribute('src', scritem.src ?? scritem);
                    script.setAttribute('id', scritem.id ?? undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }

            } catch (e) {
                error(`Add ${urlArray[index]} ERROR!!`);
            }
        }

        addScript()
    }

    public id(id: String) {
        const gvc = this;
        return `${gvc.parameter.pageConfig!.id}${id}`
    }

    public map(array:string[]){
        let html=''
        array.map((d)=>{
            html+=d
        })
        return html
    }
}


export function init(fun: (gvc: GVC,glitter:Glitter, gBundle: any) => {
    onCreateView: () => string,onResume?: () => void, onPause?: () => void, onDestroy?: () => void, onCreate?: () => void, cssInitial?: () => string
}, gt?: Glitter) {
    const glitter: Glitter = (gt) ?? ((window as any).glitter as Glitter)
    const gvc = new GVC();
    gvc.glitter = glitter;
    gvc.parameter.pageConfig = glitter.nowPageConfig
    const pageData = fun(gvc,glitter,glitter.nowPageConfig?.obj)
    if (!glitter.modelJsList.find((data) => {
        return data.src === glitter.nowPageConfig?.src
    })) {
        glitter.modelJsList.push({
            src: glitter.nowPageConfig!.src,
            create: (glitter: Glitter) => {
                init(fun, glitter)
            }
        })
    }
    const lifeCycle: LifeCycle = new LifeCycle()
    lifeCycle.onResume = pageData.onResume ?? lifeCycle.onResume;
    lifeCycle.onPause = pageData.onPause ?? lifeCycle.onPause;
    lifeCycle.onDestroy = pageData.onDestroy ?? lifeCycle.onDestroy;
    lifeCycle.onCreate = pageData.onCreate ?? lifeCycle.onCreate;
    lifeCycle.onCreateView = pageData.onCreateView;
    lifeCycle.cssInitial = pageData.cssInitial ?? lifeCycle.cssInitial
    if ($('.page-loading').length > 0) {
        $('#glitterPage').html('')
        $('.page-loading').remove();
    }
    (window as any).clickMap = (window as any).clickMap ?? {}
    switch (gvc.parameter.pageConfig?.type){
        case GVCType.Dialog:
            $('#glitterPage').append(`<div  id="page${gvc.parameter.pageConfig!.id}" style="width:100vw;height:100vh;
background: transparent;display: none;position: absolute;top: 0;left: 0;z-index: 999999;">
${lifeCycle.onCreateView()}
</div>`)
            glitter.setAnimation(gvc.parameter.pageConfig)
            break
        case GVCType.Page:
            $('#glitterPage').append(`<div id="page${gvc.parameter.pageConfig!.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;
background: ${gvc.parameter.pageConfig!.backGroundColor};display: none;z-index: 999999;">
${lifeCycle.onCreateView()}
</div>`)
            glitter.setAnimation(gvc.parameter.pageConfig)
            break
    }
    (window as any).clickMap[gvc.parameter.pageConfig!.id] = gvc.parameter.clickMap;
    lifeCycle.onCreate();
    gvc.parameter.pageConfig!.createResource = () => {
        (window as any).clickMap[gvc.parameter.pageConfig!.id] = gvc.parameter.clickMap;
        var copyStyleList: { id: string, style: string }[] = JSON.parse(JSON.stringify(gvc.parameter.styleList))
        gvc.parameter.styleList = []
        copyStyleList.map((data) => {
            gvc.addStyle(data.style)
        })
        var copyStyleLink: { id: string, src: string }[] = JSON.parse(JSON.stringify(gvc.parameter.styleLinks))
        gvc.parameter.styleLinks = []
        copyStyleLink.map((data) => {
            gvc.addStyleLink(data.src)
        })
        var copyJsList: { id: string, src: string }[] = JSON.parse(JSON.stringify(gvc.parameter.jsList))
        gvc.addMtScript(copyJsList, () => {
        }, () => {
        })
        lifeCycle.onResume()
    }
    gvc.parameter.pageConfig!.deleteResource = () => {
        (window as any).clickMap[gvc.parameter.pageConfig!.id]=undefined
        lifeCycle.onPause()
        gvc.parameter.styleLinks.map((dd) => {
            $(`#${dd.id}`).remove()
        })
        gvc.parameter.styleList.map((dd) => {
            $(`#${dd.id}`).remove()
        })
        gvc.parameter.jsList.map((dd) => {
            $(`#${dd.id}`).remove()
        })
    }
    glitter.waitChangePage =false

}
