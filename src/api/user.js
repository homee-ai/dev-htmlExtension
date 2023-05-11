import { Glitter } from "../glitterBundle/Glitter.js";
import { Plugin } from "../glitterBundle/plugins/plugin-creater.js";
import { appConfig } from "../config.js";
export class User {
    static getUserData(next) {
        const glitter = Glitter.glitter;
        glitter.runJsInterFace("getUserData", {}, function (response) {
            glitter.share.userData = response.data;
            Plugin.setAppConfig('HOMEEAppConfig', {
                token: glitter.share.userData.AUTH,
                serverURL: glitter.share.apiURL
            });
            next();
        }, {
            webFunction(data, callback) {
                $.ajax({
                    url: `${glitter.share.apiURL}/api/v1/user/login`,
                    type: 'post',
                    data: JSON.stringify({ email: 'sam94074@gmail.com', pwd: `sam12345` }),
                    contentType: 'application/json; charset=utf-8',
                    success: (suss) => {
                        console.log(suss);
                        callback({
                            data: {
                                user_id: 12052350,
                                last_name: "Rdtest",
                                first_name: "Rdtes22t",
                                name: "Rdtest Rd",
                                photo: suss.photo,
                                AUTH: suss.token
                            },
                            beta: true
                        });
                    },
                    error: (err) => {
                    },
                });
            }
        });
    }
    static setUserData(userData, next) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user`,
            type: 'put',
            data: JSON.stringify(userData),
            headers: { Authorization: userData.token },
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                next(suss);
            },
            error: (err) => {
                next(false);
            },
        });
    }
    static login({ account, pwd, inviteCode, callback, third }) {
        const glitter = Glitter.glitter;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/login`,
            type: 'post',
            data: JSON.stringify({ email: account, pwd: pwd, inviteCode: inviteCode, third: third }),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                if (suss) {
                    suss.pwd = pwd;
                    appConfig().setUserData({
                        value: suss, callback: (response) => {
                            Plugin.setAppConfig('HOMEEAppConfig', {
                                token: suss.token,
                                serverURL: appConfig().serverURL
                            });
                        }
                    });
                }
                callback(suss, 200);
            },
            error: (err) => {
                const resp = JSON.parse(err.responseText).message;
                callback(false, resp);
            },
        });
    }
    static forgetPwd(email, callback) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/forgetPwd`,
            type: 'post',
            data: JSON.stringify({ email: email }),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                if (suss) {
                    appConfig().setUserData({
                        value: suss, callback: (response) => {
                            Plugin.setAppConfig('HOMEEAppConfig', {
                                token: suss.token,
                                serverURL: appConfig().serverURL
                            });
                        }
                    });
                }
                callback(suss, 200);
            },
            error: (err) => {
                const resp = JSON.parse(err.responseText).message;
                callback(false, resp);
            },
        });
    }
    static loginFB(email, token, third, callback) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/signInWithFacebook`,
            type: 'post',
            data: JSON.stringify({ email: email, token: token, third: third }),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                if (suss) {
                    appConfig().setUserData({
                        value: suss, callback: (response) => {
                            Plugin.setAppConfig('HOMEEAppConfig', {
                                token: suss.token,
                                serverURL: appConfig().serverURL
                            });
                        }
                    });
                }
                callback(suss, 200);
            },
            error: (err) => {
                const resp = JSON.parse(err.responseText).message;
                callback(false, resp);
            },
        });
    }
    static loginApple(token, bundle, callback) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/signInWithApple`,
            type: 'post',
            data: JSON.stringify({ token: token, bundle: bundle }),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                if (suss) {
                    appConfig().setUserData({
                        value: suss, callback: (response) => {
                            Plugin.setAppConfig('HOMEEAppConfig', {
                                token: suss.token,
                                serverURL: appConfig().serverURL
                            });
                        }
                    });
                }
                callback(suss, 200);
            },
            error: (err) => {
                const resp = JSON.parse(err.responseText).message;
                callback(false, resp);
            },
        });
    }
    static loginFet(token, callback) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/signInWithFet`,
            type: 'post',
            data: JSON.stringify({ token: token }),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                if (suss) {
                    appConfig().setUserData({
                        value: suss, callback: (response) => {
                            Plugin.setAppConfig('HOMEEAppConfig', {
                                token: suss.token,
                                serverURL: appConfig().serverURL
                            });
                        }
                    });
                }
                callback(suss, 200);
            },
            error: (err) => {
                const resp = JSON.parse(err.responseText).message;
                callback(false, resp);
            },
        });
    }
    static register(obj) {
        const glitter = Glitter.glitter;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user`,
            type: 'post',
            data: JSON.stringify(obj),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                User.login({ account: obj.email, pwd: obj.pwd, inviteCode: obj.inviteCode, callback: obj.callback });
            },
            error: (err) => {
                User.login({ account: obj.email, pwd: obj.pwd, inviteCode: obj.inviteCode, callback: obj.callback });
            },
        });
    }
    static checkUserExists(account, callback) {
        const glitter = Glitter.glitter;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/checkUserExist?email=${account}`,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                callback(suss.exists);
            },
            error: (err) => {
                callback(false);
            },
        });
    }
    static checkToken(token, callback) {
        const glitter = Glitter.glitter;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/user/checkToken`,
            type: 'get',
            headers: { Authorization: token },
            data: JSON.stringify({ token: token }),
            contentType: 'application/json; charset=utf-8',
            success: (suss) => {
                callback(suss.result);
            },
            error: (err) => {
                callback(false);
            },
        });
    }
}
