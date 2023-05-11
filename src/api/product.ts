import {appConfig} from "../config.js";
import {CategoryListData, ProductData} from "../homee/legacy/api/category";

export class Product {
    public static productDetail(productId: string, callback: (result: any) => void) {

        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product/detail?product_id=${productId}`,
            type: 'get',
            headers: {Authorization: appConfig().token},
            contentType: 'application/json; charset=utf-8',
            success: (response: any) => {
                console.log("商品資訊")
                console.log(response)
                callback(response)
            },
            error: (err: any) => {
                callback(false)
            },
        });
    }
    public static productDetailwithSkuid(productId: string, callback: (result: any) => void) {

        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product/detail?sku=${productId}`,
            type: 'get',
            headers: {Authorization: appConfig().token},
            contentType: 'application/json; charset=utf-8',
            success: (response: any) => {

                callback(response)
            },
            error: (err: any) => {
                callback(false)
            },
        });
    }

    //取得文章列表
    public static getSubcategoryList(parCategoryID: string, callback: (data: any) => void) {
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

    public static getCategoryData(parameter: string, value: string, callback: (data: ProductData[]) => void): void {
        const that = this;
        let jsonData: any
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}`,
            type: 'get',
            data: jsonData,
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



    public static getCategoryAllList(callback: (data: any) => void): void {
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