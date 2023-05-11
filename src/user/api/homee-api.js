'use strict';
export class Api {
    constructor(gvc) {
        const $ = window.$;
        const glitter = gvc.glitter;
        this.homeeAJAX = (data, callback) => {
            const cont = data.api ? data.api : '/api/bm';
            if (data) {
                $.ajax({
                    url: cont + data.route,
                    type: data.method,
                    data: JSON.stringify(data.data),
                    contentType: 'application/json; charset=utf-8',
                    headers: { Authorization: glitter.getCookieByName('token') },
                    success: (suss) => callback && callback(suss),
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
        this.encodeImageFileAsURL = (element, callback) => {
            var file = element.files[0];
            var reader = new FileReader();
            reader.onloadend = () => glitter.share.uploadFile(reader.result, (response) => {
                response && response.result && callback(response.url[0]);
            });
            reader.readAsDataURL(file);
        };
        this.squareAJAX = function (routName, functionName, data, callBack, timeout) {
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
                success: function (data) {
                    callBack(JSON.parse(data));
                },
                error: function () {
                    callBack(undefined);
                },
            });
        };
    }
}
