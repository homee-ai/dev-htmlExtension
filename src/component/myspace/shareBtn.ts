import {init} from '../../glitterBundle/GVController.js';
import {SharedView} from "../../widget/sharedView.js"

init((gvc, glitter, gBundle) => {
    const share = new SharedView(gvc)
    return {
        onCreateView: () => {

            gvc.addStyle(`body{
           background-color: transparent!important;
            }`)
            return `
            <div class="w-100 vh-100" style="background-color: rgba(0,0,0,0.5);" onclick="${gvc.event(()=>{
                glitter.runJsInterFace("close", {}, () => {
                })
            })}">
${
                share.biggerTitle({
                    title: `
<div class="w-100 d-flex align-items-end justify-content-center bg-white" style="height: 113px;">
${gvc.map([
                        {
                            src: 'img/plus.svg', tit: '分享至靈感', click: () => {
                                glitter.runJsInterFace("exportf", {}, () => {
                                })
                            }
                        },
                        {
                            src: 'img/shareTo.svg', tit: '分享連結', click: () => {
                                glitter.runJsInterFace("share", {}, () => {
                                })
                            }
                        }
                    ].map((dd) => {
                        return `<div class="d-flex flex-column align-items-center justify-content-end" style="margin-left: 25px;margin-right: 25px;height: 113px;"
onclick="${gvc.event(()=>{
    dd.click()
                        })}">
<img src="${dd.src}" style="width: 28px;height: 28px;">
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: center;margin-top: 6px;margin-bottom: 22px;">${dd.tit}</span>
</div>`
                    }))}
</div>
`, leftIcon: '', rightIcon: ''
                })
            }
</div>
`
        }
    }
})