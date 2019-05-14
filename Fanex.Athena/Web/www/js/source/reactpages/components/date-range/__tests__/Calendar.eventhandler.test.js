import React from 'react'
import renderer from 'react-test-renderer'

import moment from 'moment'
import { MomentFormat } from '../constants'
import getTheme from '../styles'
import Calendar from '../Calendar'

describe('Calendar - Event Handler', () => {
    const defaultProps = {
        format: MomentFormat.default,
        theme: {},
        showMonthArrow: true,
        disableDaysBeforeToday: false,
        onlyClasses: false,
        classNames: {},
        specialDays: [],
        lang: undefined,
        sets: undefined,
        range: undefined,
        minDate: undefined,
        maxDate: undefined,
        date: undefined,
        firstDayOfWeek: undefined,
        onChange: undefined,
        onInit: undefined,
        link: undefined,
        linkCB: undefined,
        theme: undefined,
        locale: undefined
    }

    const initialProps = Object.assign({}, defaultProps, { date: "11/22/2017", offset: 0, firstDayOfWeek: 0 });

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('constructor', () => {
        it('initial state should be correct', () => {
            const date = moment(initialProps.date, defaultProps.format);
            const expectedState = {
                date,
                shownDate: date.clone(),
                firstDayOfWeek: 0
            }
            const componentInstance = new Calendar(initialProps);

            const result = componentInstance.state;

            expect(result).toEqual(expectedState);
        })

        it('shownDate of props is undefined - get endDate of range - initial state should be correct', () => {
            const date = moment("01/18/2018", defaultProps.format);
            const range = {
                startDate: date.clone().add(-1, "day"),
                endDate: date.clone()
            }
            const props = Object.assign({}, defaultProps, { range, firstDayOfWeek: 0, date: {}, shownDate: undefined });
            const expectedState = {
                date: null,
                shownDate: date.clone(),
                firstDayOfWeek: 0
            }
            const componentInstance = new Calendar(props);

            const result = componentInstance.state;

            expect(result).toEqual(expectedState);
        })

        it('initial styles should be correct', () => {
            const expectedStyles = getTheme();
            const componentInstance = new Calendar(initialProps);

            const result = componentInstance.styles;

            expect(result).toEqual(expectedStyles);
        })
    })

    describe('componentDidMount', () => {
        it('onInit should not be called when its value is undefined', () => {
            const onInit = jest.fn();
            const props = Object.assign({}, initialProps, { onInit });
            const componentInstance = new Calendar(initialProps);
            componentInstance.componentDidMount();

            expect(onInit).not.toHaveBeenCalled();
        })

        it('onInit should be called when its value is not undefined', () => {
            const date = moment("11/22/2017", "MM/DD/YYYY");
            const onInit = jest.fn();
            const props = Object.assign({}, initialProps, { onInit });

            const componentInstance = new Calendar(props);
            componentInstance.componentDidMount();

            expect(onInit).toHaveBeenCalledWith(date);
        })
    })

    describe('limitedDate', () => {
        it('limited range is string and has value in props - return correct range', () => {
            const newProps = {
                minDate: "11/01/2017",
                maxDate: "11/22/2017"
            }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const range = componentInstance.limitedDate;

            expect(range.startDate.format("MM/DD/YYYY")).toBe(newProps.minDate);
            expect(range.endDate.format("MM/DD/YYYY")).toBe(newProps.maxDate);
        })

        it('limited range is moment object and has value in props - return correct range', () => {
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("11/22/2017", "MM/DD/YYYY")
            }
            const expectedResult = {
                startDate: newProps.minDate,
                endDate: newProps.maxDate
            }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const range = componentInstance.limitedDate;

            expect(range).toEqual(expectedResult);
        })

        it('limited range has no value - return correct range with default year range', () => {
            const defaultYearRange = 5,
                startMonth = 0,
                endMonth = 11;
            const now = moment();
            const expectedResult = {
                startDate: moment([now.year() - defaultYearRange, startMonth]),
                endDate: moment([now.year(), endMonth]).endOf("month")
            }

            const componentInstance = new Calendar(initialProps);

            const range = componentInstance.limitedDate;

            expect(range).toEqual(expectedResult);
        })
    })

    describe('disablePrevButton', () => {
        it('previous month is less than limited range - return true', () => {
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("11/22/2017", "MM/DD/YYYY"),
                shownDate: moment("11/01/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const result = componentInstance.disablePrevButton;

            expect(result).toBe(true);
        })

        it('previous month is in limited range - return false', () => {
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("12/22/2017", "MM/DD/YYYY"),
                shownDate: moment("12/01/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const result = componentInstance.disablePrevButton;

            expect(result).toBe(false);
        })
    })

    describe('disableNextButton', () => {
        it('next month is less than limited range - return true', () => {
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("11/22/2017", "MM/DD/YYYY"),
                shownDate: moment("11/22/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const result = componentInstance.disableNextButton;

            expect(result).toBe(true);
        })

        it('next month is in limited range - return false', () => {
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("12/22/2017", "MM/DD/YYYY"),
                shownDate: moment("12/01/2016", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const result = componentInstance.disableNextButton;

            expect(result).toBe(false);
        })
    })

    describe('getShownDate', () => {
        it('has link value in props - return link value', () => {
            const expectedResult = moment("11/22/2017", "MM/DD/YYYY");
            const newProps = {
                link: expectedResult
            }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const result = componentInstance.getShownDate();

            expect(result).toEqual(expectedResult);
        })

        it('has no link value in props - return shownDate value in state', () => {
            const expectedResult = moment("11/22/2017", "MM/DD/YYYY");
            const newProps = {
                shownDate: expectedResult
            }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);

            const result = componentInstance.getShownDate();

            expect(result).toEqual(expectedResult);
        })
    })

    describe('handleSelect', () => {
        it('link in props is undefined - setState should be called with correct parameter', () => {
            const selectedDate = moment("11/22/2017", "MM/DD/YYYY");
            const onChange = jest.fn();
            const newProps = {
                onChange
            }
            const expectedParam = { date: selectedDate }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.handleSelect(selectedDate);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })

        it('link in props has value - setState should not be called', () => {
            const selectedDate = moment("11/22/2017", "MM/DD/YYYY");
            const onChange = jest.fn();
            const newProps = {
                link: selectedDate.clone(),
                onChange
            }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.handleSelect(selectedDate);

            expect(componentInstance.setState).not.toHaveBeenCalled();
        })

        it('onChange in props has value - should be called with correct parameter', () => {
            const selectedDate = moment("11/22/2017", "MM/DD/YYYY");
            const onChange = jest.fn();
            const newProps = {
                link: selectedDate.clone(),
                onChange
            }

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.handleSelect(selectedDate);

            expect(onChange).toHaveBeenCalledWith(selectedDate);
        })
    })

    describe('nextButtonClickHandler', () => {
        it('event.preventDefault() should be called', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const componentInstance = new Calendar(initialProps);
            componentInstance.changeMonth = jest.fn();

            componentInstance.nextButtonClickHandler(event);

            expect(event.preventDefault).toHaveBeenCalled();
        })

        it('disableNextButton = true - changeMonth should not be called', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("11/22/2017", "MM/DD/YYYY"),
                shownDate: moment("11/22/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.changeMonth = jest.fn();

            componentInstance.nextButtonClickHandler(event);

            expect(componentInstance.changeMonth).not.toHaveBeenCalled();
        })

        it('disableNextButton = false - changeMonth should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const expectedMonthParam = 11;
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("12/22/2017", "MM/DD/YYYY"),
                shownDate: moment("11/22/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.changeMonth = jest.fn();

            componentInstance.nextButtonClickHandler(event);

            expect(componentInstance.changeMonth).toHaveBeenCalledWith(expectedMonthParam, event);
        })
    })

    describe('prevButtonClickHandler', () => {
        it('event.preventDefault() should be called', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const componentInstance = new Calendar(initialProps);
            componentInstance.changeMonth = jest.fn();

            componentInstance.prevButtonClickHandler(event);

            expect(event.preventDefault).toHaveBeenCalled();
        })

        it('disablePrevButton = true - changeMonth should not be called', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("11/22/2017", "MM/DD/YYYY"),
                shownDate: moment("11/01/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.changeMonth = jest.fn();

            componentInstance.prevButtonClickHandler(event);

            expect(componentInstance.changeMonth).not.toHaveBeenCalled();
        })

        it('disablePrevButton = false - changeMonth should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const expectedMonthParam = 10;
            const newProps = {
                minDate: moment("11/01/2017", "MM/DD/YYYY"),
                maxDate: moment("12/22/2017", "MM/DD/YYYY"),
                shownDate: moment("12/01/2017", "MM/DD/YYYY")
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.changeMonth = jest.fn();

            componentInstance.prevButtonClickHandler(event);

            expect(componentInstance.changeMonth).toHaveBeenCalledWith(expectedMonthParam, event);
        })
    })

    describe('changeMonth', () => {
        it('selectedMonth < 0 - year subtract 1 - setState should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const selectedMonth = -1;
            const currentDate = moment("1/01/2017", "MM/DD/YYYY");
            const expectedParam = {
                shownDate: moment([2016, 11, currentDate.date()])
            };
            const newProps = {
                shownDate: currentDate
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeMonth(selectedMonth, event);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })

        it('selectedMonth > 11 - year add 1 - setState should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const selectedMonth = 13;
            const currentDate = moment("12/01/2016", "MM/DD/YYYY");
            const expectedParam = {
                shownDate: moment([2017, 0, currentDate.date()])
            };
            const newProps = {
                shownDate: currentDate
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeMonth(selectedMonth, event);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })

        it('selectedMonthis in range - setState should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const selectedMonth = 10;
            const currentDate = moment("12/01/2016", "MM/DD/YYYY");
            const expectedParam = {
                shownDate: moment([2016, 10, currentDate.date()])
            };
            const newProps = {
                shownDate: currentDate
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeMonth(selectedMonth, event);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })

        it('newDate is invalid when changing - set day to 1 - setState should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const selectedMonth = 1;
            const currentDate = moment("01/30/2018", "MM/DD/YYYY");
            const expectedParam = {
                shownDate: moment([currentDate.year(), selectedMonth, 1])
            };
            const newProps = {
                shownDate: currentDate
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeMonth(selectedMonth, event);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })

        it('has linkCB in props - linkCB should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const selectedMonth = 10;
            const currentDate = moment("12/01/2016", "MM/DD/YYYY");
            const expectedParam = moment([2016, 10, currentDate.date()]);
            const linkCB = jest.fn();
            const newProps = {
                shownDate: currentDate,
                link: currentDate,
                linkCB
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeMonth(selectedMonth, event);

            expect(linkCB).toHaveBeenCalledWith(expectedParam);
        })
    })

    describe('changeYear', () => {
        it('event.preventDefault() should be called', () => {
            const preventDefault = jest.fn();
            const event = {
                target: { value: "" },
                preventDefault
            };

            const componentInstance = new Calendar(initialProps);
            componentInstance.setState = jest.fn();

            componentInstance.changeYear(event);

            expect(preventDefault).toHaveBeenCalled();
        })

        it('setState should be called with correct parameter', () => {
            const currentDate = moment("12/01/2016", "MM/DD/YYYY");
            const selectedYear = 2017;
            const expectedState = {
                shownDate: moment([selectedYear, currentDate.month(), currentDate.date()])
            }

            const preventDefault = jest.fn();
            const event = {
                target: { value: selectedYear },
                preventDefault
            };

            const newProps = {
                shownDate: currentDate
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeYear(event);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedState);
        })

        it('change from leap year to normal year - set day to 1 - setState should be called with correct parameter', () => {
            const currentDate = moment("02/29/2016", "MM/DD/YYYY");
            const selectedYear = 2017;
            const expectedState = {
                shownDate: moment([selectedYear, currentDate.month(), 1])
            }

            const preventDefault = jest.fn();
            const event = {
                target: { value: selectedYear },
                preventDefault
            };

            const newProps = {
                shownDate: currentDate
            }
            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            componentInstance.setState = jest.fn();

            componentInstance.changeYear(event);

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedState);
        })
    })
});