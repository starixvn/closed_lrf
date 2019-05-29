import BaseCommonService from '../baseCommonService';

describe('baseCommonService', () => {
    class TestCommonService extends BaseCommonService {
        constructor() {
            super();
        }
    }

    it('should throw error when constructing new instance directly', () => {
        expect(() => new BaseCommonService()).toThrowError('Abstract classes can\'t be instantiated.');
    })

    const runInstanceMethodTest = (methodName) => {
        it(`${methodName} - should throw error when calling directly from base with correct message`, () => {
            const instance = new TestCommonService();

            expect(() => instance[methodName]()).toThrowError(`Method '${methodName}()' must be implemented.`);
        })
    }

    ['getTabList', 'getLink', 'fetchData', 'fetchMultiple'].forEach(item => {
        runInstanceMethodTest(item);
    })
})