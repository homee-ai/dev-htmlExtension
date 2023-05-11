'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { SharedView } from "../homee/shareView.js";
import { Api } from "../homee/api/homee-api.js";
Plugin.create(import.meta.url, (glitter) => {
    return {
        allPage: {
            defaultData: {
                searchDefault: "大家都在搜尋:沙發"
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        const sharedView = new SharedView(gvc);
                        const api = new Api();
                        let clock = 0;
                        let vm = {
                            loading: false,
                            data: []
                        };
                        return gvc.map([
                            sharedView.navigationBar({
                                title: ``,
                                leftIcon: `
<img class="" src="${new URL('../img/component/left-arrow.svg', import.meta.url).href}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                    gvc.glitter.goBack();
                                })}">
 <input class="form-control flex-fill" style="
border-radius: 20px;
font-family: 'Noto Sans TC';
padding-left: 30px;
font-style: normal;
font-weight: 400;
background: url(https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061987473) no-repeat scroll 7px 7px,rgba(41, 41, 41, 0.1);;
background-size: 20px;
font-size: 14px;
line-height: 150%;
color: #858585;
width: calc(100vw - 80px);
" 
placeholder="大家都在搜尋:沙發" oninput="${gvc.event((e) => {
                                    clearInterval(clock);
                                    clock = setTimeout(() => {
                                        vm.loading = true;
                                        gvc.notifyDataChange('search');
                                        api.homeeAJAX({
                                            api: Api.serverURL,
                                            route: '/api/v1/product?product_name=' + e.value,
                                            method: 'get'
                                        }, (res) => {
                                            vm.data = res.product_list;
                                            vm.loading = false;
                                            gvc.notifyDataChange('search');
                                        });
                                    }, 1000);
                                })}">
`,
                                rightIcon: ``
                            }),
                            gvc.bindView({
                                bind: 'search',
                                view: () => {
                                    return `<div class="w-100" style="padding-top: 40px;padding-bottom: 60px;">
${(vm.loading) ? `
<div class="w-100 d-flex align-items-center justify-content-center">
<div class="spinner-border text-black mx-auto"></div>
</div>
` : ``}
${new glitter.htmlGenerate([{
                                            "id": "s4sas4s0sesbs6s3-sasds2se-4s3scs6-s8s8s1sa-s3sascs6s6s0sds5s3sfs0s7",
                                            "js": `$homee/official/official.js`,
                                            "data": {
                                                "class": "m-0 p-0 flex-wrap justify-content-around",
                                                "style": "gap:10px;",
                                                "layout": "d-flex",
                                                "marginB": "86px",
                                                "marginL": "12px",
                                                "marginR": "12px",
                                                "setting": vm.data.map((dd) => {
                                                    return {
                                                        "id": "sbs7s7ses9sas3s8-s0s4s0s6-4scsbs8-sbs5s6s8-s7s0scs7s5s0s6s3s4s5sese",
                                                        "js": `$homee/homee/homee_home.js`,
                                                        "data": {
                                                            "data": dd,
                                                            "clickEvent": {
                                                                "src": `${new URL('../../', import.meta.url).href}/homee/event.js`,
                                                                "route": "toProductDetail"
                                                            }
                                                        },
                                                        "type": "productItem",
                                                        "label": "商品",
                                                        "route": "homee_home",
                                                        "style": "width:calc(50% - 8px);\n\n",
                                                        "expandStyle": false,
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    };
                                                }),
                                                "paddingB": "16px",
                                                "paddingL": "",
                                                "paddingR": ""
                                            },
                                            "type": "container",
                                            "class": "",
                                            "label": "元件容器",
                                            "route": "Glitter",
                                            "style": "",
                                            "expandStyle": false
                                        }], []).render(gvc, { class: ``, style: `` })}
</div>`;
                                },
                                divCreate: {}
                            })
                        ]);
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        }
    };
});
