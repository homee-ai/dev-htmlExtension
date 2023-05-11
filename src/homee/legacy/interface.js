import { User } from "./api/user.js";
import { Glitter } from "./glitterBundle/Glitter.js";
export class LegacyPage {
    static getLink(link) {
        return new URL('./' + link, import.meta.url).href;
    }
    static execute(glitter, fun) {
        function getLink(link) {
            return new URL('./' + link, import.meta.url).href;
        }
        glitter.share.getLink = getLink;
        Glitter.glitter = glitter;
        if (!glitter.share.apiURL) {
            glitter.addStyleLink(getLink(`glitterBundle/bootstrap.css`));
            glitter.addMtScript(['https://kit.fontawesome.com/02e2dc09e3.js'], () => { }, () => { });
            glitter.defaultSetting.pageAnimation = glitter.animation.rightToLeft;
            glitter.debugMode = true;
            glitter.addStyle(`
        html{
            margin: 0;
            box-sizing: border-box;

        }

         @font-face {
            font-family: 'Noto Sans TC';
            src: url(${getLink('assets/Font/NotoSansTC-Bold.otf')});
            font-weight: bold;
        }
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(${getLink("assets/Font/NotoSansTC-Regular.otf")});
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
                        fun();
                    }
                });
            }, {
                webFunction(data, callback) {
                    callback({
                        url: "https://machi-app.com"
                    });
                }
            });
        }
        else {
            fun();
        }
    }
}
