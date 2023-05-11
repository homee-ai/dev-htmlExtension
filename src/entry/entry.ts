'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {appConfig} from "../config.js";
Plugin.create(import.meta.url, (glitter, editMode) => {
    return {
        entry:{
            defaultData: {},
            render: (gvc, widget, setting, hoverID) =>{
                return {
                    view:()=>{

                        //Add javascript interface to bridge native code
                        function addInterface(){
                            glitter.runJsInterFace("getTopInset", {}, (response) => {
                                glitter.share.topInset = (response.data)
                            }, {
                                webFunction: () => {
                                    return {data: 10}
                                }
                            })
                            glitter.runJsInterFace("getBottomInset", {}, (response) => {
                                glitter.share.bottomInset = (response.data)
                            }, {
                                webFunction: () => {
                                    return {data: 10}
                                }
                            })
                            //添加商品
                            glitter.runJsInterFace("addProduct",{},(response)=>{})
                        }

                        //Add app script
                        function addScript(){
                            glitter.addMtScript(['https://kit.fontawesome.com/02e2dc09e3.js'], () => {}, () => {})
                        }
                        //Add app style
                        function addStyle(){
                            glitter.addStyleLink(`glitterBundle/bootstrap.css`)
                            glitter.addStyle(`
        html{
            margin: 0;
            box-sizing: border-box;

        }
         .dot{
            width: 16px;
            height: 16px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 10px;
            line-height: 15px;
            text-align: center;
            background: #FD6A58;
            /* HOMEE white */

            border: 1px solid #FFFFFF;
            border-radius: 50%;
            /* HOMEE white */

            color: #FFFFFF;

        }
        `)
                        }
                        //Set global style
                        function setGlobalStyle(){
                            glitter.defaultSetting.pageAnimation = glitter.animation.rightToLeft
                            glitter.debugMode = false
                        }

                        //changePage
                         function pageConfig() {
                             if(editMode){
                                 glitter.setUrlParameter('page','home')
                             }
                            glitter.share.htmlExtension = {}
                            $.ajax({
                                url: `${appConfig().serverURL}/api/v1/lowCode/pageConfig?tag=${glitter.getUrlParameter('page')}`,
                                type: 'get',
                                contentType: 'application/json; charset=utf-8',
                                success: (suss: any) => {
                                    glitter.htmlGenerate.setHome({
                                        config: suss.result[0].config,
                                        data: (() => {
                                            switch (glitter.getUrlParameter('page')) {
                                                case 'product_show':
                                                    return {
                                                        id: glitter.getUrlParameter('id'),
                                                        name:glitter.getUrlParameter('name')
                                                    }
                                                case 'mysapce_product_show':
                                                    return {
                                                        id: glitter.getUrlParameter('id'),
                                                        name:glitter.getUrlParameter('name')
                                                    }
                                                default:
                                                    return {}
                                            }
                                        })(),
                                        tag: glitter.getUrlParameter('page')
                                    })
                                },
                                error: (err: any) => {
                                    setTimeout(() => {
                                        pageConfig()
                                    }, 1000)
                                },
                            });
                        }
                        addScript()
                        addInterface()
                        addStyle()
                        setGlobalStyle()
                        pageConfig()
                        return ``
                    },
                    editor:()=>{
                        return ``
                    }
                }
            }
        }
    }
})
