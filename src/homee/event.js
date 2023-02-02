import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { Api } from './api/homee-api.js';
import { LegacyPage } from "./legacy/interface.js";
import { Funnel } from "./funnel.js";
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
                        callback: (text) => {
                            object.link = text;
                            widget.refreshAll();
                        }
                    });
                },
                event: () => {
                    gvc.glitter.runJsInterFace("openWeb", {
                        url: object.link
                    }, (data) => { }, {
                        webFunction(data, callback) {
                            gvc.glitter.openNewTab(object.link);
                        }
                    });
                }
            };
        }
    },
    category: {
        title: "商品分類",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    const api = new Api(gvc);
                    return `
                    <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">選擇分類</h3>
                    ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const vm = {
                            loading: true,
                            colOption: ''
                        };
                        function load() {
                            api.homeeAJAX({ route: '/collection', method: 'get' }, (res) => {
                                res.map((x) => {
                                    vm.colOption += `
                                        <option value='${JSON.stringify({
                                        id: x.id,
                                        name: x.name
                                    })}' ${x.name == object.name ? `selected=""` : ``}>
                                            ===== ${x.name} =====
                                        </option>
                                    `;
                                    x.group.map((y) => (vm.colOption += ` <option
                                                value='${JSON.stringify({
                                        id: y.id,
                                        name: y.name
                                    })}'
                                                ${y.name == object.name ? `selected=""` : ``}
                                            >
                                                ${y.name}
                                            </option>`));
                                });
                                gvc.notifyDataChange(id);
                            });
                        }
                        load();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return `<select
                                class="form-select mb-3 "
                                onchange="${gvc.event((e) => {
                                    const val = JSON.parse(e.value);
                                    object.value = val.id;
                                    object.name = val.name;
                                    widget.refreshAll();
                                })}"
                            >
                               ${(vm.colOption === '') ? `<option>${(_a = object.name) !== null && _a !== void 0 ? _a : "請稍候..."}</option>` : vm.colOption}
                            </select>`;
                            },
                            divCreate: {}
                        };
                    })}
                    `;
                },
                event: () => {
                    LegacyPage.execute(gvc.glitter, () => {
                        gvc.glitter.changePage(LegacyPage.getLink("jsPage/category/subCategory.js"), "subCategory", true, { title: object.name, parent_category_id: object.value, category: "sub_category_id", category_id: object.value, index: 0 });
                    });
                }
            };
        }
    },
    toProductDetail: {
        title: "商品詳情",
        fun: (gvc, widget, obj) => {
            const api = new Api(gvc);
            return {
                editor: () => {
                    var _a, _b;
                    const funnel = new Funnel(gvc);
                    return funnel.optionSreach({
                        path: location.origin + '/api/v1/product?product_name=',
                        key: 'name',
                        def: (_b = ((_a = obj.data) !== null && _a !== void 0 ? _a : {}).name) !== null && _b !== void 0 ? _b : "",
                        searchData: "product_list"
                    }, (res) => {
                        obj.data = res;
                        widget.refreshAll();
                    });
                },
                event: () => {
                    gvc.glitter.runJsInterFace("toProductPage", {
                        id: obj.data.id
                    }, (res) => {
                    }, {
                        webFunction(data, callback) {
                            alert('APP會跳轉至商品ID:' + obj.data.id + "的頁面");
                        }
                    });
                }
            };
        }
    }
});