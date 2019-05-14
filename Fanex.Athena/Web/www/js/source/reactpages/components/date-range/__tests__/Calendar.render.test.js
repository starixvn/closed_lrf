import React from 'react'
import renderer from 'react-test-renderer'

import moment, { weekdays } from 'moment'
import { MomentFormat } from '../constants'
import getTheme from '../styles'
import locale from "../utils/locale"
import Calendar from '../Calendar'

describe('Calendar - Render', () => {
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

    const initialProps = Object.assign({}, defaultProps, { date: "11/23/2017", offset: 0, firstDayOfWeek: 0 });
    const currentDate = moment("11/23/2017", "MM/DD/YYYY");

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('renderMonthList', () => {
        const classes = {
            monthAndYearSelect: "monthAndYearSelect"
        }
        const defaultPropsForMonthList = {
            shownDate: currentDate,
            onlyClasses: true,
            locale
        }
        describe('Assert props', () => {
            function assertByOnlyClassesProp({ onlyClasses, expectedStyle }) {
                it(`onlyClasses = ${onlyClasses.toString()} - select element has correct props`, () => {
                    const expectedResult = {
                        style: expectedStyle,
                        className: classes.monthAndYearSelect,
                        value: currentDate.month()
                    }
                    const newProps = {
                        shownDate: currentDate,
                        onlyClasses,
                        locale
                    }

                    const props = Object.assign({}, initialProps, newProps);
                    const componentInstance = new Calendar(props);
                    const monthList = componentInstance.renderMonthList(classes);

                    const result = monthList.props;

                    expect(result.style).toEqual(expectedResult.style);
                    expect(result.className).toBe(expectedResult.className);
                    expect(result.value).toBe(expectedResult.value);
                })
            }

            const styles = getTheme();
            const testList = [
                { onlyClasses: true, expectedStyle: undefined },
                { onlyClasses: false, expectedStyle: styles.MonthAndYearSelect }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })

        it('onChange prop - changeMonth should be called with correct parameter', () => {
            const props = Object.assign({}, initialProps, defaultPropsForMonthList);
            const componentInstance = new Calendar(props);
            const monthList = componentInstance.renderMonthList(classes);

            const monthListProps = monthList.props;
            const event = {
                target: { value: "11" }
            };
            componentInstance.changeMonth = jest.fn();

            monthListProps.onChange(event);

            expect(componentInstance.changeMonth).toHaveBeenCalledWith(event.target.value, event);
        })

        describe('Month options', () => {
            it('limited range from 1/1/2017 to 11/30/2017 - disable december', () => {
                const newProps = {
                    minDate: moment("1/1/2017", "MM/DD/YYYY"),
                    maxDate: moment("11/30/2017", "MM/DD/YYYY"),
                    shownDate: currentDate,
                    ...defaultPropsForMonthList
                }
                const props = Object.assign({}, initialProps, newProps);
                const componentInstance = new Calendar(props);
                const monthList = componentInstance.renderMonthList(classes);
                const monthOptions = monthList.props.children;

                const decemberOption = monthOptions[11];
                const result = decemberOption.props.disabled;

                expect(result).toBe(true);
            })

            it('limited range from 2/1/2017 to 3/30/2017 - enable february to march and disable january, april to december', () => {
                const newProps = {
                    minDate: moment("2/1/2017", "MM/DD/YYYY"),
                    maxDate: moment("3/30/2017", "MM/DD/YYYY"),
                    shownDate: currentDate,
                    ...defaultPropsForMonthList
                }
                const props = Object.assign({}, initialProps, newProps);
                const componentInstance = new Calendar(props);
                const monthList = componentInstance.renderMonthList(classes);
                const monthOptions = monthList.props.children;

                const isDisableJanuary = monthOptions[0].props.disabled;
                const isDisableFebruary = monthOptions[1].props.disabled;
                const isDisableMarch = monthOptions[2].props.disabled;
                const isDisableDecember = monthOptions[11].props.disabled;
                const isDisableAugust = monthOptions[7].props.disabled;

                expect(isDisableJanuary).toBe(true);
                expect(isDisableFebruary).toBe(false);
                expect(isDisableMarch).toBe(false);
                expect(isDisableDecember).toBe(true);
                expect(isDisableAugust).toBe(true);
            })

            it('month value should be correct', () => {
                const newProps = {
                    minDate: moment("1/1/2017", "MM/DD/YYYY"),
                    maxDate: moment("11/30/2017", "MM/DD/YYYY"),
                    shownDate: currentDate,
                    ...defaultPropsForMonthList
                }
                const props = Object.assign({}, initialProps, newProps);
                const componentInstance = new Calendar(props);
                const monthList = componentInstance.renderMonthList(classes);
                const monthOptions = monthList.props.children;

                const januaryValue = monthOptions[0].props.value;
                const mayValue = monthOptions[4].props.value;
                const decemberValue = monthOptions[11].props.value;

                expect(januaryValue).toBe(0);
                expect(mayValue).toBe(4);
                expect(decemberValue).toBe(11);
            })

            it('month label should be correct with enlish language', () => {
                const newProps = {
                    minDate: moment("1/1/2017", "MM/DD/YYYY"),
                    maxDate: moment("11/30/2017", "MM/DD/YYYY"),
                    shownDate: currentDate,
                    ...defaultPropsForMonthList
                }
                const props = Object.assign({}, initialProps, newProps);
                const componentInstance = new Calendar(props);
                const monthList = componentInstance.renderMonthList(classes);
                const monthOptions = monthList.props.children;

                const januaryLabel = monthOptions[0].props.children;
                const mayLabel = monthOptions[4].props.children;
                const decemberLabel = monthOptions[11].props.children;

                expect(januaryLabel).toBe("Jan");
                expect(mayLabel).toBe("May");
                expect(decemberLabel).toBe("Dec");
            })
        })
    });

    describe('renderYearList', () => {
        const classes = {
            monthAndYearSelect: "monthAndYearSelect"
        }
        const defaultPropsForMonthList = {
            shownDate: currentDate,
            onlyClasses: true,
            locale
        }
        describe('Assert props', () => {
            function assertByOnlyClassesProp({ onlyClasses, expectedStyle }) {
                it(`onlyClasses = ${onlyClasses.toString()} - select element has correct props`, () => {
                    const expectedResult = {
                        style: expectedStyle,
                        className: classes.monthAndYearSelect,
                        value: currentDate.year()
                    }
                    const newProps = {
                        shownDate: currentDate,
                        onlyClasses,
                        locale
                    }

                    const props = Object.assign({}, initialProps, newProps);
                    const componentInstance = new Calendar(props);
                    const yearList = componentInstance.renderYearList(classes);

                    const result = yearList.props;

                    expect(result.style).toEqual(expectedResult.style);
                    expect(result.className).toBe(expectedResult.className);
                    expect(result.value).toBe(expectedResult.value);
                })
            }

            const styles = getTheme();
            const testList = [
                { onlyClasses: true, expectedStyle: undefined },
                { onlyClasses: false, expectedStyle: styles.MonthAndYearSelect }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })

        it('onChange prop - changeYear should be called', () => {
            const props = Object.assign({}, initialProps, defaultPropsForMonthList);
            const componentInstance = new Calendar(props);
            componentInstance.changeYear = jest.fn();
            const yearList = componentInstance.renderYearList(classes);

            const yearListProps = yearList.props;

            yearListProps.onChange();

            expect(componentInstance.changeYear).toHaveBeenCalled();
        })

        describe('Year options', () => {
            it('year value should be correct', () => {
                const newProps = {
                    minDate: moment("1/1/2016", "MM/DD/YYYY"),
                    maxDate: moment("11/30/2017", "MM/DD/YYYY"),
                    shownDate: currentDate,
                    ...defaultPropsForMonthList
                }
                const props = Object.assign({}, initialProps, newProps);
                const componentInstance = new Calendar(props);
                const yearList = componentInstance.renderYearList(classes);

                const yearOptions = yearList.props.children;

                expect(yearOptions[0].props.value).toBe(2016);
                expect(yearOptions[1].props.value).toBe(2017);
            })

            it('year label should be correct', () => {
                const newProps = {
                    minDate: moment("1/1/2016", "MM/DD/YYYY"),
                    maxDate: moment("11/30/2017", "MM/DD/YYYY"),
                    shownDate: currentDate,
                    ...defaultPropsForMonthList
                }
                const props = Object.assign({}, initialProps, newProps);
                const componentInstance = new Calendar(props);
                const yearList = componentInstance.renderYearList(classes);

                const yearOptions = yearList.props.children;

                expect(yearOptions[0].props.children).toBe(2016);
                expect(yearOptions[1].props.children).toBe(2017);
            })
        })
    });

    describe('renderMonthAndYear', () => {
        const defaultPropsOfRenderMonthAndYear = {
            shownDate: currentDate,
            onlyClasses: true,
            locale
        }
        const classes = {
            monthAndYearWrapper: "monthAndYearWrapper"
        }

        function mockRenderDropdownMonthAndYear(componentInstance) {
            componentInstance.renderMonthList = jest.fn(() => "Month List");
            componentInstance.renderYearList = jest.fn(() => "Year List");
        }

        describe('showMonthArrow', () => {
            function assertByShowMonthArrowProp(showMonthArrow) {
                it(`showMonthArrow = ${showMonthArrow.toString()} - first and last child in children props should have correct value`, () => {
                    const newProps = {
                        showMonthArrow,
                        ...defaultPropsOfRenderMonthAndYear
                    }

                    const props = Object.assign({}, initialProps, newProps);
                    const componentInstance = new Calendar(props);
                    mockRenderDropdownMonthAndYear(componentInstance);

                    const renderedMonthAndYear = componentInstance.renderMonthAndYear(classes);

                    const monthAndYearChildren = renderedMonthAndYear.props.children;

                    const firstChild = monthAndYearChildren[0];
                    const lastChild = monthAndYearChildren[2];

                    if (showMonthArrow) {
                        expect(firstChild).not.toBe(null);
                        expect(lastChild).not.toBe(null);
                    } else {
                        expect(firstChild).toBe(null);
                        expect(lastChild).toBe(null);
                    }
                })
            }

            assertByShowMonthArrowProp(true);
            assertByShowMonthArrowProp(false);
        })

        describe('Assert props', () => {
            function assertByOnlyClassesProp({ onlyClasses, expectedStyle }) {
                it(`onlyClasses = ${onlyClasses.toString()} - element props should be correct`, () => {
                    const expectedResult = {
                        style: expectedStyle,
                        className: classes.monthAndYearWrapper
                    }
                    const newProps = {
                        shownDate: currentDate,
                        onlyClasses,
                        locale
                    }

                    const props = Object.assign({}, initialProps, newProps);
                    const componentInstance = new Calendar(props);
                    mockRenderDropdownMonthAndYear(componentInstance);
                    const monthAndYear = componentInstance.renderMonthAndYear(classes);

                    const result = monthAndYear.props;

                    expect(result.style).toEqual(expectedResult.style);
                    expect(result.className).toBe(expectedResult.className);
                })
            }

            const styles = getTheme();
            const testList = [
                { onlyClasses: true, expectedStyle: undefined },
                { onlyClasses: false, expectedStyle: styles.MonthAndYear }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })

        it('Month and Year dropdown section should be render correctly', () => {
            const newProps = {
                showMonthArrow: false,
                ...defaultPropsOfRenderMonthAndYear
            }
            const extendClasses = Object.assign({}, classes, {
                month: "month",
                monthAndYearDivider: "monthAndYearDivider",
                year: "year"
            })

            const props = Object.assign({}, initialProps, newProps);
            const componentInstance = new Calendar(props);
            mockRenderDropdownMonthAndYear(componentInstance);

            const renderedMonthAndYear = componentInstance.renderMonthAndYear(extendClasses);

            const monthAndYearDropdownSection = renderedMonthAndYear.props.children[1];

            const monthDropdown = monthAndYearDropdownSection.props.children[0];
            const dividerSection = monthAndYearDropdownSection.props.children[1];
            const yearDropdownSection = monthAndYearDropdownSection.props.children[2];

            const encodedWhiteSpace = String.fromCharCode(160);

            expect(monthDropdown.props.children).toBe("Month List");
            expect(monthDropdown.props.className).toBe(extendClasses.month);
            expect(dividerSection.props.children).toBe(encodedWhiteSpace);
            expect(dividerSection.props.className).toBe(extendClasses.monthAndYearDivider);
            expect(yearDropdownSection.props.children).toBe("Year List");
            expect(yearDropdownSection.props.className).toBe(extendClasses.year);
        })
    })

    describe('renderWeekdays', () => {
        const defaultPropsOfRenderWeekdays = {
            shownDate: currentDate,
            onlyClasses: true,
            firstDayOfWeek: 0,
            locale
        }
        const classes = {
            weekDay: "weekDay"
        }

        describe('firstDayOfWeek', () => {
            it('first day of week should be Sunday when firstDayOfWeek prop is 0', () => {
                const componentInstance = new Calendar(defaultPropsOfRenderWeekdays);

                const weekDays = componentInstance.renderWeekdays(classes);
                const firstDayOfWeek = weekDays[0];

                const result = firstDayOfWeek.props.children;

                expect(result).toBe("Su");
            })

            it('first day of week should be Monday when firstDayOfWeek prop is 1', () => {
                const newProps = {
                    firstDayOfWeek: 1
                }
                const props = Object.assign({}, defaultPropsOfRenderWeekdays, newProps);
                const componentInstance = new Calendar(props);

                const weekDays = componentInstance.renderWeekdays(classes);
                const firstDayOfWeek = weekDays[0];

                const result = firstDayOfWeek.props.children;

                expect(result).toBe("Mo");
            })
        })

        describe('Assert props', () => {
            const weekDaysLocale = locale.weekdays;

            function assertByOnlyClassesProp({ onlyClasses, expectedStyle }) {
                it(`onlyClasses = ${onlyClasses.toString()} - element props should be correct`, () => {
                    const expectedResult = {
                        style: expectedStyle,
                        className: classes.weekDay
                    }
                    const newProps = {
                        shownDate: currentDate,
                        onlyClasses,
                        locale
                    }

                    const props = Object.assign({}, initialProps, newProps);
                    const componentInstance = new Calendar(props);
                    const weekDays = componentInstance.renderWeekdays(classes);

                    weekDays.forEach((item, index) => {
                        const result = item.props;
                        expect(result.style).toEqual(expectedResult.style);
                        expect(result.className).toBe(expectedResult.className);
                        expect(result.children).toBe(weekDaysLocale[index])
                    })
                })
            }

            const styles = getTheme();
            const testList = [
                { onlyClasses: true, expectedStyle: undefined },
                { onlyClasses: false, expectedStyle: styles.Weekday }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })
    })

    describe('renderDays - current month is november', () => {
        const defaultPropsOfRenderDay = {
            range: { startDate: moment("11/1/2017", "MM/DD/YYYY"), endDate: moment("11/30/2017", "MM/DD/YYYY") },
            minDate: moment("10/1/2017", "MM/DD/YYYY"),
            maxDate: moment("12/1/2017", "MM/DD/YYYY"),
            format: MomentFormat.default,
            onlyClasses: true,
            disableDaysBeforeToday: false,
            specialDays: undefined,
            firstDayOfWeek: 0,
            shownDate: currentDate.clone()
        }
        const classes = {}

        it('day of last month should be disabled with isPassive prop is true', () => {
            const componentInstance = new Calendar(defaultPropsOfRenderDay);

            const days = componentInstance.renderDays(classes);

            const daysInLastMonth = [29, 30, 21];
            daysInLastMonth.forEach((item, index) => {
                expect(days[index].props.isPassive).toBe(true);
            })

            const firstDayInCurrentMonth = days[3];
            expect(firstDayInCurrentMonth.props.isPassive).toBe(false);
        })

        it('day of next month should be disabled with isPassive prop is true', () => {
            const componentInstance = new Calendar(defaultPropsOfRenderDay);

            const days = componentInstance.renderDays(classes);

            const daysInLastMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const indexOfFirstDayInLastMonth = days.length - daysInLastMonth.length;
            for (let i = days.length - 1; i >= indexOfFirstDayInLastMonth; i--) {
                expect(days[i].props.isPassive).toBe(true);
            }

            const lastDayOfCurrentMonth = indexOfFirstDayInLastMonth - 1;
            expect(days[lastDayOfCurrentMonth].props.isPassive).toBe(false);
        })

        it('normal day - first day in current month should has correct props', () => {
            const theme = getTheme();
            const componentInstance = new Calendar(defaultPropsOfRenderDay);

            const days = componentInstance.renderDays(classes);
            const firstDayProps = days[3].props;

            expect(firstDayProps.theme).toEqual(theme);
            expect(firstDayProps.isStartEdge).toBe(true);
            expect(firstDayProps.isEndEdge).toBe(false);
            expect(firstDayProps.isSelected).toBe(true);
            expect(firstDayProps.isInRange).toBe(false);
            expect(firstDayProps.isSunday).toBe(false);
            expect(firstDayProps.isSpecialDay).toBe(undefined);
            expect(firstDayProps.isToday).toBe(false);
            expect(firstDayProps.onlyClasses).toBe(true);
            expect(firstDayProps.classNames).toEqual({});
        })

        it('special day - props of special day should be correct', () => {
            const newProps = {
                disableDaysBeforeToday: true,
                specialDays: [{ date: moment("11/2/2017", MomentFormat.default) }]
            }
            const props = Object.assign({}, defaultPropsOfRenderDay, newProps);
            const componentInstance = new Calendar(props);

            const days = componentInstance.renderDays(classes);
            const secondDayProps = days[4].props;

            expect(secondDayProps.isSpecialDay).toBe(true);
            expect(secondDayProps.isStartEdge).toBe(false);
            expect(secondDayProps.isEndEdge).toBe(false);
            expect(secondDayProps.isInRange).toBe(true);
        })

        it('range is undefined and date prop has value - isSelected should be true', () => {
            const newProps = {
                range: null,
                date: moment("11/2/2017", MomentFormat.default)
            }
            const props = Object.assign({}, defaultPropsOfRenderDay, newProps);
            const componentInstance = new Calendar(props);

            const days = componentInstance.renderDays(classes);
            const secondDayProps = days[4].props;

            expect(secondDayProps.isSelected).toBe(true);
        })
    })

    describe('render', () => {
        function mockRenderSubComponents(componentInstance) {
            componentInstance.renderMonthAndYear = jest.fn(() => "renderMonthAndYear");
            componentInstance.renderWeekdays = jest.fn(() => "renderWeekdays");
            componentInstance.renderDays = jest.fn(() => "renderDays");
        }

        describe('Assert props', () => {
            const classes = {
                calendar: "calendar"
            }

            function assertByOnlyClassesProp({ onlyClasses, expectedStyle }) {
                it(`onlyClasses = ${onlyClasses.toString()} - element props should be correct`, () => {
                    const expectedResult = {
                        style: expectedStyle,
                        className: classes.calendar
                    }
                    const newProps = {
                        onlyClasses,
                        classNames: { calendar: classes.calendar }
                    }
                    const props = Object.assign({}, initialProps, newProps);
                    const componentInstance = new Calendar(props);
                    mockRenderSubComponents(componentInstance);

                    const calendar = componentInstance.render();

                    const result = calendar.props;

                    expect(result.style).toEqual(expectedResult.style);
                    expect(result.className).toBe(expectedResult.className);
                })
            }

            const styles = getTheme();
            const testList = [
                { onlyClasses: true, expectedStyle: undefined },
                { onlyClasses: false, expectedStyle: styles.Calendar }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })

        it('Children content should be correct', () => {
            const componentInstance = new Calendar(initialProps);
            mockRenderSubComponents(componentInstance);

            const calendar = componentInstance.render();
            const children = calendar.props.children;

            const monthAndYear = children[0].props.children;
            const weekDays = children[1].props.children;
            const days = children[2].props.children;

            expect(monthAndYear).toBe("renderMonthAndYear");
            expect(weekDays).toBe("renderWeekdays");
            expect(days).toBe("renderDays");
        })
    })
});