import {GVC} from "../glitterBundle/GVController.js";

export class Dialog{
    public dataLoading: (show: Boolean,text?:String) => void;
    public confirm: (title:string,callback: (result: Boolean) => void) => void;
    public showInfo: (title: string) => void;
    constructor(gvc:GVC) {
        const glitter=gvc.glitter
        //loading view
        this.dataLoading=(show:Boolean,text?:String)=>{
            switch (glitter.deviceType){
                case glitter.deviceTypeEnum.Web:
                    break
                default:
                    glitter.runJsInterFace("dataLoading",{show:show,text:text},(response)=>{})
                    break
            }
        }
        //Confirm view
        this.confirm=(title:string,callback:(result:Boolean)=>void)=>{
            glitter.runJsInterFace("confirm",{
                title:title
            },(response)=>{
               callback(response)
            },{
                webFunction(data: {}, callback: (data: any) => void): any {
                    return confirm(title)
                }
            })
        }
        //Info Alert
        this.showInfo=(title:string)=>{
            glitter.runJsInterFace("showInfo",{
                title:title
            },(response)=>{
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