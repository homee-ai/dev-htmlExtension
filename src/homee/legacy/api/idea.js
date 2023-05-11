export class UserData {
    constructor(userId, first_name, last_name, photo, fans, following) {
        this.userID = userId;
        this.first_name = first_name;
        this.last_name = last_name;
        this.photo = photo;
        this.fans = fans;
        this.following = following;
    }
    get name() {
        return this.last_name + " " + this.first_name;
    }
}
export class Idea {
    constructor(glitter) {
        this.glitter = glitter;
    }
    getData(data, callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        jsonData = {
            poster_id: data.poster_id,
            idea_id: data.idea_id
        };
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: (e) => {
                setTimeout(() => {
                    this.getData(data, callback);
                }, 1000);
            },
        });
    }
    getPersonalData(poster_id = this.glitter.getUrlParameter("poster_id"), callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchPersonalPost`,
            type: 'get',
            data: {
                poster_id: poster_id
            },
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    getPersonalPostData(callback) {
        const glitter = this.glitter;
        const that = this;
        glitter.share.poster_id = glitter.getUrlParameter("poster_id");
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchPersonalPost`,
            type: 'get',
            data: {
                poster_id: glitter.share.poster_id
            },
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    getMessage(jsonData, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/board`,
            type: 'GET',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                var _a, _b;
                if (jsonData.count) {
                }
                callback({ messageCount: (_b = (_a = resposnse === null || resposnse === void 0 ? void 0 : resposnse[0]) === null || _a === void 0 ? void 0 : _a["count(1)"]) !== null && _b !== void 0 ? _b : resposnse === null || resposnse === void 0 ? void 0 : resposnse.length, message: resposnse });
            },
            error: () => {
                setTimeout(() => {
                    this.getMessage(jsonData, callback);
                }, 1000);
            },
        });
    }
    getLikeCount(idea_id, callback) {
        const glitter = this.glitter;
        let jsonData = {
            idea_id: idea_id
        };
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/likeCount`,
            type: 'GET',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                var _a;
                callback(((_a = resposnse[0]) === null || _a === void 0 ? void 0 : _a["COUNT(*)"]) || 0);
            },
            error: () => {
                setTimeout(() => {
                    this.getLikeCount(idea_id, callback);
                }, 1000);
            },
        });
    }
    liked(jsonData, toggle, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/like`,
            type: (toggle) ? 'POST' : 'DELETE',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(true);
            },
            error: () => {
                callback(false);
            },
        });
    }
    detectLike(idea_id, callback) {
        const glitter = this.glitter;
        let user_id = glitter.share.userData.user_id;
        let jsonData = {
            user_id: user_id,
            idea_id: idea_id
        };
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/like`,
            type: 'GET',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(!!resposnse.length);
            },
            error: () => {
                callback(false);
            },
        });
    }
    getUserInfo(userID, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchProfile`,
            type: 'GET',
            data: {
                poster_id: userID
            },
            headers: { Authorization: glitter.share.userData.AUTH },
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                response = response[0];
                response.photo = (response === null || response === void 0 ? void 0 : response.photo) ? response.photo : `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${response['last_name']}&txtfont=Helvetica&txtalign=middle,center`;
                callback(new UserData(userID, response.first_name, response.last_name, response.photo, response.fans, response.following));
            },
            error: () => {
            },
        });
    }
    leaveMessage(data, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/board`,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(true);
            },
            error: () => {
                callback(false);
            },
        });
    }
    uploadArticle(jsonData, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea`,
            type: 'POST',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: () => {
            },
        });
    }
    searchData(seachWord, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/search`,
            type: 'get',
            data: {
                keyword: seachWord
            },
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: (e) => {
                setTimeout(() => {
                    this.searchData(seachWord, callback);
                }, 1000);
            },
        });
    }
    searchUser(seachWord, callback) {
        const glitter = this.glitter;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/searchUser`,
            type: 'get',
            data: {
                keyword: seachWord
            },
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: (e) => {
                setTimeout(() => {
                    this.searchUser(seachWord, callback);
                }, 1000);
            },
        });
    }
    changeFollow(action, target_id, follower_id, callback) {
        const glitter = this.glitter;
        let jsonData = {
            target_id: target_id,
            follower_id: follower_id
        };
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/idea/follow`,
            type: action,
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (resposnse) => {
                callback(resposnse);
            },
            error: (e) => {
                setTimeout(() => {
                    this.changeFollow(action, target_id, follower_id, callback);
                }, 1000);
            },
        });
    }
}
