import React from 'react';

const Switcher = (props) => {
    const {...attributes} = props;

    return (
        <div className="switch">
            <label>
                <input {...attributes} type="checkbox" />
                <span className="lever"></span>
            </label>
        </div>
    )
}

export default Switcher;