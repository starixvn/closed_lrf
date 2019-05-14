const modulePath = '../langHelper';

const resourceEnUS = "_language_en_US";
const resourceZhCn = "_language_zh_CN";

const originalPageLanguage = window.PageLanguage;
const originalDefaultLanguage = window[resourceEnUS];
const originalZhCnLanguage = window[resourceZhCn];

describe('LangHelper ', () => {
    describe('window.PageLanguage is undefined - Get default language code', () => {
        let LangHelper;

        beforeAll(() => {
            LangHelper = require(modulePath).default;

            window[resourceEnUS] = {
                key1: "Key 1"
            }
        })

        afterAll(() => {
            window[resourceEnUS] = originalDefaultLanguage
        })

        it('currentLanguage() should return "en-US"', () => {
            const expectedResult = "en-US";

            const result = LangHelper.currentLanguage;

            expect(result).toBe(expectedResult);
        })

        describe('getSingleResource(key)', () => {
            it('Key is not exist in resouce - return key', () => {
                const key = "key2";

                const result = LangHelper.getSingleResource(key);

                expect(result).toBe(key);
            })

            it('Key is exist in resouce - return correct value', () => {
                const expectedResult = "Key 1";

                const key = "key1";

                const result = LangHelper.getSingleResource(key);

                expect(result).toBe(expectedResult);
            })
        })
    })
})