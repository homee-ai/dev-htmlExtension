import {init} from '../../glitterBundle/GVController.js';
import {Funnel} from '../../glitterBundle/funnel.js';
import {Dialog} from "../../dialog/dialog-mobile.js";
import {appConfig} from "../../config.js";


init((gvc, glitter, gBundle) => {

    return {
        onCreateView: () => {
            // gvc.parameter.pageConfig
            let passData = gvc.parameter.pageConfig?.obj
            let viewModel = {
                title: passData.item.name,
                price: passData.item.subtotal,
            }
            let key: string[] = passData.item.kind.split(" / ");


            function productKindDom(index: number, sizeType: any) {
                return `
                    ${gvc.bindView({
                    bind: `type${index}`,
                    view: () => {
                        return `
                            <div class="sizeSelectTitle">
                                ${sizeType.attribute_key}
                            </div>
                            <div class="d-flex flex-wrap" style="overflow: scroll;">
                                ${gvc.map(sizeType.attribute_values.map((data: any, index: number) => {
                            let className = "kindUnselected"
                            if (data.selected) {
                                className += " kindSelected"
                            }
                            return `
                                        <div class="${className}" style="margin-top: 8px;">
                                            ${data.value}
                                        </div>
                                    `
                        }))}
                            </div>      
                        `
                    }, divCreate: {class: ``, style: `margin-bottom:8px;`},
                })}
                                        
                                    `
            }

            return `
                <div class="position-relative h-100" style="width:100vw;padding: 0 31px;;top: 25%;z-index: 99999;">
                    <div class="d-flex flex-column" style="width: 100%;padding: 16px 24px;background: #FFFFFF;border-radius: 24px;font-family: 'Noto Sans TC';font-style: normal;">
                        <div style="font-weight: 700;font-size: 24px;line-height: 35px;font-feature-settings: 'pnum' on, 'lnum' on;color: #1E1E1E;">
                            ${viewModel.title}
                        </div>
                        
                        ${gvc.bindView({
                            bind:"price",
                            view : ()=>{
                                return `NT$ ${viewModel.price}`
                            },divCreate:{ style:`font-weight: 500;font-size: 20px;line-height: 29px;font-feature-settings: 'pnum' on, 'lnum' on;color: #FE5541;`}
                        })}
                            
                        
                        <div style="width: 40px;height: 2px;background: #1E1E1E;margin-top:24px;margin-bottom: 16px; "></div>
                        <div style="">
                            ${gvc.bindView({
                                bind: "sizeSelect",
                                view: () => {
                                    function productKindDom(index: number, sizeType: any) {
                                        return `
                                            ${gvc.bindView({
                                            bind: `type${index}`,
                                            view: () => {
                                                return `
                                                <div class="sizeSelectTitle">
                                                    ${sizeType.attribute_key}
                                                </div>
                                                <div class="d-flex flex-wrap" style="overflow: scroll;">
                                                    ${gvc.map(sizeType.attribute_values.map((data: any, index2: number) => {
                
                                                    let classStyle = {
                                                        kindUnselected: `margin-right:8px;padding: 4px 12px 3px;height: 27px;border: 1px solid #E0E0E0;border-radius: 5px;font-family: 'Noto Sans TC';font-style: normal;font-weight: 500;font-size: 14px;line-height: 20px;color: #1E1E1E;`,
                                                        kindSelected: `background: rgba(41, 41, 41, 0.1);border: 1px solid #1E1E1E;border-radius: 5px;`
                                                    }
                                                    let className = classStyle.kindUnselected
                
                                                    if (key[index] == data.value) {
                                                        className += classStyle.kindSelected
                                                    }
                                                    return `
                                                    <div class="" style="margin-top: 8px;${className}" onclick="${gvc.event(() => {
                                                        key[index] = data.value;
                                                        let temp = "";
                                                        key.forEach((e) => {
                                                            temp += e + " / "
                                                        })
                                                        temp = temp.slice(0, -3);
                                                        viewModel.price = passData.other.sku_list[temp].sale_price
                                                        gvc.notifyDataChange("price")
                                                        gvc.notifyDataChange("sizeSelect")
                                                        // widget.refreshComponent()
                                                    })}">${data.value}
                                                                        </div>
                                                                                        `
                                                }))}
                                                                </div>      
                                                            `
                                                }, divCreate: {class: ``, style: `margin-bottom:8px;`},
                                            })}
                                                                    
                                        `
                                    }
                
                                    //todo 確認一下會不會有只有單規格的狀況
                                    if (passData.other.attribute_list) {
                
                                        return gvc.map(passData.other.attribute_list.map((sizeType: any, index: number) => {
                                            if (sizeType.attribute_key != "Title") {
                                                return productKindDom(index, sizeType);
                                            } else
                                                return ``
                
                                        }))
                                    } else {
                                        return ``
                                    }
                
                
                                }, divCreate: {class: ``, style: "padding-bottom:32px;border-bottom:1px solid rgb(30,30,30,0.1);"},
                
                            })}
                        </div>
                        <div style="padding: 0 24px;">
                            <div class="w-100 d-flex align-items-center justify-content-center" style="padding:7px 0;background: #FE5541;border-radius: 24px;font-weight: 700;font-size: 18px;line-height: 26px;text-align: center;letter-spacing: 0.15em;font-feature-settings: 'pnum' on, 'lnum' on;color: #FFFFFF;" onclick="${gvc.event(() => {
                                passData.item.kind = ""
                                key.forEach((e) => {
                                    passData.item.kind += e + " / "
                                })
                
                
                                passData.item.kind = passData.item.kind.slice(0, -3)
                
                
                                console.log("修改資訊")
                                console.log(passData)
                                console.log(passData.item.kind)
                                console.log(passData.other.sku_list[passData.item.kind])
                                passData.item.item_id = passData.other.sku_list[passData.item.kind].sku_id;
                                passData.item.price = passData.other.sku_list[passData.item.kind].price;
                                passData.item.subtotal = passData.other.sku_list[passData.item.kind].sale_price;
                                let imageIndex = passData.other.sku_list[passData.item.kind].image_index;
                                passData.item.img = passData.other.product_detail.images[imageIndex];
                                passData.callback();
                                glitter.closeDiaLog("changeSku")
                            })}">
                                確認
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    }


})