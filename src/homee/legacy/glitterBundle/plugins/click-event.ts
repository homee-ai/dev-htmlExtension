import {HtmlJson} from "./plugin-creater.js"
import {GVC} from "../GVController.js";

export class ClickEvent {
    public static create(url: string, event: {
        [name: string]: {
            title: string, fun: (gvc: GVC, widget: HtmlJson) => {
                editor: string,
                event: () => void
            }
        }
    }) {
        const glitter = (window as any).glitter
        glitter.share.clickEvent = glitter.share.clickEvent ?? {}
        glitter.share.clickEvent[url] = event
    }

    public static trigger(gvc: GVC, widget: HtmlJson,event:{src:string,route:string}){
        async function run(){
            gvc.glitter.share.clickEvent=gvc.glitter.share.clickEvent ?? {}
            if(!gvc.glitter.share.clickEvent[event.src]){
                await new Promise((resolve, reject)=>{
                    gvc.glitter.addMtScript([
                        {src: `${event.src}`,type:'module'}
                    ],()=>{
                        resolve(true)
                    },()=>{
                        resolve(false)
                    })
                })
            }
            gvc.glitter.share.clickEvent[event.src][event.route].fun(gvc,widget).event()
        }
        run().then()
    }
    public static editer(gvc: GVC, widget: HtmlJson,obj:any) {
        const glitter = gvc.glitter
        return `<div class="">
 <h3 class="" style="font-size: 16px;">點擊事件</h3>
 ${
            gvc.bindView(() => {
                return {
                    bind: ``,
                    view: () => {
                        var select=false
                        return `<select class="form-select" onchange="${gvc.event((e) => {
                            if(e.value==='undefined'){
                                obj.clickEvent=undefined
                            }else{
                                obj.clickEvent = JSON.parse(e.value)
                            }
                            widget.refreshAll()
                        })}">
${gvc.map(Object.keys(glitter.share.clickEvent).map((key) => {
                                const value = glitter.share.clickEvent[key]
                                return gvc.map(Object.keys(value).map((v2) => {
                                    const value2 = value[v2]
                                    const selected=JSON.stringify({
                                        src: key,
                                        route: v2
                                    }) === JSON.stringify(obj.clickEvent)
                                    select=selected||select
                                    return `<option value='${JSON.stringify({
                                        src: key,
                                        route: v2
                                    })}' ${(selected) ? `selected`:``}>${value2.title}</option>`
                                }))
                            }))
                        }
<option value="undefined"  ${(!select) ? `selected`:``}>未定義</option>
</select>`
                    },
                    divCreate: {}
                }
            })
        }
</div> `
    }
}
