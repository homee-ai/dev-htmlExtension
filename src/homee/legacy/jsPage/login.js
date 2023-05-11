'use strict';
import { init } from '../glitterBundle/GVController.js';
init((gvc, glitter, gBundle) => {
    gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
        gvc.notifyDataChange('mainView');
    }, () => {
    });
    gvc.addStyle(`
body{
overflow-x: hidden;
}
html{
overflow-x: hidden;
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
        main{
            position: relative;
            height: 100vh;
        }
        .showGIF{
            background-image: url("img/sample/login/BG.gif") ;
            background-position: center 60%;
            background-size: 100%;
            height: 50%;
        }
        .arrow{
            width: 24px;
            height: 24px;
            position: absolute;

        }
        .BG{
            width: 100%;
            height: 100%;
        }
        .loginBoard{
            position: absolute;
            width: 100vw;

            left: 0;
            bottom: 0;
            z-index: 3;
            /* HOMEE white */

            background: #FFFFFF;

            box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 56px 56px 0 0;
            padding-top: 48px;


        }
        .loginInf{
            margin-top: 76px;
            padding: 0 47px 25px;
        }
        .loginRow{
            padding-bottom: 11px;
            margin-right: 0px;
        }
        .loginRow input{
            /* Noto Sans TC - Regular - 14 */
            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 150%;
            /* identical to box height, or 21px */
            margin-left: 16px;

            /* HOMEE grey */

            color: #292929;

        }
        .fogetPW{
            /* Noto Sans TC - Regular - 12 */

            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 17px;
            /* identical to box height */


            color: #FD6A58;
        }
        .loginBTN{
            /* HOMEE red */
            width: 100%;
            height: 64px;

            background: #FD6A58;
            border-radius: 32px;

            margin-top: 54px;

            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 18px;
            line-height: 26px;

            /* HOMEE white */
            color: #FFFFFF;

        }
        .moreLogin{
            /* Noto Sans TC - Regular - 15 */
            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            /* identical to box height, or 22px */


            /* HOMEE grey */

            color: #858585;

            margin-top: 40px;
        }
        .funGroup{
            padding: 0 68px;
        }
        .funGroup img {
            width: 40px;
            height: 40px;
            margin-top: 16px;
        }
       `);
    function checkRegister() {
        let register = false;
        let register2 = {};
        let array = [];
        if (accountData.account !== '' && accountData.password !== '') {
            glitter.runJsInterFace("signInOrRegister", {
                account: accountData.account,
                password: accountData.password
            }, function (response) { });
        }
    }
    let accountData = {
        account: '',
        password: ''
    };
    return {
        onCreateView: () => {
            let topInset;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data;
                gvc.notifyDataChange('mainView');
            }, {
                webFunction: () => {
                    return { data: 10 };
                }
            });
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined) {
                        return `
                       <main style="overflow-x: hidden;">
                                <div class="w-100" style="position: absolute;">
                                <lottie-player src="img/sample/login/login_page.json"  background="#F8F3ED"  speed="1"  onclick="${gvc.event((e) => {
                            glitter.runJsInterFace("dismiss", {}, () => {
                            });
                        })}" style="width: 450px;height: 900px;position: absolute;transform: translateY(-350px);"  loop  autoplay></lottie-player>
                </div>
                            <div class="loginBoard d-flex flex-column align-items-center">
                                <img src="img/sample/login/logo.svg" alt="">
                                <div class="loginInf d-flex flex-column align-items-center">
                                     <div class="loginRow d-flex w-100" style="border-bottom: 1px solid #FD6A58;">
                                            <img src="img/sample/login/message.svg" alt="" style="width: 24px;height: 24px;">
                                            <input class="w-100 border-0" placeholder="電子郵件地址或手機號碼" onchange="${gvc.event((e) => {
                            accountData.account = glitter.$(e).val();
                        })}">
                                        </div>
                                    <div class="loginRow d-flex w-100" style="margin-top: 40px;border-bottom: 1px solid #FD6A58;">
                                        <img src="img/sample/login/password.svg" alt="" style="width: 24px;height: 24px;">
                                        <input type="password" class="w-100 border-0" name="password" placeholder="密碼" onchange="${gvc.event((e) => {
                            accountData.password = glitter.$(e).val();
                        })}">
                                    </div>
                                    <div class="loginRow w-100 d-flex" style="margin-top: 8px;">
                <!--                    todo sethome trans to changepage-->
                                        <div class="fogetPW ms-auto" onclick="${gvc.event(() => {
                            glitter.runJsInterFace("MCForgetPwd", {}, function (response) {
                            });
                        })}">忘記密碼？</div>
                                    </div>
                                    <div class="loginBTN d-flex justify-content-center align-items-center" onclick="${gvc.event(() => {
                            checkRegister();
                        })}">
                                        登入 / 註冊
                                    </div>
                                    <div class="moreLogin d-flex justify-content-center align-items-center">更多的登入方式</div>
                                    <div class="funGroup d-flex justify-content-between">
                                        <img src="img/sample/login/FB.png" style="height: 50px;width:50px;" alt="" onclick="${gvc.event(() => {
                            glitter.runJsInterFace("loginWithFB", {}, (response) => {
                            });
                        })}">
                                        <img src="img/sample/login/apple.png" style="height: 55px;width:55px;margin-left: 16px;margin-right: 16px;" onclick="${gvc.event(() => {
                            glitter.runJsInterFace("loginWithApple", {}, () => {
                            });
                        })}" alt="">
                                        <img src="img/sample/login/FET.png"  style="height: 45px;width:45px;" onclick="${gvc.event(() => {
                            glitter.runJsInterFace("loginWithFet", {}, () => {
                            });
                        })}" alt="" >
                                    </div>
                                </div>
                
                            </div>
                        </main>
                       `;
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: { class: ``, style: `` }
            });
        }
    };
});
