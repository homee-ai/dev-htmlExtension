'use strict';
import { init } from '../glitterBundle/GVController.js';
init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
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
            background-size: 300%;
            height: 50%;
        }
        .arrow{
            width: 24px;
            height: 24px;
            position: absolute;

        }

        .loginBoard{
            position: absolute;
            width: 100%;

            left: 0;
            bottom: 0;
            z-index: 3;
            /* HOMEE white */

            background: #FFFFFF;

            box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 56px 56px 0 0;
            padding-top: 48px;
            padding-bottom: 48px;

        }
        .loginInf{
            margin-top: 76px;
            padding-bottom: 25px;

        }
        .loginRow{
            width: 320px;
            height: 32px;
            padding-bottom: 11px;
            margin-right: 18px;

            border-bottom: 1px solid #FD6A58;
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
        .hint{
            width: 360px;
            height: 46px;
            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 23px;
            font-feature-settings: 'pnum' on, 'lnum' on;

            /* Homee-Black */
            color: #292929;
            margin-bottom: 67px;

        }
        .authRow{
            width: 160px;
            height: 40px;
            padding-bottom: 11px;
            margin-right: 18px;
            font-size: 14px;

            border-bottom: 1px solid #FD6A58;
            padding-top: 8px;
        }

        .authBtn{
            width: 160px;
            height: 40px;

            font-size: 18px;

            background: #D6D6D6;
            border-radius: 20px;

        }
        .authBtnOK{
            background:#FD6A58
        }

        .loginBTN{
            /* HOMEE red */
            width: 100%;
            height: 64px;

            background: #FD6A58;
            border-radius: 32px;

            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 18px;
            line-height: 26px;

            /* HOMEE white */
            color: #FFFFFF;
            margin-top: 80px;

        }
       `);
    gvc.addMtScript([{
            src: 'test2.js'
        }], () => {
    }, () => {
    });
    function getAuthCode() {
    }
    function checkRegister() {
        glitter.setHome('jsPage/newPW.js', 'newPW', {});
    }
    function listenAuthBTN() {
        let element = document.querySelector('.authBtn');
    }
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
            <main>
                <div class="showGIF">
                    <img class="arrow" src="img/sample/idea/left-arrow.svg" style="" alt="">
                </div>
                <div class="loginBoard d-flex flex-column align-items-center">
                    <img src="img/sample/login/logo.svg" alt="LOGO">
                    <div class="loginInf d-flex flex-column align-items-center">
                        <div class="hint">
                            您可以透過註冊電子郵件或手機查收並輸入正確的驗證碼完成密碼重設
                        </div>
                        <div class="loginRow d-flex">
                            <img src="img/sample/login/message.svg" alt="" style="width: 24px;height: 24px;">
                            <input class="w-100 border-0" placeholder="電子郵件地址或手機號碼">
                        </div>

                        <div class="d-flex " style="margin-top: 32px">
                            <div class="authRow d-flex align-items-center">
                                <img src="img/sample/login/shield.svg" alt="" style="width: 24px;height: 24px;">
                                <input class="w-100 border-0" placeholder="驗證碼" style="margin-left: 16px;">
                            </div>
    <!--                    todo 黑轉色 時間count-->
                            <div class="authBtn d-flex justify-content-center align-items-center" onclick="${gvc.event(() => { getAuthCode(); })}">
                                獲取驗證碼
                            </div>
                        </div>

                    <!--todo click-->
                        <div class="loginBTN d-flex justify-content-center align-items-center" onclick="${gvc.event(() => { checkRegister(); })}">
                            下一步
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
        },
        onCreate: () => {
            listenAuthBTN();
        }
    };
});
