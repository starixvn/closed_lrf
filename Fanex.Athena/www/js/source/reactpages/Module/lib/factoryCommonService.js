import LapCommonService from "./lapCommonService";

export default class FactoryCommonService {
    static createInstance() {
        const pageConfig = window._pConfig;
        if (!pageConfig) {
            throw new Error("Missing _pConfig in window");
        }
        const { TokenUrl, ApplyTokenUrl } = window._pConfig;
        return new LapCommonService({ TokenUrl, ApplyTokenUrl });
    }
}