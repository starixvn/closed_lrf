import axios from 'axios';
import LapCommonService from '../lapCommonService';
import { systemType } from '../../constants/configInfo';

jest.mock('axios');

describe('lapCommonService', () => {
    const defaultTabList = [
        { "Name": "AccountInfo", "Text": "Account Info", "Action": "PlayerAccountInfo", "SystemType": systemType.newAdmin },
        { "Name": "Statement", "Text": "Statement", "Action": "CustomerOutstandingBetList/Index", "SystemType": systemType.lrf },
        { "Name": "BetList", "Text": "Bet List", "Action": "CustomerOutstandingBetList/Index", "SystemType": systemType.lrf }
    ]

    const defaultConfig = {
        applyLinkTokenUrl: '/verify/applyToken',
        applyApiTokenUrl: '/verify/applyApiToken',
        baseUrl: '/',
        tabList: [...defaultTabList]
    }

    const getDefaultInstance = (initialConfig) => {
        const config = initialConfig || {...defaultConfig };
        return new LapCommonService(config);
    }

    const defaultAjaxConfig = {
        method: 'post',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'content-type': 'application/x-www-form-urlencoded'
        },
        withCredentials: false,
        responseType: 'json',
        cancelToken: new axios.CancelToken(() => {})
    }

    afterEach(() => {
        axios.mockReset();
    })

    it('constructor - initial values should be correct', () => {
        const runTestConstructor = (tabList) => {
            const initialConfig = {...defaultConfig,
                tabList: tabList
            }

            const instance = new LapCommonService(initialConfig);

            const expectedTabList = initialConfig.tabList || [];
            expect(instance._applyLinkTokenUrl).toBe(initialConfig.applyLinkTokenUrl);
            expect(instance._applyApiTokenUrl).toBe(initialConfig.applyApiTokenUrl);
            expect(instance._baseUrl).toBe(initialConfig.baseUrl);
            expect(instance._tabList).toEqual(expectedTabList);
        }

        runTestConstructor([...defaultTabList]);
        runTestConstructor();
    })

    it('getTabList - should return correct array data', () => {
        const instance = getDefaultInstance();
        const expectedResult = [...defaultTabList];

        const result = instance.getTabList();

        expect(result).toEqual(expectedResult);
    })

    it('_buildApplyTokenQueryString - should return correct query string', () => {
        const instance = getDefaultInstance();
        const sysType = systemType.lrf;
        const action = 'playeradmin/index';

        const expectedResult = `ActionLink=${encodeURIComponent(action)}&Type=${sysType}`;

        const result = instance._buildApplyTokenQueryString(sysType, action);

        expect(result).toBe(expectedResult);
    })

    it('getLink - should return correct link', () => {
        const action = 'playeradmin/index';
        const runTestPerCase = (systemType, expectedResult) => {
            const instance = getDefaultInstance();

            const result = instance.getLink(systemType, action);

            expect(result).toBe(expectedResult);
        }

        const testcaseList = [{
                systemType: systemType.lrf,
                expectedResult: `${defaultConfig.applyLinkTokenUrl}?ActionLink=${encodeURIComponent(action)}&Type=${systemType.lrf}`
            },
            {
                systemType: systemType.newAdmin,
                expectedResult: `/${action}`
            }
        ];

        testcaseList.forEach(item => runTestPerCase(item.systemType, item.expectedResult));
    })

    it('_buildCommonAjaxConfig - should return correct config value', () => {
        const instance = getDefaultInstance();
        const url = 'playeradmin/getdata';
        const data = { username: 'test' };

        const expectedResult = {
            ...defaultAjaxConfig,
            url,
            ...data
        }

        instance._getConfigParam = jest.fn((commonConfig, params) => {
            return {...commonConfig, ...params }
        })

        const result = instance._buildCommonAjaxConfig(defaultAjaxConfig, url, data);

        expect(result).toEqual(expectedResult);
    })

    it('_getConfigParam - should return correct value by method', () => {
        const url = 'playeradmin/getdata';
        const params = { username: 'test' };
        const initialConfig = {...defaultAjaxConfig, url };
        const runTestByMethod = (method, expectedResult) => {
            const config = {...initialConfig, method };
            const instance = getDefaultInstance();

            const result = instance._getConfigParam(config, params);

            expect(result).toEqual(expectedResult);
        }

        const testcaseList = [
            { method: 'get', expectedResult: {...initialConfig, method: 'get', params } },
            { method: 'post', expectedResult: {...initialConfig, data: 'username=test' } }
        ]

        testcaseList.forEach(item => runTestByMethod(item.method, item.expectedResult));
    })

    it('_fetchDataWithToken - should pass config correctly', (done) => {
        const getTokenResponse = {
            Token: 'abc',
            ApiUrl: 'http://localhost'
        }
        axios.get = jest.fn(() => Promise.resolve({ data: getTokenResponse }));

        axios.mockImplementation((axiosConfig) => {
            return Promise.resolve(axiosConfig);
        });

        const expectedResult = {
            method: 'post',
            url: 'http://localhost/playeradmin/getdata',
            headers: {...defaultAjaxConfig.headers, 'X-Auth-Token': getTokenResponse.Token }
        }

        const instance = getDefaultInstance();
        instance._buildApplyTokenQueryString = jest.fn(() => 'action=test&type=1');
        instance._buildCommonAjaxConfig = jest.fn(() => {
            return { method: 'post', url: 'http://localhost/playeradmin/getdata' }
        });

        const action = 'playeradmin/getdata';
        const params = { username: 'test' };
        const configOption = {...defaultAjaxConfig };

        instance._fetchDataWithToken(systemType.lrf, action, params, configOption)
            .then(result => {
                expect(result).toEqual(expectedResult);
                done();
            });
    })

    describe('fetchData', () => {
        const action = 'playeradmin/getdata';
        const params = {
            username: 'test'
        }
        const configOption = {...defaultAjaxConfig }

        it('system type is new admin - should call axios with correct parameter', (done) => {
            const instance = getDefaultInstance();
            instance._buildCommonAjaxConfig = jest.fn((config, relativeUrl, params) => {
                return {
                    ...config,
                    url: relativeUrl,
                    params
                }
            })

            axios.mockImplementation((axiosConfig) => {
                return Promise.resolve(axiosConfig);
            });

            const expectedResult = {
                ...configOption,
                url: '/' + action,
                params
            }

            instance.fetchData(systemType.newAdmin, action, params, configOption)
                .then(result => {
                    expect(result).toEqual(expectedResult);
                    done();
                });
        })

        it('system type is not new admin - should call _fetchDataWithToken with correct parameter', () => {
            const instance = getDefaultInstance();
            instance._fetchDataWithToken = jest.fn((sysType, action, params, config) => {
                return {
                    sysType,
                    action,
                    params,
                    config
                }
            })

            const expectedResult = {
                action,
                params,
                sysType: systemType.lrf,
                config: {...defaultAjaxConfig }
            }

            const result = instance.fetchData(systemType.lrf, action, params);

            expect(result.action).toBe(expectedResult.action);
            expect(result.params).toEqual(expectedResult.params);
            expect(result.sysType).toBe(expectedResult.sysType);
            expect(result.config.method).toBe(expectedResult.config.method);
        })
    })

    it('fetchMultiple - has request list - return correct result', (done) => {
        const firstResult = { username: 'test', currency: 'usd' };
        const firstRequest = Promise.resolve({ data: firstResult });

        const secondResult = { status: 'active', email: 'test@gmail.com' };
        const secondRequest = Promise.resolve({ data: secondResult });

        axios.all = jest.fn(() => {
            return Promise.resolve();
        });
        axios.spread = jest.fn();
        const callback = jest.fn();

        const instance = getDefaultInstance();

        instance.fetchMultiple([firstRequest, secondRequest], callback)
            .then(response => {
                expect(axios.spread).toHaveBeenCalledWith(callback);
                done();
            });
    })

    it('fetchMultiple - promiseList is empty - do nothing', () => {
        const promiseList = [];
        axios.all = jest.fn();

        const callback = jest.fn();
        const instance = getDefaultInstance();
        instance.fetchMultiple(promiseList, callback);

        expect(axios.all).not.toHaveBeenCalled();
    })
})