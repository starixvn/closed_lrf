import React from 'react'
import renderer from 'react-test-renderer'

import UserGuide from '../UserGuide'

describe('UserGuide ', () => {
    describe('render', () => {
        it('popup component is hidden', () => {
            const props = {
                content: '<div></div>'
            };

            const component = renderer.create(<UserGuide {...props} />);

            const result = component.toJSON();
            const popup = result.children[1];
        
            expect(result).toMatchSnapshot();
            expect(popup.props.className).toContain('hide');
        });
    });

    describe('onCloseHandler', () => {
        it('update state to false', () => {
            const component = new UserGuide ({});
            component.setState = jest.fn();

            component.onCloseHandler();

            expect(component.setState).toHaveBeenCalledWith({ isShow: false });
        });
    });

    describe('onClickHandler', () => {
        it('update state to true', () => {
            const component = new UserGuide ({});
            component.setState = jest.fn();

            component.onClickHandler();

            expect(component.setState).toHaveBeenCalledWith({ isShow: true });
        });

        it('onClick prop is called', () => {
            const props = {
                onClick: jest.fn()
            };
            const component = new UserGuide (props);
            component.setState = jest.fn();

            component.onClickHandler();

            expect(props.onClick).toHaveBeenCalled();
        });

        it('update state to true - content is not empty - popup is shown', () => {
            const props = {};

            const component = renderer.create(<UserGuide {...props} />);
            let result = component.toJSON();
            const button = result.children[0];
            const popup = result.children[1];
            button.props.onClick();
            result = component.toJSON()
        
            expect(result).toMatchSnapshot();
            expect(popup.props.className).toContain('hide');
        });

        it('update state to true - content is empty - popup is shown', () => {
            const props = {
                content: '<div></div>'
            };

            const component = renderer.create(<UserGuide {...props} />);
            let result = component.toJSON();
            const button = result.children[0];
            button.props.onClick();
            result = component.toJSON();
            const popup = result.children[1];
        
            expect(result).toMatchSnapshot();
            expect(popup.props.className).toContain('show');
        });
    });
});