import { Glitter } from "../glitterBundle/Glitter.js";
export class User {
    static getUserData(next) {
        const glitter = Glitter.glitter;
        glitter.runJsInterFace("getUserData", {}, function (response) {
            glitter.share.userData = response.data;
            next();
        }, {
            webFunction(data, callback) {
                $.ajax({
                    url: `${glitter.share.apiURL}/api/v1/user/login`,
                    type: 'post',
                    data: JSON.stringify({ email: 'sam94074@gmail.com', pwd: `sam12345` }),
                    contentType: 'application/json; charset=utf-8',
                    success: (suss) => {
                        callback({
                            data: {
                                user_id: 12052350,
                                last_name: "Rdtest",
                                first_name: "Rdtes22t",
                                name: "Rdtest Rd",
                                photo: "https://prd-homee-api-public.s3.amazonaws.com/scene/12577227/headPhoto.png",
                                AUTH: suss.token
                            },
                            beta: true
                        });
                    },
                    error: (err) => {
                    },
                });
            }
        });
    }
}
