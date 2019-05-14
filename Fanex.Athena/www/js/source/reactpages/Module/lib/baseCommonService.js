class BaseCommonService {
    constructor() {
        if (this.constructor == BaseCommonService) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getLink(systemType, actionUrl) {
        throw new Error("Method 'getTabLink()' must be implemented.");
    }

    fetchData(systemType, apiUrl, method = 'POST') {
        throw new Error("Method 'fetchData()' must be implemented.");
    }
}

export default BaseCommonService;