import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import AppData from '@jsroot/lib/AppData';
import { FormFilter } from '../FormFilter';
import LangHelper from '@jsroot/lib/langHelper';
import { defaultAppData, defaultFilterProps } from './TestData';

jest.mock('@jsroot/lib/AppData');

describe('FormFilter ', () => {
    beforeEach(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
    })

    it('render() - match with snapshot', () => {
        Object.assign(AppData, defaultAppData);

        const renderer = new ShallowRenderer();
        const result = renderer.render(<FormFilter {...defaultFilterProps}/>);
	
        expect(result).toMatchSnapshot();
    })

    it('render() - productOptions is empty - no render dropdown for product', () => {
        Object.assign(AppData, defaultAppData, { productOptions: [] });

        const renderer = new ShallowRenderer();
        const result = renderer.render(<FormFilter {...defaultFilterProps}/>);
	
        expect(result).toMatchSnapshot();
    })
})