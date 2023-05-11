'use strict';
import {appConfig} from '../../config.js'
export class Api {
    public static serverURL=appConfig().serverURL
    public homeeAJAX: (data: { api?: string; route: string; method: string; data?: any }, callback?: (res: any) => void) => void;
    constructor() {
        const $ = (window as any).$;
        this.homeeAJAX = (data: { api?: string; route: string; method: string; data?: any }, callback?: (res: any) => void) => {
            const cont = data.api ? data.api : '/api/bm';

            if (data) {
                $.ajax({
                    url: cont + data.route,
                    type: data.method,
                    data: JSON.stringify(data.data),
                    contentType: 'application/json; charset=utf-8',
                    headers: { Authorization: appConfig().token },
                    success: (suss: any) => callback && callback(suss),
                    error: (err: any) => {
                        switch (err.status) {
                            case 401:
                                callback && callback(false)
                                break;
                            default:
                                callback && callback(false)
                                break;
                        }
                    },
                });
            }
        };
    }
}
