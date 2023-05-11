'use strict';
import { GVC } from '../../glitterBundle/GVController.js';

export class Api {
    public homeeAJAX: (data: { api?: string; route: string; method: string; data?: any }, callback?: (res: any) => void) => void;
    public encodeImageFileAsURL: (element: { files: Blob[] }, callback: (resp: string) => void) => void;
    public squareAJAX: (routName: string, functionName: string, data: any, callBack: (resp: any) => void, timeout?: number) => void;
    constructor(gvc: GVC) {
        const $ = (window as any).$;
        const glitter = gvc.glitter;
        this.homeeAJAX = (data: { api?: string; route: string; method: string; data?: any }, callback?: (res: any) => void) => {
            const cont = data.api ? data.api : '/api/bm';

            if (data) {
                $.ajax({
                    url: cont + data.route,
                    type: data.method,
                    data: JSON.stringify(data.data),
                    contentType: 'application/json; charset=utf-8',
                    headers: { Authorization: glitter.getCookieByName('token') },
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

        this.encodeImageFileAsURL = (element: { files: Blob[] }, callback: (resp: string) => void) => {
            var file = element.files[0];
            var reader = new FileReader();
            reader.onloadend = () =>
                glitter.share.uploadFile(reader.result, (response: { result: boolean; url: string[] }) => {
                    response && response.result && callback(response.url[0]);
                });
            reader.readAsDataURL(file);
        };

        this.squareAJAX = function (routName: string, functionName: string, data: any, callBack: (resp: any) => void, timeout?: number) {
            let id = (glitter.callBackId += 1);
            glitter.callBackList.set(id, callBack);
            let map = {
                routName: routName,
                functionName: functionName,
                callBackId: id,
                data: data,
            };
            $.ajax({
                type: 'POST',
                url: glitter.share.webUrl + '/PostApi',
                data: JSON.stringify(map),
                timeout: timeout,
                success: function (data: any) {
                    callBack(JSON.parse(data));
                },
                error: function () {
                    callBack(undefined);
                },
            });
        };
    }
}
