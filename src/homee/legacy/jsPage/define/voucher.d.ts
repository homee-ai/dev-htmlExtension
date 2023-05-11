interface VoucherModel {
    id: string;
    vendor_name: string;
    vendor_icon: string;
    name: string;
    config: any;
    title: string;
    subTitle: string;
    startTime: string;
    endTime: string;
    formatEndTime?: string;
    isUse: boolean;
    code: string;
    lowCostText?: string,
    lowCostNumber?: string,
}
