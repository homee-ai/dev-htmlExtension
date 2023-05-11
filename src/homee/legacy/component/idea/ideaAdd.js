import { init } from '../../glitterBundle/GVController.js';
import { Funnel } from '../../glitterBundle/funnel.js';
import { Dialog } from "../../widget/dialog.js";
init((gvc, glitter, gBundle) => {
    const id = glitter.getUUID();
    let funnel = new Funnel(gvc);
    let botInset = 0;
    gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`);
    glitter.runJsInterFace("getBottom", {}, function (response) {
        botInset = response.data;
        gvc.notifyDataChange(id);
    }, {
        webFunction(data, callback) {
            return { data: 10 };
        }
    });
    return {
        onCreateView: () => {
            gvc.addStyle(`
                .addIcon{
                    width:28px;
                    height:28px
                }
                .addText{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 17px;
                    text-align: center;
                    color: #292929;
                    margin-top : 6px;
                }
            `);
            let topInset = 0;
            glitter.runJsInterFace("getTopInset", {}, (response) => {
                topInset = (response.data);
                gvc.notifyDataChange('productFooter');
            }, {
                webFunction: () => {
                    return { data: 0 };
                }
            });
            let clickTimer = glitter.ut.clock();
            return `
            <div onclick="${gvc.event(() => {
                var _a;
                if (clickTimer.stop() > 500) {
                    glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                }
            })}" class="w-100 h-100">
              ${gvc.bindView({
                bind: "productFooter",
                view: () => {
                    return `
<input type="file"
                            class="d-none"
                            id="${gvc.id("photo")}"
                            multiple="multiple"
                            onchange="${gvc.event((e) => {
                        const dialog = new Dialog(gvc);
                        dialog.dataLoading(true, "圖片上傳中...");
                        async function upload() {
                            var _a;
                            let fullURL = [];
                            for (let i = 0; i < $(e).get(0).files.length; i++) {
                                let f = $(e).get(0).files[i];
                                let ran = funnel.randomString(3);
                                const regex = new RegExp('[^.]+$');
                                const extension = f.name.match(regex);
                                const result = await new Promise((resolve) => {
                                    funnel.encodeFileBase64(f, (data) => {
                                        $.ajax({
                                            url: glitter.share.apiURL + '/api/v1/scene/getSignedUrl',
                                            type: 'post',
                                            data: JSON.stringify({ file_name: `${new Date().getTime()}.png` }),
                                            contentType: 'application/json; charset=utf-8',
                                            headers: { Authorization: glitter.share.userData.AUTH },
                                            success: (data1) => {
                                                $.ajax({
                                                    url: data1.url,
                                                    type: 'put',
                                                    data: f,
                                                    processData: false,
                                                    crossDomain: true,
                                                    success: (data2) => {
                                                        fullURL.push(data1.fullUrl);
                                                        resolve(true);
                                                    },
                                                    error: (err) => {
                                                        resolve(false);
                                                    },
                                                });
                                            },
                                            error: (err) => {
                                                resolve(false);
                                            },
                                        });
                                    });
                                });
                                if (!result) {
                                    dialog.dataLoading(false);
                                    dialog.showInfo("圖片上傳失敗");
                                    return;
                                }
                            }
                            glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                            dialog.dataLoading(false);
                            glitter.changePage('jsPage/idea/idea_post.js', "idea_post", true, {
                                preview_image: fullURL,
                                scene: "noImage",
                                config: {}
                            });
                        }
                        upload();
                    })}"
                        />
                        <div class="d-flex align-items-center justify-content-center bg-white" style="height:${90 + topInset}px;padding-top: ${topInset}px;">
                            <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e) => {
                        clickTimer.zeroing();
                        $(`#${gvc.id("photo")}`).click();
                    })}">
                                <img class="addIcon" src="img/sample/idea/addImg.svg" onclick="">
                                <div class="addText">分享圖片</div>
                            </div>
                            <div class="d-flex flex-column align-items-center" style="margin-left: 64px;" onclick="${gvc.event(() => {
                        var _a;
                        glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                        glitter.runJsInterFace("selectModel", {}, function (response) {
                            glitter.changePage('jsPage/idea/idea_selectPostImg.js', "idea_selectPostImg", true, response);
                        }, {
                            webFunction(data) {
                                return {
                                    preview_image: ["img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png", "img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png", "img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png"],
                                    scene: "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz",
                                    config: {
                                        "id": "E9ED7F76-116D-42A3-B616-C83684F36F01",
                                        "key": "hhh",
                                        "data": [{
                                                "x": -1.5339330434799194,
                                                "y": -1.2596129179000854,
                                                "z": -0.35074079036712646,
                                                "prodult": {
                                                    "id": 7324687,
                                                    "sku": "F010060-1-1",
                                                    "name": "MARSILLY 餐椅",
                                                    "spec": "",
                                                    "price": 4890,
                                                    "multiple": false,
                                                    "is_select": false,
                                                    "model_url": "https://machi-app.com/api/v1/assets/sku/20221027T020021-F010060-1-1.usdz",
                                                    "select_count": 1,
                                                    "preview_image": "https://cdn.store-assets.com/s/349867/i/41820128.png?width=720"
                                                },
                                                "rotation": 0
                                            }],
                                        "rout": "Documents/MySpace/1668048250482.usdz",
                                        "time": 689741055.022742,
                                        "store_time": "2022-11-10 10:44:15",
                                        "server_rout": "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz"
                                    }
                                };
                            }
                        });
                    })}">
                                <img class="addIcon" src="img/sample/idea/addSpace.svg">
                                <div class="addText">分享空間</div>
                            </div>
                        </div>
                       
                        
                    `;
                },
                divCreate: {
                    style: `background: rgba(0,0,0,0.5);box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);z-index: 99999;`,
                    class: `position-relative h-100`
                },
                onCreate: () => {
                }
            })}
</div>
            `;
        }
    };
    function createIdeaByIMG() {
        glitter.runJsInterFace("selectIMG", {}, function (response) {
            glitter.changePage('jsPage/idea/idea_post.js', "idea_post", true, response);
        }, {
            webFunction(data) {
                return {
                    preview_image: ["https://machi-app.com/api/v1/image/sub_category/4.png", "https://machi-app.com/api/v1/image/sub_category/3.png", "https://machi-app.com/api/v1/image/sub_category/2.png", "https://machi-app.com/api/v1/image/sub_category/5.png", "https://machi-app.com/api/v1/image/sub_category/6.png"],
                    scene: "",
                    config: ""
                };
            }
        });
    }
    function createIdea() {
        glitter.runJsInterFace("selectModel", {}, function (response) {
            glitter.changePage('jsPage/idea/idea_selectPostImg.js', "idea_selectPostImg", true, response);
        }, {
            webFunction(data) {
                return {
                    preview_image: ["img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png", "img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png", "img/sample/idea/postimg.png", "img/sample/idea/postimg_2.png"],
                    scene: "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz",
                    config: {
                        "id": "E9ED7F76-116D-42A3-B616-C83684F36F01",
                        "key": "hhh",
                        "data": [{
                                "x": -1.5339330434799194,
                                "y": -1.2596129179000854,
                                "z": -0.35074079036712646,
                                "prodult": {
                                    "id": 7324687,
                                    "sku": "F010060-1-1",
                                    "name": "MARSILLY 餐椅",
                                    "spec": "",
                                    "price": 4890,
                                    "multiple": false,
                                    "is_select": false,
                                    "model_url": "https://machi-app.com/api/v1/assets/sku/20221027T020021-F010060-1-1.usdz",
                                    "select_count": 1,
                                    "preview_image": "https://cdn.store-assets.com/s/349867/i/41820128.png?width=720"
                                },
                                "rotation": 0
                            }],
                        "rout": "Documents/MySpace/1668048250482.usdz",
                        "time": 689741055.022742,
                        "store_time": "2022-11-10 10:44:15",
                        "server_rout": "https://prd-homee-api-public.s3.amazonaws.com/scene/12729479/hhh.usdz"
                    }
                };
            }
        });
    }
});
