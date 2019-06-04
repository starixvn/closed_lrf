import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const DropdownToggle = (props) => {
    const { className, tag, caret, ...attrs } = props;
    const classes = classNames('dropdown-toggle', className);
    const Tag = tag;

    return (
        <Tag className={classes} {...attrs} />
    )
}

const propTypes = {
    caret: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    tag: PropTypes.string
};

const defaultProps = {
    caret: true,
    tag: 'button'
};

DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;

export default DropdownToggle;