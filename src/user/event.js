import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
ClickEvent.create(import.meta.url, {
    test: {
        title: "logout",
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return `
                
                    `;
                },
                event: () => {
                }
            };
        }
    },
});
