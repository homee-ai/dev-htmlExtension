export class Lan{
    public static getLan=(id:number)=>{
        let language=[
            {
                "id": 1,
                "tw": "首頁",
                "en": "Home"
            },
            {
                "id": 2,
                "tw": "靈感",
                "en": "Idea"
            },
            {
                "id": 3,
                "tw": "我的空間",
                "en": "MySpace"
            },
            {
                "id": 4,
                "tw": "購物車",
                "en": "Cart"
            },
            {
                "id": 5,
                "tw": "會員",
                "en": "Me"
            },
            {
                "id": 6,
                "tw": "儲存時間",
                "en": "Established at"
            },
            {
                "id": 7,
                "tw": "開始掃描",
                "en": "Start scanning"
            },
            {
                "id": 8,
                "tw": "點擊下方按鈕開始掃描空間",
                "en": "Click button to start scanning"
            },
            {
                "id": 9,
                "tw": "將灰色空間掃描填滿",
                "en": "Scanning the grey areas"
            },
            {
                "id": 10,
                "tw": "慢一點",
                "en": "Slow down"
            },
            {
                "id": 11,
                "tw": "點擊下方按鈕執行 AI 運算",
                "en": "Click red button to create a space"
            },
            {
                "id": 12,
                "tw": "AI 運算中",
                "en": "AI computing"
            },
            {
                "id": 13,
                "tw": "AI 運算完成",
                "en": "Finished"
            },
            {
                "id": 14,
                "tw": "商品清單",
                "en": "Items in space"
            },
            {
                "id": 15,
                "tw": "總金額：",
                "en": "Total: "
            },
            {
                "id": 16,
                "tw": "加入購物車",
                "en": "Add to Cart"
            },
            {
                "id": 17,
                "tw": "分享至靈感",
                "en": "Post your idea"
            },
            {
                "id": 18,
                "tw": "分享給",
                "en": "Share with"
            },
            {
                "id": 19,
                "tw": "搜尋",
                "en": "Search"
            },
            {
                "id": 20,
                "tw": "傳送",
                "en": "Send"
            },
            {
                "id": 21,
                "tw": "請加入商品至空間",
                "en": "Add items to space"
            },
            {
                "id": 22,
                "tw": "加入",
                "en": "Add"
            },
            {
                "id": 23,
                "tw": "加入至空間",
                "en": "Add to Space"
            },
            {
                "id": 24,
                "tw": "使用雙指移動空間，將商品放置於合適位置",
                "en": "Use fingers move space, place item in desired position"
            },
            {
                "id": 25,
                "tw": "取消",
                "en": "Cancel"
            },
            {
                "id": 26,
                "tw": "編輯",
                "en": "Edit"
            }
        ]
        const item=language.find((dd)=>{return dd.id==id})
        return (item) ? item.tw:`X${id}X`
    }
}