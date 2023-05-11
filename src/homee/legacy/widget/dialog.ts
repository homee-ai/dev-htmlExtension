import {GVC} from "../glitterBundle/GVController.js";

export class Dialog{
    public dataLoading: (show: Boolean,text?:String) => void;
    public confirm: (title:string,callback: (result: Boolean) => void) => void;
    public showInfo: (title: string) => void;
    constructor(gvc:any) {
        const glitter=gvc.glitter
        //loading view
        this.dataLoading=(show:Boolean,text?:String)=>{
            switch (glitter.deviceType){
                case glitter.deviceTypeEnum.Web:
                    break
                default:
                    glitter.runJsInterFace("dataLoading",{show:show,text:text},(response:any)=>{})
                    break
            }
        }
        //Confirm view
        this.confirm=(title:string,callback:(result:Boolean)=>void)=>{
            glitter.runJsInterFace("confirm",{
                title:title
            },(response:any)=>{
               callback(response.result)
            },{
                webFunction(data: {}, callback: (data: any) => void): any {
                    return {
                        result:confirm(title)
                    }
                }
            })
        }
        //Info Alert
        this.showInfo=(title:string)=>{
            glitter.runJsInterFace("showInfo",{
                title:title
            },(response:any)=>{
            },{
                webFunction(data: {}, callback: (data: any) => void): any {
                    return confirm(title)
                }
            })
        }
        //Success alert
        // this.success=()=>{
        //
        // }
    }
}