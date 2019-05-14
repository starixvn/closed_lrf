import React from 'react';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT} from './constants';
import PropTypes from 'prop-types';

const Popup = (props) => {
    const { title, isShow, width, height, isHtml, children, iframeUrl } = props;
    let content;
    if(iframeUrl)
    {
        content = (<iframe frameBorder="0" src={iframeUrl} width="100%" height="100%"/>);
    }
    else
    {                    
        content = isHtml ? 
        (<div className='popup-content' dangerouslySetInnerHTML={{ __html: children }} />) :
            (<div className='popup-content'>{children}</div>)
    }

    return (<div className={`popup-container ${isShow ? 'show' : 'hide'}`}>
                <div className='popup-block-body'></div>
                <div className='flat-popup' style={{ height: height, width: width }}>
                    <div className='popup-title'>
                        <div className="txt-title">{title}</div>
                        <a className="popup-close" href="javascript:;" onClick={() => {props.onClose && props.onClose()}}><i className="icon-close"></i></a>
                    </div>
                { content }
                </div>
            </div>
        )
}

Popup.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    isHtml: PropTypes.bool,
    iframeUrl: PropTypes.string,
}

Popup.defaultProps = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    isShow: false,
    isHtml: false,
    iframeUrl: null
}

export default Popup;
