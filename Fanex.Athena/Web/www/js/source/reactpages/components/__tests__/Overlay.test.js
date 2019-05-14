import React from 'react'
import renderer from 'react-test-renderer'

import Overlay from '../Overlay'

describe("Overlay ", () => {
    const defaultProps = {
        closeOnOutsideClick: true,
        isOpening: false,
        onOpen: undefined,
        onClose: undefined
    }

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe("constructor", () => {
        it("initial values should be correct", () => {
            const overlay = new Overlay(defaultProps);

            expect(overlay.containerElement).toBe(null);
            expect(overlay.state).toEqual({ isOpening: defaultProps.isOpening });
        })
    })

    describe("componentDidUpdate", () => {
        it("do not change isOpening prop - do nothing", () => {
            const overlay = new Overlay(defaultProps);

            overlay.setState = jest.fn();
            overlay.componentDidUpdate(defaultProps);

            expect(overlay.setState).not.toHaveBeenCalled();
        })

        it("Change isOpening prop to true - onOpen prop is defined - call onOpen function", () => {
            const props = Object.assign({}, { ...defaultProps });
            const overlay = new Overlay(props);

            props.isOpening = true;
            overlay.setState = jest.fn();
            props.onOpen = jest.fn();
            overlay.componentDidUpdate(defaultProps);

            expect(props.onOpen).toHaveBeenCalled();
        })

        it("Change isOpening prop to false - onOpen prop should not be called", () => {
            const props = Object.assign({}, defaultProps, { isOpening: true });
            const overlay = new Overlay(props);

            props.isOpening = false;
            overlay.setState = jest.fn();
            props.onOpen = jest.fn();
            overlay.componentDidUpdate(defaultProps);

            expect(props.onOpen).not.toHaveBeenCalled();
        })

        it("Change isOpening prop - setState should be called with correct parameter", () => {
            const props = Object.assign({}, { ...defaultProps });
            const overlay = new Overlay(props);
            const expectedState = { isOpening: !defaultProps.isOpening };

            props.isOpening = expectedState.isOpening;
            overlay.setState = jest.fn();
            overlay.componentDidUpdate(defaultProps);

            expect(overlay.setState).toHaveBeenCalledWith(expectedState);
        })
    })

    it("componentDidMount - _registerEvents should be called", () => {
        const overlay = new Overlay(defaultProps);
        overlay._registerEvents = jest.fn();

        overlay.componentDidMount();

        expect(overlay._registerEvents).toHaveBeenCalled();
    })

    it("componentWillUnmount - _unRegisterEvents should be called", () => {
        const overlay = new Overlay(defaultProps);
        overlay._unRegisterEvents = jest.fn();

        overlay.componentWillUnmount();

        expect(overlay._unRegisterEvents).toHaveBeenCalled();
    })

    describe("_registerEvents", () => {
        let originalAddEventListener;

        beforeEach(() => {
            originalAddEventListener = document.addEventListener;
            document.addEventListener = jest.fn();
        })

        afterEach(() => {
            document.addEventListener = originalAddEventListener;
        })

        it("closeOnOutsideClick = false - do not register _handleClickOutSide on document click event", () => {
            const props = Object.assign({}, defaultProps, { closeOnOutsideClick: false });
            const overlay = new Overlay(props);

            overlay._registerEvents();

            expect(document.addEventListener).not.toHaveBeenCalledWith("click", overlay._handleClickOutSide, true);
        })

        it("closeOnOutsideClick = true - register _handleClickOutSide on document click event", () => {
            const overlay = new Overlay(defaultProps);

            overlay._registerEvents();

            expect(document.addEventListener).toHaveBeenCalledWith("click", overlay._handleClickOutSide, true);
        })
    })

    describe("_unRegisterEvents", () => {
        let originalRemoveEventListener;

        beforeEach(() => {
            originalRemoveEventListener = document.removeEventListener;
            document.removeEventListener = jest.fn();
        })

        afterEach(() => {
            document.removeEventListener = originalRemoveEventListener;
        })

        it("closeOnOutsideClick = false - do not register _handleClickOutSide on document click event", () => {
            const props = Object.assign({}, defaultProps, { closeOnOutsideClick: false });
            const overlay = new Overlay(props);

            overlay._unRegisterEvents();

            expect(document.removeEventListener).not.toHaveBeenCalledWith("click", overlay._handleClickOutSide, true);
        })

        it("closeOnOutsideClick = true - register _handleClickOutSide on document click event", () => {
            const overlay = new Overlay(defaultProps);

            overlay._unRegisterEvents();

            expect(document.removeEventListener).toHaveBeenCalledWith("click", overlay._handleClickOutSide, true);
        })
    })

    describe("_handleClickOutSide", () => {
        const containerElement = {
            contains: (element) => {
                if (element === "container") {
                    return true;
                }

                return false;
            }
        }

        it("isOpening = false - do not call _close function", () => {
            const target = "container"
            const event = { target }

            const overlay = new Overlay(defaultProps);
            overlay.containerElement = containerElement;
            overlay._close = jest.fn();

            overlay._handleClickOutSide(event);

            expect(overlay._close).not.toHaveBeenCalled();
        })

        it("isOpening = true - call _close function", () => {
            const target = "outside"
            const event = { target }

            const props = Object.assign({}, defaultProps, { isOpening: true });
            const overlay = new Overlay(props);
            overlay.containerElement = containerElement;
            overlay._close = jest.fn();

            overlay._handleClickOutSide(event);

            expect(overlay._close).toHaveBeenCalled();
        })
    })

    describe("_close", () => {
        it("onClose should be called", () => {
            const props = Object.assign({}, defaultProps, { onClose: jest.fn() });

            const overlay = new Overlay(props);
            overlay.setState = jest.fn((newState, callbackFunc) => { callbackFunc() });

            overlay._close();

            expect(props.onClose).toHaveBeenCalled();
        })

        it("setState should be called with correct parameter", () => {
            const expectedState = { isOpening: false };

            const overlay = new Overlay(defaultProps);
            overlay.setState = jest.fn();

            overlay._close();

            expect(overlay.setState.mock.calls[0][0]).toEqual(expectedState);
        })
    })

    describe("render", () => {
        it("isOpening = false - match with snapshot", () => {
            const component = renderer.create(<Overlay {...defaultProps}>children</Overlay>);

            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })

        it("isOpening = true - match with snapshot", () => {
            const props = Object.assign({}, defaultProps, { isOpening: true });
            const component = renderer.create(<Overlay className="extend" {...props}>children</Overlay>);

            const result = component.toJSON();

            expect(result).toMatchSnapshot();
        })
    })
})