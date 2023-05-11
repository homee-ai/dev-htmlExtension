import {init} from '../../glitterBundle/GVController.js';
import {Lan} from '../../api/language.js'
import {SharedView} from "../../widget/sharedView.js"

init((gvc, glitter, gBundle) => {
    const share = new SharedView(gvc)
    let vm={
        model:{
            remind:"此功能需使用支援 LiDAR 光學感測功能之手機",
            BTN:"邀請好友協助掃描"
        }

    }
    return {
        onCreateView: () => {
            gvc.addStyle(`
                body{
                    background-color: transparent!important;
                }
                .laravel{
                    background: #FFFFFF;
                    box-shadow: -3px 3px 15px rgba(0, 0, 0, 0.1);
                    border-radius: 20px;          
                    padding:32px 24px 16px;         
                }
                .remind{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 18px;
                    color: #292929;
                    margin-bottom:32px;
                    word-break: break-all;
                    white-space: normal;
                    text-align: center;
                }
                .startBTN{
                    height: 40px;
                    background: #FD6A58;
                    border-radius: 20px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 18px;
                    color: #FFFFFF;
                }
            
            `)

            return `
                ${gvc.bindView({
                    bind:"laravel",
                    view : ()=>{
                        
                        return `
                            <div class="laravel" >
                                <div class="remind d-flex flex-wrap justify-content-center align-items-center">
                                    ${vm.model.remind}
                                </div>
                                <button class="w-100 border-0 startBTN" onclick="${gvc.event(()=>{
                                    glitter.changePage("jsPage/guide/guide1.js", "guide1", true, {})
                                })}">${vm.model.BTN}</button>
                            </div>
                        `
                    },
                    divCreate:{style:`padding : 0 55px;height:100vh ` , class:`w-100  d-flex justify-content-center align-items-center`}
                
                })}
            `
        }
    }
})