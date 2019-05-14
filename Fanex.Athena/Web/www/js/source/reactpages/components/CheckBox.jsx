import React from 'react';
import PropTypes from 'prop-types';

const CheckBox = (props) => {
    return (<div className="checkbox-group">
                    <input type="checkbox" className="checkbox"                  
                        id={props.id}
                        checked={props.checked} 
                        disabled={props.disabled}
                        onChange={() => props.onChange(!props.checked)} />
                    <label htmlFor={props.id}>{props.label}</label>
                </div>
    )
}

CheckBox.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
}

CheckBox.defaultProps = {
    label: '',
    checked: true,
    disabled: false,
    onChange: function() {}
}

export default CheckBox;