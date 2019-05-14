class BaseCommonService {
    constructor() {
        if (this.constructor == BaseCommonService) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getLink(sysType, action) {
        throw new Error("Method 'getTabLink()' must be implemented.");
    }

    fetchData(sType, action, params, configOption = {}) {
        throw new Error("Method 'fetchData()' must be implemented.");
    }

    fetchMultiple(promiseList, callback) {
        throw new Error("Method 'fetchMultiple()' must be implemented.");
    }
}

export default BaseCommonService;