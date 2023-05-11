'use strict';
import {init} from '../../glitterBundle/GVController.js';
import {ViewModel} from '../../view/userProfile.js'
import {SharedView} from "../../widget/sharedView.js"
import {Dialog} from "../../widget/dialog.js"
import {Funnel} from '../../glitterBundle/funnel.js';
import {User} from "../../api/user.js"

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

        html {
            width: 100%;
            height: 100%;

        }

        body {
            width: 100%;
            height: 100%;
     
        }

        main {
            padding: 24px 35px 44px;
         
            font-family: 'Noto Sans TC';
            margin: 0;
            box-sizing: border-box;
        }

        .homeBlack {
            color: #292929;
        }

        .mySpaceCount {
            width: 18px;
            height: 18px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            line-height: 15px;
            text-align: center;
  
            /* HOMEE white */

            border: 1px solid #FFFFFF;
            border-radius: 8px;
            /* HOMEE white */

            color: #FFFFFF;

        }

        .indexTitle {
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;

            /* HOMEE white */
            color: #292929;
        }
        
        .save{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 25px;
            /* identical to box height */
            
            text-align: center;
            
            /* HOMEE red */
            
            color: #FD6A58;
        }
        .changePhoto{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 14px;
            line-height: 20px;
            font-feature-settings: 'pnum' on, 'lnum' on;
            
            /* HOMEE red */
            
            color: #FD6A58;
            
            margin-top : 8px;
        }
        .acc-title{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 35px;
            color: #292929;
            margin-bottom : 18px;
        }
        `)
    gvc.addStyle(`
        html{
            overflow-y : auto;
            box-sizing: border-box;
        }
        main{
            width:100%;

        }
        .addr-add{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
     
            
            
            /* HOMEE red */
            
            color: #FD6A58;
        }
        .addr-edit{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #FD6A58;
            margin-right : 12px;
        }
        .addr-del{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 150%;
            color: #858585;
           
        }
    `)
    let dialog = new Dialog(gvc)
    let viewModel = new ViewModel(gvc)
    let shareView = new SharedView(gvc)
    let vm = {
        loading: false,
    }
    let firstAddressData: any = {};
    let accountModel: any = [
        {
            left: "姓名",
            type: "name",
            name: "name",
            placehold: {last: glitter.share.userData.last_name, first: glitter.share.userData.first_name}
        },
        {
            left: "用戶名稱",
            type: "text",
            name: "userName",
            placehold: (glitter.share.userData.name) ?? (glitter.share.userData.last_name + glitter.share.userData.first_name)
        },
        {
            left: "電子郵件",
            type: "email",
            name: "email",
            placehold: glitter.share.userData.email || ""
        },
        {
            left: "電話",
            type: "number",
            name: "phone",
            placehold: glitter.share.userData.phone || ""
        },
        {
            left: "密碼",
            type: "password",
            name: "password",
            check: false,
            placehold: ""
        },
        {
            visible: false,
            left: "新密碼",
            type: "password",
            name: "newPassword",
            placehold: ""
        },
        {
            visible: false,
            left: "再次輸入",
            type: "password",
            name: "confirmPassword",
            placehold: ""
        }

    ];
    let photoFile:any = undefined
    let b64 :any= undefined
    var resetPassword=false
    let addressModel: any = []
    return {
        onCreateView: () => {
            let topInset: number = 10
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = response.data
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    return {data: 10}
                }
            })

            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    return `
        <div class="w-100 d-flex" style="padding-right: 26px;">
           ${shareView.navigationBar({
                        title: "編輯我的帳號",
                        leftIcon: `<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                            if(glitter.getUrlParameter('navagation')=="true"){
                                glitter.runJsInterFace("dismiss",{},()=>{})
                            }else{
                                glitter.goBack()
                            }
                        })}">`,
                        rightIcon: `<div class="save" onclick="${gvc.event(() => {
                            saveData();
                        })}">儲存</div>`
                    })}
        </div>
        <main style="overflow-x: hidden;">                                   
                ${(() => {
                        let funnel = new Funnel(gvc)
                        return gvc.map([`<input
                            type="file"
                            class="d-none"
                            id="${gvc.id("photo")}"
                            onchange="${gvc.event((e) => {
                            for (let i = 0; i < $(e).get(0).files.length; i++) {
                                let f = $(e).get(0).files[i];
                                let ran = funnel.randomString(3);
                                const regex = new RegExp('[^.]+$');
                                const extension = f.name.match(regex);
                                funnel.encodeFileBase64(f, (data) => {
                                    photoFile = {
                                        ran: ran,
                                        fullName: f.name,
                                        name: f.name.substring(0, extension.index - 1),
                                        ext: extension[0],
                                        data: f,
                                    };
                                    b64=data
                                    $('#'+gvc.id('photoImage')).attr('src',b64)
                                });
                            }
                        })}"
                        />`, gvc.bindView({
                            bind: "photo",
                            view: () => {
                                return `
                        <div class="w-100 d-flex flex-column align-items-center">                            
                            <img id="${gvc.id('photoImage')}" src="${(photoFile !== undefined) ? b64 : glitter.share.userData.photo}" style="width: 128px;height: 128px;border-radius: 50%"
                            onclick="${gvc.event(()=>{
                                    $(`#${gvc.id("photo")}`).click()
                                })}">
                            <div class="changePhoto" onclick="${gvc.event(() => {
                                    $(`#${gvc.id("photo")}`).click()
                                })}">更換大頭貼</div>                                                      
                        </div>
                    `;
                            },
                            divCreate: {
                                class: `w-100 d-flex justify-content-center align-items-center`,
                                style: `margin-bottom : 40px;`
                            }
                        })])
                    })()}                        
            ${gvc.bindView({
                        bind: "accountData",
                        view: () => {
                            return `<div class="w-100 d-flex flex-column">
                                <div class="acc-title">帳號資料</div>
                                ${gvc.map(accountModel.map((dd: any) => {
                                if (dd.name === 'password') {
                                    return gvc.bindView({
                                        bind: `${dd.name}-inputRow`,
                                        view: () => {

                                            return `                            
                                <div class="left" style="">${dd.left}</div>
                                <div class="right" style="width: 78%;position: relative">
                                    <input class="w-100 border-0 pwInput" name="password" type="password" placeholder="輸入原先密碼" onchange="${gvc.event((e) => {
                                                dd.placehold = e.value
                                            })}" value="${dd.placehold}">
                                    ${(dd.check) ? `` : ` <div class="pwCheck" onclick="${gvc.event(() => {
                                                if (glitter.share.userData.pwd !== dd.placehold) {
                                                    dialog.showInfo("密碼輸入錯誤!")
                                                } else {
                                                    accountModel.map((d2: any) => {
                                                        d2.visible = 'true'
                                                    })
                                                    dd.check = true
                                                    resetPassword=true
                                                    gvc.notifyDataChange('accountData')
                                                }
                                               
                                            })}">確認</div>    `}
                                                                   
                                </div>                               
                                
                            `
                                        },
                                        divCreate: {style: ``, class: `d-flex align-items-center input-row`}
                                    })
                                } else {
                                    if (dd.visible === false) {
                                        return ``
                                    } else {
                                        return viewModel.inputRow(dd)
                                    }
                                }
                            }))}
                            </div>`
                        },
                        divCreate: {}
                    })}
            ${gvc.bindView({
                        bind: "firstAddress",
                        view: () => {

                            if (vm.loading && firstAddressData?.address) {
                                let temp: any = firstAddressData.address

                                let address = `${temp.city} ${temp.zipcode} ${temp.town} ${temp.address}`

                                addressModel = [
                                    {
                                        left: "姓名",
                                        type: "name",
                                        name: "addressName",
                                        placehold: {
                                            last: firstAddressData.last_name,
                                            first: firstAddressData.first_name
                                        }
                                    },
                                    {
                                        left: "電話",
                                        type: "number",
                                        name: "addressPhone",
                                        placehold: firstAddressData.address_phone
                                    },
                                    {
                                        left: "公司名稱",
                                        type: "text",
                                        name: "addressCompany",
                                        placehold: firstAddressData.company
                                    },
                                    {
                                        left: "地址",
                                        type: "text",
                                        name: "address",
                                        placehold: address
                                    }
                                ];
                            }

                            let returnData = ``;

                            addressModel.forEach((data: any) => {
                                returnData += viewModel.inputRow(data, "readonly")
                            })


                            let addBtn = ``
                            if (vm.loading && !firstAddressData?.address) {
                                addBtn = `<div class="addr-add" onclick="${gvc.event(() => {
                                    glitter.changePage('jsPage/user/editFirstAddress.js', "editFirstAddress", true, {})
                                })}">新增</div>`
                            } else {
                                addBtn = `
                            <div class="d-flex">
                                <div class="addr-edit" onclick="${gvc.event(() => {
                                    glitter.changePage('jsPage/user/editFirstAddress.js', "editFirstAddress", true, {address: firstAddressData})
                                })}">編輯</div>
                                <div class="addr-del" onclick="${gvc.event(() => {
                                    deleteFirstAddress()
                                })}">刪除</div>
                            </div>`
                            }


                            return `
                    <div class="w-100 d-flex flex-column d-none" style="margin-top:6px;">
                        <div class="w-100 acc-title d-flex justify-content-between align-items-center">
                            <div class="">首選地址</div>${addBtn}
                        </div>                                            
                        ${returnData}               
                    </div>`
                        }
                    })}
        </main>`
                },
                divCreate: {class: ``, style: `overflow-x: hidden;width:calc(100vw);`}
            })
        },
        onResume: function () {
        },
        onCreate: () => {
            glitter.runJsInterFace("getFirstAddress", {}, (response) => {
                firstAddressData = response
                vm.loading = true;
                gvc.notifyDataChange('mainView')
            }, {
                webFunction: () => {
                    //todo 這邊可以的話預設值地址改一下 隨便地方
                    return {
                        last_name: "Lai",
                        first_name: "Zack",
                        address_phone: "0981825882",
                        company: "HOMEE",
                        address: {
                            city: "臺中市",
                            zipcode: "429",
                            town: "神岡區",
                            address: "圳堵里和睦路一段61巷49號"

                        },

                    }
                }
            })
            if (gBundle.event == "changePhoto") {
                changeHeadPhoto();
            }
        }
    }

    function deleteFirstAddress() {
        if (confirm("確定刪除?")) {
            glitter.runJsInterFace("deleteAddress", {}, (response) => {
                //todo 刪掉的api
                firstAddressData = {};
                gvc.notifyDataChange('mainView')

            }, {
                webFunction: () => {
                    return {result: "OK"}
                }
            })
        }
    }

    function changeHeadPhoto() {
        glitter.runJsInterFace("changeHeadPhoto", {}, (response) => {
            //todo 刪掉的api
            glitter.share.userData.photo = response.url;
            gvc.notifyDataChange('photo')

        }, {
            webFunction: () => {
                return {url: "https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=Zack&txtfont=Helvetica&txtalign=middle,center"}
            }
        })
    }

    //todo 改密碼
    function saveData() {
        if(resetPassword){
            if(accountModel[5].placehold.length < 8){
                dialog.showInfo("密碼長度必須大於8位數")
                return
            }else if(accountModel[5].placehold !== accountModel[6].placehold){
                dialog.showInfo("密碼不一致!")
                return
            }

        }
        let accountInputData: any = {
            last_name: accountModel[0].placehold.last,
            first_name: accountModel[0].placehold.first,
            name: accountModel[1].placehold,
            email: accountModel[2].placehold,
            phone: accountModel[3].placehold,
            pwd:accountModel[5].placehold,
            resetPwd:resetPassword,
            photo:glitter.share.userData.photo
        };
        function saveEvent(){
            glitter.runJsInterFace("saveData", accountInputData, (response) => {

            }, {
                webFunction: () => {
                    return {result: "OK"}
                }
            })
        }
        if(photoFile!==undefined){
            dialog.dataLoading(true)
            $.ajax({
                url: glitter.share.apiURL+'/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name:`${new Date().getTime()}.png`}),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.share.userData.AUTH },
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile.data,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            accountInputData.photo=data1.fullUrl
                            saveEvent()
                        },
                        error: (err: any) => {
                            dialog.dataLoading(false)
                            dialog.showInfo("上傳失敗!")
                        },
                    });
                },
                error: (err: any) => {
                    dialog.dataLoading(false)
                    dialog.showInfo("上傳失敗!")
                },
            });
        }else {
            saveEvent()
        }
    }
})
 const formatDate = (date?: string | Date, symbol?: string) => {
    let d = date === undefined || date === null || date == '' ? new Date() : new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(symbol ?? '-');
};

 const formatTimeByAPM = (time?: string | Date, apm?: boolean) => {
    let d = time ? new Date(time) : new Date(),
        hour = (apm && d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString(),
        min = '' + d.getMinutes(),
        meridiem = d.getHours() < 12 ? ' AM' : ' PM';
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;
    let result = [hour, min].join(':');
    apm && (result += meridiem);

    return result;
};

const formatTimeByHMS = (time?: string, symbol?: string) => {
    let result: string = '';
    if (time === undefined) {
        let date = new Date(),
            h = '' + date.getHours(),
            m = '' + date.getMinutes(),
            s = '' + date.getSeconds();
        if (h.length < 2) h = '0' + h;
        if (m.length < 2) m = '0' + m;
        if (s.length < 2) s = '0' + s;
        result = [h, m, s].join(symbol ?? ':');
    } else {
        time.length < 8 && (time = '0' + time);
        let hour = time.slice(0, 2),
            min = time.slice(3, 5),
            meridiem = time.slice(6, 8);
        if ((meridiem === 'pm' || meridiem === 'PM') && hour !== '12') {
            hour = (parseInt(hour) + 12).toString();
        } else if ((meridiem === 'am' || meridiem === 'AM') && hour === '12') {
            hour = '00';
        }
        result = [hour, min, '00'].join(symbol ?? ':');
    }
    return result;
};
