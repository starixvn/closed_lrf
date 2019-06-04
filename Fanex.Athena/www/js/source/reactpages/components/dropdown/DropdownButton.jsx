import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DropdownToggle from './DropdownToggle';
import DropdownMenu from './DropdownMenu';

const DropdownButton = (props) => {
    const { className, children, toggleButton, dropdownMenu, isOpen, onOpen, onClose, onToggle, buttonLabel, ...attrs } = props;
    const classes = classNames('dropdown', className);

    return (
        <div className={classes} {...attrs}>
            <DropdownToggle {...toggleButton} onClick={onToggle}>{buttonLabel}</DropdownToggle>
            <DropdownMenu {...dropdownMenu} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                {children}
            </DropdownMenu>
        </div>
    )
}

const propTypes = {
    buttonLabel: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onToggle: PropTypes.func,
    toggleButton: PropTypes.shape({
        caret: PropTypes.bool,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
        tag: PropTypes.string
    }),
    dropdownMenu: PropTypes.shape({
        tag: PropTypes.string,
        children: PropTypes.node.isRequired,
        className: PropTypes.string
    })
};
DropdownButton.propTypes = propTypes;

export default DropdownButton;