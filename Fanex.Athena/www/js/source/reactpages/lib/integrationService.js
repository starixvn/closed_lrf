import { mode, currentMode, systemType, tokenUrlTemplate } from '../constants/integrationInfo';
import Site from './site';

export const isValidMode = () => {
    return (currentMode === mode.parasitic && Identity && Identity.ApplyTokenUrl) || currentMode === mode.self;
}

export const getActionLink = (type, action) => {
    return currentMode === mode.self ? Site.resolveClientUrl(action) : getExternalActionLink(type, action);
}

const getExternalActionLink = (type, action) => {
    return type === systemType.newAdmin ? action : buildExternalActionLink(type, action);
}

const buildExternalActionLink = (type, action) => {
    const applyTokenUrl = (Identity && Identity.ApplyTokenUrl) || '';

    return `${applyTokenUrl}?ActionLink=${action}&Type=${type}`;
}

export const getApiActionLink = (type, action) => {
    return currentMode === mode.self && type === systemType.lrf ? Site.resolveClientUrl(action) : buildExternalApiActionLink(type, action);
}

const buildExternalApiActionLink = (type, action) => {
    return type === systemType.newAdmin ? action :
        tokenUrlTemplate && tokenUrlTemplate.replace('{0}', encodeURIComponent(action)).replace('{1}', type);
}