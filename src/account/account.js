'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { Api } from "../homee/api/homee-api.js";
import { Dialog } from "../dialog/dialog-mobile.js";
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { appConfig } from "../config.js";
import { User } from "../api/user.js";
Plugin.create(import.meta.url, (glitter) => {
    const api = {
        upload: (photoFile, callback) => {
            glitter.share.dialog.dataLoading({ text: '上傳中', visible: true });
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}` }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            glitter.share.dialog.dataLoading({ visible: false });
                            glitter.share.dialog.successMessage({ text: "上傳成功" });
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            glitter.share.dialog.successMessage({ text: "上傳失敗" });
                        },
                    });
                },
                error: (err) => {
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        }
    };
    return {
        login: {
            defaultData: {
                topInset: 10,
                accountData: {
                    account: '',
                    password: ''
                },
                event: {
                    forgotPW: {},
                    login: {},
                    register: {}
                },
                background: new URL('../img/component/login/login_page.json', import.meta.url),
            },
            render: (gvc, widget, setting, hoverID) => {
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
        
                    margin-top: 50px;
        
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
                return {
                    view: () => {
                        glitter.share.viewGuide = false;
                        widget.data.accountData = {
                            account: '',
                            password: ''
                        };
                        gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                            gvc.notifyDataChange('mainView');
                        }, () => {
                        });
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (widget.data.topInset != response.data) {
                                widget.data.topInset = response.data;
                                gvc.notifyDataChange('mainView');
                            }
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        const dialog = new Dialog(gvc);
                        function login() {
                            User.login({
                                third: vm.fet ? { type: 'fet', uid: vm.fet } : undefined,
                                pwd: widget.data.accountData.password,
                                account: widget.data.accountData.account,
                                callback(data) {
                                    dialog.dataLoading(false);
                                    if (!data) {
                                        dialog.showInfo('密碼輸入錯誤或是查無此帳號');
                                    }
                                    else {
                                        dialog.showInfo('登入成功!');
                                        appConfig().setHome(gvc, 'user_setting', {});
                                    }
                                },
                            });
                        }
                        function checkRegister() {
                            dialog.dataLoading(true);
                            User.checkUserExists(widget.data.accountData.account, (response) => {
                                if (response === undefined) {
                                    dialog.dataLoading(false);
                                    dialog.showInfo("連線逾時");
                                }
                                else if (response) {
                                    dialog.showInfo("此帳號已被使用");
                                }
                                else {
                                    setTimeout(() => {
                                        dialog.dataLoading(false);
                                        appConfig().changePage(gvc, "register", {
                                            pwd: widget.data.accountData.password,
                                            account: widget.data.accountData.account,
                                            third: vm.fet ? { type: 'fet', uid: vm.fet } : undefined
                                        }, {
                                            animation: glitter.animation.fade
                                        });
                                    }, 500);
                                }
                            });
                        }
                        const vm = {
                            fet: ''
                        };
                        return gvc.bindView({
                            bind: `mainView`,
                            dataList: [{ obj: vm, key: 'fet' }],
                            view: () => {
                                return `
                            <main style="overflow-x: hidden;">
                                <div class="w-100" style="position: absolute;">
                                    <lottie-player src="${new URL('../img/component/login/login_page.json', import.meta.url)}"  background="#F8F3ED"  speed="1"  onclick="${gvc.event((e) => {
                                    appConfig().setHome(gvc, 'home', {});
                                })}" style="width: 100%;height: 900px;position: absolute;transform: translateY(-350px);"  loop  autoplay></lottie-player>
                                </div>
                                <div class="loginBoard d-flex flex-column align-items-center">
                                    <img src="${new URL('../img/component/login/logo.svg', import.meta.url)}" alt=
                                    "">
                                    <div class="loginInf d-flex flex-column align-items-center">
                                         <div class="loginRow d-flex w-100" style="border-bottom: 1px solid #FD6A58;">
                                                <img src="${new URL('../img/component/login/message.svg', import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                <input class="w-100 border-0 bg-white" placeholder="電子郵件地址或手機號碼" onchange="${gvc.event((e) => {
                                    widget.data.accountData.account = e.value;
                                })}">
                                            </div>
                                        <div class="loginRow d-flex w-100" style="margin-top: 40px;border-bottom: 1px solid #FD6A58;">
                                            <img src="${new URL('../img/component/login/password.svg', import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                            <input type="password" class="w-100 border-0" name="password" placeholder="密碼" onchange="${gvc.event((e) => {
                                    widget.data.accountData.password = e.value;
                                })}">
                                        </div>
                                        <div class="loginRow w-100 d-flex" style="margin-top: 8px;padding-bottom: 0px;">
                    <!--                    todo sethome trans to changepage-->
                                            <div class="fogetPW ms-auto" onclick="${gvc.event(() => {
                                    appConfig().changePage(gvc, "forgotPW");
                                })}">忘記密碼？</div>
                                           
                                        </div>
                                        <div class="loginBTN d-flex justify-content-center align-items-center" style="margin-top: 40px;height: 56px;" onclick="${gvc.event(() => {
                                    if (!widget.data.accountData.account) {
                                        alert("帳號不得為空!");
                                    }
                                    else if (widget.data.accountData.password.length < 8) {
                                        alert("密碼必須大於8位數");
                                    }
                                    else {
                                        login();
                                    }
                                })}">
                                            登入
                                        </div>
                                        <div class="w-100 d-flex align-items-center justify-content-center" style="margin-top:16px;font-weight: 500;font-size: 18px;line-height: 26px;font-feature-settings: 'pnum' on, 'lnum' on;color: #1E1E1E;" onclick="${gvc.event(() => {
                                    checkRegister();
                                })}">註冊帳號</div>
                                        <div class="w-100 text-danger text-center mt-2 ${vm.fet ? '' : 'd-none'}">驗證成功，登入或註冊後即可綁定遠傳帳號</div>
                                        <div class="moreLogin d-flex justify-content-center align-items-center">更多的登入方式</div>
                                        <div class="funGroup d-flex justify-content-between">
                                            <img src="${new URL('../img/component/login/FB.png', import.meta.url)}" style="height: 50px;width:50px;" alt="" onclick="${gvc.event(() => {
                                    glitter.runJsInterFace("loginWithFB", {}, (response) => {
                                        dialog.dataLoading(false);
                                        if (response.email && response.token) {
                                            dialog.dataLoading(true);
                                            User.loginFB(response.email, response.token, vm.fet ? { type: 'fet', uid: vm.fet } : undefined, (data, code) => {
                                                dialog.dataLoading(false);
                                                if (!data) {
                                                    dialog.showInfo('登入失敗');
                                                }
                                                else if (data.type == 'signup') {
                                                    appConfig().changePage(gvc, "register", {
                                                        pwd: gvc.glitter.getUUID(),
                                                        account: response.email,
                                                        third: data['third']
                                                    }, {
                                                        animation: glitter.animation.fade
                                                    });
                                                }
                                                else {
                                                    dialog.showInfo('登入成功!');
                                                    appConfig().setHome(gvc, 'user_setting', {});
                                                }
                                            });
                                        }
                                    });
                                })}">
                                            <img src="${new URL('../img/component/login/apple.png', import.meta.url)}" style="height: 55px;width:55px;margin-left: 16px;margin-right: 16px;" onclick="${gvc.event(() => {
                                    dialog.dataLoading(true);
                                    glitter.runJsInterFace("loginWithApple", {}, (response) => {
                                        dialog.dataLoading(false);
                                        if (response.result) {
                                            dialog.dataLoading(true);
                                            User.loginApple(response.token, response.bundle, (data, code) => {
                                                dialog.dataLoading(false);
                                                if (!data) {
                                                    dialog.showInfo('登入失敗');
                                                }
                                                else if (data.type == 'signup') {
                                                    appConfig().changePage(gvc, "register", {
                                                        pwd: gvc.glitter.getUUID(),
                                                        account: data['third'].email,
                                                        third: data['third']
                                                    }, {
                                                        animation: glitter.animation.fade
                                                    });
                                                }
                                                else {
                                                    dialog.showInfo('登入成功!');
                                                    appConfig().setHome(gvc, 'user_setting', {});
                                                }
                                            });
                                        }
                                    });
                                })}" alt="">
                                            <img src="${new URL('../img/component/login/FET.png', import.meta.url)}"  style="height: 45px;width:45px;" onclick="${gvc.event(() => {
                                    dialog.dataLoading(true);
                                    glitter.runJsInterFace("loginWithFet", {}, (response) => {
                                        dialog.dataLoading(false);
                                        if (response.result) {
                                            User.loginFet(response.fet, (data, code) => {
                                                dialog.dataLoading(false);
                                                if (!data) {
                                                    dialog.showInfo('登入失敗');
                                                }
                                                else if (data.type == 'signup') {
                                                    vm.fet = data['third'].uid;
                                                    dialog.showInfo('驗證成功，登入或註冊後即可綁定遠傳帳號!');
                                                }
                                                else {
                                                    dialog.showInfo('登入成功!');
                                                    appConfig().setHome(gvc, 'user_setting', {});
                                                }
                                            });
                                        }
                                        else {
                                            dialog.showInfo('登入失敗');
                                        }
                                    });
                                })}" alt="" >
                                        </div>
                                    </div>
                    
                                </div>
                            </main>
                       `;
                            },
                            divCreate: { class: ``, style: `` }
                        });
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">背景動圖</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.background}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'json,image/*',
                                    callback(data) {
                                        api.upload(data[0].file, (link) => {
                                            widget.data.background = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                            </div>`,
                            ClickEvent.editer(gvc, widget, widget.data.event.login)
                        ]);
                    }
                };
            },
        },
        register: {
            defaultData: {
                loginData: {
                    account: undefined,
                    head: '',
                    lastName: '',
                    firstName: '',
                    gender: '-1',
                    birthDay: '',
                    name: '',
                    inviteCode: '',
                    email: '',
                    pwd: ''
                },
                topInset: 10,
                background: new URL('../img/component/login/login_page.json', import.meta.url),
            },
            render: (gvc, widget, setting, hoverID) => {
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
                        margin-top: 24px;
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
                        margin-top: 35px;
            
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
                    var _a, _b;
                    const dialog = new Dialog(gvc);
                    if (widget.data.loginData.gender === "-1" || widget.data.loginData.lastName === '' || widget.data.loginData.firstName === '' || widget.data.loginData.birthDay === '' || widget.data.loginData.name === '') {
                        dialog.showInfo("請填寫完整資料!");
                    }
                    else {
                        let temp = {
                            third: (_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data.third,
                            first: widget.data.loginData.firstName,
                            last: widget.data.loginData.lastName,
                            inviteCode: (widget.data.loginData.inviteCode) || undefined,
                            email: widget.data.loginData.email,
                            pwd: widget.data.loginData.password,
                            gender: widget.data.loginData.gender,
                            birth: widget.data.loginData.birthDay,
                            userName: widget.data.loginData.name,
                        };
                        dialog.dataLoading(true);
                        User.register({
                            third: (_b = gvc.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.obj.data.third,
                            first: widget.data.loginData.firstName,
                            last: widget.data.loginData.lastName,
                            inviteCode: (widget.data.loginData.inviteCode) || undefined,
                            email: widget.data.loginData.email,
                            pwd: widget.data.loginData.password,
                            gender: widget.data.loginData.gender,
                            birth: widget.data.loginData.birthDay,
                            userName: widget.data.loginData.name,
                            callback: (response, code) => {
                                dialog.dataLoading(false);
                                if (response) {
                                    dialog.showInfo('登入成功!');
                                    appConfig().setHome(gvc, 'user_setting', {});
                                }
                                else {
                                    if (code === 'errorCode') {
                                        dialog.showInfo('邀請碼輸入錯誤');
                                    }
                                    else {
                                        dialog.showInfo('此信箱已經註冊．');
                                    }
                                }
                            }
                        });
                    }
                }
                const $ = gvc.glitter.$;
                var exists = widget.data.loginData.account == "";
                return {
                    view: () => {
                        gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                            gvc.notifyDataChange('mainView');
                        }, () => {
                        });
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            widget.data.topInset = response.data;
                            gvc.notifyDataChange('mainView');
                        }, {
                            webFunction: () => {
                                return { data: 10 };
                            }
                        });
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (widget.data.topInset !== undefined && widget.data.loginData.account !== undefined) {
                                    return `
                                        <main style="overflow-x: hidden;position: relative">
                                            <img src="https://homee-ai.github.io/glitter-htmlExtension/src/img/component/left-arrow.svg" alt="L" style="width: 28px;height: 28px;position: absolute;top:${widget.data.topInset + 20}px;left:16px;z-index: 3;" onclick="${gvc.event(() => {
                                        appConfig().setHome(gvc, "login");
                                    })}">
                                            <div class="w-100" style="position: absolute;">
                                                <lottie-player src="${new URL('../img/component/login/login_page.json', import.meta.url)}"  background="#F8F3ED"  speed="1"  onclick="${gvc.event((e) => {
                                    })}" style="width: 100%;height: 1073px;position: absolute;transform: translateY(-40%);"  loop  autoplay></lottie-player>
                                            </div>
                                            <div class="loginBoard d-flex flex-column align-items-center">
                                                <img src="${new URL('../img/component/login/logo.svg', import.meta.url)}" alt="LOGO">
                                                <div class="loginInf d-flex flex-column align-items-center">                                                                                                   
                                                    <div class="d-flex flex-wrap w-100" style="padding-left: 47px;padding-right: 47px;">                                                    
                                                        <div class="d-flex w-100 w-100 me-0">
                                                            <div class="registerElement d-flex elementMargin w-100 me-0">                                                           
                                                                <img src="${new URL('../img/component/login/message.svg', import.meta.url)}">
                                                                <input class="w-100" placeholder="電子郵件地址或手機號碼" name="email" onchange="${gvc.event((e) => {
                                        widget.data.loginData.email = e.value;
                                    })}">                                                           
                                                            </div>                       
                                                        </div>
                                                        <div class="d-flex w-100 w-100 me-0">
                                                            <div class="registerElement d-flex elementMargin w-100 me-0">                                                           
                                                                <img src="${new URL('../img/component/login/password.svg', import.meta.url)}">
                                                                <input class="w-100" placeholder="密碼" name="password" type="password" onchange="${gvc.event((e) => {
                                        widget.data.loginData.password = e.value;
                                    })}">                                                           
                                                            </div>                       
                                                        </div>
                                                        <div class="d-flex w-100">
                                                            <div class="registerElement d-flex elementMargin">                                                           
                                                                <img src="${new URL('../img/component/login/L.svg', import.meta.url)}">
                                                                <input class="" placeholder="姓氏" name="last" onchange="${gvc.event((e) => {
                                        widget.data.loginData.firstName = e.value;
                                    })}">                                                           
                                                            </div>
                                                            <div class="registerElement d-flex  elementMargin">
                                                                <img src="${new URL('../img/component/login/F.svg', import.meta.url)}">
                                                                <input class="" placeholder="名稱" name="name" value="" onchange="${gvc.event((e) => {
                                        widget.data.loginData.lastName = e.value;
                                    })}">
                                                            </div>
                                                        </div>
                                                        <div class="d-flex w-100 w-100 me-0">
                                                            <div class="registerElement d-flex elementMargin w-100 me-0">                                                           
                                                                <img src="${new URL('../img/component/login/addUser.svg', import.meta.url)}">
                                                                <input class="w-100" placeholder="用戶名稱" name="name" onchange="${gvc.event((e) => {
                                        widget.data.loginData.name = e.value;
                                    })}">                                                           
                                                            </div>                       
                                                        </div>
                                                        <div class="d-flex w-100">
                                                            <div class="registerElement d-flex elementMargin">
                                                                <img src="${new URL('../img/component/login/profile.svg', import.meta.url)}">
                                                                <select name="gender" style="background: none;color: black;" onchange="${gvc.event((e) => {
                                        widget.data.loginData.gender = e.value;
                                    })}">
                                                                    <option selected value="-1" hidden>性別</option>
                                                                    <option  value="1">男性</option>
                                                                    <option  value="0">女性</option>
                                                                </select>                       
                                                            </div>
                                                            <div class="registerElement d-flex me-0 elementMargin ">
                                                                <img src="${new URL('../img/component/login/calender.svg', import.meta.url)}">
                                                                <input class="w-100" type="date" style="background: none;color: black;"  name="birth" onchange="${gvc.event((e) => {
                                        widget.data.loginData.birthDay = e.value;
                                    })}" placeholder="出生日期" placeholder="MM/DD/YYYY"
                                                                onclick="${gvc.event((e) => {
                                        glitter.runJsInterFace("datePicker", {}, (response) => {
                                            glitter.$(e).val(response.data);
                                            widget.data.loginData.birthDay = response.data;
                                        });
                                    })}"   >
                                                            </div>
                                                        </div>     
                                                        <div class="d-flex w-100">
                                                            <div class="registerElement d-flex elementMargin w-100 me-0">                                                           
                                                                <img src="${new URL('../img/component/login/TicketStar.svg', import.meta.url)}">
                                                                <input class="w-100 me-0" placeholder="用戶邀請碼" name="inviteCode" onchange="${gvc.event((e) => {
                                        widget.data.loginData.inviteCode = e.value;
                                    })}">                                                           
                                                            </div>                       
                                                        </div>  
                                                                        
                                                    </div>                                                
                                                <!--會員編號拿掉-->
                                                <!--註冊-->
                                                <!--todo click-->
                                                    <div class="loginBTN d-flex justify-content-center align-items-center" style="${(exists) ? `margin-top: 50px;` : ``}" onclick="${gvc.event(() => {
                                        checkRegister();
                                    })} ">
                                                        註冊
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
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        forgotPW: {
            defaultData: {
                background: new URL('../img/component/login/login_page.json', import.meta.url),
                topInset: 10
            },
            render: (gvc, widget, setting, hoverID) => {
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
                    margin-top: 56px;
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
                    white-space:normal;
                    word-wrap:break-word;            
                    word-break:break-all;
        
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
                .helpText{
                    width:338px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 12px;
                    color: #FD6A58;
                }
               `);
                widget.data.background = new URL('../img/component/login/login_page.json', import.meta.url);
                function checkRegister() {
                    appConfig().changePage(gvc, "newPW");
                }
                glitter.runJsInterFace("getTopInset", {}, (response) => {
                    if (widget.data.topInset == response.data) {
                        widget.data.topInset = response.data;
                        gvc.notifyDataChange('mainView');
                    }
                }, {
                    webFunction: () => {
                        return { data: 10 };
                    }
                });
                gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                    gvc.notifyDataChange('mainView');
                }, () => {
                });
                let email = '';
                return {
                    view: () => {
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (widget.data.topInset !== undefined) {
                                    return `
                                    <main style="position: relative">  
                                        <img src="https://homee-ai.github.io/glitter-htmlExtension/src/img/component/left-arrow.svg" alt="L" style="width: 28px;height: 28px;position: absolute;top:20px;left:16px;z-index: 3;" onclick="${gvc.event(() => {
                                        appConfig().setHome(gvc, "login");
                                    })}">                                     
                                        <div class="w-100" style="position: absolute;">
                                            
                                            <lottie-player src="${widget.data.background}"  background="#F8F3ED"  speed="1"  onclick="${gvc.event((e) => {
                                    })}" style="width: 100%;height: 1073px;position: absolute;transform: translateY(-40%);"  loop  autoplay></lottie-player>
                                        </div>
                                        <div class="loginBoard d-flex flex-column align-items-center">
                                            <img src="${new URL('../img/component/login/logo.svg', import.meta.url)}" alt="LOGO">
                                            <div class="loginInf d-flex flex-column align-items-center">
                                                <div style="font-weight: 700;font-size: 32px;line-height: 46px;text-align: center;color: #1E1E1E;">
                                                    重置密碼
                                                </div>
                                                <div style="font-family: 'Noto Sans TC';font-style: normal;font-weight: 500;font-size: 18px;line-height: 26px;font-feature-settings: 'pnum' on, 'lnum' on;color: #1E1E1E;margin-bottom: 59px;">
                                                    我們將向您發送電子郵件或短信以重置密碼
                                                </div>
                                                <div class="loginRow d-flex align-items-center" style="height: 50px;">
                                                    <img src="${new URL('../img/component/login/message.svg', import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                    <input class="w-100 border-0" placeholder="電子郵件地址" style="height: 30px;" onchange="${gvc.event((e) => {
                                        email = e.value;
                                    })}">
                                                </div>
                                                <div class="d-flex d-none" style="margin-top: 32px">
                                                    <div class="authRow d-flex align-items-center">
                                                        <img src="${new URL('../img/component/login/shield.svg', import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                        <input class="w-100 border-0" placeholder="驗證碼" style="margin-left: 16px;">
                                                    </div>
                            <!--                    todo 黑轉色 時間count-->
                                                    <div class="authBtn d-flex justify-content-center align-items-center" onclick="${gvc.event(() => {
                                    })}">
                                                        確認
                                                    </div>
                                                </div>
<!--                                                todo 協助沒有 目前先拿掉-->
                                                <div class="helpText d-flex align-items-center justify-content-end d-none">
                                                    需要協助？
                                                </div>
                        
                                            <!--todo click-->
                                                <div class="loginBTN d-flex justify-content-center align-items-center" onclick="${gvc.event(() => {
                                        const dialog = new Dialog();
                                        dialog.dataLoading(true);
                                        User.forgetPwd(email, (response, code) => {
                                            dialog.dataLoading(false);
                                            if (response) {
                                                dialog.showInfo("驗證信已送出");
                                                gvc.glitter.goBack();
                                            }
                                            else {
                                                dialog.showInfo("驗證信送出失敗");
                                            }
                                        });
                                    })}">
                                                    傳送驗證信
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
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        newPW: {
            defaultData: {
                topInset: undefined,
                background: new URL('../img/component/login/login_page.json', import.meta.url),
            },
            render: (gvc, widget, setting, hoverID) => {
                widget.data.background = new URL('../img/component/login/login_page.json', import.meta.url);
                gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                    gvc.notifyDataChange('mainView');
                }, () => {
                });
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
                    margin-top: px;
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
                .loginRow img{
        
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
                    margin-top: 192px;
        
                }
               `);
                glitter.runJsInterFace("getTopInset", {}, (response) => {
                    if (widget.data.topInset != response.data) {
                        widget.data.topInset = response.data;
                        gvc.notifyDataChange('mainView');
                    }
                }, {
                    webFunction: () => {
                        return { data: 10 };
                    }
                });
                function resetPW() {
                    appConfig().changePage(gvc, "forgotPW");
                }
                return {
                    view: () => {
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                if (widget.data.topInset !== undefined) {
                                    return `
                                    <main>
                                        <div class="w-100" style="position: absolute;">
                                            <lottie-player src="${widget.data.background}"  background="#F8F3ED"  speed="1"  onclick="${gvc.event((e) => {
                                    })}" style="width: 100%;height: 1073px;position: absolute;transform: translateY(-40%);"  loop  autoplay></lottie-player>
                                            <img class="arrow" src="${new URL('../img/component/left-arrow.svg', import.meta.url)}" style="top: ${widget.data.topInset}" alt="">
                                        </div>
                                        <div class="loginBoard d-flex flex-column align-items-center">
                                            <img src="${new URL('../img/component/login/logo.svg', import.meta.url)}" alt="LOGO">
                                            <div class="loginInf d-flex flex-column align-items-center">
                                                <div class="loginRow d-flex">
                                                    <img src="${new URL('../img/component/login/password.svg', import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                    <input type="password" class="w-100 border-0" placeholder="新密碼">
                                                </div>
                    
                                                <div class="loginRow d-flex" style="margin-top: 40px">
                                                    <img src="${new URL('../img/component/login/password.svg', import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                    <input type="password" class="w-100 border-0" placeholder="重新輸入新密碼">
                                                </div>
                    
                                            <!--todo click-->
                                                <div class="loginBTN d-flex justify-content-center align-items-center" onclick="${gvc.event(() => {
                                        resetPW();
                                    })}">
                                                    確認
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
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        empty: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        return ``;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
