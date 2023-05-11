import {Glitter} from "../glitterBundle/Glitter.js";


//
export interface OrderNoticeStruct {
    id : string,
    status : number,
    date : string,
    read : boolean
}
//todo 彩蛋的結構待定
export interface EggNoticeStruct {
    id : string,
    status : number,
    date : string,
    read : boolean
}






export class OrderNotice {
    public glitter: Glitter

    constructor(glitter: Glitter) {
        this.glitter = glitter;
    }
    //todo 取得彩蛋通知
    public getEggNotice(callback: (data:any) => void) {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        let status

        let data:EggNoticeStruct[] = [
            {
                id : "20220718",
                read : false,
                status : 3,
                date : "2022-07-21 10:10"
            },
        ]


        callback([{
            read:false,
            title : "聖誕老人經過你家囉",
            text : "隨機開啟您的空間尋找聖誕老人留給您的專屬驚喜禮物哦！",
            date : "2022-12-25 12:25"
        }])
    }
    //取得訂單通知
    public getOrderNotice(callback: (data:any) => void) {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        let status
        let data:OrderNoticeStruct[] = [
            {
                id : "20220718",
                read : false,
                status : 2,
                date : "2022-07-20 10:10"
            },
            {
                id : "20220718",
                read : true,
                status : 1,
                date : "2022-07-19 10:10"
            },
            {
                id : "20220718",
                read : true,
                status : 0,
                date : "2022-07-18 10:10"
            },
        ]


        callback(data)
    }
}

