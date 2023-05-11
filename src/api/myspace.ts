import {appConfig} from "../config.js";

export interface Space {
    id:string,
    key:string,
    data:string,
    rout:string,
    time:number,
    store_time:string,
    server_rout:string,
    space_image:string
}

export class Myspace {
    public static getModelList(callback:(space:Space[]|boolean)=>void) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/scene/myScene`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        console.log(JSON.stringify(response))
                        callback(response.config as Space[])
                        // alert(JSON.stringify(response))
                    },
                    error: (err: any) => {
                        callback(false)
                        // alert(JSON.stringify(response))
                    },
                });
            }
        })
    }
    public static getFirstView(callback:(res:any)=>void) {
        appConfig().getUserData({
            callback: (response: any) => {
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/user/watchedVideo?email=${response.email}`,
                    type: 'get',
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {

                        callback(response)
                        // alert(JSON.stringify(response))
                    },
                    error: (err: any) => {
                        callback(false)
                        // alert(JSON.stringify(response))
                    },
                });
            }
        })
    }
    public static setFirstView(callback:(res:any)=>void) {
        appConfig().getUserData({
            callback: (response: any) => {
                console.log(response.token)
                let data = {
                    email:response.email
                };
                $.ajax({
                    url: `${appConfig().serverURL}/api/v1/user/watchedVideo`,
                    type: 'put',
                    data:JSON.stringify(data),
                    headers: {Authorization: response.token},
                    contentType: 'application/json; charset=utf-8',
                    success: (response: any) => {
                        console.log(response)
                        callback(response)
                        // alert(JSON.stringify(response))
                    },
                    error: (err: any) => {
                        callback(false)
                        // alert(JSON.stringify(response))
                    },
                });
            }
        })
    }
}
