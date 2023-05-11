import { appConfig } from "../config.js";
export class Category {
    constructor(glitter) {
        this.glitter = glitter;
    }
    getSubcategoryList(parCategoryID, callback) {
        const glitter = this.glitter;
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
    getCategoryData(parameter, value, callback, sortby) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        let sortPara = (sortby) ? `&sort_by=${sortby}` : "";
        $.ajax({
            url: `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}${sortPara}`,
            type: 'get',
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
    getPageCategoryData(parameter, value, limit, cursor, callback, sortby) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        let sortPara = (sortby) ? `&sort_by=${sortby}` : "";
        let url = `${appConfig().serverURL}/api/v1/product?easy_id=1&${parameter}=${value}${sortPara}`;
        if (limit) {
            url += "&limit=" + limit.toString();
        }
        if (cursor) {
            url += "&cursor=" + cursor;
        }
        $.ajax({
            url: url,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                callback(response);
            },
            error: (e) => {
                setTimeout(() => {
                }, 1000);
            },
        });
    }
    getCategoryAllList(callback) {
        const glitter = this.glitter;
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
