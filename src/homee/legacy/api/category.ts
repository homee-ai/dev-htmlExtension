import {Glitter} from "../glitterBundle/Glitter.js";

export interface ProductData {
    id: string,
    modelUrl : string,
    multiple : string ,
    name : string,
    preview_image : string,
    price : number,
    sale_price : number,
    sku : string,
    spec : string,
}

export interface CategoryListData{
    id : number,
    name : string,
    image_url : string,
    store_id : string,
    sub_category:SubCategoryListData[]

}
export interface SubCategoryListData{
    easy_collection_id : number,
    id : number ,
    image_url : string,
    name : string ,
    parent_category_id : number

}


export class Category {
    public glitter: Glitter

    constructor(glitter: Glitter) {
        this.glitter = glitter;
    }

    //取得文章列表
    public getSubcategoryList(parCategoryID:string,callback: (data:any) => void) {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any

        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/category`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (resposnse: any) => {
                let allCategoryList = resposnse["category_list"]
                let returnData:any;
                allCategoryList.forEach((categoryData:any)=>{

                    if (categoryData["store_id"] == parCategoryID){
                        returnData = categoryData.sub_category;
                    }
                })
                callback(returnData)
            },
            error: (e) => {
                setTimeout(() => {
                    // this.getSubcategoryList(data,callback)
                }, 1000)
            },
        });
    }

    public getCategoryData(parameter:string , value:string , callback: (data:ProductData[])=>void):void{
        const glitter = this.glitter;
        const that = this;
        let jsonData: any

        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/product?easy_id=1&${parameter}=${value}`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (response: any) => {
                callback(response["product_list"])
            },
            error: (e) => {
                setTimeout(() => {
                    // this.getSubcategoryList(data,callback)
                }, 1000)
            },
        });
    }
    public getCategoryAllList(callback: (data:any)=>void):void{
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/category`,
            type: 'get',
            data: '',
            contentType: 'application/json; charset=utf-8',
            headers: {Authorization: glitter.share.userData.AUTH},
            success: (response: any) => {
                callback(response['category_list'] as CategoryListData[])
            },
            error: (e) => {
                setTimeout(() => {
                    // this.getSubcategoryList(data,callback)
                }, 1000)
            },
        });
    }

}

