'use strict';
import {init} from '../glitterBundle/GVController.js';

init((gvc, glitter, gBundle) => {
    

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
            background-position: center 40%;
            background-size: 100%;
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
            margin-top: 60px;
            padding-bottom: 25px;

        }
        .loginRow{
            padding-bottom: 11px;
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
        .userPic{
            width: 96px;
            height: 96px;
            background: #C4C5C9;
            margin-bottom: 44px;
        }
        .registerElement{
            width: 148px;
            height: 32px;
            border-bottom: 1px solid #FD6A58;
            margin-right: 24px;
        }
        .registerElement img{
            width: 24px;
            height: 24px;
            margin-right: 16px;

        }
        .registerElement input , .registerElement select{

            width: 90px;
            height: 24px;
            margin-right: 16px;
            border: 0;

            font-family: 'Noto Sans TC',serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 150%;
        }
        .elementMargin{
            margin-top: 40px;
        }
        .loginBTN{
            /* HOMEE red */
            width: calc(100% - 94px);
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
            margin-top: 99px;

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
       `)

    const loginData = {
        account: undefined,
        head: '',
        lastName: '',
        firstName: '',
        gender: '-1',
        birthDay: ''
    }

    //todo changeUserPic
    function changeUserPic() {
        let element = document.querySelector('.userPicElement');


    }

    function checkRegister() {
        //todo 全部都填的話
        if (loginData.gender === "-1" || loginData.lastName === '' || loginData.firstName === '' || loginData.birthDay === '' || loginData.account === '') {
            glitter.runJsInterFace("needWrite", {}, () => {
            })
        } else {
            glitter.runJsInterFace("register", loginData, () => {
            })
        }
    }

    return {
        onCreateView: () => {
            gvc.addMtScript([{src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`}], () => {
                gvc.notifyDataChange('mainView')
            }, () => {
            })
            const $ = gvc.glitter.$

            var exists = loginData.account == ""
            let topInset: number
            var cancelBlue = true
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 10}
                }
            })
            glitter.runJsInterFace("getAccount", {}, (response) => {
                loginData.account = response.data
                exists = loginData.account == ""
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 10}
                }
            })
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (topInset !== undefined && loginData.account !== undefined) {
                        return `
                <main style="overflow-x: hidden;">
                <div class="w-100" style="position: absolute;">
                <lottie-player src="img/sample/login/login_page.json"  background="#F8F3ED"  speed="1"  onclick="${gvc.event((e) => {
                            glitter.runJsInterFace("dismiss", {}, () => {
                            })
                        })}" style="width: 497px;height: 1073px;position: absolute;transform: translateY(-40%);"  loop  autoplay></lottie-player>
</div>
                    <div class="loginBoard d-flex flex-column align-items-center">
                        <img src="img/sample/login/logo.svg" alt="LOGO">
                        <div class="loginInf d-flex flex-column align-items-center">
                            <div class="userPic" style="border-radius: 50%;background: 50%/cover no-repeat url('img/sample/login/userPic.png');background-color: whitesmoke;" onclick="${gvc.event((e) => {
                            glitter.ut.chooseMediaCallback({
                                single: true,
                                accept: "image/*",
                                callback(data: { data: any; type: string; name: string; extension: string }[]) {
                                    if (data.length > 0) {
                                        glitter.$(e).css('background', `50%/cover no-repeat url('${data[0].data}')`)
                                    }
                                }
                            })
                        })}">
                            </div>

                        <!--四個註冊元素 每個都必填-->
                            <div class="d-flex flex-wrap w-100" style="padding-left: 47px;padding-right: 47px;">
                            ${(exists) ? ` <div class="loginRow d-flex w-100" style="border-bottom: 1px solid #FD6A58;margin-bottom: 23px;">
                            <img src="img/sample/login/message.svg" alt="" style="width: 24px;height: 24px;">
                            <input class="w-100 border-0" placeholder="電子郵件地址或手機號碼" onchange="${gvc.event((e) => {
                            loginData.account = $(e).val()
                        })}">
                        </div>` : ``}
                           <div class="d-flex w-100">
                            <div class="registerElement d-flex">
                                    <img src="img/sample/login/F.svg">
                                    <input class="" placeholder="名稱" name="name" value="" onchange="${gvc.event((e) => {
                            loginData.lastName = glitter.$(e).val()
                        })}">
                                </div>
                                <div class="registerElement d-flex m-0">
                                    <img src="img/sample/login/L.svg">
                                    <input class="" placeholder="姓氏" name="last" onchange="${gvc.event((e) => {
                            loginData.firstName = glitter.$(e).val()
                        })}">
                                </div>
</div>
                               <div class="d-flex w-100">
                              <div class="registerElement d-flex elementMargin">
                                    <img src="img/sample/login/profile.svg">
                                    <select name="gender" style="background: none;color: black;" onchange="${gvc.event((e) => {
                            loginData.gender = glitter.$(e).val()
                        })}">
                                        <option selected value="-1" hidden>性別</option>
                                        <option value="男性" value="1">男性</option>
                                        <option value="女性" value="0">女性</option>
                                    </select>

                                </div>
                                <div class="registerElement d-flex me-0 elementMargin ">
                                    <img src="img/sample/login/calender.svg">
                                    <input class="" type="text" style="background: none;color: black;"  name="birth" onchange="${gvc.event((e) => {
                            loginData.birthDay = glitter.$(e).val()
                        })}" placeholder="請選擇日期" placeholder="MM/DD/YYYY"
                    onclick="${gvc.event((e) => {
                            glitter.runJsInterFace("datePicker", {}, (response) => {
                                glitter.$(e).val(response.data)
                                loginData.birthDay = response.data
                            })
                        })}"   readonly>
                                </div>
</div>

                            </div>


                        <!--會員編號拿掉-->
                        <!--註冊-->
                        <!--todo click-->
                            <div class="loginBTN d-flex justify-content-center align-items-center" style="${(exists) ? `margin-top: 50px;` : ``}" onclick="${gvc.event(() => {
                            checkRegister()
                        })} ">
                                註冊
                            </div>
                        </div>

                    </div>
                </main>
        `
                    } else {
                        return ``
                    }
                },
                divCreate: {class: ``, style: ``}
            })
        }
    }
})


