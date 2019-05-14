import React from 'react';
import langHelper from '../lib/langHelper';

const NoDataTitle = () => {
    return (
            <p className="no-info-row center-align">{langHelper.getSingleResource("NoInfo")}</p>
        )
    }

export default NoDataTitle;