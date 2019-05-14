import React from 'react'
import renderer from 'react-test-renderer'

import Month from '../Month'

describe('Month', () => {
    const defaultProps = {
        label: undefined,
        value: {
            year: 1999
        },
        min: {},
        max: {},
        onChange: jest.fn()
    }

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('constructor', () => {
        it('Initial state should be correct', () => {
            const component = new Month(defaultProps);
            const expectedState = {expandYear: 1999, showMonthDrop: false }

            expect(component.state).toEqual(expectedState);
        });
    })

    describe('_onChange', () => {
        const value = {year: 2000};
        let component;
        const props = Object.assign({}, defaultProps);
        props.onChange = jest.fn();

        beforeEach(() => {
            component = new Month(props);
            component.setState = jest.fn();
            component._onChange(value);
        });

        it('props.onChange() should be called with correct param', () => {
            expect(props.onChange).toHaveBeenCalledWith(value);
        })

        it('setState() should be called with correct param', () => {
            expect(component.setState).toHaveBeenCalledWith({showMonthDrop: false})
        })
    });

    describe('methods', () => {
        it('_formatString()', () => {
            const props = Object.assign({}, defaultProps);
            const component = new Month(props);
            const result = component._formatString(1, 1999);
            expect(result).toEqual("Feb 1999");
        });

        it('_getNextMonth()', () => {
            const testCases = [
                { 
                    props: {value: {month: 0, year: 2000}},
                    expectedResult: {month: 1, year: 2000}
                },
                { 
                    props: {value: {month: 11, year: 2000}},
                    expectedResult: {month: 0, year: 2001}
                }
            ];

            testCases.forEach(function(item){
                const props = Object.assign({}, defaultProps, item.props);
                const component = new Month(props);
                const result = component._getNextMonth();
                expect(result).toEqual(item.expectedResult);
            });
        });

        it('_getPrevMonth()', () => {
            const testCases = [
                { 
                    props: {value: {month: 0, year: 2000}},
                    expectedResult: {month: 11, year: 1999}
                },
                { 
                    props: {value: {month: 11, year: 2000}},
                    expectedResult: {month: 10, year: 2000}
                }
            ];

            testCases.forEach(function(item){
                const props = Object.assign({}, defaultProps, item.props);
                const component = new Month(props);
                const result = component._getPrevMonth();
                expect(result).toEqual(item.expectedResult);
            });
        });

        it('_checkValidMonth()', () => {
            const props = Object.assign({}, defaultProps, {
                min: {month: 2, year: 2000},
                max: {month: 3, year: 2001}
            });

            const testCases = [
                { month: 1, year: 2000, expectedResult: false },
                { month: 2, year: 2000, expectedResult: true },
                { month: 6, year: 2000, expectedResult: true },
                { month: 2, year: 2001, expectedResult: true },
                { month: 6, year: 2001, expectedResult: false },
            ];
            const component = new Month(props);

            testCases.forEach((item) => {
                const result = component._checkValidMonth(item.month, item.year);
                expect(result).toEqual(item.expectedResult);
            });
        });

        it('_goToMonth()', () => {
            const testCases = [
                { month: 1, year: 2000, expectedResult: false },
                { month: 2, year: 2000, expectedResult: true },
                { month: 6, year: 2000, expectedResult: true },
                { month: 2, year: 2001, expectedResult: true },
                { month: 6, year: 2001, expectedResult: false },
            ];
            const component = new Month(Object.assign({}, defaultProps));
            component.state = {expandYear: 2000};
            component.setState = jest.fn();
            
            const result = component._goToMonth(new Event("xxx"), {year: 2001});

            expect(component.setState).toHaveBeenCalledWith({expandYear: 2001});
        });
    })

    describe('render', () => {
        it('_renderOption() renders correctly', () => {
            const props = Object.assign({}, defaultProps);
            const component = new Month(props);

            const renderedComponent = 
                renderer.create(<div>{component._renderOption({year: 1999, month: 1}, {year: 2004, month: 2}, {year: 2004, month: 1})}</div>);
            const tree = renderedComponent.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('showMonthDrop = true: render correct content', () => {
            const props = Object.assign({}, defaultProps);
            const component = renderer.create(<Month {...props} />);
        component.getInstance().setState({showMonthDrop: true});
            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('showMonthDrop = false: render correct content', () => {
            const props = Object.assign({}, defaultProps);
            const component = renderer.create(<Month {...props} />);
            component.getInstance().setState({showMonthDrop: false});
            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    });
});