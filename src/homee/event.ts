import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {Api} from './api/homee-api.js';
import {Funnel} from "./funnel.js";
import {appConfig} from "../config.js";
import {User} from "../api/user.js";
import {Dialog} from "../dialog/dialog-mobile.js";
import {Checkout} from "../api/checkout.js";

ClickEvent.create(import.meta.url, {
    link: {
        title: "連結跳轉",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return gvc.glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: "連結跳轉",
                        default: object.link,
                        placeHolder: "輸入跳轉的連結",
                        callback: (text: string) => {
                            object.link = text
                            widget.refreshAll()
                        }
                    })
                },
                event: () => {
                    /**
                     * 網頁直接跳轉連結，如為APP則打開WEBVIEW
                     * */
                    gvc.glitter.runJsInterFace("openWeb", {
                        url: object.link
                    }, (data) => {
                    }, {
                        webFunction(data: any, callback: (data: any) => void): any {
                            gvc.glitter.openNewTab(object.link)
                            // gvc.glitter.location.href=object.link
                        }
                    })

                }
            }
        }
    },
    pageSwitch: {
        title: "頁面跳轉",
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
                    appConfig().changePage(gvc, object.selectPage.tag!)
                }
            }
        }
    },
    pageSwitchNeedLogin: {
        title: "頁面跳轉-需要登入",
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
                    appConfig().getUserData({
                        callback: (userData) => {
                            try {
                                const dialog = new Dialog(gvc)
                                dialog.dataLoading(true)
                                if (userData.token) {
                                    User.checkToken(userData.token, (response) => {
                                        if (response) {
                                            dialog.dataLoading(false)
                                            appConfig().changePage(gvc, object.selectPage.tag!)
                                        } else {
                                            User.login({
                                                account: userData.email,
                                                pwd: userData.pwd,
                                                callback: (response) => {
                                                    dialog.dataLoading(false)
                                                    if (response) {
                                                        appConfig().changePage(gvc, object.selectPage.tag!)
                                                    } else {
                                                        appConfig().setHome(gvc, "login")
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    appConfig().setHome(gvc, "login")
                                }
                            } catch (e) {
                                appConfig().setHome(gvc, "login")
                            }
                        }
                    })
                }
            }
        }
    },
    setHome: {
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
    setHomeNeedLogin: {
        title: "首頁設定-需要登入",
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
                    appConfig().getUserData({
                        callback: (userData) => {
                            try {
                                const dialog = new Dialog(gvc)
                                dialog.dataLoading(true)
                                if (userData.token) {
                                    User.checkToken(userData.token, (response) => {
                                        if (response) {
                                            dialog.dataLoading(false)
                                            appConfig().setHome(gvc, object.selectPage.tag!)
                                        } else {
                                            User.login({
                                                account: userData.email,
                                                pwd: userData.pwd,
                                                callback: (response) => {
                                                    dialog.dataLoading(false)
                                                    if (response) {
                                                        appConfig().setHome(gvc, object.selectPage.tag!)
                                                    } else {
                                                        appConfig().setHome(gvc, "login")
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    appConfig().setHome(gvc, "login")
                                }
                            } catch (e) {
                                appConfig().setHome(gvc, "login")
                            }
                        }
                    })
                }
            }
        }
    },
    category: {
        title: "商品分類",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    const api = new Api()
                    function getInput(object: any) {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            const vm = {
                                loading: true,
                                colOption: ''
                            }

                            function load() {
                                function lo(){
                                    gvc.glitter.share.storeCollection.map((x: { id: number; name: string; group: { id: number; name: string }[] }) => {
                                        vm.colOption += /*html*/ `
                                        <option value='${JSON.stringify({
                                            id: x.id,
                                            name: x.name
                                        })}' ${x.name == object.name ? `selected=""` : ``}>
                                             ${x.name} 
                                        </option>
                                    `;
                                        x.group.map(
                                            (y) =>
                                                (vm.colOption += /*html*/ ` <option
                                                value='${JSON.stringify({
                                                    id: y.id,
                                                    name: y.name
                                                })}'
                                                ${y.name == object.name ? `selected=""` : ``}
                                            >
                                                ${y.name}
                                            </option>`)
                                        );
                                    });
                                    gvc.notifyDataChange(id)
                                }
                                if(gvc.glitter.share.storeCollection){
                                    lo()
                                }
                                api.homeeAJAX({route: '/collection', method: 'get'}, (res) => {
                                    gvc.glitter.share.storeCollection=res
                                    lo()
                                });
                            }

                            load()
                            return {
                                bind: id,
                                view: () => {
                                    return `
                            <select
                                class="form-select flex-fill"
                                onchange="${gvc.event((e) => {
                                        const val = JSON.parse(e.value)
                                        object.value = val.id;
                                        object.name = val.name;
                                        widget.refreshAll()
                                    })}"
                            >
                               ${(vm.colOption === '') ? `<option>${object.name ?? "請稍候..."}</option>` : vm.colOption}
                            </select>

`
                                },
                                divCreate: {class: `flex-fill`}
                            }
                        })
                    }

                    return `
<div class="alert alert-dark mt-2">
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">大分類</h3>
                    ${getInput(object)}
                    <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">跳轉後的子分類首頁</h3>
                    <select
                        class="form-select flex-fill"
                        onchange="${gvc.event((e) => {
                        const val = JSON.parse(e.value)
                        object.selectIndex = val;
                        widget.refreshAll();
                    })}">
                    ${(()=>{
                        let returnHTML = `
                            
                        `;
                        if (object.subCategory){
                            object.subCategory.forEach((data:any , index:number)=>{
                                let select = (index == object.selectIndex)?"selected":""
                                returnHTML += `
                                <option value="${index}" ${select}>${data.appearText??data.name}</option>
                            `
                            })
                        }
                        
                        return returnHTML
                    })()}
                    </select>
                    <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">子分類</h3>
                    
                    ${gvc.map((object.subCategory ?? []).map((dd: any, index: number) => {
                        return `<div class="mb-3 d-flex align-items-center w-100"><i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                            object.subCategory.splice(index, 1);
                            widget.refreshAll();
                        })}"></i>${getInput(dd)}</div>`
                    }))}
                 <div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                        gvc.event(() => {
                            object.subCategory = object.subCategory ?? []
                            object.subCategory.push({})
                            widget.refreshAll()
                        })
                    }">添加子分類</div>   
</div>
                    
                    `
                },
                event: () => {
                    appConfig().changePage(gvc, "sub_category", {
                        title: object.name,
                        object: object,
                        category: "sub_category_id",
                        selectIndex: object?.selectIndex??0
                    })

                }
            }
        }
    },
    toProductDetail: {
        title: "商品詳情",
        fun: (gvc, widget, obj) => {
            const api = new Api()
            return {
                editor: () => {
                    const funnel = new Funnel(gvc)

                    return funnel.optionSreach(
                        {
                            path: Api.serverURL + '/api/v1/product?product_name=',
                            key: 'name',
                            def: (obj.data ?? {}).name ?? "",
                            searchData: "product_list"
                        },
                        (res) => {
                            obj.data = res

                            widget.refreshAll()
                        }
                    )
                },
                event: () => {
                    appConfig().changePage(gvc, "product_show", obj.data)
                }
            }
        }
    },
    goBack: {
        title: "返回上一頁",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    if (gvc.glitter.pageConfig.length <= 1) {
                        appConfig().setHome(gvc, "home", {})
                    } else {
                        gvc.glitter.goBack()
                    }
                }
            }
        }
    },
    engineer: {
        title: "開發中",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    new Dialog(gvc).showInfo("開發中...2/26完成!")
                }
            }
        }
    },
    openMyspace: {
        title: '我的空間',
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    gvc.glitter.runJsInterFace("openMyspace", {}, () => {
                    })
                }
            }
        }
    },
    testMode: {
        title: '測試空間',
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    gvc.glitter.runJsInterFace("testMyspace", {}, () => {
                    })
                }
            }
        }
    },
    cartBadge: {
        title: '購物車數量',
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {

                    gvc.glitter.share.cart=gvc.glitter.share.cart??{}
                    gvc.glitter.share.cart.callback=gvc.glitter.share.cart.callback ?? []
                    function getCount(){
                        let count = 0
                        Checkout.getCart((cartData) => {
                            Object.keys(cartData).map((key) => {
                                Object.values(cartData[key]).map((d2) => {
                                    count += d2.count
                                })
                            })
                            object.callback(count)
                        })
                    }
                    gvc.glitter.share.cart.callback.push((()=>{
                        getCount()
                    }))
                    getCount()
                }
            }
        }
    }
})

