'use strict';
import {init} from '../glitterBundle/GVController.js';
import {ViewModel} from "../view/ideaViewApi.js";

init((gvc, glitter, gBundle) => {
    // <script src="../glitterBundle/ControlInstance.js"></script>
    //     <script type="text/javascript" src="../glitterBundle/slick/slick.min.js"></script>
    
    const viewModel = new ViewModel(gvc)
    let position = 0
    return {
        onCreateView: () => {
            return `
<div class="w-100" style="height: 100%;">${viewModel.slideControl((() => {
                let map = []
                for (let a = 1; a < 9; a++) {
                    map.push(`introduce/i${a}.png`)
                }
                return map
            })(), 'ss0', `
            .swiper-slide{
                height:100vh;
                width:100%;
                background-repeat: no-repeat;
            }
        `)}</div>

<div style="color: white;height: 40px;position: absolute;right: 0px;bottom: 10px;z-index: 2;font-size: 16px;margin-right:10px;display: flex;align-items: center;justify-content: center;font-weight: 600;flex-direction: column;"
onclick="${gvc.event(()=>{
                glitter.runJsInterFace("next",{},()=>{})
            })}">下一步 ></div>

            `
        },
        onCreate: () => {

        }
    }
})