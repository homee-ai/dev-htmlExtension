'use strict';
import { appConfig } from '../../config.js';
export class Api {
    constructor() {
        const $ = window.$;
        this.homeeAJAX = (data, callback) => {
            const cont = data.api ? data.api : '/api/bm';
            console.log("---------------");
            console.log(data.route);
            console.log(appConfig().token);
            if (data) {
                $.ajax({
                    url: cont + data.route,
                    type: data.method,
                    data: JSON.stringify(data.data),
                    contentType: 'application/json; charset=utf-8',
                    headers: { Authorization: appConfig().token },
                    success: (suss) => {
                        callback && callback(suss);
                    },
                    error: (err) => {
                        switch (err.status) {
                            case 401:
                                callback && callback(false);
                                break;
                            default:
                                callback && callback(false);
                                break;
                        }
                    },
                });
            }
        };
    }
}
Api.serverURL = appConfig().serverURL;
