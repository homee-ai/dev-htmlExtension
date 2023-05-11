import {GVC} from '../glitterBundle/GVController.js';


export class ViewModel{
    public gvc:GVC
    constructor(gvc: GVC) {
        this.gvc=gvc;
    }
    indexOrder=(order:any) => {return `
        <div class="w-100 d-flex position-relative" style="background: #F8F3ED;height: 8px;margin-top: 24px;
border-radius: 4px;z-index: 2;">

        <div class="position-absolute" style="background: #FD6A58;width: ${(() => {
        switch (order.status) {
            case "-1":
                return "0px"
            case "0":
                return "24px;"
            case "1":
                return "calc(100%/3 + 24px);"
            case "2":
                return "calc(100%/3*2 + 12px);"
            case "3":
                return "100%;"
        }
    })()};height: 8px;z-index: 0;
        border-radius: 4px;">

        </div>
        ${(() => {
        var dot = `<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="3" cy="3" r="2.5" fill="white" stroke="#292929"/>
        </svg>`
        var array = ['12px', 'calc(calc(100% - 48px)/3)', 'calc(calc(100% - 48px)/3)', 'calc(calc(100% - 48px)/3)']
        var html = ''
        array.map((data) => {
            html += `<div class="d-flex position-relative" style="z-index: 2;margin-left: ${data};">${dot}</div>`
        })
        return html
    })()}

        </div>
        <div class="w-100 d-flex position-relative" style="height: 8px;margin-top: -2px;
        border-radius: 4px; z-index: 3;">
        ${(() => {
        var dot = `<div style="width: 1px;height: 16px;background-color: #858585;"></div>`
        var array = ['15px', 'calc(calc(100% - 36px)/3)', 'calc(calc(100% - 32px)/3)', 'calc(calc(100% - 34px)/3)']
        var html = ''
        array.map((data) => {
            html += `<div class="d-flex" style="margin-left: ${data};text-align: center;">${dot}</div>`
        })
        return html
    })()}

        </div>
        <div class="w-100 d-flex" style="height: 8px;
        border-radius: 4px;margin-top: 10px;margin-bottom: 10px;">
        ${(() => {
        let dot = `<div style="width: 1px;height: 16px;background-color: #858585;"></div>`;
        let array = ['0px', 'calc(calc(100% - 120px)/3)', 'calc(calc(100% - 120px)/3)', 'calc(calc(100% - 120px)/3)']
        let index2 = ['已下單', '製作中', '配送中', '已送達']
        let html = ''
        array.map((data, index) => {
            html += `<div class="" style="white-space:nowrap;word-break:break-all;margin-left: ${data};text-align: center;font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 10px;
                line-height: 14px;">${index2[index]}</div>`
        })
        return html
    })()}

        </div>`}
    indexUserSpace=(data:any)=>{
        const gvc=this.gvc;
        const glitter=this.gvc.glitter;

        //下方html用到的css
        gvc.addStyle(`
         .mySpaceCount{
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
            border-radius: 8px;
            /* HOMEE white */

            color: #FFFFFF;

        }
        `)
        //範例
        // tempData = [{
        //     title:"我的空間",
        //         icon:"../img/myspace.svg",
        //     count:2,
        //     click:()=>{}
        // }]
        //屬性
        //客戶的我的空間那列的資訊 記得問一下這個是不是該放這 以及中間icon部分應該跟圖檔做連結 要怎麼搞
        let UserSpaceArray = data;
        //方法

        //畫面
        let returnHtml = "";
        let temp = "";
        UserSpaceArray.forEach((item:any)=>{
            let width = (100 / Object.keys(item).length)
            temp = `
                <div class="d-flex flex-column align-items-center" style="width: ${width}%;height: 56px;" onclick="${gvc.event(()=>{
                item.click()
            })}">
                            <!--icom-->
                    <div style="position: relative;width: 26px;height: 24px;">

                         ${glitter.print(()=>{
                if(item.count != 0){
                    return `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${item.count}</div>`
                }
                else{return ``}
            })}

                    <img class="h-100 w-100" src="${item.icon}" style="">

                    </div>
                    <div class="indexTitle" style="margin-top: 5px">
                        ${item.title}
                    </div>

                </div>

                ${glitter.print(()=>{
                if (UserSpaceArray[Object.keys(UserSpaceArray).length - 1] !== item)
                    return  `<div style="width: 1px;height: 48px;background-color: #EAD8C2;"></div>   `
                else
                    return ``
            })}

                    `
            returnHtml += temp
        })
        return returnHtml;
    }
    indexServiceList=(data:any[])=>{
        const gvc=this.gvc;
        const glitter=this.gvc.glitter;
        //屬性
        //客戶的我的空間那列的資訊 記得問一下這個是不是該放這 以及中間icon部分應該跟圖檔做連結 要怎麼搞
        let serviceList = data;
        //方法

        //畫面

        let returnHtml = "";
        let temp = "";
        serviceList.forEach((item:any)=>{
            temp = `
                <div class="d-flex" style="padding-left:2px;height: 29px;align-items: center;" onclick="${gvc.event(() => {
                item.click()
            })}">
                    <img src="${item.icon}" style="height: 20px;width: 20px;margin-right: 26px" alt="">
                    <div class="indexTitle">${item.title}</div>
                    <!--todo append click fun-->
                    <img class="ms-auto" src="img/angle-right.svg" alt="" style="width: 16px;height: 16px;">
                </div>
                ${glitter.print(() => {
                if (serviceList[Object.keys(serviceList).length - 1] !== item)
                    return `<div style="width: 100%;height: 1px;background-color: #EAD8C2;"></div>   `
                else
                    return ``
            })}

            `
            returnHtml += temp
        })
        return returnHtml;
    }

    mainServiceRow=(left:string , rignt:string , click:()=>void)=>{
        const gvc=this.gvc;
        const glitter=this.gvc.glitter;
        //屬性
        //客戶的我的空間那列的資訊 記得問一下這個是不是該放這 以及中間icon部分應該跟圖檔做連結 要怎麼搞
        gvc.addStyle(`
            .serviceRow{
                padding : 0px 20px;
                gap : 8px;
                           
                height : 68px;
                
                background : #FBF9F6;
                border-radius : 20px;
                
                margin-bottom : 12px;
            }      
            .left{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 23px;
                
                /* HOMEE black */

                color: #292929;

            }   
            .right{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 13px;
                line-height: 14px;
                /* identical to box height, or 108% */
                
                
                /* HOMEE dark grey */
                
                color: #858585;

            }   
        `)
        // //方法
        //
        // //畫面
        //
        return `
            <div class="d-flex align-items-center  w-100 serviceRow" onclick="${gvc.event(() => {
                click();
            })}">
                <div class="d-flex me-auto" style="padding-left:2px;height: 29px;align-items: center;" >
                    ${left}
                </div>
                <div class="d-flex align-items-center ms-auto">
                    ${rignt}
                    <img class="ms-auto" src="img/angle-right.svg" alt="" style="width: 16px;height: 16px;">
                </div>
            </div>
            
            `;
    }
    ourServiceRow=(left:string , rignt:string , click:()=>void)=>{
        const gvc=this.gvc;
        const glitter=this.gvc.glitter;
        //屬性
        //客戶的我的空間那列的資訊 記得問一下這個是不是該放這 以及中間icon部分應該跟圖檔做連結 要怎麼搞
        gvc.addStyle(`
            .serviceRow{
                padding-left : 32px;
                padding-right : 24px;
                gap : 8px;
                margin-bottom:17px;                          
                height : 23px;
                               
            }      
            .left{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 15px;
                line-height: 150%;
                /* identical to box height, or 22px */
                
                
                /* HOMEE grey */
                
                color: #858585;

            }   
            .right{
                font-family: 'Noto Sans TC';
                font-style: normal;
                font-weight: 400;
                font-size: 13px;
                line-height: 14px;
                /* identical to box height, or 108% */
                
                
                /* HOMEE dark grey */
                
                color: #858585;

            }   
        `)
        // //方法
        //
        // //畫面
        //
        return `
            <div class="d-flex align-items-center  w-100 serviceRow" onclick="${gvc.event(() => {
            click();
        })}">
                <div class="d-flex me-auto left" style="padding-left:2px;height: 29px;align-items: center;" >
                    ${left}
                </div>
                <div class="d-flex align-items-center ms-auto">
                    ${rignt}
                    <img class="ms-auto" src="img/angle-right.svg" alt="" style="width: 24px;height: 24px;">
                </div>
            </div>
            
            `;
    }
    addQuantile=function (num:number) {
        if (typeof num !== 'number') return num;
        var result:any[] = [];
        num.toString()
            .split('')
            .reverse()
            .map((n, i) => {
                result.splice(0, 0, n);
                i % 3 == 2 && i != num.toString().length - 1 && result.splice(0, 0, ',');
            });
        return result.join('');
    }

    inviteFriendText=(paragraph:any)=>{
        const gvc=this.gvc;

        const glitter=this.gvc.glitter;

        gvc.addStyle(`
            .commonText{
                word-break: break-all;
                white-space: normal;
                width:100%;
                display:flex;
            }
        `)
        return `${gvc.bindView({
            bind:paragraph.name,
            view:()=>{

                switch (paragraph.type){
                    case "title":{
                        return `
                        <div class="commonText"  style="height: 38px; font-weight: 700;font-size: 24px;line-height: 38px;margin-top: 68px;">
                            ${paragraph.text}
                        </div>`
                    }
                    case "subtitle":{
                        return `
                        <div class="commonText" style="font-weight: 700;font-size: 18px;margin-top: 30px;">
                            ${paragraph.text}
                        </div>`
                    }
                    case "text":{
                        return `
                        <div class="commonText" style="font-weight: 500;font-size: 16px;">
                            ${paragraph.text}
                        </div>`
                    }
                       

                }
                return ``
            }
        })}`

    }
}
