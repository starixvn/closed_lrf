import React from 'react'
import renderer from 'react-test-renderer'

import parseInput from '../utils/parseInput'
import { MomentFormat } from '../constants'
import moment from 'moment'
import defaultOptions from '../defaultOptions'

import DatePicker from '../DatePicker'
import Calendar from '../Calendar'

jest.mock('../defaultOptions')
jest.mock('../Calendar')

describe('DatePicker ', () => {
    const defaultProps = {
        format: MomentFormat.default,
        firstDayOfWeek: undefined,
        minDate: undefined,
        maxDate: undefined,
        classNames: undefined,
        onChange: undefined,
        onInit: undefined,
        locale: undefined,
        date: "01/29/2018"
    }

    beforeAll(() => {
        defaultOptions.locale = undefined;
    })

    describe("constructor", () => {
        it("initial values should be correct", () => {
            const datePicker = new DatePicker(defaultProps);
            const expectedState = {
                selectedDate: moment(defaultProps.date, MomentFormat.default),
                show: false
            }
            const expectedLocale = {};

            expect(datePicker.locale).toEqual(expectedLocale);
            expect(datePicker.state).toEqual(expectedState);
        })

        it("selectedState has value - dateText should has correct value", () => {
            const datePicker = new DatePicker(defaultProps);
            const expectedResult = "01/29/2018";

            expect(datePicker.dateText).toBe(expectedResult);
        })

        it("selectedState has no value - dateText should has empty value", () => {
            const props = Object.assign({}, defaultProps, { date: {} });
            const datePicker = new DatePicker(props);
            const expectedResult = "";

            expect(datePicker.dateText).toBe(expectedResult);
        })
    })

    describe("handleSelect", () => {
        let datePicker, props;
        const date = moment([2018, 1, 29]);
        beforeEach(() => {
            props = Object.assign({}, defaultProps, { onChange: jest.fn() });
            datePicker = new DatePicker(props);
            datePicker.setState = jest.fn();
        })

        it("onChange should be called with correct parameter", () => {
            datePicker.handleSelect(date);

            expect(props.onChange).toHaveBeenCalled();
        })

        it("setState should be called with correct parameter", () => {
            const expectedState = {
                selectedDate: date, 
                show: false
            };

            datePicker.handleSelect(date);

            expect(datePicker.setState).toHaveBeenCalledWith(expectedState);
        })
    })

    describe("show", () => {
        it("setState should be called with correct parameter", () => {
            const datePicker = new DatePicker(defaultProps);
            datePicker.setState = jest.fn();

            const expectedState = {
                show: true
            };

            datePicker.show();

            expect(datePicker.setState).toHaveBeenCalledWith(expectedState);
        })
    })

    describe("render", () => {
        it("input section should be matched with snapshot", () => {
            const dateRange = new DatePicker(defaultProps);
            const renderResult = dateRange.render();

            const inputSection = renderResult.props.children[0];
            const component = renderer.create(<div>{inputSection}</div>);
            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })

        it("input section fire click event - show function should be called", () => {
            const dateRange = new DatePicker(defaultProps);
            dateRange.show = jest.fn();
            const renderResult = dateRange.render();

            const inputSection = renderResult.props.children[0];
            inputSection.props.onClick();

            expect(dateRange.show).toHaveBeenCalled();
        })

        it("isOpening props of Overlay component should be correct", () => {
            const dateRange = new DatePicker(defaultProps);
            const renderResult = dateRange.render();

            const overlayComponent = renderResult.props.children[1];
            const result = overlayComponent.props.isOpening;

            expect(result).toBeFalsy();
        })

        it("Calendar section should be matched with snapshot", () => {
            const component = renderer.create(<DatePicker {...defaultProps} />);
            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })

        it("props pass to Calendar section should be correct", () => {
            const dateRange = new DatePicker(defaultProps);
            const { format, firstDayOfWeek, minDate, maxDate, classNames } = dateRange.props;
            dateRange.handleSelect = jest.fn();

            const renderResult = dateRange.render();

            const overlayComponent = renderResult.props.children[1];
            const calendarComponent = overlayComponent.props.children.props.children;

            const propsResult = calendarComponent.props;

            expect(propsResult.shownDate).toEqual(dateRange.state.selectedDate);
            expect(propsResult.format).toBe(format);
            expect(propsResult.firstDayOfWeek).toBe(firstDayOfWeek);
            expect(propsResult.minDate).toEqual(minDate);
            expect(propsResult.maxDate).toEqual(maxDate);
            expect(propsResult.classNames).toEqual({});
            expect(propsResult.locale).toEqual(dateRange.locale);

            propsResult.onChange();
            expect(dateRange.handleSelect).toHaveBeenCalled();
        })
    })
});