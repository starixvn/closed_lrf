const pageConfig = window._pConfig;

export const tokenUrlTemplate = pageConfig && pageConfig.tokenUrl;

export const systemType = {
    internal: 0,
    lrf: 1,
    affiliate: 2,
    newAdmin: 3
}