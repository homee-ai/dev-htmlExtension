import { init } from '../../glitterBundle/GVController.js';
import { Lan } from '../../api/language.js';
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
            return `<div class="w-100 vh-100 d-flex align-items-center " style="" >
<div style="width: 100px;" class="d-flex">
<img src="img/goBack.svg" onclick="${gvc.event(() => {
                glitter.runJsInterFace("goBack", {}, (response) => { });
            })}">
</div>
<div class="flex-fill"></div>
<div onclick="${gvc.event(() => {
                glitter.runJsInterFace("click", {}, (response) => { });
            })}">
${gvc.bindView({
                bind: id,
                view: () => {
                    return `<span class="" style="font-family: 'Noto Sans TC';font-weight: normal;
font-size: 15px;color:black;">${Lan.getLan(14)}</span>
${(count === 0) ? `` : `<div class="dot" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${count}</div>`}
`;
                },
                divCreate: { elem: `button`, class: `btn d-flex  m-auto align-items-center justify-content-center position-relative`, style: `background-color: #FFDC6A;height: 28px;border-radius: 14px;` },
                onCreate: () => { }
            })}
</div>

<div class="flex-fill"></div>
<div style="width: 100px;" class="d-flex">
<div class="flex-fill"></div>
<img src="img/share.svg" style="margin-right: 20px;" onclick="${gvc.event(() => {
                glitter.runJsInterFace("share", {}, (response) => { });
            })}">
<img src="img/question.svg" onclick="${gvc.event(() => {
                glitter.runJsInterFace("question", {}, (response) => { });
            })}">
</div>

</div>`;
        }
    };
});
