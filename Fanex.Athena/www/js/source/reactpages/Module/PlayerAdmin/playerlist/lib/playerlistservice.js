import factoryCommonService from "../../../lib/factoryCommonService";

export default class playerlistservice {
    constructor() {
        this.commonService = factoryCommonService.createInstance();
    }
}