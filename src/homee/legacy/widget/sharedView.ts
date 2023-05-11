import {GVC} from "../glitterBundle/GVController";

export class SharedView {
    public navigationBar: (item: { title: string; leftIcon: string; rightIcon: string }) => string;
    public biggerTitle: (item: { title: string; leftIcon: string; rightIcon: string }) => string;

    constructor(gvc: GVC) {
        const glitter = gvc.glitter;
        let topInset: number = 0

        this.navigationBar = (item: { title: string, leftIcon: string, rightIcon: string , }) => {
            topInset = glitter.share.topInset
            return gvc.bindView({
                bind: `nav`,
                view: () => {
                    return `
                    <nav class="bg-white w-100" style="position: fixed;z-index: 3;padding-top: ${topInset - 20}px;width: 100vw;">
                        <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 26px; background: #FFFFFF;box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);position:relative;">
                            <div class="me-auto p-0 d-flex align-items-center" style="">
                                ${item.leftIcon}
                            </div>
                            <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="position: absolute;top: 50%;   font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-size: 16px;
                    color: #1E1E1E;;
                    font-weight: 700;">${item.title}</div>
                            ${(()=>{
                                if (item.rightIcon){
                                    return `
                                    <div class="d-flex ms-auto align-items-center" style="">
                                        ${item.rightIcon}
                                    </div>`
                                }else 
                                    return ``
                            })()}
                        
                        </div>
                    </nav>
                        `
                },
                divCreate: {style:`width:100vw;height:calc(63px + ${topInset - 20}px)`},
                onCreate: () => {
                }
            })
        },
        this.biggerTitle = (item: { title: string, leftIcon: string, rightIcon: string }) => {
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data)
                gvc.notifyDataChange('nav')
            }, {
                webFunction: () => {
                    return {data: 50}
                }
            })
            return gvc.bindView({
                bind: `nav`,
                view: () => {
                    return `
                    <nav class="bg-white w-100" style="position: fixed;z-index: 3;padding-top: ${topInset - 20}px;width: 100vw;">
                    <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 113px; padding: 0 26px; background: #FFFFFF;box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);position:relative;">
                    <div class="me-auto p-0 d-flex align-items-center" style="">
                    ${item.leftIcon}
                    </div>
                    <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="position: absolute;top: 50%;   font-family: 'Noto Sans TC';
            font-style: normal;
            font-size: 16px;
            font-weight: 700;">${item.title}</div>
                    ${(()=>{
                        if (item.rightIcon){
                            return `
                            <div class="d-flex ms-auto align-items-center" style="">
                                ${item.rightIcon}
                            </div>`
                        }else
                            return ``
                    })()}
                    
                    </div>
                    </nav>
                        `
                },
                divCreate: {style:`width:100vw;`},
                onCreate: () => {
                }
            })
        }
    }
}