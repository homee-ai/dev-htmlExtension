import { init } from '../../glitterBundle/GVController.js';
import { ViewModel } from "../../view/ideaViewApi.js";
import { Dialog } from "../../widget/dialog.js";
import { SharedView } from "../../widget/sharedView.js";
init((gvc, glitter, gBundle) => {
    var interact = null;
    gvc.addStyle(`       
        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Bold.otf);
            font-weight: bold;
        }

        @font-face {
            font-family: 'Noto Sans TC';
            src: url(assets/Font/NotoSansTC-Regular.otf);
            font-weight: normal;
        }

        html{
            margin: 0;
            box-sizing: border-box;
        }

        body {
            width: 100%;
            height: 100%;

        }
        
        .nextStep{
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 63px;
            /* identical to box height */
            
            text-align: center;
            
            /* HOMEE red */
            
            color: #FD6A58;
        }

        main {
            height : calc(100vh - 63px);
            font-family: 'Noto Sans TC';

        }
        .imgBlock{
            overflow: scroll;
            flex-direction: row;
            justify-content: flex-start;
        }
        .imgBlock::-webkit-scrollbar{
            display:none;
        }
        .selectImg{
            position:relative;       
        }
        
        .selectImgLong{
            touch-action: none;            
        }
        .edit-btn{
            width:40px;
            height:40px;
            background:white;
            position:absolute;
            right : 11px;
            bottom : 11px;
            z-index : 3;
        }
        
        .deleteImg{
            width : 48px;
            height : 48px;
            position : fixed;
            left : calc(50% - 24px);
            bottom : 114px;

        }
        .drop-active{
            transform: scale(1.25);
        }
        .selectedBorder{
            border: 5px solid green;
        }

`);
    gvc.addMtScript([{ src: 'https://unpkg.com/interactjs/dist/interact.min.js' }], () => {
        interact = (window.interact);
        gvc.notifyDataChange('mainView');
    }, () => {
    });
    function appendBorder(element) {
        deleteIMGArray = deleteIMGArray.filter((dd) => {
            return dd !== Number(element === null || element === void 0 ? void 0 : element.getAttribute("index"));
        });
        if (element.classList.contains("selectedBorder")) {
            element.classList.remove("selectedBorder");
        }
        else {
            element.classList.add("selectedBorder");
            deleteIMGArray.push(Number(element === null || element === void 0 ? void 0 : element.getAttribute("index")));
        }
        if (deleteIMGArray.length > 0) {
            $('.deleteImg').show();
        }
        else {
            $('.deleteImg').hide();
        }
    }
    function deleteIMG() {
        dialog.confirm(`確認刪除${deleteIMGArray.length}張圖片?`, (response) => {
            if (response) {
                if (imgArray.length > 1) {
                    deleteIMGArray.forEach((v) => {
                        imgArray.splice(v, 1);
                    });
                    gBundle.preview_image = imgArray;
                    gvc.notifyDataChange('slideImg');
                }
                else {
                    alert("請至少留一張");
                }
            }
        });
    }
    let viewModel = new ViewModel(gvc);
    let dialog = new Dialog(gvc);
    let shareView = new SharedView(gvc);
    let imgArray = gBundle.preview_image;
    let deleteIMGArray = [];
    return {
        onCreateView: () => {
            let topInset = 10;
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (interact == null) {
                        return ``;
                    }
                    return `
                    ${shareView.navigationBar({
                        title: "新貼文",
                        leftIcon: `  <img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            viewModel.checkDismiss();
                        })}">`,
                        rightIcon: `<div class="nextStep"  onclick="${gvc.event(() => {
                            glitter.changePage('jsPage/idea/idea_post.js', "idea_post", true, gBundle);
                        })}">
                        下一步
                    </div>`
                    })}
                <main class="d-flex align-items-center w-100" style="">                    
                    ${(() => {
                        return gvc.bindView({
                            bind: `slideImg`,
                            view: () => {
                                let returnHtml = ``;
                                imgArray.forEach((img, index) => {
                                    returnHtml += `
                                        <div class="selectImg flex-shrink-0" index=${index} onclick="${gvc.event((e) => { appendBorder(e); })}" style="width: 92%; height: 220px;margin-right: 3%;background: 50% / cover url(${img})">
                                            <div class="edit-btn rounded" style="background: 50% / cover url('img/sample/idea/pen.svg')" index=${index} onclick="${gvc.event((html, event) => { editImg(index, event); })}"></div>
                                        </div>
                                    `;
                                });
                                return returnHtml;
                            },
                            divCreate: { class: `d-flex imgBlock w-100 h-100 align-items-center`, style: `` },
                            onCreate: () => {
                            }
                        });
                    })()}
                 ${(() => {
                        return `<img class="deleteImg" alt="trash" src="img/sample/idea/delete.svg" style="display: none;" onclick="${gvc.event(() => { deleteIMG(); })}"></img>`;
                    })()}
                   
                </main>
            `;
                },
                divCreate: { class: ``, style: `` },
                onCreate: () => {
                    let deleteable = true;
                }
            });
        }
    };
    function editImg(index, event) {
        event.stopImmediatePropagation();
    }
});
