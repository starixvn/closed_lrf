import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Overlay from '../Overlay';

class DropdownMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tag, className, isOpen, onOpen, onClose, ...attrs } = this.props;
        const Tag = tag;
        const classes = classNames('dropdown-menu', className);

        return (
            <Overlay isOpening={isOpen} onOpen={onOpen} onClose={onClose}>
                <Tag className={classes} {...attrs} />
            </Overlay>
        )
    }
}

const propTypes = {
    tag: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
};

const defaultProps = {
    tag: 'div'
};

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export default DropdownMenu;