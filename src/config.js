import { Plugin } from "./glitterBundle/plugins/plugin-creater.js";
import { Api } from "./homee/api/homee-api.js";
import { Dialog } from "./dialog/dialog-mobile.js";
export function appConfig() {
    return Plugin.getAppConfig("HOMEEAppConfig", {
        serverURL: "http://127.0.0.1:3080",
        token: "",
        uploadImage: (photoFile, callback) => {
            const glitter = window.glitter;
            const dialog = new Dialog();
            console.log(photoFile);
            dialog.dataLoading(true);
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}.` + photoFile.name.split('.').pop() }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: appConfig().token },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            dialog.dataLoading(false);
                            dialog.showInfo("上傳成功");
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            dialog.showInfo("上傳失敗");
                        },
                    });
                },
                error: (err) => {
                    dialog.dataLoading(false);
                    dialog.showInfo("上傳失敗");
                },
            });
        },
        changePage: (gvc, tag, obj, option) => {
            gvc.glitter.defaultSetting.pageAnimation = appConfig().translation;
            const api = new Api();
            const dialog = new Dialog(gvc);
            dialog.dataLoading(true);
            api.homeeAJAX({
                api: Api.serverURL,
                route: '/api/v1/lowCode/pageConfig?query=config&tag=' + tag,
                method: 'get'
            }, (res) => {
                dialog.dataLoading(false);
                gvc.glitter.htmlGenerate.changePage({
                    config: res.result[0].config,
                    data: obj,
                    tag: tag,
                    goBack: true,
                    option: option
                });
            });
        },
        setHome: (gvc, tag, obj, option) => {
            const api = new Api();
            const dialog = new Dialog(gvc);
            dialog.dataLoading(true);
            api.homeeAJAX({
                api: Api.serverURL,
                route: '/api/v1/lowCode/pageConfig?query=config&tag=' + tag,
                method: 'get'
            }, (res) => {
                dialog.dataLoading(false);
                gvc.glitter.htmlGenerate.setHome({
                    config: res.result[0].config,
                    data: obj,
                    tag: tag,
                    option: option
                });
            });
        },
        translation: (() => {
            const glitter = window.glitter;
            return glitter.animation.rightToLeft;
        })(),
        getUserData: ({ callback }) => {
            const glitter = window.glitter;
            glitter.getPro("daiqdmoiwme21", (response) => {
                var _a, _b;
                try {
                    const userData = JSON.parse(response.data);
                    userData.name = (_a = userData.name) !== null && _a !== void 0 ? _a : userData.first_name + userData.last_name;
                    userData.photo = (_b = userData.photo) !== null && _b !== void 0 ? _b : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${userData.first_name}&txtfont=Helvetica&txtalign=middle,center`;
                    callback(userData);
                }
                catch (e) {
                    callback({});
                }
            });
        },
        setUserData: ({ value, callback }) => {
            const glitter = window.glitter;
            glitter.setPro("daiqdmoiwme21", JSON.stringify(value), (response) => {
                callback(response);
            });
            glitter.runJsInterFace("storeUserData", value, (response) => { });
        },
        getTopInset: (callback) => {
            const glitter = window.glitter;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                callback(response.data);
            }, {
                webFunction: () => {
                    return { data: 0 };
                }
            });
        },
        getBottomInset: (callback) => {
            const glitter = window.glitter;
            glitter.runJsInterFace("getBottomInset", {}, (response) => {
                callback(response.data);
            }, {
                webFunction: () => {
                    return { data: 0 };
                }
            });
        }
    });
}
