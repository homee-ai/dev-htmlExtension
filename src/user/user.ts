'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {Api} from "../homee/api/homee-api.js";
import {SharedView} from "../homee/shareView.js";
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {appConfig} from "../config.js";
import {Funnel} from "../homee/funnel.js";
import {Dialog} from "../homee/legacy/widget/dialog.js";
import {ViewModel} from "../homee/legacy/view/userProfile.js";
import {User} from "../api/user.js";


Plugin.create(import.meta.url, (glitter) => {
    return {
        nav: {
            defaultData: {
                nav: {
                    title: "",
                    leftIcon: new URL('../img/component/left-arrow.svg', import.meta.url),
                    leftPage: "",
                    boxShadow: true,
                    background: "#FFFFFF"
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    .voucherInput{                        
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                    }
                    .voucherInput::placeholder{
                        color: #858585;
                    }
                    
                `)
                const sharedView = new SharedView(gvc);

                return {
                    view: () => {
                        return sharedView.navigationBar({
                            title: widget.data.nav.title,
                            leftIcon: `<img class="" src="${widget.data.nav.leftIcon}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            })}">`,
                            rightIcon: ``,
                            boxShadow: widget.data.nav.boxShadow,
                            background: widget.data.nav.background,
                        })

                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="font-size: 16px;">??????????????????</h3>
                            <select class="form-control" onchange="${gvc.event((e) => {
                                widget.data.nav.boxShadow = (e.value == 1);
                                widget.refreshAll;
                            })}">         
                              <option value="1">???</option>                     
                              <option value="0">??????</option>                              
                              ${(() => {
                                let text = (widget.data.nav.boxShadow) ? "???" : "??????"
                                return `<option selected hidden>${text}</option>`
                            })()}                              
                            </select>
                        `
                            ,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `??????`,
                                default: widget.data.nav.title,
                                placeHolder: widget.data.nav.title,
                                callback: (text: string) => {
                                    widget.data.nav.title = text
                                    widget.refreshAll!()
                                }
                            }),
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">??????icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="?????????????????????" value="${widget.data.nav.leftIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.nav.leftIcon = link;
                                            widget.refreshAll();
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">????????????</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input type="color" value="${widget.data.nav.background}" onchange="${gvc.event((e: HTMLInputElement) => {
                                widget.data.nav.background = e.value;
                                widget.refreshAll();
                            })}">
                            </div>    
                        `
                        ])
                    }

                }
            },
        },
        banner: {
            defaultData: {
                img: new URL('../img/component/ourServiceBanner.png', import.meta.url),
                text: "??????",
                click: () => {

                }
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .banner-text{
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 500;
                        font-size: 15px;
                        color: #1E1E1E;
                        word-wrap:break-word;
                        white-space:pre-wrap; 
                        margin-top : 16px;
                        padding:0 27px;
                    }
                `)
                return {
                    view: () => {
                        return `
                        <div style="padding:0 42px;">
                            <img class="w-100" src="${widget.data.img}">
                        </div>
                        <div class="banner-text">${widget.data.text}</div>
                        
                        `
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">??????icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="?????????????????????" value="${widget.data.img}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                          appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.img = link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `????????????`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            })

                        ])
                    }
                }
            },
        },
        funRow: {
            defaultData: {

                img: "../img/component/notification.svg",
                text: "????????????",
                click: () => {

                }

            },
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data

                return {
                    view: () => {
                        gvc.addStyle(`
                            .rowText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 20px;
                                line-height: 29px;
                                color: #1E1E1E;                                  
                            }
                        `)
                        return `
                        <div class="d-flex align-items-center  " style="padding:35px 0px;" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">
                            <img src="${new URL(widget.data.img)}" alt="${widget.data.text}" style="width: 32px;height: 32px;margin-right: 16px;">
                            <div class="rowText">${widget.data.text}</div>
                            <img class="ms-auto" src="${new URL("../img/component/right-arrow.svg")}" alt="?????????" style="height: 24px;width: 24px;" >
                        </div>
                        `
                    },
                    editor: () => {
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">??????icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="?????????????????????" value="${widget.data.img}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                          appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.img = link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `??????????????????`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            }),

                        ])
                    }
                }
            },
        },
        button: {
            defaultData: {
                text: "??????",
                click: () => {

                }
            },
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
                        return `
                        <buttom class="" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">${widget.data.text}</buttom>
                        `
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `??????????????????`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            })

                        ])
                    }
                }
            },
        },
        text: {
            defaultData: {
                text: "??????",
                click: {}
            },
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
                        return `
                        <div class="" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: widget.data.click
                            })
                        })}">${widget.data.text}</div>
                        `
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `????????????`,
                                default: widget.data.text,
                                placeHolder: widget.data.text,
                                callback: (text: string) => {
                                    widget.data.text = text
                                    widget.refreshAll!()
                                }
                            }),
                            ClickEvent.editer(gvc, widget, widget.data.click)

                        ])
                    }
                }
            },
        },
        dividingLine: {
            defaultData: {
                style: "solid",
                width: 1,
                color: "000"
            },
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
                        return `
                        <div class="w-100" style="border-top: ${widget.data.width}px ${widget.data.style} #${widget.data.color};"></div>
                        
                        `
                    },
                    editor: () => {
                        return gvc.map([])
                    }
                }
            },
        },
        textArea: {
            defaultData: {
                text: "??????",
                click: () => {

                }
            },
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
                        return `
                        <div class="" style="white-space:normal;word-wrap:break-word;word-break:break-all;" onclick="${gvc.event(() => {
                            widget.data.click();
                        })}">${widget.data.text}</div>
                        `
                    },
                    editor: () => {
                        return gvc.map([
                            `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">????????????</h3>
                            <textarea class="form-control p-0" placeholder="" style="height:auto"  onchange="${gvc.event((e) => {
                                let element = e as HTMLTextAreaElement;
                                widget.data.text = e.value;
                                widget.refreshAll!()
                                element.style.height = "auto";
                                element.style.height = (element.scrollHeight) + "px";
                                console.log(e.scrollHeight)
                            })}" >${widget.data.text ?? ''}</textarea>`
                        ])
                    }
                }
            },
        },
        ourService: {
            defaultData: {
                link: [],
                section: [
                    {
                        title: "????????????",
                        service: [
                            {
                                text: "????????????????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "????????????",
                                onclick: () => {

                                }
                            },
                        ]
                    },
                    {
                        title: "????????????",
                        service: [
                            {
                                text: "HOMEE ??????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "??????????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "?????????????????????????????????????????????   ",
                                onclick: () => {

                                }
                            },
                            {
                                text: "?????????????????????",
                                onclick: () => {

                                }
                            },
                        ]
                    },
                    {
                        title: "????????????",
                        service: [
                            {
                                text: "????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "??????????????? / ?????????????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "???????????? / ????????????",
                                onclick: () => {

                                }
                            },
                            {
                                text: "????????????",
                                onclick: () => {

                                }
                            },
                        ]
                    }

                ],
                lastSection: {
                    contactUs: {
                        title: "????????????",
                        servicePhoneTitle: "????????????",
                        servicePhone: "8729-5939 ?????????????????????02???",
                        serviceTimeTitle: "????????????",
                        physicalStore: "??????????????? ~ ?????? 10:00-21:00",
                        onlineStore: "????????????????????? ~ ?????? 09:00-18:00",
                        service1v1: {
                            title: "??????????????????",
                            onclick: () => {
                            }
                        }
                    },
                    kanban: "img/kanban.png"

                }
            },
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data

                return {
                    view: () => {
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

        `)
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
                        return `
                        ${gvc.bindView({
                            bind: "serviceListGroup",
                            view: () => {
                                gvc.addStyle(`
                                    .serviceCard{
                                        background: #FBF9F6;
                                        border-radius: 24px;
                                        padding: 16px 0px 7px;
                                        margin-bottom:16px;
                                    }
                                    
                                    .serviceTitle{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 24px;
                                        line-height: 35px;
                                        color: #292929;
                                        margin-bottom:24px;
                                    }
                                    .serviceText{
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 15px;
                                        line-height: 150%;
                                        color: #858585;
                                    }
                                `)
                                let returnHTML = ``;
                                widget.data.section.forEach((serviceList: any) => {
                                    returnHTML += `                           
                                    ${gvc.bindView({
                                        bind: "service",
                                        view: () => {
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
                                            let serviceGroup = ``;
                                            serviceGroup = gvc.map(serviceList.service.map((service: any) => {
                                                console.log(service)
                                                return `
                                                <div class="d-flex align-items-center  w-100 serviceRow" onclick="${gvc.event(() => {
                                                    ClickEvent.trigger({
                                                        gvc, widget, clickEvent: service
                                                    })
                                                })}">
                                                    <div class="d-flex me-auto left" style="padding-left:2px;height: 29px;align-items: center;" >
                                                        ${service.text}
                                                    </div>
                                                    <div class="d-flex align-items-center ms-auto">                                                        
                                                        <img class="ms-auto" src="${new URL!(`../img/component/angle-right.svg`, import.meta.url)}" alt="" style="width: 24px;height: 24px;">
                                                    </div>
                                                </div>
                                              
                                              `
                                            }))

                                            return `
                                    <div class="d-flex align-items-center flex-column serviceCard">
                                        <div class="serviceTitle">${serviceList.title}</div>
                                        ${serviceGroup}
                                    </div>
                                `

                                        }
                                    })}
                                `

                                })
                                return returnHTML
                            }, divCreate: {style: `margin-top: 26px;`, class: ``}
                        })}
                        ${gvc.bindView({
                            bind: "lastSection",
                            view: () => {
                                gvc.addStyle(`
                                .lastSectionTitle{
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 700;
                                    font-size: 24px;
                                    line-height: 35px;
                                    
                                    color: #292929;
                                    
                                    margin-bottom : 24px;
                                }
                                .serviceTimeBlock * ,.servicePhoneBlock *{
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 400;
                                    font-size: 15px;
                                    line-height: 150%;
                                    color: #858585;
                                }
                                .serviceBTN{
                                    height: 48px;
                                    margin-top:24px;
                                    font-family: 'Noto Sans TC';
                                    font-style: normal;
                                    font-weight: 700;
                                    font-size: 18px;
                                    line-height: 26px;
                                    
                                    text-align: center;
                                    letter-spacing: 0.15em;
        
                                    background: #FD6A58;
                                    border-radius: 28px;
                                    
                                    
                                    color: #FFFFFF;
                                    
                                    
                                }
                            `)
                                let thisModel = widget.data.lastSection
                                return `
                        
                                <div class="lastSectionTitle d-flex justify-content-center align-items-center">${thisModel.contactUs.title}</div>
                                <div class="servicePhoneBlock d-flex flex-column align-items-start justify-content-start" style="margin-bottom: 16px;">
                                    <div>${thisModel.contactUs.servicePhoneTitle}</div>
                                    <div>${thisModel.contactUs.servicePhone}</div>
                                </div>
                                <div class="serviceTimeBlock" >
                                    <div>${thisModel.contactUs.serviceTimeTitle}</div>
                                    <div>${thisModel.contactUs.physicalStore}</div>
                                    <div>${thisModel.contactUs.onlineStore}</div>
                                </div>
                                <button class="w-100 serviceBTN border-0" onclick="${gvc.event(() => {
                                    thisModel.contactUs.service1v1.onclick();
                                })}">${thisModel.contactUs.service1v1.title}</button>
                                
                                ${gvc.bindView({
                                    bind: "kanban",
                                    view: () => {

                                        return `
                                            <div class="" style="padding-top: 57%;width : 100%;background:50% / cover url(${new URL!(`../img/component/kanban.png`, import.meta.url)})"></div>
                                        `
                                    },
                                    divCreate: {class: ``, style: `width : 100%;`}
                                })}     
                            `
                            },
                            divCreate: {
                                class: ``,
                                style: `background: #FBF9F6;border-radius: 24px;padding: 16px 32px 24px;`
                            }
                        })}
                        `
                    },
                    editor: () => {
                        return gvc.map(widget.data.section.map((dd: any, index: number) => {
                            return `<div class="alert alert-dark">
<h3 style="color:white;font-size: 16px;" class="d-flex align-items-center"><i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                widget.data.section.splice(index, 1)
                                widget.refreshAll()
                            })}"></i>??????.${index + 1}</h3>
${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "????????????",
                                default: dd.title,
                                placeHolder: `?????????????????????`,
                                callback: (text: string) => {
                                    dd.title = text
                                    widget.refreshAll()
                                }
                            })}
<div class="mt-2"></div>
${gvc.map(dd.service.map((d3: any, index: number) => {
                                return `<div class="alert alert-warning">
${
                                    glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: `<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            dd.service.splice(index, 1)
                                            widget.refreshAll()
                                        })}"></i>??????.` + (index + 1),
                                        default: d3.text,
                                        placeHolder: `?????????????????????`,
                                        callback: (text: string) => {
                                            d3.text = text
                                            widget.refreshAll()
                                        }
                                    }) + ClickEvent.editer(gvc, widget, d3)
                                }
</div>`
                            }))}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                dd.service.push(
                                    {
                                        text: "??????",
                                        onclick: () => {

                                        }
                                    }
                                )
                                widget.refreshAll()
                            })}">????????????</div>
</div>
<div class="w-100 bg-white my-2" style="height: 1px;"></div>
`
                        }).concat([
                            `<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                widget.data.section.push({
                                    title: "????????????",
                                    service: []
                                })
                                widget.refreshAll()
                            })}">????????????</div>`
                        ]))
                    }
                }
            },
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "??????",
                        icon: new URL('../img/component/footer/home.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "??????",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "????????????",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "?????????",
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "??????",
                        icon: new URL('../img/component/footer/user.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },

                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getBottomInset", {}, (response: any) => {
                    if (widget.data?.bottomInset != response.data) {
                        widget.data.bottomInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
                return {
                    view: () => {
                        return ``
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        pointsRewardBlock: {
            defaultData: {
                backPoint: 600,
            },
            render: (gvc, widget, setting, hoverID) => {


                return {
                    view: () => {
                        return `
                        ${gvc.bindView({
                            bind: 'backPoint',
                            view: () => {
                                gvc.addStyle(`
                                .giveBack {
                                    font-weight: 500;
                                    font-size: 18px;
                                    line-height: 200%;
                                    color: #292929;
                                    font-feature-settings: 'pnum' on, 'lnum' on;
                                }
                                .backPoint {
                                    font-weight: 700;
                                    font-size: 32px;
                                    line-height: 46px;
                                    font-feature-settings: 'pnum' on, 'lnum' on;
                                    color: #fd6a58;
                                }
                            `);
                                return /*html*/ `
                                <div class="d-flex align-items-baseline justify-content-center">
                                    <div class="giveBack">???????????????</div>
                                    <div class="backPoint">${widget.data.backPoint}</div>
                                </div>
                            `;
                            },
                            divCreate: {
                                style: `height:96px;background: #FBF9F6;border-radius: 20px;margin-top:24px;`,
                                class: `w-100 d-flex justify-content-center align-items-center `,
                            },
                        })}
                    `
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        voucher: {
            defaultData: {
                voucherList: [
                    {
                        id: "0",
                        vendor_name: "???????????????",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "???????????????",
                        config: {},
                        title: "?????? 10,000 ???",
                        subTitle: "??? 30,000 ???",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "???????????????2025.03.31",
                        isUse: false,
                        status: 0,
                    },
                    {
                        id: "1",
                        vendor_name: "???????????????",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "???????????????",
                        config: {},
                        title: "?????? 10,000 ???",
                        subTitle: "??? 30,000 ???",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "????????????????????? 8 ??????",
                        isUse: false,
                        status: 1,
                    },
                    {
                        id: "2",
                        vendor_name: "???????????????",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "???????????????",
                        config: {},
                        title: "?????? 10,000 ???",
                        subTitle: "??? 30,000 ???",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "???????????????2025.03.31",
                        isUse: false,
                        status: 2,
                    },
                    {
                        id: "3",
                        vendor_name: "???????????????",
                        vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                        name: "???????????????",
                        config: {},
                        title: "?????? 10,000 ???",
                        subTitle: "??? 30,000 ???",
                        startTime: "",
                        endTime: "",
                        formatEndTime: "???????????????2025.03.31",
                        isUse: false,
                        status: 3,
                    }

                ],
                cEvent: {},
                eventList: {
                    status0: {},
                    status1: {},
                    status2: {}
                }


            },
            render: (gvc, widget, setting, hoverID) => {
                enum voucherStatus {
                    unused,
                    expire,
                    used,
                    passed
                }

                return {
                    view: () => {
                        function useVoucher(id: number) {
                            //todo ??????????????????????????????
                            appConfig().changePage(gvc, "user_couponDetail");
                        }

                        gvc.addStyle(`
                            .unusedDate{
                                color : #FF0000;
                            }
                            .normalDate{
                                color : #858585;
                            }
                            .useBTNtext{                            
                                border-radius: 4px;                               
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                line-height: 20px;
                                margin-right: 10px;
                                width:48px;
                                text-align: center;
                                height: 20px;
                                
                            }
                            .useBTNtext.on{
                                background: #FE5541;
                                color: #FFFFFF;
                            }
                            .useBTNtext.off{
                                background: #EAD8C2;
                                color: #858585;
                            }
                            .useBTNtext.passed{
                                background: #E0E0E0;
                                color: #858585;
                            }
                        `)
                        return gvc.map(widget.data.voucherList.map((coupon: any) => {
                            return `
                            <div
                                class="d-flex align-items-center border"
                                style="
                                    padding:13px 16px;
                                    height: 104px;
                                    background: #FBF9F6;
                                    box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);
                                    border-radius: 20px;
                                    margin-top:12px;
                                "
                                onclick="${gvc.event(() => {
                                useVoucher(coupon.id);
                            })}">
                            <div
                                class="d-flex flex-column align-items-center"
                                style="width: 60px;overflow: hidden;"
                            >
                                <img src="${coupon.vendor_icon}" style="width: 56px;height: 56px;border-radius: 50%;" />
                                <span
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 10px;
                                        width: 60px;
                                        line-height: 12px;
                                        margin-top: 4px;
                                        word-break: break-all;
                                        overflow: hidden; 
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        -webkit-line-clamp: 1;
                                        -webkit-box-orient: vertical;  
                                        overflow: hidden;
                                        text-align: center;
                                    "
                                    >${coupon.vendor_name}</span
                                >
                            </div>
                            <div
                                style="
                                    width: 1px;
                                    height: 64px;
                                    background: #D6D6D6;
                                    margin-left: 24px;
                                "
                            ></div>
                            <div
                                class="d-flex flex-column justify-content-center"
                                style="margin-left: 20px;width: calc(100% - 170px);">
                                <span       
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 18px;
                                        line-height: 26px;
                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                        color: #FD6A58;
                                    " 
                                    >${coupon.title}</span
                                >
                                <span
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                    "
                                    >${coupon.subTitle}</span
                                >
                                <span class="${(() => {
                                if (coupon.status == voucherStatus.expire) {

                                    return "unusedDate"
                                } else {
                                    return "normalDate"
                                }
                            })()}"
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 10px;
                                        line-height: 14px;
                                    "
                                    >${coupon.formatEndTime}</span
                                >
                            </div>
                            <div class="flex-fill" style=""></div>
                            <div class="useBTNtext ${(() => {
                                switch (coupon.status) {
                                    case voucherStatus.unused: {
                                        return `on`;
                                    }
                                    case voucherStatus.expire: {
                                        return `on`;
                                    }
                                    case voucherStatus.used: {
                                        return `off`;
                                    }
                                    case voucherStatus.passed: {
                                        return `passed`;
                                    }
                                }
                            })()}">${(() => {
                                switch (coupon.status) {
                                    case voucherStatus.unused: {
                                        return `??????`;
                                    }
                                    case voucherStatus.expire: {
                                        return `??????`;
                                    }
                                    case voucherStatus.used: {
                                        return `?????????`;
                                    }
                                    case voucherStatus.passed: {
                                        return `?????????`;
                                    }
                                }
                            })()}</div>
                               
                        </div>
                        `
                        }))
                    },
                    editor: () => {
                        return ClickEvent.editer(gvc, widget, widget.data, {
                            option: [],
                            hover: true
                        });
                    }
                }
            },
        },
        voucherDetail: {
            defaultData: {
                coupon: {
                    id: "0",
                    vendor_name: "???????????????",
                    vendor_icon: "https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg",
                    name: "???????????????",
                    config: {},
                    title: "?????? 10,000 ???",
                    subTitle: "??? 30,000 ???",
                    startTime: "2022.03.31 00:00",
                    endTime: "2025.03.31 23:59",
                    formatEndTime: "???????????????2025.03.31",
                    isUse: false,
                    status: 0,
                    content: "??????????????? iPhone + ?????????????????????????????? 30000 ???????????? 10000 ??????",
                    product: "?????????????????????",
                    payway: "???????????????????????????",
                    logistics: "???????????????????????????",
                },

            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        gvc.addStyle(`
                            .normalDate{
                                color : #858585;
                            }
                            .useBTNtext{                            
                                border-radius: 4px;                               
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                line-height: 20px;
                                margin-right: 10px;
                                width:48px;
                                text-align: center;
                                height: 20px;
                                
                            }
                            .useBTNtext.on{
                                background: #FE5541;
                                color: #FFFFFF;
                            }
                            
                            .detailTitle{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 700;
                                font-size: 15px;
                                color: #292929;
                                margin-top:16px;
                            }
                            .detailText{
                                white-space: normal;
                                word-wrap: break-word;
                                word-break: break-all;
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                color: #292929;
                            }
                        `)
                        const data=gvc.parameter.pageConfig?.obj.data
                        let coupon = widget.data.coupon
                        console.log(`vendor:${JSON.stringify(data)}`)
                        if(data.vendor_id){
                            coupon={
                                id: data.vendor_id,
                                vendor_name: data.vendor_name,
                                vendor_icon:data.vendor_icon,
                                name: data.ogData.name,
                                config: {},
                                title: data.ogData.title,
                                subTitle: data.ogData.subTitle,
                                startTime: data.ogData.startTime.substring(0,10),
                                endTime: (data.ogData.endTime) ? data.ogData.endTime.substring(0,10) : "???????????????",
                                formatEndTime: `???????????????${(data.ogData.endTime) ? data.ogData.endTime.substring(0,10) : "???????????????"}`,
                                isUse: false,
                                status: 0,
                                content: data.ogData.note,
                                product: "?????????????????????",
                                payway: "???????????????????????????",
                                logistics: "???????????????????????????",
                            }
                            coupon.vendor_id=data.vendor_id;
                            coupon.vendor_icon=data.vendor_icon
                            coupon.vendor_name=data.vendor_name
                        }
                        return `
                        <div class="w-100">                            
                            <div
                                class="d-flex align-items-center border w-100"
                                style="
                                    padding:13px 16px;
                                    height: 104px;
                                    background: #FBF9F6;
                                    box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.05);
                                    border-radius: 20px;
                                    margin-top:12px;
                                    margin-bottom:16px;
                                "
                                onclick="${gvc.event(() => {
                                    if(data.selectBack){
                                        data.selectBack();
                                    }
                        })}">
                            <div
                                class="d-flex flex-column align-items-center"
                                style="width: 60px;overflow: hidden;"
                            >
                                <img src="${coupon.vendor_icon}" style="width: 56px;height: 56px;border-radius: 50%;" />
                                <span
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 10px;
                                        width: 60px;
                                        line-height: 12px;
                                        margin-top: 4px;
                                        word-break: break-all;
                                        overflow: hidden; 
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        -webkit-line-clamp: 1;
                                        -webkit-box-orient: vertical;  
                                        overflow: hidden;
                                        text-align: center;
                                    "
                                    >${coupon.vendor_name}</span
                                >
                            </div>
                            <div
                                style="
                                    width: 1px;
                                    height: 64px;
                                    background: #D6D6D6;
                                    margin-left: 24px;
                                "
                            ></div>
                            <div
                                class="d-flex flex-column justify-content-center"
                                style="margin-left: 20px;width: calc(100% - 170px);">
                                <span       
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 18px;
                                        line-height: 26px;
                                        font-feature-settings: 'pnum' on, 'lnum' on;
                                        color: #FD6A58;
                                    " 
                                    >${coupon.title}</span
                                >
                                <span
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 12px;
                                        line-height: 17px;
                                    "
                                    >${coupon.subTitle}</span
                                >
                                <span class="normalDate"
                                    style="
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 400;
                                        font-size: 10px;
                                        line-height: 14px;
                                    "
                                    >${coupon.formatEndTime}</span
                                >
                            </div>
                            <div class="flex-fill" style=""></div>
                            <div class="useBTNtext on ">??????</div>                               
                        </div>
                            <div class="detailTitle">
                                ????????????
                            </div>
                            <div class="detailText">
                                ${coupon.content}
                            </div>
                            <div class="detailTitle">
                                ????????????
                            </div>
                            <div class="detailText">
                                ${coupon.startTime}~${coupon.endTime}
                            </div>
                            <div class="detailTitle">
                                ??????
                            </div>
                            <div class="detailText">
                                ${coupon.product}
                            </div>
                            <div class="detailTitle">
                                ??????
                            </div>
                            <div class="detailText">
                                ${coupon.payway}
                            </div>
                            <div class="detailTitle">
                                ??????
                            </div>
                            <div class="detailText">
                                ${coupon.logistics}
                            </div>
                            <div class="detailTitle">
                                ????????????
                            </div>
                            <div class="detailText">
                                ??? ??????????????????????????????????????????<br>
                                ??? ??????????????????????????????<br>
                                ??? ?????????????????????????????????????????????????????????????????????????????????<br>
                                ??? ??????????????????????????????????????????????????????????????????????????????????????????????????? 1% ?????????<br>
                                ??? HOMEE ?????????????????????????????????????????????????????????????????????<br>
                            </div>
                        </div>
                        `
                    },
                    editor: () => {
                        return ClickEvent.editer(gvc, widget, widget.data, {
                            option: [],
                            hover: true
                        });
                    }
                }
            },
        },
        edit: {
            defaultData: {
                topInset: 10,
                nav: {
                    title: "",
                    leftIcon: new URL('../img/component/left-arrow.svg', import.meta.url),
                    leftPage: "",
                    boxShadow: true,
                    background: "#FFFFFF"
                },
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
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
                        const sharedView = new SharedView(gvc);
                        //@ts-ignore
                        let viewModel = new ViewModel(gvc)
                        let dialog = new Dialog(gvc)
                        let firstAddressData: any = {};
                        const vm: { loading: boolean, data: any, userData: any ,addressModel:any} = {
                            loading: true,
                            data: undefined,
                            userData: undefined,
                            addressModel:[]
                        };
                        appConfig().getUserData({
                            callback: (response) => {
                                vm.data = [
                                    {
                                        left: "??????",
                                        type: "name",
                                        name: "name",
                                        placehold: {
                                            get last() {
                                                return response?.last_name || ""
                                            },
                                            set last(value){
                                                response.last_name=value
                                            },
                                            get first() {
                                                return response?.first_name || ""
                                            },
                                            set first(value){
                                                response.first_name=value
                                            }
                                        }
                                    },
                                    {
                                        left: "????????????",
                                        type: "text",
                                        name: "userName",
                                        get placehold(){
                                            return (response.name) ?? ((vm.data.first_name + vm.data.last_name ) || "")
                                        },
                                        set placehold(value){
                                            response.name=value
                                        }
                                    },
                                    {
                                        left: "????????????",
                                        type: "email",
                                        name: "email",
                                        get placehold(){
                                            return response.email || ""
                                        },
                                        set placehold(value){
                                            response.email=value
                                        }
                                    },
                                    {
                                        left: "??????",
                                        type: "number",
                                        name: "phone",
                                        get placehold(){
                                            return response.phone
                                        },
                                        set placehold(value){
                                            response.phone=value
                                        }
                                    },
                                    {
                                        left: "??????",
                                        type: "password",
                                        name: "password",
                                        check: false,
                                        placehold:""
                                    },
                                    {
                                        visible: false,
                                        left: "?????????",
                                        type: "password",
                                        name: "newPassword",
                                        placehold: ""
                                    },
                                    {
                                        visible: false,
                                        left: "????????????",
                                        type: "password",
                                        name: "confirmPassword",
                                        placehold: ""
                                    }
                                ]
                                if (response.addressModel){
                                    vm.addressModel = [
                                        {
                                            left: "??????",
                                            type: "name",
                                            name: "addressName",
                                            placehold: {
                                                last: response.addressModel.last_name,
                                                first: response.addressModel.first_name
                                            }
                                        },
                                        {
                                            left: "??????",
                                            type: "number",
                                            name: "addressPhone",
                                            placehold: response.addressModel.address_phone
                                        },
                                        {
                                            left: "????????????",
                                            type: "text",
                                            name: "addressCompany",
                                            placehold: response.addressModel.company
                                        },
                                        {
                                            left: "??????",
                                            type: "text",
                                            name: "address",
                                            placehold: response.addressModel.address
                                        }
                                    ];
                                }
                                else {
                                    vm.addressModel = gvc.parameter.pageConfig?.obj.data?.addressModel??[];
                                }


                                vm.userData = response
                                vm.loading = false
                            }
                        })
                        let photoFile: any = undefined
                        let b64: any = undefined
                        let resetPassword = false
                        let addressModel: any = []

                        function saveData() {

                            dialog.dataLoading(true)
                            User.setUserData(vm.userData,(response)=>{
                                dialog.dataLoading(false)
                                appConfig().setUserData({
                                    value:vm.userData,
                                    callback:(response)=>{
                                        appConfig().setHome(gvc,'user_setting')
                                        setTimeout(()=>{
                                            dialog.showInfo("????????????")
                                        },1000)
                                    }
                                })
                            })
                        }

                        function dataURLtoFile(dataurl: any, filename: string) {
                            let arr = dataurl.split(','),
                                mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]),
                                n = bstr.length,
                                u8arr = new Uint8Array(n);

                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }

                            return new File([u8arr], filename, {type: mime});
                        }

                        function deleteFirstAddress() {
                            if (confirm("?????????????")) {
                                glitter.runJsInterFace("deleteAddress", {}, (response) => {
                                    //todo ?????????api
                                    vm.addressModel = [];
                                    gvc.notifyDataChange('firstAddress')
                                }, {
                                    webFunction: () => {
                                        return {result: "OK"}
                                    }
                                })
                            }
                        }

                        return gvc.map([
                            `
                            ${sharedView.navigationBar({
                                title: '????????????',
                                leftIcon: `<img class="" src="${new URL('../img/component/left-arrow.svg', import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                    if (glitter.getUrlParameter('navagation') == "true") {
                                        glitter.runJsInterFace("dismiss", {}, () => {
                                        })
                                    } else {
                                        glitter.goBack()
                                    }
                                })}">`,
                                rightIcon: `<div class="save" onclick="${gvc.event(() => {
                                    saveData();
                                })}">??????</div>`,
                                boxShadow: widget.data.nav.boxShadow,
                                background: widget.data.nav.background,
                            })}
                            `,
                            `
                            <main style="overflow-x: hidden;">                                   
                                ${(() => {
                                let funnel = new Funnel(gvc)
                                return gvc.map([`
                                    <input
                                    type="file"
                                    class="d-none"
                                    id="${gvc.id("photo")}"
                                    onchange="${gvc.event((e) => {
                                        for (let i = 0; i < $(e).get(0).files.length; i++) {
                                            // ?????? canvas
                                            let canvas = document.createElement('canvas');
                                            let ctx = canvas.getContext('2d');
                                            let file = $(e).get(0).files[i];
                                            let img = new Image();
                                            img.src = URL.createObjectURL(file);
                                            // ????????????????????????
                                            img.onload = function () {
                                                // ?????????????????????
                                                let width = img.width;
    
                                                if (width > 200) {
                                                    // ?????? canvas ?????????
                                                    canvas.width = 200;
                                                    // ?????? canvas ?????????
                                                    canvas.height = img.height * 200 / img.width;
                                                    // ???????????????????????? URL
                                                    ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                                                    let f = $(e).get(0).files[i];
                                                    let ran = funnel.randomString(3);
                                                    const regex = new RegExp('[^.]+$');
                                                    const extension = f.name.match(regex);
                                                    let compressedImageURL = canvas.toDataURL(`image/${extension}`, 0.75);
                                                    photoFile = {
                                                        ran: ran,
                                                        fullName: f.name,
                                                        name: f.name.substring(0, extension.index - 1),
                                                        ext: extension[0],
                                                        data: dataURLtoFile(compressedImageURL, f.name),
                                                    };
                                                    b64 = compressedImageURL
                                                }else{
                                                    const regex = new RegExp('[^.]+$');
                                                    let f = $(e).get(0).files[i];
                                                    const extension = f.name.match(regex);
                                                    let ran = funnel.randomString(3);
                                                    photoFile = {
                                                        ran: ran,
                                                        fullName: f.name,
                                                        name: f.name.substring(0, extension.index - 1),
                                                        ext: extension[0],
                                                        data: f,
                                                    };
                                                }
                                                appConfig().uploadImage(photoFile.data,(response)=>{
                                                    vm.userData.photo=response
                                                    $('#' + gvc.id('photoImage')).attr('src', response)
                                                })
                                            };
                                        }
                                    })}"
                                    ></input>`,
                                    gvc.bindView({
                                        dataList: [
                                            {
                                                obj: vm,
                                                key: 'loading'
                                            }
                                        ],
                                        bind: gvc.glitter.getUUID(),
                                        view: () => {
                                            if (vm.loading) {
                                                return ``
                                            }
                                            return `
                                                <div class="w-100 d-flex flex-column align-items-center">                            
                                                    <img id="${gvc.id('photoImage')}" src="${(photoFile !== undefined) ? b64 : vm.userData.photo ?? `https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=200&h=200&txtsize=90&txt=${vm.data.last_name}&txtfont=Helvetica&txtalign=middle,center`}" style="width: 128px;height: 128px;border-radius: 50%"
                                                    onclick="${gvc.event(() => {
                                                $(`#${gvc.id("photo")}`).click()
                                            })}">
                                                    <div class="changePhoto" onclick="${gvc.event(() => {
                                                $(`#${gvc.id("photo")}`).click()
                                            })}">???????????????</div>                                                      
                                                </div>
                                            `;
                                        },
                                        divCreate: {
                                            class: `w-100 d-flex justify-content-center align-items-center`,
                                            style: `margin-bottom : 40px;`
                                        }
                                    })])
                            })()}    
<!--                                                    ????????????-->
                                ${gvc.bindView({
                                dataList: [
                                    {
                                        obj: vm,
                                        key: 'loading'
                                    }
                                ],
                                bind: "accountData",
                                view: () => {
                                  
                                    if (vm.loading) {
                                        return ``
                                    }
                                    return `
                                        <div class="w-100 d-flex flex-column">
                                            <div class="acc-title">????????????</div>
                                            ${gvc.map(vm.data.map((dd: any) => {
                                            if (dd.name === 'password' && dd.check==false) {
                                                return gvc.bindView({
                                                    bind: `${dd.name}-inputRow`,
                                                    view: () => {
                                                        return `                   
                                                                <div class="left" style="">${dd.left}</div>
                                                                <div class="right" style="width: 78%;position: relative">
                                                                <input class="w-100 border-0 pwInput" name="password" type="password" placeholder="??????????????????" onchange="${gvc.event((e:HTMLInputElement) => {
                                                                    dd.placehold = e.value
                                                                })}" value="${dd.placehold}">
                                                                    ${(dd.check) ? `` : ` <div class="pwCheck" onclick="${gvc.event(() => {
                                                                    if (vm.userData.pwd !== dd.placehold) {
                                                                        
                                                                        dialog.showInfo("??????????????????!")
                                                                    } else {
                                                                        vm.data.map((d2: any) => {
                                                                            if (d2.left != "??????"){
                                                                                d2.visible = 'true'
                                                                            }else{
                                                                                d2.visible = false
                                                                            }                                                                             
                                                                        })
                                                                        dd.visible = false;
                                                                        dd.check = true
                                                                        resetPassword = true
                                                                        gvc.notifyDataChange('accountData')
                                                                    }
                                                                })}">??????</div>    
                                                                `}
                                                                                   
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
                                ${gvc.bindView( {
                                    bind: "firstAddress",
                                    view: () => {
                                        //vm.loading && 
                                        
    
                                        let returnData = ``;

                                        vm.addressModel.forEach((data: any) => {
                                            returnData += viewModel.inputRow(data, "readonly")
                                        })
    
    
                                        let addBtn = ``
                                        
                                        //vm.loading && 
                                        if (vm.addressModel.length == 0) {
                                            addBtn = `<div class="addr-add" onclick="${gvc.event(() => {
                                                appConfig().changePage(gvc, "editFirstAddress");
                                            })}">??????</div>`
                                        } else {
                                            addBtn = `
                                            <div class="d-flex">
                                                <div class="addr-edit" onclick="${gvc.event(() => {
                                                    vm.addressModel[3].type = "address"
                                                    //todo ???????????????????????? twzipcode????????? ????????????
                                                    appConfig().changePage(gvc, "editFirstAddress" , {addressModel:vm.addressModel});
                                                })}">??????</div>
                                                <div class="addr-del" onclick="${gvc.event(() => {
                                                    deleteFirstAddress()
                                                })}">??????</div>
                                            </div>`
                                        }

                                        return `
                                            <div class="w-100 d-flex flex-column d-none" style="margin-top:6px;">
                                                <div class="w-100 acc-title d-flex justify-content-between align-items-center">
                                                    <div class="">????????????</div>${addBtn}
                                                </div>                                            
                                                ${returnData}               
                                            </div>`
                                    }, divCreate: {}
                                })}
                                
                            </main>
                            `

                        ])
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        edit_firstAddress: {
            defaultData: {

            },
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {
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

                        //@ts-ignore
                        let viewModel = new ViewModel(gvc)
                        let shareView = new SharedView(gvc)
                        let vm = {
                            empty:true
                        }
                        let model:any = undefined;

                        function initModel(){
                            appConfig().getUserData({
                                callback: (response) => {
                                    vm.empty = !!(response?.addressModel);
                                    let address = (response?.addressModel) ?response?.addressModel[3].placehold:""

                                    model = gvc.parameter.pageConfig?.obj.data?.addressModel ?? [
                                        {
                                            left : "??????",
                                            type : "name",
                                            name : "address-name",
                                            placehold : {last:response?.addressModel?.last_name || "??????" , first:response?.addressModel?.first_name || "??????"}
                                        },
                                        {
                                            left : "??????",
                                            type : "number",
                                            name : "address-phone",
                                            placehold : response?.addressModel?.address_phone || ""
                                        },
                                        {
                                            left : "????????????",
                                            type : "text",
                                            name : "company",
                                            placehold : response?.addressModel?.company || ""
                                        },
                                        {
                                            left : "??????",
                                            type : "address",
                                            name : "address",
                                            placehold : address
                                        }
                                    ];
                                }
                            })
                        }
                        initModel();
                        return `
                        <!--            ?????????-->
                        ${gvc.bindView({
                            bind : "firstAddress",
                            view : ()=>{

                                let returnData = ``;
                                //???????????????
                                model.forEach((data:any)=>{
                                    returnData += viewModel.inputRow(data)
                                })
                                return `
                                <div class="w-100 d-flex flex-column" style="margin-top:6px;">
                                    <div class="w-100 acc-title d-flex justify-content-between align-items-center">
                                        <div class="">????????????</div>
                                    </div>                                            
                                    ${returnData}                                     
                                </div>`
                            },onCreate : ()=>{

                            }
                        })}
                        <!--            ????????????-->
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
                                        //todo edit this addressModel
                                        glitter.share.addressModel = model;
                                        appConfig().changePage(gvc, "user_edit_Profile");
                                    })}">????????????</bottom>
                                    <div class="delete-btn" onclick="${gvc.event(()=>{
                                        glitter.share.addressModel = undefined;
                                        appConfig().changePage(gvc, "user_edit_Profile");
                                    })}">????????????</div>
                                    `
                                }else {
                                    return `
                                    <bottom class="OKBtn w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                                        //???????????? ?????????????????? ???????????????????????? ??????text
                                        model[3].type = "text"
                                        //this is returnData take back to edit_Profile
                                      
                                        appConfig().changePage(gvc, "user_edit_Profile" , {
                                            addressModel:model,
                                        });
                                    })}">
                                       ??????
                                    </bottom>
                                    `
                                }


                            }, divCreate : {style : `padding: 0 59px;margin-top:40px;` , class : `d-flex flex-column justify-content-center align-items-center`}
                        })}
                        `
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        invite_Friend: {
            defaultData: {

            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {

                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
                                <main class="" style=padding:24px 35px 44px;font-family: 'Noto Sans TC';font-style: normal;margin: 0;box-sizing: border-box;"">
                                    ${gvc.bindView({
                                        bind:"icon",
                                        view:()=>{
                                            return `
                                        <img src="${new URL('../img/inviteLOGO.svg', import.meta.url)}" alt="LOGO" style="width: 190px;height: 133px;">
                                    `
                                        },divCreate:{class:`d-flex flex-column align-items-center` , style : `padding-top:60px;`}
                                    })}
                                </main>

                                                          
                            `

                            },

                        })
                    },
                    editor: () => {
                        return `
                        <!--
                        ${gvc.bindView({
                            bind: "footer",
                            view : ()=>{
                                let classStyle={
                                    footerBTN:`
                                                border-radius : 8px;
                                                border:1px solid rgb(210,66,123);
                                                font-size : 14px;
                                                font-weight : 700;
                                                padding:15px;
                                                `,
                                    shareBTN :`
                                                height: 48px;
                                                background: #FD6A58;
                                                border-radius: 24px;
                                                color : white;
                                            `,
                                    QRBTN : `
                                                background-color : white;
                                                color : rgb(210,66,123);
                                                margin-top : 18px;
                                            `
                                }
                                let inviteCode = ""
                                appConfig().getUserData({
                                    callback: (response) => {
                                        console.log(response)
                                    }
                                });

                                return `
                                            <bottom style="margin-bottom: 60px;${classStyle.footerBTN}${classStyle.shareBTN} " class="w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                                    glitter.runJsInterFace("shareText",{
                                        text:`????????????HOMEE APP:https://apps.apple.com/tw/app/homee-marketplace/id6444941721?????????????????????????????????:${inviteCode}???????????????200??? $ 100 ?????????`
                                    },()=>{

                                    })
                                })}">???????????????????????????</bottom>                                
                                        `
                            },divCreate : {class:`d-flex flex-column w-100` , style : `padding:12px 20px ${12+widget.data.bottomInset}px;margin-top:auto;position: absolute;bottom:0;left: 0;background: #FFFFFF;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);`}
                        })}              
                        -->
                        `
                    }
                }
            },
        },
        invite_BTN: {
            defaultData: {
                botInset:0,
                inviteCode:""
            },
            render: (gvc, widget, setting, hoverID) => {

                return {
                    view: () => {

                        glitter.runJsInterFace("getBotInset", {}, (response) => {
                            if (widget.data.botInset != response.data){
                                widget.data.botInset = response.data
                                gvc.notifyDataChange('mainView')
                            }

                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        appConfig().getUserData({
                            callback: (response: any) => {
                                console.log()
                                widget.data.inviteCode = response.invite_code;
                                gvc.notifyDataChange('footer');
                            }
                        })
                        return gvc.bindView({
                            bind: "footer",
                            view : ()=>{

                                let classAdd={
                                    footerBTN:`
                                        border-radius : 8px;
                                        border:1px solid rgb(210,66,123);
                                        font-size : 14px;
                                        font-weight : 700;
                                        padding:15px;
                                    `,
                                    shareBTN:`
                                        height: 48px;
                                        background: #FD6A58;
                                        border-radius: 24px;
                                        color : white;
                                        font-family: 'Noto Sans TC';
                                        font-style: normal;
                                        font-weight: 700;
                                        font-size: 18px;
                                        line-height: 26px;
                                        
                                        text-align: center;
                                        letter-spacing: 0.15em;
                                        color: #FFFFFF;
                                    `,
                                    QRBTN:`
                                        background-color : white;
                                        color : rgb(210,66,123);
                                        margin-top : 18px;
                                    `

                                }
                                return `
                                <bottom style="margin-bottom: 30px;${classAdd.footerBTN}${classAdd.shareBTN}" class="w-100 d-flex align-items-center justify-content-center" onclick="${gvc.event(()=>{
                                    // todo
                                    glitter.runJsInterFace("shareText",{
                                        text:`????????????HOMEE APP:https://apps.apple.com/tw/app/homee-marketplace/id6444941721?????????????????????????????????:${widget.data.inviteCode}???????????????200??? $ 100 ?????????`
                                    },()=>{

                                    })
                                })}">???????????????????????????</bottom>
                                
                            `
                            },divCreate : {class:`d-flex flex-column w-100` , style : `padding:12px 20px ${12+widget.data.botInset}px;margin-top:auto;position: absolute;bottom:0;left: 0;background: #FFFFFF;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);`}
                        })
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        empty: {
            defaultData: {
                link: []
            },
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data

                return {
                    view: () => {
                        return ``
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        }
    }
});