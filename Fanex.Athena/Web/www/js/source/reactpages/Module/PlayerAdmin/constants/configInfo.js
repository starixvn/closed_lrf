export const mode = {
    self: 'Self',
    parasitic: 'Parasitic'
}

const pageConfig = window._pConfig;

export const currentMode = pageConfig && pageConfig.mode;

export const tokenUrlTemplate = pageConfig && pageConfig.tokenUrl;

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