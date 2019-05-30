import FactoryCommonService from '../factoryCommonService';
import LapCommonService from '../lapCommonService';

jest.mock('../lapCommonService')

describe('factoryCommonService', () => {
    const originalPageConfig = window._pConfig;
    const originalIdentity = window.Identity;

    const resetGlobalValue = () => {
        window._pConfig = originalPageConfig;
        window.Identity = originalIdentity;
    }

    describe('createInstance', () => {
        afterEach(() => {
            resetGlobalValue();
            LapCommonService.mockReset();
        })

        it('missing _pConfig - throw error with correct message', () => {
            const invoker = () => FactoryCommonService.createInstance();
            expect(invoker).toThrowError('Missing _pConfig in window');
        })

        it('missing _pConfig.applyApiTokenUrl - throw error with correct message', () => {
            window._pConfig = {};
            const invoker = () => FactoryCommonService.createInstance();
            expect(invoker).toThrowError('Missing applyApiTokenUrl in window._pConfig');
        })

        it('missing Identity - throw error with correct message', () => {
            window._pConfig = {
                applyApiTokenUrl: 'verify/applyapitoken'
            };
            const invoker = () => FactoryCommonService.createInstance();
            expect(invoker).toThrowError('Missing Identity object');
        })

        it('missing Identity.RootUrl - throw error with correct message', () => {
            window._pConfig = {
                applyApiTokenUrl: 'verify/applyapitoken'
            };
            window.Identity = {};

            const invoker = () => FactoryCommonService.createInstance();
            expect(invoker).toThrowError('Missing Identity.RootUrl');
        })

        it('missing Identity.ApplyTokenUrl - throw error with correct message', () => {
            window._pConfig = {
                applyApiTokenUrl: 'verify/applyapitoken'
            };
            window.Identity = {
                RootUrl: '/'
            };

            const invoker = () => FactoryCommonService.createInstance();
            expect(invoker).toThrowError('Missing Identity.ApplyTokenUrl');
        })

        it('has config values - create new LapCommonService instance with correct parameter', () => {
            window._pConfig = {
                applyApiTokenUrl: 'verify/applyapitoken',
                tabList: ['tab1', 'tab2']
            };
            window.Identity = {
                RootUrl: '/',
                ApplyTokenUrl: 'verify/applytoken'
            };

            LapCommonService.mockImplementation((initialConfig) => {
                return initialConfig;
            });

            const { applyApiTokenUrl, tabList } = window._pConfig;
            const { RootUrl, ApplyTokenUrl } = window.Identity;
            const expectedResult = {
                tabList,
                baseUrl: RootUrl,
                applyApiTokenUrl,
                applyLinkTokenUrl: ApplyTokenUrl
            }

            const result = FactoryCommonService.createInstance();
            expect(result).toEqual(expectedResult);
        })
    })
})