export class EditerApi {
    static upload(title, default_, gvc, callback) {
        return `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${title}</h3>
<div class="d-flex align-items-center mb-3">
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${default_}">
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
            gvc.glitter.ut.chooseMediaCallback({
                single: true,
                accept: 'image/*',
                callback(data) {
                    gvc.glitter.share.publicInterface["glitter"].upload(data[0].file, (link) => {
                        callback(link);
                    });
                }
            });
        })}"></i>
</div>`;
    }
}
