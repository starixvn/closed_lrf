import React from 'react';
import { FormFilter } from '../FormFilter';
import AppData from '@jsroot/lib/AppData';
import LangHelper from '@jsroot/lib/langHelper';
import DataService from '@jsroot/lib/DataService.js';
import ApiUrl from '../../../common/constants/apiUrl';
import Site from '@jsroot/lib/site';
import Service from '../../../common/lib/Service';

describe('FormFilter - exportExcel', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
    });

    
    it('parameter is null - do nothing' ,() => {
        const event = { preventDefault: jest.fn() };

        const props = { toggleLoader: jest.fn() };
        const filter = new FormFilter(props);
        filter._getParams = jest.fn(() => null);

        filter.exportExcel(event);

        expect(props.toggleLoader).not.toHaveBeenCalled();
    });
    
    it('DataService.getFile throw error = alert error' ,(done) => {
        const event = { preventDefault: jest.fn() };
        const promise = Promise.reject('error');

        DataService.getFile = jest.fn(() => promise);
            
        const props = { toggleLoader: jest.fn() };
        const filter = new FormFilter(props);
            
        var params = { }
        filter._getParams = jest.fn(() => params);
        window.alert = jest.fn();

        filter.exportExcel(event);

        Promise.reject().then().catch(() => {
            expect(window.alert).toHaveBeenCalledWith("ErrorProcessingMsg");
            expect(props.toggleLoader).toHaveBeenCalledWith(false);
            done();
        })
    });


    describe('response is excel file', () => {
        it('response status = 204 - alert No Info' ,(done) => {
            const event = { preventDefault: jest.fn() };

            const response = { data: 'excel', headers: { 'content-type': 'abc' }, status: 204 };
            const promise = Promise.resolve(response);
            DataService.getFile = jest.fn(() => promise);
            
            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            
            var params = { }
            filter._getParams = jest.fn(() => params);
            window.alert = jest.fn();

            filter.exportExcel(event);

            expect(params.IsExport).toBe(true);
            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(DataService.getFile).toHaveBeenCalledWith(ApiUrl.MULTICUSTOMER_DATA_URL, params);
            Promise.resolve().then(() => {
                expect(window.alert).toHaveBeenCalledWith("NoInfo");
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
                done();
            })
        });

        it('parameter is valid - call service to download excel file' ,(done) => {
            const event = { preventDefault: jest.fn() };

            const response = { data: 'excel', headers: { 'content-type': 'abc' } };
            const promise = Promise.resolve(response);
            DataService.getFile = jest.fn(() => promise);
            Site.downloadFile = jest.fn();

            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            
            var params = { }
            filter._getParams = jest.fn(() => params);

            filter.exportExcel(event);

            expect(params.IsExport).toBe(true);
            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(DataService.getFile).toHaveBeenCalledWith(ApiUrl.MULTICUSTOMER_DATA_URL, params);
            Promise.resolve().then(() => {
                expect(Site.downloadFile).toHaveBeenCalledWith(response.data, 'BettingTicketsCenter_MultiCustomer.xls');
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
                done();
            })
        });
    });

    describe('response is json data', () => {
        it('RowsExceedLimitErrorCode error - show warning' ,(done) => {
            const RowsExceedLimitErrorCode = 1001;
            const event = { preventDefault: jest.fn() };
            const data = {ErrorCode: RowsExceedLimitErrorCode};
            var blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
            const response = { data: blob, headers: { 'content-type': 'application/json' } };
            
            const promise = Promise.resolve(response);
            DataService.getFile = jest.fn(() => promise);
            
            Site.readAsJson = jest.fn((_, callback) => callback(data));
            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            
            var params = { }
            filter._getParams = jest.fn(() => params);
            filter._showExportWarning = jest.fn();

            filter.exportExcel(event);

            Promise.resolve().then(() => {
                expect(filter._showExportWarning).toHaveBeenCalled();
                done();
            })
        });

        it('other errors - alert message' ,(done) => {
            const UnknownErrorCode = 1002;
            const event = { preventDefault: jest.fn() };
            const data = {ErrorCode: UnknownErrorCode, ErrorMsg: "abc error"};
            var blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
            const response = { data: blob, headers: { 'content-type': 'application/json' } };
            
            const promise = Promise.resolve(response);
            DataService.getFile = jest.fn(() => promise);
            
            Site.readAsJson = jest.fn((_, callback) => callback(data));
            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            
            var params = { }
            filter._getParams = jest.fn(() => params);
            window.alert = jest.fn();

            filter.exportExcel(event);

            Promise.resolve().then(() => {
                expect(window.alert).toHaveBeenCalled();
                done();
            })
        });
    })
});