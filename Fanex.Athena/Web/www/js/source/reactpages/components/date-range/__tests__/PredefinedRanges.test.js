import React from 'react'
import renderer from 'react-test-renderer'

import moment from 'moment'
import { MomentFormat } from '../constants'
import getTheme from '../styles'
import locale from "../utils/locale"
import PredefinedRanges from '../PredefinedRanges'


describe('PredefinedRanges', () => {
    const currentDate = moment("11/23/2017", MomentFormat.default);
    const yesterday = {
        startDate: moment("11/22/2017", MomentFormat.default),
        endDate: moment("11/22/2017", MomentFormat.default)
    };
    const lastMonth = {
        startDate: moment("10/1/2017", MomentFormat.default),
        endDate: moment("10/30/2017", MomentFormat.default)
    };
    const defaultProps = {
        ranges: { 'Yesterday': yesterday, 'LastMonth': lastMonth },
        range: { startDate: moment([2018, 0, 1]), endDate: moment([2018, 0, 19]) },
        onlyClasses: false,
        classNames: {}
    }
    const theme = getTheme({ Day: { margin: 5 } });

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('constructor', () => {
        it('initial value should be correct', () => {
            const componentInstance = new PredefinedRanges(defaultProps);

            expect(componentInstance.styles).toBe(undefined);
            expect(componentInstance.selectedItem).toBe(undefined);
        })
    })

    describe("_getSelectedRange", () => {
        it("startDate and endDate in state.range not match to any range options - return undefined", () => {
            const componentInstance = new PredefinedRanges(defaultProps);

            const result = componentInstance._getSelectedRange();

            expect(result).toBe(undefined);
        })

        it("startDate and endDate in state.range not match to 'yesterday' in range options - return correct range name", () => {
            const expectedRangeName = "Yesterday";
            const yesterdayRange = {
                startDate: yesterday.startDate.clone(),
                endDate: yesterday.endDate.clone()
            }
            const props = Object.assign({}, defaultProps, { range: yesterdayRange });
            const componentInstance = new PredefinedRanges(props);

            const result = componentInstance._getSelectedRange();

            expect(result).toBe(expectedRangeName);
        })
    })

    describe("componentDidUpdate", () => {
        it("Not change range - do nothing", () => {
            const props = Object.assign({}, defaultProps);
            const componentInstance = new PredefinedRanges(props);
            componentInstance._getSelectedRange = jest.fn();
            const expectedRangeName = componentInstance.selectedItem;

            componentInstance.componentDidUpdate(defaultProps);

            expect(componentInstance._getSelectedRange).not.toHaveBeenCalled();
            expect(componentInstance.selectedItem).toBe(expectedRangeName);
        })

        it("Range is changed - selectedItem value should be correct", () => {
            const expectedRangeName = "Yesterday";

            const props = Object.assign({}, defaultProps);
            const componentInstance = new PredefinedRanges(props);
            componentInstance._getSelectedRange = jest.fn(() => expectedRangeName);

            props.range = {};
            componentInstance.componentDidUpdate(defaultProps);

            expect(componentInstance.selectedItem).toBe(expectedRangeName);
        })
    })

    describe('handleSelect', () => {
        it('event.preventDefault() should be called', () => {
            const event = {
                preventDefault: jest.fn()
            }
            const onSelect = jest.fn();
            const newProps = { onSelect };
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);

            const rangeName = "Yesterday";
            componentInstance.handleSelect(rangeName, event);

            expect(event.preventDefault).toHaveBeenCalled();
        })

        it('onSelect props should be called with correct parameter', () => {
            const expectedParam = defaultProps.ranges.Yesterday;
            const event = {
                preventDefault: jest.fn()
            }
            const onSelect = jest.fn();
            const newProps = { onSelect };
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);

            const rangeName = "Yesterday";
            componentInstance.handleSelect(rangeName, event);

            expect(onSelect).toHaveBeenCalledWith(expectedParam);
        })
    })

    describe('clickButton', () => {
        it('event.preventDefault() should be called', () => {
            const buttonHandlers = {
                "Apply": jest.fn(),
                "Cancel": jest.fn()
            };
            const event = {
                preventDefault: jest.fn()
            }
            const newProps = { buttonHandlers };
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);
            const actionName = "Apply";

            componentInstance.clickButton(event, actionName);

            expect(event.preventDefault).toHaveBeenCalled();
        })

        it('event.preventDefault() should be called', () => {
            const buttonHandlers = {
                "Apply": jest.fn(),
                "Cancel": jest.fn()
            };
            const event = {
                preventDefault: jest.fn()
            }
            const newProps = { buttonHandlers };
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);
            const actionName = "Apply";

            componentInstance.clickButton(event, actionName);

            expect(buttonHandlers.Apply).toHaveBeenCalled();
        })
    })

    describe('renderRangeList', () => {
        const classes = {
            predefinedRangesItem: "predefinedRangesItem",
            predefinedRangesItemActive: "predefinedRangesItemActive"
        }
        describe('Assert props', () => {
            function assertByOnlyClassesProp({ onlyClasses, expectedStyle }) {
                it(`onlyClasses = ${onlyClasses.toString()} - range element has correct props`, () => {
                    const expectedResult = {
                        style: expectedStyle
                    }
                    const newProps = {
                        onlyClasses,
                        theme
                    }

                    const props = Object.assign({}, defaultProps, newProps);
                    const componentInstance = new PredefinedRanges(props);
                    componentInstance.selectedItem = "Yesterday";
                    const ranges = componentInstance.renderRangeList(classes);

                    const result = ranges[0].props;

                    expect(result.style).toEqual(expectedResult.style);
                })
            }

            const style = {
                ...theme.PredefinedRangesItem,
                ...theme.PredefinedRangesItemActive
            }
            const testList = [
                { onlyClasses: true, expectedStyle: undefined },
                { onlyClasses: false, expectedStyle: style }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })

        it('Yesterday range is not selected - this range should have correct class name', () => {
            const expectedClassName = classes.predefinedRangesItem;
            const newProps = {
                onlyClasses: true,
                theme
            }
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);

            const ranges = componentInstance.renderRangeList(classes);

            const yesterdayRange = ranges[0];
            const result = yesterdayRange.props.className;

            expect(result).toBe(expectedClassName);
        })

        it('Yesterday range is selected - this range should have correct class name', () => {
            const expectedClassName = Object.keys(classes).map(item => item).join(" ");
            const newProps = {
                onlyClasses: true,
                theme
            }
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);
            componentInstance.selectedItem = "Yesterday";

            const ranges = componentInstance.renderRangeList(classes);

            const yesterdayRange = ranges[0];
            const result = yesterdayRange.props.className;

            expect(result).toBe(expectedClassName);
        })

        it('onClick event - onSelect should be called with correct parameter', () => {
            const newProps = {
                onlyClasses: true,
                theme
            }
            const props = Object.assign({}, defaultProps, newProps);
            const componentInstance = new PredefinedRanges(props);
            componentInstance.handleSelect = jest.fn();

            const ranges = componentInstance.renderRangeList(classes);

            const event = {},
                rangeName = "Yesterday";
            const yesterdayRange = ranges[0];

            yesterdayRange.props.onClick(event, rangeName);

            expect(componentInstance.handleSelect).toHaveBeenCalled();
        })
    })

    describe('renderRangeButtons', () => {
        const classes = {
            applyButton: "applyButton",
            cancelButton: "cancelButton"
        }
        const defaultPropsOfRenderRangeButtons = {
            onlyClasses: true,
            theme,
            locale
        }

        function getDefaultRangeButtons(newProps = {}) {
            const props = Object.assign({}, defaultProps, defaultPropsOfRenderRangeButtons, newProps);
            const componentInstance = new PredefinedRanges(props);
            return componentInstance.renderRangeButtons(classes);
        }

        it('class name of container should be correct', () => {
            const rangeButtons = getDefaultRangeButtons();
            const containerClassName = rangeButtons.props.className;
            const expectedContainerClassName = "range-button-group";

            expect(containerClassName).toBe(expectedContainerClassName);
        })

        it('class name of buttons should be correct', () => {
            const rangeButtons = getDefaultRangeButtons();
            const buttons = rangeButtons.props.children;

            const applyButtonProps = buttons[0].props;
            const expectedClassNameOfApplyButton = classes.applyButton;

            const cancelButtonProps = buttons[1].props;
            const expectedClassNameOfCancelButton = classes.cancelButton;

            expect(applyButtonProps.className).toBe(expectedClassNameOfApplyButton);
            expect(cancelButtonProps.className).toBe(expectedClassNameOfCancelButton);
        })

        it('buttons text should be correct', () => {
            const applyLabel = "Apply",
                cancelLabel = "Cancel";
            const newProps = {
                locale: { applyLabel, cancelLabel }
            }
            const rangeButtons = getDefaultRangeButtons(newProps);
            const buttons = rangeButtons.props.children;

            const applyButtonProps = buttons[0].props;
            const cancelButtonProps = buttons[1].props;

            expect(applyButtonProps.children).toBe(applyLabel);
            expect(cancelButtonProps.children).toBe(cancelLabel);
        })

        it('buttons onClick event - clickButton should be called with correct parameter', () => {
            const applyActionName = "apply",
                cancelActionName = "cancel";

            const props = Object.assign({}, defaultProps, defaultPropsOfRenderRangeButtons);
            const componentInstance = new PredefinedRanges(props);
            componentInstance.clickButton = jest.fn();
            const rangeButtons = componentInstance.renderRangeButtons(classes);
            const buttons = rangeButtons.props.children;

            const applyButtonProps = buttons[0].props;
            const cancelButtonProps = buttons[1].props;

            const event = {};
            applyButtonProps.onClick(event);
            expect(componentInstance.clickButton).toHaveBeenCalledWith(event, applyActionName);

            cancelButtonProps.onClick(event);
            expect(componentInstance.clickButton).toHaveBeenCalledWith(event, cancelActionName);
        })

        describe('Assert style', () => {
            function assertByOnlyClassesProp({ onlyClasses, expectedStyle, buttonIndex }) {
                it(`onlyClasses = ${onlyClasses.toString()} - button element has correct props`, () => {
                    const expectedResult = {
                        style: expectedStyle
                    }
                    const newProps = {
                        onlyClasses,
                        theme
                    }

                    const props = Object.assign({}, defaultProps, newProps);
                    const componentInstance = new PredefinedRanges(props);
                    const rangeButtons = componentInstance.renderRangeButtons(classes);
                    const buttons = rangeButtons.props.children;

                    const buttonProps = buttons[buttonIndex].props;

                    expect(buttonProps.style).toEqual(expectedResult.style);
                })
            }

            const testList = [
                { onlyClasses: true, expectedStyle: undefined, buttonIndex: 0 },
                { onlyClasses: false, expectedStyle: theme.RangeApplyButton, buttonIndex: 0 },
                { onlyClasses: true, expectedStyle: undefined, buttonIndex: 1 },
                { onlyClasses: false, expectedStyle: theme.RangeCancelButton, buttonIndex: 1 }
            ]

            testList.forEach(assertByOnlyClassesProp);
        })
    })

    describe('render', () => {
        const classNames = {
            predefinedRanges: "predefinedRanges"
        }
        const defaultPropsOfRender = {
            onlyClasses: true,
            theme,
            classNames
        }

        it('onlyClasses = true - match snapshot', () => {
            const props = Object.assign({}, defaultProps, defaultPropsOfRender);
            const component = renderer.create(<PredefinedRanges {...props} />);

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('onlyClasses = false - match snapshot', () => {
            const newProps = { onlyClasses: false };
            const props = Object.assign({}, defaultProps, defaultPropsOfRender, newProps);
            const component = renderer.create(<PredefinedRanges {...props} />);

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    })
});