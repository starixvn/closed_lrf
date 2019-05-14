import React from 'react'
import renderer from 'react-test-renderer'

import MonthPicker from '../MonthPicker'

describe('MonthPicker', () => {
    const defaultProps = {
        monthOption: {},
        fromDateOption: {},
        toDateOption: {},
        onChange: jest.fn(),
        minDate: "01/20/2000",
        maxDate: "10/20/2001",
        fromDate: "10/20/2000",
        toDate: "05/29/2001"
    }

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('constructor', () => {
        it('Initial state should be correct', () => {
            const component = new MonthPicker(defaultProps);
            const expectedState = {
                month: {year: 2000, month: 9},
                from: 20,
                to: 29
            };

            expect(component.state).toEqual(expectedState);
        });
    })

    describe('_onMonthChange', () => {
        const value = {month: 8, year: 2000};
        let component;
        const props = Object.assign({}, defaultProps);
        props.onChange = jest.fn();

        beforeAll(() => {
            component = new MonthPicker(props);
            component.setState = jest.fn();
            component._onMonthChange(value);
        });

        it('props.onChange() should be called with correct param', () => {
            expect(props.onChange).toHaveBeenCalledWith({
                fromDate: "09/01/2000",
                toDate: "09/30/2000"
            });
        })

        it('setState() should be called with correct param', () => {
            expect(component.setState).toHaveBeenCalledWith({
                month: value,
                minDate: 1,
                maxDate: 30,
                from: 1,
                to: 30
            });
        })
    });

    describe('_onFromDateChange', () => {
        it('props.onChange() should be called with correct param', () => {
            const value = 10;
            let component;
            const props = Object.assign({}, defaultProps);
            props.onChange = jest.fn();

            component = new MonthPicker(props);
            component.setState = jest.fn();

            component._onFromDateChange(value);


            expect(props.onChange).toHaveBeenCalledWith({
                fromDate: "10/10/2000",
                toDate: "10/29/2000"
            });

            expect(component.setState).toHaveBeenCalledWith({ from: value });
        })
    });

    describe('_onToDateChange', () => {
        it('props.onChange() should be called with correct param', () => {
            const value = 30;
            let component;
            const props = Object.assign({}, defaultProps);
            props.onChange = jest.fn();

            component = new MonthPicker(props);
            component.setState = jest.fn();

            component._onToDateChange(value);


            expect(props.onChange).toHaveBeenCalledWith({
                fromDate: "10/20/2000",
                toDate: "10/30/2000"
            });

            expect(component.setState).toHaveBeenCalledWith({ to: value });
        })
    });

    describe('methods', () => {
        it('_formatDate()', () => {
            const testCases = [
               { 
                   date: 1,
                   month: 2,
                   year: 2000,
                   expectedResult: "03/01/2000"
               },
               { 
                   date: 19,
                   month: 11,
                   year: 2000,
                   expectedResult: "12/19/2000"
               }
           ];

            const props = Object.assign({}, defaultProps);
            const component = new MonthPicker(props);

            testCases.forEach((item) => {
                const result = component._formatDate(item.date, item.month, item.year);

                expect(result).toEqual(item.expectedResult);
            });
        });
    })

    describe('render', () => {
        
        it('render correct content', () => {
            const props = Object.assign({}, defaultProps);
            const component = renderer.create(<MonthPicker {...props} />);
            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    });
});