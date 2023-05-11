import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {appConfig} from "../config.js";
import {Api} from "../homee/api/homee-api.js";

ClickEvent.create(import.meta.url,{
    loginOrRegister:{
        title:'登入事件測試',
        fun:(gvc, widget, object)=>{
            return {
                editor:()=>{
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
                event:()=>{
                    console.log(widget.data)
                    appConfig().changePage(gvc,object.selectPage.tag!)
                }
            }
        }
    }
})