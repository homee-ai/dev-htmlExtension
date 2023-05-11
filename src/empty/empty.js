'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
Plugin.create(import.meta.url, (glitter) => {
    function escape(text) {
        return text.replace(/&/g, '&').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "'");
    }
    return {
        banner: {
            defaultData: {
                link: []
            },
            render: (gvc, widget, setting, hoverID) => {
                const data = widget.data;
                return {
                    view: () => {
                        return ``;
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
    };
});
