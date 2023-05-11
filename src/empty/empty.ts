'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";



Plugin.create(import.meta.url,(glitter)=>{
    function escape (text: string){
        return text.replace(/&/g, '&').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "'");
    }
    return {
        banner: {
            defaultData:{
                link:[]
            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{
                        return ``
                    },
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },

    }
});