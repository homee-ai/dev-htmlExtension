import {Glitter} from "../glitterBundle/Glitter.js";
import {Dialog} from "../widget/dialog";

export interface IdeaData {
    idea_id: string,
    poster_id: string,
    content: { intro: string },
    datetime: number,
    //場景內容
    scene: string,
    //場景配置
    config: any,
    preview_image: [string],
    messageCount: number,
    message: [any],
    dislike: boolean,
    posterPhoto: string,
    poster: string,
    likeCount: number,
    first_name: string,
    last_name: string,
    photo: string,
}

export class UserData {
    public get name(){
        return this.last_name + " " +this.first_name
    }
    public first_name:string
    public last_name:string
    public photo:string
    public userID: string
    public fans:string
    public following:string


    constructor(userId: string, first_name: string,last_name:string,photo:string,fans:string,following:string) {
        this.userID=userId
        this.first_name=first_name
        this.last_name=last_name
        this.photo=photo
        this.fans=fans
        this.following=following
    }
}

export class Idea {
    public glitter: Glitter

    constructor(glitter: Glitter) {
        this.glitter = glitter;
    }

    //取得文章列表
    public getData(data:{poster_id?:string,idea_id?:string},callback: (data: IdeaData[]) => void) {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        jsonData = {
            poster_id: data.poster_id,
            idea_id:data.idea_id
        }
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {

                callback(resposnse)
            },
            error: (e) => {
                setTimeout(() => {
                    this.getData(data,callback)
                }, 1000)
            },
        });
    }
    //取得個人的文章列表
    public getPersonalData(poster_id: string = this.glitter.getUrlParameter("poster_id"), callback: (data: IdeaData[]) => void) {
        const glitter = this.glitter
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchPersonalPost`,
            type: 'get',
            data: {
                poster_id: poster_id
            },
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {

                callback(resposnse)
            },
            error: (e) => {
                setTimeout(() => {
                    // this.getData(callback)
                }, 1000)
            },
        });
    }

    //取得個人的文章列表
    public getPersonalPostData(callback: (data: IdeaData[]) => void) {
        const glitter = this.glitter
        const that = this

        glitter.share.poster_id = glitter.getUrlParameter("poster_id")

        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchPersonalPost`,
            type: 'get',
            data: {
                poster_id : glitter.share.poster_id
            },
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {

                callback(resposnse)
            },
            error: (e) => {
                setTimeout(() => {
                    // this.getData(callback)
                }, 1000)
            },
        });
    }

    //取得文章留言
    public getMessage(jsonData: {
        idea_id: string,
        count: boolean
    }, callback: (data: { messageCount: number, message: any }) => void) {
        const glitter = this.glitter
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/board`,
            type: 'GET',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                if (jsonData.count) {

                }

                callback({messageCount: resposnse?.[0]?.["count(1)"] ?? resposnse?.length, message: resposnse})
                // transUserIDtoName(idea_id);
                // getLikeCount(idea_id)
                // gvc.notifyDataChange(`message${idea_id}`)
            },
            error: () => {
                setTimeout(() => {
                    this.getMessage(jsonData, callback)
                }, 1000)
            },
        });
    }

    //取得按讚數量
    public getLikeCount(idea_id: string, callback: (data: number) => void) {
        const glitter = this.glitter
        let jsonData = {
            idea_id: idea_id
        }
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/likeCount`,
            type: 'GET',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(resposnse[0]?.["COUNT(*)"] || 0)
            },
            error: () => {
                setTimeout(() => {
                    this.getLikeCount(idea_id, callback)
                }, 1000)
            },
        });
    }

    //按讚
    public liked(jsonData: {
        user_id: string,
        idea_id: string
    }, toggle: boolean, callback: (result: boolean) => void) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/like`,
            type: (toggle) ? 'POST' : 'DELETE',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(true)
            },
            error: () => {
                callback(false)
            },
        });
    }

    //判斷是否有按讚
    public detectLike(idea_id: any, callback: (result: boolean) => void) {
        const glitter = this.glitter;
        let user_id = glitter.share.userData.user_id
        let jsonData = {
            user_id: user_id,
            idea_id: idea_id
        }
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/like`,
            type: 'GET',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(!!resposnse.length)
            },
            error: () => {
                callback(false)
            },
        });


    }

    //取得用戶資料
    public getUserInfo(userID: string, callback: (data: UserData) => void) {
        const glitter = this.glitter

        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchProfile`,
            type: 'GET',
            data: {
                poster_id: userID
            },
            headers: {Authorization: glitter.share.userData.AUTH},
            contentType: 'application/json; charset=utf-8',
            success: (response: any) => {
                response=response[0]
                response.photo=(response?.photo) ? response.photo : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${response['last_name']}&txtfont=Helvetica&txtalign=middle,center`
                callback(new UserData(userID , response.first_name , response.last_name , response.photo , response.fans , response.following))
            },
            error: () => {
            },
        });
    }

    //留言
    public leaveMessage(data: {
        idea_id: string,
        messager: string,
        content: {
            appendix: string,
            text: string
        }
    }, callback: (result: Boolean) => void) {
        const glitter = this.glitter
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/board`,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(true)
            },
            error: () => {
                callback(false)
            },
        });
    }

    //發布文章
    public uploadArticle(jsonData: any, callback: (result: Boolean) => void) {
        const glitter = this.glitter
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea`,
            type: 'POST',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(resposnse)
            },
            error: () => {
            },
        });
    }

    //搜尋文章 para1:搜尋字串 para2:callback
    public searchData(seachWord: string, callback: (data: IdeaData[]) => void) {
        const glitter = this.glitter
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/search`,
            type: 'get',
            data: {
                keyword: seachWord
            },
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {

                callback(resposnse)
            },
            error: (e) => {
                setTimeout(() => {
                    this.searchData(seachWord,callback)
                }, 1000)
            },
        });
    }

    //搜尋文章 para1:搜尋字串 para2:callback
    public searchUser(seachWord: string, callback: (data: UserData[]) => void) {
        const glitter = this.glitter
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchUser`,
            type: 'get',
            data: {
                keyword: seachWord
            },
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(resposnse)
            },
            error: (e) => {
                setTimeout(() => {
                    this.searchUser(seachWord,callback)
                }, 1000)
            },
        });
    }

    //取得用戶資料
    public changeFollow(action: string , target_id: string , follower_id: string , callback: (data: any) => void) {
        const glitter = this.glitter
        let jsonData = {
            target_id: target_id,
            follower_id:follower_id
        }
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/follow`,
            type: action,
            data: JSON.stringify(jsonData) ,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                callback(resposnse)
            },
            error: (e) => {
                setTimeout(() => {
                    this.changeFollow(action , target_id , follower_id,callback)
                }, 1000)
            },
        });
    }
}

