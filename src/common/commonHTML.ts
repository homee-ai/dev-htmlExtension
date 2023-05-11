'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'

Plugin.create(import.meta.url,(glitter)=>{
    return {
        banner: {
            defaultData:{
                link:[]
            },
            render:(gvc, widget, setting, hoverID) => {
                const data: { link: { img: string,code?:string }[] } = widget.data

                return {
                    view: ()=>{return ``},
                    editor: ()=>{
                        return ``
                    }
                }
            },
        },

    }
});