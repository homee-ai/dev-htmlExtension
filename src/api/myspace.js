import { appConfig } from "../config.js";
export class Myspace {
    static getModelList(callback) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/scene/myScene`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        console.log(JSON.stringify(response));
                        callback(response.config);
                    },
                    error: (err) => {
                        callback(false);
                    },
                });
            }
        });
    }
    static getFirstView(callback) {
        appConfig().getUserData({
            callback: (response) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/user/watchedVideo?email=${response.email}`,
                    type: 'get',
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        callback(response);
                    },
                    error: (err) => {
                        callback(false);
                    },
                });
            }
        });
    }
    static setFirstView(callback) {
        appConfig().getUserData({
            callback: (response) => {
                console.log(response.token);
                let data = {
                    email: response.email
                };
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/user/watchedVideo`,
                    type: 'put',
                    data: JSON.stringify(data),
                    headers: { Authorization: response.token },
                    contentType: 'application/json; charset=utf-8',
                    success: (response) => {
                        console.log(response);
                        callback(response);
                    },
                    error: (err) => {
                        callback(false);
                    },
                });
            }
        });
    }
}
