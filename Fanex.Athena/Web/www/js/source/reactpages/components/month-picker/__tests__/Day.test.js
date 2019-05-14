import React from 'react'
import renderer from 'react-test-renderer'

import Day from '../Day'

describe('Day', () => {
    const defaultProps = {
        label: undefined,
        value: 1000,
        min: 0,
        max: 10,
        onChange: undefined
    }

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('constructor', () => {
        it('Initial state should be correct', () => {
            const component = new Day(defaultProps);
            const expectedState = { showDateDrop: false }

            expect(component.state).toEqual(expectedState);
        });
    })

    describe('_onChange', () => {
        const value = 1000;
        let component;
        const props = Object.assign({}, defaultProps);

        beforeEach(() => {
            props.onChange = jest.fn();
            component = new Day(props);
            component.setState = jest.fn();
            component._onChange(value);
        });

        it('props.onChange() should be called with correct param', () => {
            expect(props.onChange).toHaveBeenCalledWith(value);
        })

        it('setState() should be called with correct param', () => {
            expect(component.setState).toHaveBeenCalledWith({showDateDrop: false})
        })
    });

    describe('render', () => {
        it('_renderOption() renders correctly', () => {
            const props = Object.assign({}, defaultProps);
            const component = new Day(props);

            const renderedComponent = renderer.create(<div>{component._renderOption(0, 1, 100)}</div>);
            const tree = renderedComponent.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('showDateDrop = true: render correct content', () => {
            const props = Object.assign({}, defaultProps);
            const component = renderer.create(<Day {...props} />);
            component.getInstance().setState({showDateDrop: true});
            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('showDateDrop = false: render correct content', () => {
            const props = Object.assign({}, defaultProps);
            const component = renderer.create(<Day {...props} />);
            component.getInstance().setState({showDateDrop: false});
            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    });
});