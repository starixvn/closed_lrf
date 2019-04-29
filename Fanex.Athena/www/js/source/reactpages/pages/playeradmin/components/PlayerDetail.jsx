import React, { PureComponent } from 'react'
import { Tabs, Tab } from '@9softstudio/react-simple-tab'

import Site from '../../../lib/site';
import { playerMenuList, mode, currentMode } from '../lib/constants';

export default class PlayerDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedTabIndex: 0,
            targetUrl: ''
        }
    }

    handleClickMenu = (event, actionLink, tabIndex) => {
        event.preventDefault();

        this.setState({ 
            targetUrl: actionLink, 
            selectedTabIndex: tabIndex 
        });
    }

    _isValidMode() {
        return (currentMode === mode.appraisal && Identity && Identity.ApplyTokenUrl) || currentMode === mode.self;
    }

    _getExternalActionLink(url) {
        return `${Identity.ApplyTokenUrl}?ActionLink=${url}&Type=1`;
    }

    render() {
        if (!currentMode || !this._isValidMode()) {
            return null;
        }

        const { selectedTabIndex, targetUrl } = this.state;

        return (
            <div className="pa-detail-container">
                <Tabs>
                    {
                        playerMenuList.map((item, index) => {
                            const actionLink = currentMode === mode.self ? 
                                Site.resolveClientUrl(item.url) :
                                this._getExternalActionLink(item.url);
                                
                            return (
                                <Tab key={item.key} isActive={selectedTabIndex === index}
                                    label={item.text} url={actionLink}
                                    onClick={(event) => this.handleClickMenu(event, actionLink, index)} />
                                // <li className="tab">
                                //     <a className={selectedTabIndex === index ? "active" : ""}>{item.text}</a>
                                // </li>
                            )
                        })
                    }
                </Tabs>

                <div className="pa-frame-container">
                    <iframe id="paDetailFrame" name="paDetailFrame" frameBorder="0" src={targetUrl}></iframe>
                </div>
            </div>
        )
    }
}