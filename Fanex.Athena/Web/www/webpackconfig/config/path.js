var path = require('path');

var projectRoot = path.resolve(__dirname, '../../../');

var cssPaths = {
    build: "www/css/build",

    home: ["./www/css/source/pages/home/home.scss"],
    main: ["./www/css/source/main.scss"],
    error: ["./www/css/source/pages/utility/error.scss"],
    um: ["./www/css/source/pages/utility/um.scss"],

    reportjqgridlayout: ["./www/css/source/pages/common/reportjqgridlayout.main.scss"],
    betlistLayout: ["./www/css/source/pages/betlist/betlistcommon.main.scss"],
    betlistSimpleLayout: ["./www/css/source/pages/betlist/betlistcommon.main.scss", "./www/css/source/extensions/popup-ex.scss"],

    totalbetlayout: ["./www/css/source/pages/totalbet/totalbet.scss"],

    colossusbetdetail: ["./www/css/source/pages/betlist/colossusbetdetail.scss"],
    systemparlaydetail: ["./www/css/source/pages/betlist/systemparlaydetail.scss"],

    betlistResult: ["./www/css/source/pages/betlist/result/betlist.result.scss"],

    login: ["./www/css/source/pages/login/login-ex.scss"],
    livereport: ["./www/css/source/pages/report/livereport.scss"],
    licenseewinloss: ["./www/css/source/pages/report/licenseewinloss.scss"],

    ahforecast: ["./www/css/source/pages/forecast/forecast.ah.scss"],
    mixparlay: ["./www/css/source/pages/totalbet/mixparlay.scss"],
    forecastonextwo: ["./www/css/source/pages/forecast/forecastonextwo.scss"],
    newforecast: ["./www/css/source/pages/forecast/newforecast.scss"],

    settledmatchcount: ["./www/css/source/pages/report/settledmatchcount.scss"],
    weeklylivematch: ["./www/css/source/pages/report/weeklylivematch.scss"],
    turnover: ["./www/css/source/pages/report/turnover.scss"],
    result: ["./www/css/source/pages/report/result.scss"],
    cashoutwinloss: ["./www/css/source/pages/report/cashoutwinloss.scss"],
    cashouthistory: ["./www/css/source/pages/betlist/cashouthistory.main.scss", "./www/css/source/extensions/popup-ex.scss"],

    winlossbyproduct: ["./www/css/source/pages/report/winlossbyproduct.scss"],
    winlossbyleague: ["./www/css/source/pages/report/winlossbyleague.scss"],
    matchwinloss: ["./www/css/source/pages/report/matchwinloss.scss"],
    platformwinloss: ["./www/css/source/pages/report/platformwinloss.scss"],
    winlossbybettype: ["./www/css/source/pages/report/winlossbybettype.scss"],
    lastbetmonitoring: ["./www/css/source/pages/betlist/lastbetmonitoring.scss"],
    customercommgrouplist: ["./www/css/source/pages/customer/commgrouplist.scss"],
    customercommgroupdetail: ["./www/css/source/pages/customer/commgrouplist-detail.scss"],
    customerlog: ["./www/css/source/pages/customer/customerlog.scss"],
    customerlist: ["./www/css/source/pages/customer/customerlist.scss"],
    customeroutstanding: ["./www/css/source/pages/betlist/customeroutstanding.scss"],
    betsetting: ["./www/css/source/pages/customer/betsetting.scss"],
    licenseelist: ["./www/css/source/pages/utility/licenseelist.scss"],
    activecustomersummary: ["./www/css/source/pages/report/activecustomersummary.scss"],
    agcasinowinloss: ["./www/css/source/pages/report/agcasinowinloss.scss"],
    customerbalance: ["./www/css/source/pages/report/customerbalance.scss"],
    golddeluxewinloss: ["./www/css/source/pages/report/golddeluxewinloss.scss"],
    colossusbetswinloss: ["./www/css/source/pages/report/colossusbetswinloss.scss"],
    customerpendingfunds: ["./www/css/source/pages/report/customerpendingfunds.scss"],
    customerturnover: ["./www/css/source/pages/report/customerturnover.scss"],
    customerwinloss: ["./www/css/source/pages/report/customerwinloss.scss"]
};

var scriptPaths = {
    build: "www/js/build",

    language: "common/languages/ViewResources.js",
    languageCN: "common/languages/ViewResources.zh-CN.js", 
    languageTW: "common/languages/ViewResources.zh-TW.js", 
    languageHans: "common/languages/ViewResources.zh-Hans.js",
    home: ["./www/js/source/components/navbar.js", "./www/js/source/components/sidebar.js", "malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js", "./www/js/source/pages/home/main.js"],
    signin: ["./www/js/source/pages/signin/main.js"],

    livereport: "./www/js/source/pages/report/livereport/main-livereport.js",
    livereportmatchlist: "./www/js/source/pages/report/livereport/main-matchlist.js",
    licenseewinloss: "./www/js/source/pages/report/licenseewinloss/main.js",
    betlist: "./www/js/source/pages/betlist/betlist.js",
    betlistsimple: "./www/js/source/pages/betlist/main-simple.js",
    betlistrunning: "./www/js/source/pages/betlist/main-betlistrunning.js",
    betlistrunningmultiplebettypes: "./www/js/source/pages/betlist/main-betlistrunning.multiplebettypes.js",
    betlistcorrectscore: "./www/js/source/pages/betlist/main-betlistcorrectscore.js",

    handicapoverunder: "./www/js/source/pages/totalbet/handicapoverunder/main.js",
    ahforecast: "./www/js/source/pages/forecast/forecast.ah.main.js",
    moneyline: "./www/js/source/pages/totalbet/moneyline/main.js",
    oddevendrawnodraw: "./www/js/source/pages/totalbet/oddevendrawnodraw/main.js",
    totalgoal: "./www/js/source/pages/totalbet/totalgoal/main.js",
    outright: "./www/js/source/pages/totalbet/outright/main.js",
    halftimefulltime: "./www/js/source/pages/totalbet/halftimefulltime/main.js",
    firstgoallastgoal: "./www/js/source/pages/totalbet/firstgoallastgoal/main.js",
    homedrawawaynobet: "./www/js/source/pages/totalbet/homedrawawaynobet/main.js",
    forecastonextwo: "./www/js/source/pages/forecast/forecast.onextwo.main.js",
    forecasthdpou: "./www/js/source/pages/forecast/forecast.handicapoverunder.main.js",
    newforecasthdpou: "./www/js/source/pages/forecast/forecast.newforecasthdpou.main.js",

    settledmatchcount: "./www/js/source/pages/report/settledmatchcount/main-settledmatchcount.js",
    weeklylivematch: "./www/js/source/pages/report/weeklylivematch/main-weeklylivematch.js",
    turnover: "./www/js/source/pages/report/turnover/main.js",
    result: "./www/js/source/pages/report/result/main-result.js",
    cashoutwinloss: "./www/js/source/pages/report/cashoutwinloss/main.js",

    winlossbyproduct: "./www/js/source/pages/report/winlossbyproduct/main-winlossbyproduct.js",
    winlossbyleague: "./www/js/source/pages/report/winlossbyleague/main.js",
    matchwinloss: "./www/js/source/pages/report/matchwinloss/main.js",
    platformwinloss: "./www/js/source/pages/report/platformwinloss/main-platformwinloss.js",
    winlossbybettype: "./www/js/source/pages/report/winlossbybettype/main.js",
    lastbetmonitoring: "./www/js/source/pages/betlist/lastbetmonitoring/main.js",
    customercommgrouplist: "./www/js/source/pages/customer/customercomm/main-commgrouplist.js",
    customercommgroupadd: "./www/js/source/pages/customer/customercomm/main-commgroupadd.js",
    customercommgroupedit: "./www/js/source/pages/customer/customercomm/main-commgroupedit.js",
    customerlist: "./www/js/source/pages/customer/customerlist/main.js",
    loginlog: "./www/js/source/pages/customer/customerlog/loginlog/main.js",
    customersetting: "./www/js/source/pages/customer/customerlog/customersetting/main.js",
    groupcommission: "./www/js/source/pages/customer/customerlog/groupcommission/main.js",
    customeroutstanding: "./www/js/source/pages/betlist/customer/main.js",
    rngcasinobetsetting: "./www/js/source/pages/customer/betsetting/main-rngcasino.js",
    betsettingmain: "./www/js/source/pages/customer/betsetting/main-betsetting.js",
    betsettingbygroup: "./www/js/source/pages/customer/betsetting/main-betsettingbygroup.js",
    dcsbetsetting: "./www/js/source/pages/customer/betsetting/main-dcsbetsetting.js",
    thirdpartybetsetting: "./www/js/source/pages/customer/betsetting/main-thirdparty.js",
    kenobetsetting: "./www/js/source/pages/customer/betsetting/main-keno.js",
    numbergamebetsetting: "./www/js/source/pages/customer/betsetting/main-numbergame.js",
    exchangebetsetting: "./www/js/source/pages/customer/betsetting/main-exchange.js",

    activecustomersummary: "./www/js/source/pages/report/activecustomersummary/main.js",
    agcasinowinloss: "./www/js/source/pages/report/agcasinowinloss/main.js",
    customerbalance: "./www/js/source/pages/report/customerbalance/main.js",
    golddeluxewinloss: "./www/js/source/pages/report/thirdpartywinloss/main-golddeluxewinloss.js",
    colossusbetswinloss: "./www/js/source/pages/report/thirdpartywinloss/main-colossusbetswinloss.js",
    customerpendingfunds: "./www/js/source/pages/report/customerpendingfunds/main.js",
    customerturnover: "./www/js/source/pages/report/customerturnover/main.js",
    customerwinloss: "./www/js/source/pages/report/customerwinloss/main.js"
};

module.exports = {
    projectRoot: projectRoot,
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};