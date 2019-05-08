export const mode = {
    self: 'Self',
    parasitic: 'Parasitic'
}

export const currentMode = window.__lrf && window.__lrf.modules &&
    window.__lrf.modules.playerAdmin && window.__lrf.modules.playerAdmin.mode;

const pageConfig = window.__pageConfig;
export const tokenUrlTemplate = pageConfig && pageConfig.tokenUrl;

export const apiInfo = pageConfig && pageConfig.apiInfo;

export const systemType = {
    internal: 0,
    lrf: 1,
    affiliate: 2,
    newAdmin: 3
}

export const playerMenuList = [{
        Name: 'AccountInfo',
        Text: 'Account Info',
        Action: 'PlayerAccountInfo',
        SystemType: systemType.lrf
    },
    {
        Name: 'Statement',
        Text: 'Statement',
        Action: 'PlayerStatement',
        SystemType: systemType.lrf
    },
    {
        Name: 'BetList',
        Text: 'Bet List',
        Action: 'PlayerBetList',
        SystemType: systemType.lrf
    }
]