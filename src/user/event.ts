import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {Funnel} from "./funnel.js";

ClickEvent.create(import.meta.url,{
    test:{
        title:"logout",
        fun:(gvc,widget,object)=>{
            return {
                editor:()=>{
                    return `
                
                    `
                },
                event:()=>{


                }
            }
        }
    },
})
