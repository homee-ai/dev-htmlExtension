import { Plugin } from "./glitterBundle/plugins/plugin-creater.js";
import { Api } from "./homee/api/homee-api.js";
import { DialogHelper } from "./dialog/dialog-helper.js";
export function appConfig() {
    return Plugin.getAppConfig("HOMEEAppConfig", {
        serverURL: "http://127.0.0.1:3080",
        token: "",
        uploadImage: (photoFile, callback) => {
            const glitter = window.glitter;
            console.log(photoFile);
            glitter.share.dialog.dataLoading({ text: '上傳中', visible: true });
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
                            glitter.share.dialog.dataLoading({ visible: false });
                            glitter.share.dialog.successMessage({ text: "上傳成功" });
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            glitter.share.dialog.successMessage({ text: "上傳失敗" });
                        },
                    });
                },
                error: (err) => {
                    glitter.share.dialog.dataLoading({ visible: false });
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        },
        changePage: (gvc, tag, obj) => {
            gvc.glitter.defaultSetting.pageAnimation = appConfig().translation;
            const api = new Api();
            DialogHelper.dataLoading({
                text: "",
                visible: true
            });
            api.homeeAJAX({
                api: Api.serverURL,
                route: '/api/v1/lowCode/pageConfig?query=config&tag=' + tag,
                method: 'get'
            }, (res) => {
                DialogHelper.dataLoading({
                    text: "",
                    visible: false
                });
                gvc.glitter.htmlGenerate.changePage({
                    config: res.result[0].config,
                    data: obj,
                    tag: tag,
                    goBack: true
                });
                setTimeout(() => {
                    DialogHelper.dataLoading({
                        text: "",
                        visible: false,
                    });
                });
            });
        },
        setHome: (gvc, tag, obj) => {
            const api = new Api();
            api.homeeAJAX({
                api: Api.serverURL,
                route: '/api/v1/lowCode/pageConfig?query=config&tag=' + tag,
                method: 'get'
            }, (res) => {
                DialogHelper.dataLoading({
                    text: "",
                    visible: false
                });
                gvc.glitter.htmlGenerate.setHome({
                    config: res.result[0].config,
                    data: obj,
                    tag: tag
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
                try {
                    const userData = JSON.parse(response.data);
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
        }
    });
}