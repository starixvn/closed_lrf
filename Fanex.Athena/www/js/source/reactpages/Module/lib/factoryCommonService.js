import LapCommonService from "./lapCommonService";

export default class FactoryCommonService {
    static createInstance() {
        const pageConfig = window._pConfig;
        if (!pageConfig) {
            throw new Error("Missing _pConfig in window");
        }

        const { applyApiTokenUrl, tabList } = pageConfig;

        if (!applyApiTokenUrl) {
            throw new Error("Missing applyApiTokenUrl in window._pConfig");
        }

        if (!window.Identity) {
            throw new Error("Missing Identity object");
        }

        const { RootUrl, ApplyTokenUrl } = window.Identity;
        if (!RootUrl) {
            throw new Error("Missing Identity.RootUrl");
        }

        if (!ApplyTokenUrl) {
            throw new Error("Missing Identity.ApplyTokenUrl");
        }

        const initialConfig = {
            tabList,
            baseUrl: RootUrl,
            applyApiTokenUrl,
            applyLinkTokenUrl: ApplyTokenUrl
        }
        return new LapCommonService(initialConfig);
    }
}