//
import {init} from '../../glitterBundle/GVController.js'
import {ViewModel} from "../../view/ideaViewApi.js";
import {Dialog} from "../../widget/dialog.js"
import {SharedView} from "../../widget/sharedView.js"


init((gvc, glitter, gBundle) => {
    var interact: any = null
    
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

`)
    gvc.addMtScript([{src: 'https://unpkg.com/interactjs/dist/interact.min.js'}], () => {
        interact = ((window as any).interact)
        gvc.notifyDataChange('mainView')
    }, () => {

    })
    function appendBorder(element :HTMLElement){
        deleteIMGArray=deleteIMGArray.filter((dd)=>{
            return dd!==Number(element?.getAttribute("index"))
        })
        if (element.classList.contains("selectedBorder")){
            element.classList.remove("selectedBorder")
        }else{
            element.classList.add("selectedBorder")
            deleteIMGArray.push(Number(element?.getAttribute("index")))
        }
        if(deleteIMGArray.length>0){
            $('.deleteImg').show()
        }else{
            $('.deleteImg').hide()
        }
    }
    function deleteIMG(){
        dialog.confirm(`確認刪除${deleteIMGArray.length}張圖片?`,(response)=>{
          if (response){
              if (imgArray.length > 1) {
                  deleteIMGArray.forEach((v)=>{
                      imgArray.splice(v ,1);
                  })
                  gBundle.preview_image = imgArray;
                  gvc.notifyDataChange('slideImg');
              }else {
                  alert("請至少留一張")
              }

          }
        })

    }

    let viewModel = new ViewModel(gvc)
    let dialog = new Dialog(gvc)
    let shareView = new SharedView(gvc)
    // let img = gBundle.preview_image;
    // let imgArray:string[] = ["img/sample/idea/postimg.png" , "img/sample/idea/postimg_2.png","img/sample/idea/postimg.png" , "img/sample/idea/postimg_2.png","img/sample/idea/postimg.png" , "img/sample/idea/postimg_2.png"];
    let imgArray: string[] = gBundle.preview_image
    let deleteIMGArray: number[] = [];
    return {
        onCreateView: () => {
            let topInset: number = 10
            return gvc.bindView({
                bind: `mainView`,
                view: () => {
                    if (interact == null) {
                        return ``
                    }
                    return `
                    ${shareView.navigationBar({
                        title: "新貼文",
                        leftIcon: `  <img class="" src="img/sample/idea/left-arrow.svg" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                            viewModel.checkDismiss()
                        })}">`,
                        rightIcon: `<div class="nextStep"  onclick="${gvc.event(() => {
                            glitter.changePage('jsPage/idea/idea_post.js', "idea_post", true, gBundle)
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
                                        <div class="selectImg flex-shrink-0" index=${index} onclick="${gvc.event((e)=>{appendBorder(e);})}" style="width: 92%; height: 220px;margin-right: 3%;background: 50% / cover url(${img})">
                                            <div class="edit-btn rounded" style="background: 50% / cover url('img/sample/idea/pen.svg')" index=${index} onclick="${gvc.event((html,event)=>{editImg(index,event);})}"></div>
                                        </div>
                                    `
                                })
                                return returnHtml
                            },
                            divCreate: {class: `d-flex imgBlock w-100 h-100 align-items-center`, style: ``},
                            onCreate: () => {


                            }
                        })
                    })()}
                 ${(()=>{
                     return  `<img class="deleteImg" alt="trash" src="img/sample/idea/delete.svg" style="display: none;" onclick="${gvc.event(()=>{deleteIMG();})}"></img>`
                   
                    })()}
                   
                </main>
            `
                },
                divCreate: {class: ``, style: ``},
                onCreate: () => {
                    let deleteable = true
                    // if (interact) {
                    //     interact('.deleteImg').dropzone({
                    //         // only accept elements matching this CSS selector
                    //         accept: '.selectImg',
                    //         // Require a 75% element overlap for a drop to be possible
                    //         overlap: 0.01,
                    //
                    //         // listen for drop related events:
                    //
                    //         ondropactivate: function (event: any) {
                    //             // 抓著的時候
                    //             event.relatedTarget.classList.add('drop-active')
                    //         },
                    //         ondragenter: function (event: any) {
                    //             //確定放進去還沒放手
                    //
                    //         },
                    //         ondragleave: function (event: any) {
                    //             //在外面
                    //             //     console.log("test")
                    //             //     event.target.classList.remove('drop-active')
                    //             //     gvc.notifyDataChange('slideImg')
                    //             event.stopImmediatePropagation();
                    //         },
                    //         ondrop: function (event: any) {
                    //             // 放進去之後
                    //             event.stopImmediatePropagation();
                    //             dialog.confirm("確認刪除?",
                    //                 (result) => {
                    //                     if (result) {
                    //                         if (imgArray.length > 1) {
                    //                             imgArray.splice(event.relatedTarget, 1)
                    //                             gBundle.preview_image = imgArray
                    //                             event.stopImmediatePropagation();
                    //                         } else {
                    //                             alert("最少得留一個")
                    //                         }
                    //                     }
                    //                     gvc.notifyDataChange('slideImg')
                    //                 })
                    //
                    //         },
                    //         ondropdeactivate: function (event: any) {
                    //             // 拿出來
                    //             event.target.classList.remove('drop-active')
                    //         }
                    //     })
                    //
                    //
                    // interact('.selectImg')
                    //     .draggable({
                    //         inertia: true,
                    //         modifiers: [
                    //             interact.modifiers.restrictRect({
                    //                 restriction: 'parent',
                    //                 endOnly: true
                    //             })
                    //         ],
                    //         autoScroll: true,
                    //
                    //         listeners: {move: dragMoveListener}
                    //     })
                    // }

                    // enable draggables to be dropped into this
                    // function dragMoveListener(event: any) {
                    //     let target = event.target
                    //     // keep the dragged position in the data-x/data-y attributes
                    //     // let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                    //     let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                    //     let x = 1;
                    //
                    //     // translate the element
                    //     target.style.webkitTransform =
                    //         target.style.transform =
                    //             'translate(' + x + 'px, ' + y + 'px)'
                    //
                    //     // update the posiion attributes
                    //     target.setAttribute('data-x', x)
                    //     target.setAttribute('data-y', y)
                    // }

                }
            })
        }
    }

    function editImg(index:number , event:any){
        event.stopImmediatePropagation();

    }

})