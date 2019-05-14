import React from 'react';

const Loader = ({isLoading}) => {
    return (<div className="loading-process default" style={{ display: `${isLoading ? 'block' : 'none'}` }}>
            <div className="icon-loading">
                <div className="loader-inner ball-beat">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default Loader;
