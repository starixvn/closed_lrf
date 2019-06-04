import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class DropdownItem extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        if (this.props.disabled) {
            e.preventDefault();
            return;
        }

        this.props.onClick && this.props.onClick(e);
    }

    render() {
        const { tag, className, active, ...props } = this.props;
        const Tag = tag || 'button';
        const type = (Tag === 'button' && (props.onClick)) ? 'button' : undefined;
        const classes = classNames('dropdown-item', className, {
            disabled: props.disabled,
            active
        });

        return (
            <Tag className={classes} type={type} {...props} />
        )
    }
}

const propTypes = {
    children: PropTypes.node,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    tag: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string
};

const defaultProps = {
    tag: 'button',
    disabled: false
};

DropdownItem.propTypes = propTypes;
DropdownItem.defaultProps = defaultProps;

export default DropdownItem;