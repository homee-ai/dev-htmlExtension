'use strict';
import {init} from '../../glitterBundle/GVController.js';
import {ViewModel} from '../../view/userProfile.js'
import {SharedView} from "../../widget/sharedView.js"


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
    let viewModel = new ViewModel(gvc)
    let shareView = new SharedView(gvc)
    let vm = {
        empty:true
    }


    let model:any = undefined;
    initModel();

    gvc.addStyle(`
        html{
            overflow-y : auto;
        }
        main{
            width:100%;
            padding-left:19px;
            padding-right:19px;
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
                title: "編輯首選地址",
                leftIcon:`<img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                    glitter.goBack("edit_Profile")
                })}">`,
                rightIcon:`
            `
        })}
        </div>
        <main style="">               
                                                          
            ${gvc.bindView({
                bind : "firstAddress",
                view : ()=>{
               
                    let returnData = ``;
                    //繪製輸入格
                    model.forEach((data:any)=>{
                        returnData += viewModel.inputRow(data )
                    })
                    
                    
                    
                    return `
                    <div class="w-100 d-flex flex-column" style="margin-top:6px;">
                        <div class="w-100 acc-title d-flex justify-content-between align-items-center">
                            <div class="">首選地址</div>
                        </div>                                            
                        ${returnData}                                     
                    </div>`
                },onCreate : ()=>{
                    
                }
            })}
<!--            按鍵描繪-->
            ${gvc.bindView({
               bind : "btnGroup",
               view : ()=>{
                   gvc.addStyle(`
                       .OKBtn{
                        height: 48px;
                        left: 0px;
                        top: 0px;
                        background: #FD6A58;
                        border-radius: 28px;
                        color: #FFFFFF;
                       }
                       .delete-btn{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 15px;
                        line-height: 150%;
                        /* identical to box height, or 22px */
                        
                        text-align: center;
                        
                        /* HOMEE black */
                        
                        color: #292929;
                        
                        margin-top:8px;
                       }
                   `)
                   if (vm.empty){
                       return `
                       <bottom class="OKBtn w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                           glitter.share.addressModel = model;
                           glitter.setHome('jsPage/user/edit.js', 'edit_Profile', {})

                       })}">更新地址</bottom>
                       <div class="delete-btn" onclick="${gvc.event(()=>{
                           glitter.share.addressModel = undefined;
                           glitter.goBack("edit_Profile")
                       })}">刪除地址</div>
                   `
                   }else {
                       return `
                       <bottom class="OKBtn w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                           //要把這邊 選擇市跟鄉鎮 改回原本的一長條 改回text
                           model[3].type = "text"
                           glitter.share.addressModel = model;
                           console.log(glitter.share.addressModel)
                           glitter.setHome('jsPage/user/edit.js', 'edit_Profile', {})
                       })}">
                           儲存
                       </bottom>
                       `
                   }
                   
                   
               }, divCreate : {style : `padding: 0 59px;margin-top:40px;` , class : `d-flex flex-column justify-content-center align-items-center`}
            })}
                
            
        </main>`
                },
                divCreate: {class: ``, style: ``}
            })
        },
        onResume: function () {
        },
        onCreate: () => {

        }
    }
    function initModel(){
        vm.empty = !!(glitter.share?.addressModel);

        let address = (glitter.share?.addressModel) ?glitter.share?.addressModel[3].placehold:""



        model = [
            {
                left : "姓名",
                type : "name",
                name : "address-name",
                placehold : {last:glitter.share?.addressModel?.last_name || "" , first:glitter.share?.addressModel?.first_name || ""}
            },
            {
                left : "電話",
                type : "number",
                name : "address-phone",
                placehold : glitter.share?.addressModel?.address_phone || ""
            },
            {
                left : "公司名稱",
                type : "text",
                name : "company",
                placehold : glitter.share?.addressModel?.company || ""
            },
            {
                left : "地址",
                type : "address",
                name : "address",
                placehold : address
            }
        ];

    }
})

