import axios from 'axios'
import Site from '@jsroot/lib/site'
import DataService from '../DataService'

describe('DataService ', () => {
    it('getData(url, params) - call axios get with url', () => {
        const url = "wwww.abc";
        const param = { foo: 123};
        const expectedResult = "return_data";
        axios.get = jest.fn(() => expectedResult);

        const result = DataService.getData(url, param);

        expect(result).toBe(expectedResult);
        expect(axios.get).toHaveBeenCalledWith(url, { params: param });
    })

    describe('postData(url, params)', () => {
        it('axios.post should be called with correct parameters', () => {
            axios.post = jest.fn();
            Site.getXsrfToken = jest.fn(() => "tokenXXX");
            const params = {
                data: { Abc: "1,2,3", ProductList: "SB,BA" }
            }

            const expectedUrl = "api/getdata";
            const expectedHeader = {
                'X-Requested-With': 'XMLHttpRequest',
                '__RequestVerificationToken': "tokenXXX"
            }

            DataService.postData(expectedUrl, params);

            expect(axios.post).toHaveBeenCalledWith(expectedUrl, params, { headers: expectedHeader });
        });
    });

    describe('getFile(url, params)', () => {
        it('axios.post should be called with correct parameters', () => {
            axios.post = jest.fn();
            Site.getXsrfToken = jest.fn(() => "tokenXXX");
            const params = {
                data: { Abc: "1,2,3", ProductList: "SB,BA" }
            }

            const expectedUrl = "api/getdata";
            const expectedHeader = {
                'X-Requested-With': 'XMLHttpRequest',
                '__RequestVerificationToken': "tokenXXX"
            }

            DataService.getFile(expectedUrl, params);

            expect(axios.post).toHaveBeenCalledWith(expectedUrl, params, { responseType: 'blob', headers: expectedHeader });
        });
    });
})