import React from 'react'
import renderer from 'react-test-renderer'

import Popup from '../Popup'

describe('Popup ', () => {
    describe('render', () => {
        it('isShow is false - popup component is hidden', () => {
            const component = renderer.create(<Popup><div></div></Popup>);

            const result = component.toJSON();
        
            expect(result).toMatchSnapshot();
            expect(result.props.className).toContain('hide');
        });

        it('isShow is true - popup component is shown', () => {
            const props = {
                isShow: true
            };

            const component = renderer.create(<Popup {...props}><div></div></Popup>);

            const result = component.toJSON();
        
            expect(result).toMatchSnapshot();
            expect(result.props.className).toContain('show');
        });

        it('has iframeUrl - popup adds an iframe element', () => {
            const props = {
                iframeUrl: "www.fake.com"
            };

            const component = renderer.create(<Popup {...props}><div></div></Popup>);

            const result = component.toJSON();
        
            expect(result).toMatchSnapshot();
        });

        it('isHtml is false - popup component shows content as text', () => {
            const props = {
                isShow: true
            };

            const component = renderer.create(<Popup {...props}><div></div></Popup>);

            const result = component.toJSON();
        
            expect(result).toMatchSnapshot();
        });

        it('isHtml is true - popup component shows content as html', () => {
            const props = {
                isShow: true,
                isHtml: true
            };

            const component = renderer.create(<Popup {...props}><div></div></Popup>);

            const result = component.toJSON();
        
            expect(result).toMatchSnapshot();
        });
    });
});