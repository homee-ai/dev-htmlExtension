import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { Api } from './api/homee-api.js';
import { LegacyPage } from "../homee/legacy/interface.js";
ClickEvent.create(import.meta.url, {
    test: {
        title: "測試事件",
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
});
