class BaseContainerService {
    constructor() {
        if (this.constructor == BaseContainerService) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getTabLink(sType, action) {
        throw new Error("Method 'getTabLink()' must be implemented.");
    }

    fetchData(sType, action, ajaxConfig = {}) {
        throw new Error("Method 'fetchData()' must be implemented.");
    }
}

export default BaseContainerService;