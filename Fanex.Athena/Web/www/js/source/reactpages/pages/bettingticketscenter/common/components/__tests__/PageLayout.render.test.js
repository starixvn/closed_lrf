import React from 'react';
import { PageLayout } from '../PageLayout';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';
import LangHelper from '@jsroot/lib/langHelper';
import Site from '@jsroot/lib/site'

describe('PageLayout ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Site.resolveClientUrl = jest.fn((url) => url);
    })
    afterEach(() => {
        jest.resetAllMocks();
    })

    it('render with correct active tab', () => {
        const props = { requestParam: { BaseCurrency: 'USD' }, toggleLoader: jest.fn(), children: [], selectedTabIndex: 1, isLoading: true};
        
        const shallowRenderer = new ShallowRenderer();
        const result = shallowRenderer.render(<PageLayout {...props}/>);

        expect(result).toMatchSnapshot();
    });

    it('show loader', () => {
        const props = { requestParam: { BaseCurrency: 'USD' }, toggleLoader: jest.fn(), children: [], selectedTabIndex: 1, isLoading: true };
        
        const shallowRenderer = new ShallowRenderer();
        const result = shallowRenderer.render(<PageLayout {...props}/>);

        expect(result).toMatchSnapshot();
    });

    it('show popup', () => {
        const props = { requestParam: { BaseCurrency: 'USD' }, toggleLoader: jest.fn(), children: [], selectedTabIndex: 1};

        const component = renderer.create(<PageLayout {...props}/>);

        component.getInstance()._openPopup('url', 'title');

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('_closePopup is called when close popup', () => {
        const props = { requestParam: { BaseCurrency: 'USD' }, toggleLoader: jest.fn(), children: [], selectedTabIndex: 1};

        const component = renderer.create(<PageLayout {...props}/>);
        const instance = component.getInstance();
        instance._openPopup('url', 'title');

        expect(instance.state.isShowPopup).toBe(true);

        const closeBtn = component.root.findByProps({ className: "popup-close" });
        closeBtn.props.onClick();

        expect(instance.state.isShowPopup).toBe(false);
    });
})