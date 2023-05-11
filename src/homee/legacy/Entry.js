'use strict';
import { User } from "./api/user.js";
export class Entry {
    static onCreate(glitter) {
        glitter.addMtScript(['https://kit.fontawesome.com/02e2dc09e3.js'], () => {
        }, () => {
        });
        glitter.defaultSetting.pageAnimation = glitter.animation.rightToLeft;
        glitter.debugMode = true;
        glitter.addStyle(`
        html{
            margin: 0;
            box-sizing: border-box;

        }

         @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Bold.otf);
            font-weight: bold;
        }
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Regular.otf);
            font-weight: normal;
        }
         .dot{
            width: 16px;
            height: 16px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 10px;
            line-height: 15px;
            text-align: center;
            background: #FD6A58;
            /* HOMEE white */

            border: 1px solid #FFFFFF;
            border-radius: 50%;
            /* HOMEE white */

            color: #FFFFFF;

        }
        `);
        glitter.debugMode = false;
        glitter.share.inviteDiscount = 100;
        glitter.runJsInterFace("getTopInset", {}, (response) => {
            glitter.share.topInset = (response.data);
        }, {
            webFunction: () => {
                return { data: 10 };
            }
        });
        glitter.runJsInterFace("getTopInset", {}, (response) => {
            glitter.share.bottomInset = (response.data);
        }, {
            webFunction: () => {
                return { data: 10 };
            }
        });
        glitter.runJsInterFace("getServerRout", {}, (response) => {
            glitter.share.apiURL = response.url;
            User.getUserData(() => {
                if (glitter.getUrlParameter('component')) {
                    $('.page-spinner').hide();
                    glitter.setHome(`component/${glitter.getUrlParameter('component')}.js`, glitter.getUrlParameter('component'), {}, { backGroundColor: "transparent" });
                }
                else {
                    pageConfig();
                }
            });
        }, {
            webFunction(data, callback) {
                callback({
                    url: "https://machi-app.com"
                });
            }
        });
        function pageConfig() {
            var _a;
            switch (glitter.getUrlParameter('page')) {
                case "categoryMain":
                    glitter.setHome('jsPage/category/main.js', 'categoryMain', {});
                    return;
                case "category":
                    glitter.setHome('jsPage/category/category.js', 'category', {});
                    return;
                case "categoryDetail":
                    glitter.setHome('jsPage/category/categoryDetail.js', 'categoryDetail', {});
                    return;
                case "subCategory":
                    glitter.setHome('jsPage/category/subCategory.js', 'subCategory', {});
                    return;
                case "orderBill":
                    glitter.setHome('jsPage/orderBill.js', 'orderBill', {});
                    return;
                case "index":
                    glitter.setHome('jsPage/index.js', 'index', {});
                    return;
                case "idea_post":
                    glitter.setHome('jsPage/idea/idea_post.js', "idea_post", {});
                    return;
                case "idea_board":
                    glitter.setHome('jsPage/idea/idea_board.js', 'idea_board', {});
                    return;
                case "idea_selectPostImg":
                    glitter.runJsInterFace("modelData", {}, (response) => {
                        response.data.config = JSON.parse(response.data.config);
                        glitter.setHome('jsPage/idea/idea_selectPostImg.js', 'idea_selectPostImg', response.data);
                    });
                    return;
                case "idea_profile":
                    glitter.share.firstPageIsIdea = true;
                    glitter.setHome('jsPage/idea/idea_profile.js', 'idea_profile', {
                        poster_id: (_a = glitter.getUrlParameter('poster_id')) !== null && _a !== void 0 ? _a : glitter.share.userData.user_id
                    });
                    return;
                case "idea_search":
                    glitter.setHome('jsPage/idea_search.js', 'idea_search', {});
                    return;
                case "shareList":
                    glitter.setHome('jsPage/dialog/shareList.js', 'shareList', {});
                    return;
                case "idea":
                    glitter.share.firstPageIsIdea = true;
                    glitter.setHome('jsPage/idea/idea.js', 'idea', {
                        poster_id: glitter.getUrlParameter('poster_id'),
                        idea_id: glitter.getUrlParameter('idea_id')
                    });
                    return;
                case "guide":
                    glitter.setHome('jsPage/guide/scanStart.js', 'scanStart', {});
                    return;
                case "register":
                    glitter.setHome('jsPage/register.js', 'register', {});
                    return;
                case "newPW":
                    glitter.setHome('jsPage/newPW.js', 'newPW', {});
                    return;
                case "forgotPW":
                    glitter.setHome('jsPage/forgotPW.js', 'forgotPW', {});
                    return;
                case "login":
                    glitter.setHome('jsPage/login.js', 'login', {});
                    return;
                case "inviteFriend":
                    glitter.setHome('jsPage/user/inviteFriend.js', 'inviteFriend', {});
                    return;
                case "edit_Profile":
                    glitter.setHome('jsPage/user/edit.js', 'edit_Profile', {});
                    return;
                case "editFirstAddress":
                    glitter.setHome('jsPage/user/editFirstAddress.js', 'editFirstAddress', {});
                    return;
                case "couponDetail":
                    glitter.setHome('jsPage/user/couponDetail.js', 'couponDetail', {});
                    return;
                case "couponTotal":
                    glitter.setHome('jsPage/user/couponTotal.js', 'couponTotal', {});
                    return;
                case "ourService":
                    glitter.setHome('jsPage/ourService.js', 'ourService', {});
                    return;
                case "setting":
                    glitter.setHome('jsPage/user/setting.js', 'setting', {});
                    return;
                case "main":
                    glitter.setHome('jsPage/user/main2.js', 'main', {});
                    return;
                case "introduce":
                    glitter.setHome('jsPage/introduce.js', 'introduce', {});
                    return;
                default:
                    if (glitter.getUrlParameter("page") == undefined) {
                        glitter.setHome('jsPage/user/main2.js', 'main2', {});
                    }
                    else {
                        glitter.setHome(glitter.getUrlParameter("page"), glitter.getUrlParameter("page"), {});
                    }
            }
        }
    }
}
