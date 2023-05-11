import { appConfig } from "../config.js";
export class Product {
    static productDetail(productId, callback) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product/detail?product_id=${productId}`,
            type: 'get',
            headers: { Authorization: appConfig().token },
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                console.log("商品資訊");
                console.log(response);
                callback(response);
            },
            error: (err) => {
                callback(false);
            },
        });
    }
    static productDetailwithSkuid(productId, callback) {
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product/detail?sku=${productId}`,
            type: 'get',
            headers: { Authorization: appConfig().token },
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                callback(response);
            },
            error: (err) => {
                callback(false);
            },
        });
    }
    static getSubcategoryList(parCategoryID, callback) {
        const that = this;
        let jsonData;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/category`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            success: (resposnse) => {
                let allCategoryList = resposnse["category_list"];
                let returnData;
                allCategoryList.forEach((categoryData) => {
                    if (categoryData["store_id"] == parCategoryID) {
                        returnData = categoryData.sub_category;
                    }
                });
                callback(returnData);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    static getCategoryData(parameter, value, callback) {
        const that = this;
        let jsonData;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                callback(response["product_list"]);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    static getCategoryAllList(callback) {
        const that = this;
        let jsonData;
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/category`,
            type: 'get',
            data: '',
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                callback(response['category_list']);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
}
