import {Glitter} from "../Glitter.js";
import {GVC} from "../GVController.js";

export interface HtmlJson {
    clickEvent?:{
        src:string,
        route:string
    },
    rout: string,
    type: string,
    id: string,
    label: string,
    data: any,
    js: string,
    refreshAll: () => void,
    refreshComponent: () => void
}

export class Plugin {
    constructor() {
    }

    public static create(url: string, fun: (
        glitter: Glitter) => {
        [name: string]: {
            defaultData: any, render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[]) => {
                view: ()=>string,
                editor: ()=>string
            }
        }
    }) {
        const glitter = (window as any).glitter
        glitter.share.htmlExtension[url] = fun(glitter)
    }
    public static async  initial(gvc:GVC,set:any[]){
        for (const a of set){
            if(!gvc.glitter.share.htmlExtension[a.js]){
                await new Promise((resolve, reject)=>{
                    gvc.glitter.addMtScript([
                        {src: `${a.js}`,type:'module'}
                    ],()=>{
                        resolve(true)
                    },()=>{
                        resolve(false)
                    })
                })
            }
            if(a.type==='container'){
                await Plugin.initial(gvc,a.data.setting)
            }
        }
        return true
    }
}

function getUrlParameter(url: string, sParam: string): any {
    let sPageURL = url.split("?")[1],
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

