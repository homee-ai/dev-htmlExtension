import {Glitter} from "../glitterBundle/Glitter.js";
import {appConfig} from "../config.js";

export interface ProductData {
    id: string,
    modelUrl: string,
    multiple: string,
    name: string,
    preview_image: string,
    price: number,
    sale_price: number,
    sku: string,
    spec: string,
}

export interface CategoryListData {
    id: number,
    name: string,
    image_url: string,
    store_id: string,
    sub_category: SubCategoryListData[]

}

export interface SubCategoryListData {
    easy_collection_id: number,
    id: number,
    image_url: string,
    name: string,
    parent_category_id: number

}


export class Category {
    public glitter: Glitter

    constructor(glitter: Glitter) {
        this.glitter = glitter;
    }

    //取得文章列表
    public getSubcategoryList(parCategoryID: string, callback: (data: any) => void) {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any

        $.ajax({
            url: `${appConfig().serverURL}/api/v1/category`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            success: (resposnse: any) => {
                let allCategoryList = resposnse["category_list"]
                let returnData: any;
                allCategoryList.forEach((categoryData: any) => {

                    if (categoryData["store_id"] == parCategoryID) {
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

    public getCategoryData(parameter: string, value: string, callback: (data: ProductData[] ) => void , sortby?:string): void {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        let sortPara = (sortby)?`&sort_by=${sortby}`:""
        // sort_by: 'manual' | 'best-selling' | 'alpha' | 'alpha-desc' | 'price' | 'price-desc' | 'lastest' | 'lastest-desc';
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}${sortPara}`,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
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
    public getPageCategoryData(parameter: string, value: string,  limit:number , cursor:string , callback: (data: any ) => void , sortby?:string): void {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        let sortPara = (sortby)?`&sort_by=${sortby}`:""
        let url = `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}${sortPara}`;
        if (limit){
            url += "&limit=" + limit.toString();
        }
        if (cursor){
            url += "&cursor=" + cursor;
        }
        // sort_by: 'manual' | 'best-selling' | 'alpha' | 'alpha-desc' | 'price' | 'price-desc' | 'lastest' | 'lastest-desc';
        $.ajax({
            url: url,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            success: (response: any) => {

                callback(response)
            },
            error: (e) => {
                setTimeout(() => {
                    // this.getSubcategoryList(data,callback)
                }, 1000)
            },
        });
    }

    public getCategoryAllList(callback: (data: any) => void): void {
        const glitter = this.glitter;
        const that = this;
        let jsonData: any
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/category`,
            type: 'get',
            data: '',
            contentType: 'application/json; charset=utf-8',

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

