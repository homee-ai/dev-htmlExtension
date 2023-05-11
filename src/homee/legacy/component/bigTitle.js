import { init } from '../glitterBundle/GVController.js';
import { Lan } from '../api/language.js';
init((gvc, glitter, gBundle) => {
    const id = glitter.getUUID();
    let count = 0;
    glitter.runJsInterFace("getCount", {}, function (response) {
        count = response.data;
        gvc.notifyDataChange(id);
    }, {
        webFunction(data, callback) {
            return { data: 10 };
        }
    });
    return {
        onCreateView: () => {
            let topInset = 0;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data);
                gvc.notifyDataChange('nav');
            }, {
                webFunction: () => {
                    return { data: 50 };
                }
            });
            return gvc.bindView({
                bind: `nav`,
                view: () => {
                    if (topInset == 0) {
                        return ``;
                    }
                    return `<div class="w-100 d-flex align-items-center " style="padding-top: ${topInset}px;" >
<div style="width: 70px;padding-left: 16px;" class="d-flex">
<img src="img/goBack.svg" onclick="${gvc.event(() => {
                        glitter.runJsInterFace("cancel", {}, (response) => {
                        });
                    })}">
</div>
<div class="flex-fill"></div>
<span class="" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 15px;
line-height: 150%;
max-width: calc(100vw - 100px);
word-break: break-word;
white-space: normal;text-align: center;">${Lan.getLan(24)}</span>

<div class="flex-fill"></div>
<div style="width: 70px;" class="d-flex">
<div class="flex-fill"></div>
</div>

</div>`;
                },
                divCreate: {}
            });
        }
    };
});
