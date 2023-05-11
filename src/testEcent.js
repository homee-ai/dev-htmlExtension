import { ClickEvent } from "./glitterBundle/plugins/click-event.js";
ClickEvent.create(import.meta.url, {
    demo: {
        title: 'demo',
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    alert('asdkaskdkdas');
                }
            };
        }
    }
});
