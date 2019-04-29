var path = require('path');

var projectRoot = path.resolve(__dirname, '../../../');

var cssPaths = {
    build: "www/css/build",
    layout: "./www/css/source/reactpages/main.scss",
    subsidiaryperformance: "./www/css/source/reactpages/pages/subsidiaryperformance/index.scss",
    licenseewlbytimezone: "./www/css/source/reactpages/pages/licenseewl-by-timezone/index.scss",
    notification: "./www/css/source/reactpages/pages/notification/index.scss",
    exchangewl: "./www/css/source/reactpages/pages/exchangewl/index.scss",
    speciallicenseewl: "./www/css/source/reactpages/pages/speciallicenseewl/index.scss",
    bettingticketscenter: "./www/css/source/reactpages/pages/bettingticketscenter/index.scss",
    betlist: "./www/css/source/reactpages/pages/betlist/index.scss",
    casinoturnover: "./www/css/source/reactpages/pages/casinoturnover/index.scss"
};

var scriptPaths = {
    build: "www/js/build",

    languageResource: ["./www/js/source/reactpages/lib/langHelper.js",
        "./www/js/source/common/languages/ViewResources.js",
    ],
    langCN: "./www/js/source/common/languages/ViewResources.zh-CN.js",
    langHans: "./www/js/source/common/languages/ViewResources.zh-Hans.js",
    langTW: "./www/js/source/common/languages/ViewResources.zh-TW.js",
    /*React page*/
    subsidiaryperformance: "./www/js/source/reactpages/pages/subsidiaryperformance/components/index.jsx",
    licenseewlbytimezone: "./www/js/source/reactpages/pages/licenseewl-by-timezone/components/index.jsx",
    notification: "./www/js/source/reactpages/pages/notification/components/resultAmendment/index.jsx",
    exchangewl: "./www/js/source/reactpages/pages/exchangewl/components/index.jsx",
    speciallicenseewl: "./www/js/source/reactpages/pages/speciallicenseewl/components/index.jsx",
    bettingticketscenter_multicustomer: "./www/js/source/reactpages/pages/bettingticketscenter/multicustomer/components/index.jsx",
    bettingticketscenter_singlecustomer: "./www/js/source/reactpages/pages/bettingticketscenter/singlecustomer/components/index.jsx",
    bettingticketscenter_refno: "./www/js/source/reactpages/pages/bettingticketscenter/refno/components/index.jsx",
    bettingticketscenter_running: "./www/js/source/reactpages/pages/bettingticketscenter/running/components/index.jsx",
    casinoturnover: "./www/js/source/reactpages/pages/casinoturnover/components/index.jsx",

    playeradmin: "./www/js/source/reactpages/pages/playeradmin/components/index.jsx"
};
module.exports = {
    projectRoot: projectRoot,
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};