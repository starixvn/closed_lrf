import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'

import getTheme from '../styles'
import DayCell from '../DayCell'

describe('DayCell', () => {
    const now = moment("11/22/2017", "MM/DD/YYYY");
    const defaultProps = {
        theme: { 'Day': {} },
        onlyClasses: false,
        dayMoment: now,
        onSelect: undefined,
        isSelected: undefined,
        isInRange: undefined,
        isPassive: undefined,
        isSpecialDay: undefined,
        classNames: undefined
    }

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('constructor', () => {
        it('Initial state should be correct', () => {
            const componentInstance = new DayCell(defaultProps);
            const expectedState = {
                hover: false,
                active: false
            }

            expect(componentInstance.state).toEqual(expectedState);
            expect(componentInstance.styles).toEqual(defaultProps.theme);
        });
    })


    describe('handleMouseEvent', () => {
        it('event.preventDefault() should be called', () => {
            const event = new Event("mouseevent");
            event.preventDefault = jest.fn();

            const props = Object.assign({}, defaultProps, { isPassive: true });
            const componentInstance = new DayCell(props);

            componentInstance.handleMouseEvent(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('props.isPassive = true - return null', () => {
            const event = new Event("mouseevent");
            event.preventDefault = jest.fn();

            const props = Object.assign({}, defaultProps, { isPassive: true });
            const componentInstance = new DayCell(props);

            const result = componentInstance.handleMouseEvent(event);

            expect(result).toBe(null);
        });

        describe('props.isPassive = false', () => {
            function assertState(eventType, expectedState) {
                it(`${eventType} - setState should be called with correct parameter`, () => {
                    const event = new Event(eventType);
                    event.preventDefault = jest.fn();

                    const props = Object.assign({}, defaultProps, { isPassive: false });
                    const componentInstance = new DayCell(props);

                    const setStateMock = jest.fn();
                    componentInstance.setState = setStateMock;

                    componentInstance.handleMouseEvent(event);

                    expect(setStateMock).toHaveBeenCalledWith(expectedState);
                })
            }

            const eventWithExpectedState = {
                'mouseenter': { hover: true },
                'mouseup': { hover: false, active: false },
                'mouseleave': { hover: false, active: false },
                'mousedown': { active: true }
            }

            Object.keys(eventWithExpectedState).forEach((eventType) => {
                assertState(eventType, eventWithExpectedState[eventType]);
            })
        });
    });

    describe('handleSelect', () => {
        it('event.preventDefault() should be called', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const props = Object.assign({}, defaultProps, { isPassive: true });
            const componentInstance = new DayCell(props);

            componentInstance.handleSelect(event);

            expect(event.preventDefault).toHaveBeenCalled();
        })

        it('props.isPassive = true - return null', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const props = Object.assign({}, defaultProps, { isPassive: true });
            const componentInstance = new DayCell(props);

            const result = componentInstance.handleSelect(event);

            expect(result).toBe(null);
        });

        it('props.isPassive = false - props.onSelect should be called with correct parameter', () => {
            const event = new Event("click");
            event.preventDefault = jest.fn();

            const expectedParam = now;
            const onSelect = jest.fn();
            const props = Object.assign({}, defaultProps, { isPassive: false, onSelect });
            const componentInstance = new DayCell(props);

            componentInstance.handleSelect(event);

            expect(onSelect).toHaveBeenCalledWith(expectedParam);
        })
    });


    describe('getStateStyles', () => {
        it('using default props - return empty object', () => {
            const expectedResult = {};
            const componentInstance = new DayCell(defaultProps);

            const result = componentInstance.getStateStyles();

            expect(result).toEqual(expectedResult);
        })

        describe('using custom theme', () => {
            const theme = getTheme();

            const newProps = {
                isSelected: true,
                isInRange: true,
                isPassive: true,
                isStartEdge: true,
                isEndEdge: true,
                dayMoment: true,
                isToday: true,
                isSunday: true,
                isSpecialDay: true,
                theme
            };

            it('not active and hover - return correct style object', () => {
                const expectedResult = {
                    ...theme.DayToday,
                    ...theme.DaySunday,
                    ...theme.DaySpecialDay,
                    ...theme.DayInRange,
                    ...theme.DayPassive,
                    ...theme.DaySelected,
                    ...theme.DayStartEdge,
                    ...theme.DayEndEdge
                };
                const props = Object.assign({}, defaultProps, newProps);

                const componentInstance = new DayCell(props);

                const result = componentInstance.getStateStyles();

                expect(result).toEqual(expectedResult);
            })

            it('active and hover - return correct style object', () => {
                const expectedResult = {
                    ...theme.DayToday,
                    ...theme.DaySunday,
                    ...theme.DaySpecialDay,
                    ...theme.DayInRange,
                    ...theme.DayHover,
                    ...theme.DayPassive,
                    ...theme.DayActive,
                    ...theme.DaySelected,
                    ...theme.DayStartEdge,
                    ...theme.DayEndEdge
                };

                const props = Object.assign({}, defaultProps, newProps);
                const componentInstance = new DayCell(props);
                componentInstance.state = { hover: true, active: true };

                const result = componentInstance.getStateStyles();

                expect(result).toEqual(expectedResult);
            })
        });
    });

    describe('getClassNames', () => {
        const classNames = {
            day: "day",
            dayActive: "dayActive",
            dayPassive: "dayPassive",
            dayInRange: "dayInRange",
            dayStartEdge: "dayStartEdge",
            dayEndEdge: "dayEndEdge",
            dayToday: "dayToday",
            daySunday: "daySunday",
            daySpecialDay: "daySpecialDay"
        }
        it('using default props - conditions are false - return correct class name', () => {
            const expectedResult = "day";

            const componentInstance = new DayCell(defaultProps);

            const result = componentInstance.getClassNames(classNames);

            expect(result).toBe(expectedResult);
        })

        it('using new props - conditions are true - return correct class name', () => {
            const expectedResult = Object.keys(classNames).map(item => {
                return item;
            }).join(" ");

            const newProps = {
                isSelected: true,
                isInRange: true,
                isPassive: true,
                isStartEdge: true,
                isEndEdge: true,
                isToday: true,
                isSunday: true,
                isSpecialDay: true
            };
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new DayCell(props);

            const result = componentInstance.getClassNames(classNames);

            expect(result).toBe(expectedResult);
        })
    });

    describe('render', () => {
        const classNames = {
            day: "day",
            dayActive: "dayActive",
            dayPassive: "dayPassive",
            dayInRange: "dayInRange",
            dayStartEdge: "dayStartEdge",
            dayEndEdge: "dayEndEdge",
            dayToday: "dayToday",
            daySunday: "daySunday",
            daySpecialDay: "daySpecialDay"
        }

        it('onlyClasses is false - render correct content', () => {
            const props = Object.assign({}, defaultProps, { classNames });
            const component = renderer.create(<DayCell {...props} />);

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('onlyClasses is true - render correct content', () => {
            const props = Object.assign({}, defaultProps, { classNames, onlyClasses: true });
            const component = renderer.create(<DayCell {...props} />);

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    });

});