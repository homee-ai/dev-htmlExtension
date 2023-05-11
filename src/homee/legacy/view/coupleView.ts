import { GVC } from '../glitterBundle/GVController.js';

export class ViewModel {
    public gvc: GVC;
    constructor(gvc: GVC) {
        this.gvc = gvc;
    }
    couponRow = (couponData: any) => {
        const gvc = this.gvc;

        gvc.addStyle(`
            .couponcompany : {
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                color: #292929;
            }
            .couponDiscount {
                font-weight: 700;
                font-size: 18px;
                line-height: 26px;
                color: #fd6a58;
            }
            .couponCondition {
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                text-align: center;
                color: #292929;
            }
            .couponDate {
                font-weight: 400;
                font-size: 10px;
                line-height: 14px;
                text-align: center;
                color: #858585;
            }
            .couponBTN {
                width: 48px;
                height: 20px;
                background: #fd6a58;
                border-radius: 4px;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                letter-spacing: 0.15em;
                color: white;
            }
        `);

        return /*html*/ `
            ${gvc.bindView({
                bind: `couponDetail${couponData.id}`,
                view: () => {
                    return /*html*/ `
                        <div
                            class="d-flex flex-column align-items-center justify-content-center"
                            style="width: 88px;height: 77px;padding-right: 12px;border-right: 1px solid #EAD8C2;"
                        >
                            <img src="${couponData.icon}" style="width: 56px;height: 56px;" />
                            <div class="couponCompany">${couponData.company}</div>
                        </div>
                        <div class="d-flex flex-column align-items-baseline justify-content-center" style="padding-left: 24px;">
                            <div class="couponDiscount">${couponData.discount}</div>
                            <div class="couponCondition">${couponData.condition}</div>
                            <div class="couponDate">${couponData.date}</div>
                        </div>
                        <button class="couponBTN border-0 ms-auto">使用</button>
                    `;
                },
                divCreate: { style: ``, class: `w-100 d-flex align-items-center` },
            })}
        `;
    };
}
