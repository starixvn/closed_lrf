import React from 'react'
import renderer from 'react-test-renderer'

import parseInput from '../utils/parseInput'
import { MomentFormat } from '../constants'
import getTheme from '../styles'
import defaultOptions from '../defaultOptions'
import moment from 'moment'

import PredefinedRanges from '../PredefinedRanges'
import DateRange from '../DateRange'

jest.mock('../defaultOptions')
jest.mock('../styles')

describe('DateRange ', () => {
    const locale = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }

    const defaultProps = {
        linkedCalendars: false,
        theme: {},
        format: MomentFormat.default,
        calendars: 2,
        onlyClasses: true,
        offsetPositive: false,
        classNames: {},
        specialDays: [],
        rangedCalendars: false,
        twoStepChange: false,
        showRange: true,

        startDate: "1/1/2018",
        endDate: "1/3/2018",
        locale
    }

    const defaultStartDateMoment = moment(defaultProps.startDate, MomentFormat.default)['startOf']('day');
    const defaultEndDateMoment = moment(defaultProps.endDate, MomentFormat.default)['endOf']('day');

    const defaultRange = {
        startDate: defaultStartDateMoment,
        endDate: defaultEndDateMoment
    }

    const originalLocale = defaultOptions.locale;

    beforeAll(() => {
        getTheme.mockImplementation(() => {
            return {
                Day: {
                    width: 100,
                    height: 50,
                    display: "block"
                }
            };
        });
        defaultOptions.locale = {};
        defaultOptions.ranges = jest.fn(() => { });
    })

    afterAll(() => {
        defaultOptions.locale = originalLocale;
    })

    describe('constructor', () => {
        it('initial values should be correct', () => {
            const expectedStyle = {
                Day: {
                    width: 100,
                    height: 50,
                    display: "block"
                }
            }
            const dateRange = new DateRange(defaultProps);

            expect(dateRange.styles).toEqual(expectedStyle);
            expect(dateRange.calendarSelectionStep).toEqual(0);
            expect(dateRange.locale).toEqual(locale);
            expect(dateRange.ranges).toEqual({});
            expect(dateRange.isValid).toEqual(true);
            expect(dateRange.originalRange).toEqual(defaultRange);
        })

        it('State should be correct', () => {
            function assertState(linkedCalendars) {
                const props = Object.assign({}, defaultProps, { linkedCalendars });
                const dateRange = new DateRange(props);

                const expectedState = {
                    range: defaultRange,
                    link: linkedCalendars ? defaultEndDateMoment : linkedCalendars,
                    show: false
                }

                expect(dateRange.state).toEqual(expectedState);
            }

            assertState(false);
            assertState(true);
        })

        it('date is function type - range should be correct', () => {
            const expectedStartDate = moment([2018, 1, 1]);
            const startDate = () => expectedStartDate.clone();
            const props = Object.assign({}, defaultProps, { startDate });
            const dateRange = new DateRange(props);

            expect(dateRange.originalRange.startDate).toEqual(expectedStartDate);
        })

        it('date is object but not moment - return null', () => {
            const props = Object.assign({}, defaultProps, { startDate: {} });
            const dateRange = new DateRange(props);

            expect(dateRange.originalRange.startDate).toEqual(null);
        })
    })

    describe('dateRangeText', () => {
        it('currentRange has value - dateRangeText should be correct format', () => {
            const expectedResult = `${defaultStartDateMoment.format(MomentFormat.default)} - ${defaultEndDateMoment.format(MomentFormat.default)}`;

            const dateRange = new DateRange(defaultProps);

            expect(dateRange.dateRangeText).toBe(expectedResult);
        })

        it('range is null - return empty string', () => {
            const props = Object.assign({}, defaultProps, { startDate: {}, endDate: {} });
            const dateRange = new DateRange(props);

            expect(dateRange.dateRangeText).toBe("");
        })
    })

    describe('show/ close', () => {
        let dateRange;
        beforeEach(() => {
            dateRange = new DateRange(defaultProps);
            dateRange.setState = jest.fn();
        })

        it('show - step should be 0', () => {
            dateRange.show();

            expect(dateRange.calendarSelectionStep).toBe(0);
        })

        it('show - setState should be called with correct parameter', () => {
            const expectedState = { show: true };

            dateRange.show();

            expect(dateRange.setState).toHaveBeenCalledWith(expectedState);
        })

        it('close - setState should be called with correct parameter', () => {
            const expectedState = { show: false };

            dateRange.close();

            expect(dateRange.setState).toHaveBeenCalledWith(expectedState);
        })
    })

    describe('componentDidMount', () => {
        it('onInit is undefined - do not call that function', () => {
            const mockOnInit = jest.fn();
            const props = Object.assign({}, defaultProps);
            const dateRange = new DateRange(props);

            dateRange.componentDidMount();

            expect(mockOnInit).not.toHaveBeenCalled();
        })

        it('onInit is defined - call that function with correct parameter', () => {
            const mockOnInit = jest.fn();
            const props = Object.assign({}, defaultProps, { onInit: mockOnInit });
            const dateRange = new DateRange(props);

            dateRange.componentDidMount();

            expect(mockOnInit).toHaveBeenCalledWith(defaultRange);
        })
    })

    describe('orderRange', () => {
        it('startDate before endDate - do not swap these values', () => {
            const dateRange = new DateRange(defaultProps);

            const result = dateRange.orderRange(defaultRange);

            expect(result).toEqual(defaultRange);
        })

        it('startDate after endDate - swap these values', () => {
            const dateRange = new DateRange(defaultProps);
            const range = {
                startDate: defaultEndDateMoment,
                endDate: defaultStartDateMoment
            }

            const result = dateRange.orderRange(range);

            expect(result).toEqual(defaultRange);
        })
    })

    describe('setRange', () => {
        it('valid month range - setState show be called with correct parameter', () => {
            function assertSetRangeWithValidMonthRange(show) {
                const dateRange = new DateRange(defaultProps);
                dateRange.isValidMonthRange = jest.fn(() => true);
                dateRange.setState = jest.fn();

                const range = Object.assign({}, defaultRange);
                const expectedState = show === undefined ? { range } : { range, show };

                dateRange.setRange(range, show);

                expect(dateRange.setState).toHaveBeenCalledWith(expectedState);
            }

            assertSetRangeWithValidMonthRange();
            assertSetRangeWithValidMonthRange(true);
            assertSetRangeWithValidMonthRange(false);
        })

        it('invalid month range - setState should not be called', () => {
            const onChange = jest.fn();

            const props = Object.assign({}, defaultProps, { onChange });
            const dateRange = new DateRange(props);
            dateRange.isValidMonthRange = jest.fn(() => false);
            dateRange.setState = jest.fn();

            const range = Object.assign({}, defaultRange);
            const show = true;

            dateRange.setRange(range, show);

            expect(dateRange.setState).not.toHaveBeenCalled();
        })

        it('invalid month range - onChange should be called with correct parameter', () => {
            const onChange = jest.fn();

            const props = Object.assign({}, defaultProps, { onChange });
            const dateRange = new DateRange(props);
            dateRange.isValidMonthRange = jest.fn(() => false);
            dateRange.setState = jest.fn();

            const range = Object.assign({}, defaultRange);
            const show = true, isValid = false;

            dateRange.setRange(range, show);

            expect(onChange).toHaveBeenCalledWith(range, isValid);
        })
    })

    describe('handleCalendarSelect', () => {
        it('calendarSelectionStep is 0 - setRange should be called with correct parameter', () => {
            const dateRange = new DateRange(defaultProps);
            dateRange.setRange = jest.fn();
            dateRange.calendarSelectionStep = 0;

            const selectedDate = '2018-01-01';

            dateRange.handleCalendarSelect(selectedDate);

            expect(dateRange.calendarSelectionStep).toBe(1);
            expect(dateRange.setRange).toHaveBeenCalledWith( {
                startDate: selectedDate,
                endDate: selectedDate
            });
        })

        it('calendarSelectionStep is 1 - setRange should be called with correct parameter', () => {
            const dateRange = new DateRange(defaultProps);
            dateRange.setRange = jest.fn();
            dateRange.calendarSelectionStep = 1;

            const selectedDate = '2018-01-01';

            dateRange.handleCalendarSelect(selectedDate);

            expect(dateRange.calendarSelectionStep).toBe(0);
            expect(dateRange.setRange).toHaveBeenCalledWith( {
                startDate: dateRange.state.range.startDate,
                endDate: selectedDate
            });
        })
    })

    describe('handlePredefinedRangesSelect', () => {
        it('setRange should be called with correct parameter', () => {
            const range = { from: 1, to: 2 };
            const props = { onChange: jest.fn() };
            const dateRange = new DateRange(props);
            dateRange.setRange = jest.fn();

            dateRange.handlePredefinedRangesSelect(range);

            expect(dateRange.setRange).toHaveBeenCalledWith(range, false);
            expect(props.onChange).toHaveBeenCalledWith(range, true);
            expect(dateRange.originalRange).toEqual(range);
        })
    })

    describe('isValidMonthRange', () => {
        it('limitedMonthRange props is undefined - return true', () => {
            const dateRange = new DateRange(defaultProps);

            const result = dateRange.isValidMonthRange();

            expect(result).toBe(true);
        })

        it('limitedMonthRange props is defined - pass valid range - return true', () => {
            const props = Object.assign({}, defaultProps, { limitedMonthRange: 3 });
            const dateRange = new DateRange(props);

            const result = dateRange.isValidMonthRange(defaultRange);

            expect(result).toBe(true);
        })

        it('limitedMonthRange props is defined - pass invalid range - return false', () => {
            const props = Object.assign({}, defaultProps, { limitedMonthRange: 1 });
            const dateRange = new DateRange(props);

            const endDate = moment([2018, 3, 1]);
            const range = {
                startDate: defaultStartDateMoment,
                endDate
            }
            const result = dateRange.isValidMonthRange(range);

            expect(result).toBe(false);
        })

        it('limitedMonthRange props is defined - pass range between 2 years - return false', () => {
            const props = Object.assign({}, defaultProps, { limitedMonthRange: 1 });
            const dateRange = new DateRange(props);

            const startDate = moment([2017, 1, 1]);
            const endDate = moment([2018, 3, 1]);
            const range = { startDate, endDate }
            const result = dateRange.isValidMonthRange(range);

            expect(result).toBe(false);
        })

        it('limitedMonthRange props is defined - just check by month and ignore date - valid range - return true', () => {
            const props = Object.assign({}, defaultProps, { limitedMonthRange: 6 });
            const dateRange = new DateRange(props);

            const startDate = moment([2017, 6, 1]);
            const endDate = moment([2017, 11, 31]);
            const range = { startDate, endDate }
            const result = dateRange.isValidMonthRange(range);

            expect(result).toBe(true);
        })

        it('limitedMonthRange props is defined - just check by month and ignore date - invalid range - return false', () => {
            const props = Object.assign({}, defaultProps, { limitedMonthRange: 6 });
            const dateRange = new DateRange(props);

            const startDate = moment([2017, 6, 1]);
            const endDate = moment([2018, 0, 1]);
            const range = { startDate, endDate }
            const result = dateRange.isValidMonthRange(range);

            expect(result).toBe(false);
        })
    })

    describe('handleLinkChange', () => {
        it('setState should be called with correct parameter', () => {
            const dateRange = new DateRange(defaultProps);
            dateRange.setState = jest.fn();
            const newDate = defaultStartDateMoment;
            const expectedParam = {
                link: newDate
            }

            dateRange.handleLinkChange(newDate);

            expect(dateRange.setState).toHaveBeenCalledWith(expectedParam);
        })
    })

    describe('handleApply', () => {
        it('onClickApplyButton should be called with correct parameter', () => {
            const onClickApplyButton = jest.fn();
            const props = Object.assign({}, defaultProps, { onClickApplyButton, onChange: jest.fn() });
            const dateRange = new DateRange(props);
            dateRange.close = jest.fn();

            dateRange.handleApply();

            expect(onClickApplyButton).toHaveBeenCalledWith(defaultRange, true);
            expect(props.onChange).toHaveBeenCalledWith(defaultRange, dateRange.isValid);
        })

        it('currentRange should be correct', () => {
            const selectedRange = {
                startDate: defaultStartDateMoment.clone().month(2),
                endDate: defaultEndDateMoment.clone().month(4)
            }
            const dateRange = new DateRange(defaultProps);
            dateRange.state.range = Object.assign({}, selectedRange);
            dateRange.close = jest.fn();

            dateRange.handleApply();

            expect(dateRange.originalRange).toEqual(selectedRange);
        })

        it('close should be called', () => {
            const dateRange = new DateRange(defaultProps);
            dateRange.close = jest.fn();

            dateRange.handleApply();

            expect(dateRange.close).toHaveBeenCalled();
        })
    })

    describe("handleCancel", () => {
        it("setRange should be called with correct parameter", () => {
            const expectedCurrentRange = {};

            const dateRange = new DateRange(defaultProps);
            dateRange.originalRange = {};
            dateRange.setRange = jest.fn();

            dateRange.handleCancel();

            expect(dateRange.setRange).toHaveBeenCalledWith(expectedCurrentRange, false);
        })
    })

    describe("render", () => {
        it("showRange = false - PredefinedRanges should not be shown - match with snapshot", () => {
            const props = Object.assign({}, defaultProps, { showRange: false });

            const component = renderer.create(<DateRange {...props} />);

            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })

        it("showRange = true - PredefinedRanges should be shown - match with snapshot", () => {
            const component = renderer.create(<DateRange {...defaultProps} />);

            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })

        it("linkedCalendars = true - match with snapshot", () => {
            const props = Object.assign({}, defaultProps, { linkedCalendars: true });
            const component = renderer.create(<DateRange {...props} />);

            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })

        it("on select on PredefinedRanges - call handlePredefinedRangesSelect method", () => {
            const props = Object.assign({}, defaultProps, { showRange: true });

            const dateRange = new DateRange(defaultProps);
            dateRange.handlePredefinedRangesSelect = jest.fn();
            const component = renderer.create(dateRange.render());

            const predefinedRanges = component.root.findByType(PredefinedRanges);
            predefinedRanges.props.onSelect();

            expect(dateRange.handlePredefinedRangesSelect).toHaveBeenCalled();
        })
    })
})