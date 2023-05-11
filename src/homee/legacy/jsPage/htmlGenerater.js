import { init } from "../glitterBundle/GVController.js";
import { HtmlGenerate } from "../glitterBundle/module/Html_generate.js";
init(function (gvc, glitter, gBundle) {
    const htmlgenerate = new HtmlGenerate(gBundle, []);
    return {
        onCreateView: () => {
            return htmlgenerate.render(gvc);
        }
    };
});
