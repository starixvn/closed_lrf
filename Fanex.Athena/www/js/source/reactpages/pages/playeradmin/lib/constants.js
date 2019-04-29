export const mode = {
    self: 'Self',
    appraisal: 'Appraisal'
}

export const currentMode = window.__lrf && window.__lrf.modules &&
    window.__lrf.modules.playerAdmin && window.__lrf.modules.playerAdmin.mode;

export const playerMenuList = [
    { key: 'playerAccountInfo', text: 'Account Info', url: 'PlayerAdmin/PlayerAccountInfo' },
    { key: 'playerStatement', text: 'Statement', url: 'PlayerAdmin/PlayerStatement' },
    { key: 'playerBetList', text: 'Bet List', url: 'PlayerAdmin/PlayerBetList' },
    { key: 'playerTransferFund', text: 'Transfer Funds', url: 'PlayerAdmin/PlayerTransferFund' },
]