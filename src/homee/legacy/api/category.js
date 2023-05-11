export class Category {
    constructor(glitter) {
        this.glitter = glitter;
    }
    getSubcategoryList(parCategoryID, callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/category`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
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
    getCategoryData(parameter, value, callback) {
        const glitter = this.glitter;
        const that = this;
        let jsonData;
        $.ajax({
            url: `${glitter.share.apiURL}/api/v1/product?easy_id=1&${parameter}=${value}`,
            type: 'get',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
            success: (response) => {
                callback(response["product_list"]);
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
            url: `${glitter.share.apiURL}/api/v1/category`,
            type: 'get',
            data: '',
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: glitter.share.userData.AUTH },
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
