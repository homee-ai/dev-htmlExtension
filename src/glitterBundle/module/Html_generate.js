import { Glitter } from '../Glitter.js';
export class HtmlGenerate {
    constructor(setting, hover = []) {
        this.setting = setting;
        const editContainer = Glitter.glitter.getUUID();
        setting.map((dd) => {
            var _a, _b;
            dd.refreshAllParameter = (_a = dd.refreshAllParameter) !== null && _a !== void 0 ? _a : {
                view1: () => {
                }, view2: () => {
                }
            };
            dd.refreshComponentParameter = (_b = dd.refreshComponentParameter) !== null && _b !== void 0 ? _b : {
                view1: () => {
                }, view2: () => {
                }
            };
            dd.refreshAll = () => {
                dd.refreshAllParameter.view1();
                dd.refreshAllParameter.view2();
            };
            dd.refreshComponent = () => {
                dd.refreshComponentParameter.view1();
                dd.refreshComponentParameter.view2();
            };
            return dd;
        });
        this.render = (gvc, option = { class: ``, style: `` }) => {
            var loading = false;
            const container = gvc.glitter.getUUID();
            return gvc.bindView({
                bind: container,
                view: () => {
                    if (loading) {
                        return ``;
                    }
                    else {
                        return gvc.map(setting.map((dd) => {
                            var _a, _b;
                            const component = gvc.glitter.getUUID();
                            dd.refreshAllParameter.view1 = () => {
                                gvc.notifyDataChange(container);
                            };
                            dd.refreshComponentParameter.view1 = () => {
                                gvc.notifyDataChange(component);
                            };
                            return gvc.bindView({
                                bind: component,
                                view: () => {
                                    return `${(() => {
                                        try {
                                            return gvc.glitter.share.htmlExtension[dd.route][dd.type].render(gvc, dd, setting, hover).view;
                                        }
                                        catch (e) {
                                            return `render error`;
                                        }
                                    })()}
                                    `;
                                },
                                divCreate: {
                                    style: `${gvc.map(['paddingT', 'paddingB', 'paddingL', 'paddingR'].map((d2, index) => {
                                        let k = ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'];
                                        return `${k[index]}:${(dd.data[d2] && dd.data[d2] !== '') ? dd.data[d2] : '0'};`;
                                    }))} ${gvc.map(['marginT', 'marginB', 'marginL', 'marginR'].map((d2, index) => {
                                        let k = ['margin-top', 'margin-bottom', 'margin-left', 'margin-right'];
                                        return `${k[index]}:${(dd.data[d2] && dd.data[d2] !== '') ? dd.data[d2] : '0'};`;
                                    }))} ${(_a = dd.style) !== null && _a !== void 0 ? _a : ''} ${(hover.indexOf(dd.id) !== -1) ? `border: 4px solid dodgerblue;border-radius: 5px;box-sizing: border-box;` : ``}`,
                                    class: `position-relative ${(_b = dd.class) !== null && _b !== void 0 ? _b : ''}`
                                }
                            });
                        }));
                    }
                },
                divCreate: { class: option.class, style: option.style },
                onCreate: () => {
                }
            });
        };
        this.editor = (gvc, option = {
            return_: false,
            refreshAll: () => {
            },
            setting: setting,
            deleteEvent: () => { }
        }) => {
            var loading = false;
            const oset = this.setting;
            return gvc.bindView({
                bind: editContainer,
                view: () => {
                    var _a;
                    if (loading) {
                        return ``;
                    }
                    else {
                        return gvc.map(((_a = option.setting) !== null && _a !== void 0 ? _a : setting).map((dd, index) => {
                            try {
                                const component = gvc.glitter.getUUID();
                                dd.refreshAllParameter.view2 = () => {
                                    gvc.notifyDataChange(editContainer);
                                };
                                dd.refreshComponentParameter.view2 = () => {
                                    gvc.notifyDataChange(component);
                                };
                                dd.refreshAll = () => {
                                    dd.refreshAllParameter.view1();
                                    dd.refreshAllParameter.view2();
                                    option.refreshAll();
                                };
                                const toggleView = gvc.glitter.getUUID();
                                const toggleEvent = gvc.event(() => {
                                    dd.expand = !dd.expand;
                                    gvc.notifyDataChange([toggleView, component]);
                                });
                                return `<div style=" ${(option.return_) ? `padding: 10px;` : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`}" class="
${(option.return_) ? `w-100 border rounded bg-dark mt-2` : ``} " >
${gvc.bindView({
                                    bind: toggleView,
                                    view: () => {
                                        return `<div class="d-flex align-items-center" style="${(option.return_ && !dd.expand) ? `` : `margin-bottom: 10px;`};cursor: pointer;" >
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            function checkDelete(setting) {
                                                const index = setting.findIndex((x) => x.id === dd.id);
                                                if (index !== -1) {
                                                    setting.splice(index, 1);
                                                }
                                                else {
                                                    setting.map((d2) => {
                                                        if (d2.type === "container") {
                                                            checkDelete(d2.data.setting);
                                                        }
                                                    });
                                                }
                                            }
                                            checkDelete(oset);
                                            option.refreshAll();
                                            dd.refreshAll();
                                            option.deleteEvent();
                                        })}"></i>
<h3 style="color: white;font-size: 16px;" class="m-0">${dd.label}</h3>
<div class="flex-fill"></div>
${(option.return_) ? (dd.expand ? `<div style="cursor: pointer;" onclick="${toggleEvent}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;" onclick="${toggleEvent}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``) : ``}
</div>`;
                                    },
                                    divCreate: {}
                                })}
${gvc.bindView({
                                    bind: component,
                                    view: () => {
                                        if (option.return_ && !dd.expand) {
                                            return ``;
                                        }
                                        try {
                                            return gvc.map([
                                                HtmlGenerate.editeInput({
                                                    gvc: gvc,
                                                    title: "模塊名稱",
                                                    default: dd.label,
                                                    placeHolder: "請輸入自定義模塊名稱",
                                                    callback: (text) => {
                                                        dd.label = text;
                                                        option.refreshAll();
                                                        dd.refreshAll();
                                                    }
                                                }),
                                                gvc.bindView(() => {
                                                    const uid = gvc.glitter.getUUID();
                                                    const toggleEvent = gvc.event(() => {
                                                        dd.expandStyle = !dd.expandStyle;
                                                        gvc.notifyDataChange(uid);
                                                    });
                                                    return {
                                                        bind: uid,
                                                        view: () => {
                                                            var _a, _b;
                                                            return `<div class="w-100  rounded p-2" style="background-color: #0062c0;">
<div class="w-100 d-flex p-0 align-items-center" onclick="${toggleEvent}" style="cursor: pointer;"><h3 style="font-size: 16px;" class="m-0 p-0">容器版面設計</h3>
<div class="flex-fill"></div>
${(dd.expandStyle ? `<div style="cursor: pointer;" >收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``)}
</div>

<div class="d-flex flex-wrap align-items-center mt-2 ${(dd.expandStyle) ? `` : `d-none`}">
<span class="w-100 mb-2 fw-500" style="color: orange;">外間距 [ 單位 : %,PX ]</span>
${gvc.map(['上', '下', '左', '右'].map((d2, index) => {
                                                                var _a;
                                                                let key = ['marginT', 'marginB', 'marginL', 'marginR'][index];
                                                                return `<div class="d-flex align-items-center mb-2" style="width: calc(50%);"><span class="mx-2">${d2}</span>
<input class="form-control" value="${(_a = dd.data[key]) !== null && _a !== void 0 ? _a : ''}" onchange="${gvc.event((e) => {
                                                                    dd.data[key] = e.value;
                                                                    option.refreshAll();
                                                                    dd.refreshAll();
                                                                })}"></div>`;
                                                            }))}
<span class="w-100 mb-2 fw-500" style="color: orange;">內間距 [ 單位 : %,PX ]</span>
${gvc.map(['上', '下', '左', '右'].map((d2, index) => {
                                                                var _a;
                                                                let key = ['paddingT', 'paddingB', 'paddingL', 'paddingR'][index];
                                                                return `<div class="d-flex align-items-center mb-2" style="width: calc(50%);"><span class="mx-2">${d2}</span>
<input class="form-control" value="${(_a = dd.data[key]) !== null && _a !== void 0 ? _a : ''}" onchange="${gvc.event((e) => {
                                                                    dd.data[key] = e.value;
                                                                    option.refreshAll();
                                                                    dd.refreshAll();
                                                                })}"></div>`;
                                                            }))}
${HtmlGenerate.editeInput({
                                                                gvc: gvc,
                                                                title: "Class",
                                                                default: (_a = dd.class) !== null && _a !== void 0 ? _a : "",
                                                                placeHolder: ``,
                                                                callback: (text) => {
                                                                    dd.class = text;
                                                                    option.refreshAll();
                                                                    dd.refreshAll();
                                                                }
                                                            })}
${HtmlGenerate.editeText({
                                                                gvc: gvc,
                                                                title: "Style",
                                                                default: (_b = dd.style) !== null && _b !== void 0 ? _b : "",
                                                                placeHolder: ``,
                                                                callback: (text) => {
                                                                    dd.style = text;
                                                                    option.refreshAll();
                                                                    dd.refreshAll();
                                                                }
                                                            })}
</div></div>`;
                                                        },
                                                        divCreate: { class: "mt-2" }
                                                    };
                                                }),
                                                ,
                                                gvc.glitter.share.htmlExtension[dd.route][dd.type].render(gvc, dd, setting, hover).editor
                                            ]);
                                        }
                                        catch (e) {
                                            return `<div style="word-break: break-all;white-space: normal;">
資料錯誤:${e.message}
</div>`;
                                        }
                                    },
                                    divCreate: {}
                                })}</div>`;
                            }
                            catch (e) {
                                return `<div style="word-break: break-all;white-space: normal;" >
資料錯誤:${e.message}
</div>`;
                            }
                        }));
                    }
                },
                divCreate: {}
            });
        };
        this.exportJson = (setting) => {
            return JSON.stringify(setting);
        };
    }
    static editeInput(obj) {
        var _a;
        console.log("test");
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<input class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${(_a = obj.default) !== null && _a !== void 0 ? _a : ''}">`;
    }
    ;
    static imgInput(obj) {
        return `
            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="mt-2"></div>
            <div class="d-flex align-items-center mb-3">
                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${obj.default}">
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
            obj.glitter.ut.chooseMediaCallback({
                single: true,
                accept: 'image/*',
                callback(data) {
                    obj.callback(data);
                }
            });
        })}"></i>
            </div>
        `;
    }
    ;
    static editeText(obj) {
        var _a;
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<textarea class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" style="height: 100px;">${(_a = obj.default) !== null && _a !== void 0 ? _a : ''}</textarea>`;
    }
    ;
}
HtmlGenerate.saveEvent = () => {
    alert('save');
};
