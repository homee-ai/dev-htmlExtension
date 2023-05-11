export class OrderNotice {
    constructor(glitter) {
        this.glitter = glitter;
    }
    getEggNotice(callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        let status;
        let data = [
            {
                id: "20220718",
                read: false,
                status: 3,
                date: "2022-07-21 10:10"
            },
        ];
        callback([{
                read: false,
                title: "聖誕老人經過你家囉",
                text: "隨機開啟您的空間尋找聖誕老人留給您的專屬驚喜禮物哦！",
                date: "2022-12-25 12:25"
            }]);
    }
    getOrderNotice(callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        let status;
        let data = [
            {
                id: "20220718",
                read: false,
                status: 2,
                date: "2022-07-20 10:10"
            },
            {
                id: "20220718",
                read: true,
                status: 1,
                date: "2022-07-19 10:10"
            },
            {
                id: "20220718",
                read: true,
                status: 0,
                date: "2022-07-18 10:10"
            },
        ];
        callback(data);
    }
}
