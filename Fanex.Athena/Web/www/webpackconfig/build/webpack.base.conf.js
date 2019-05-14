var path = require('path');
var merge = require('webpack-merge');

var pathConfig = require('../config/path');
var alias = require('../config/alias');
var rules = require('../config/rule');
var pluginGenerator = require('../config/plugin');
var exposeLoader = require('expose-loader');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function generateConfig(environment) {
    var jsPath = `${pathConfig.scriptPaths.build}/${environment}`;
    var cssPath = `${pathConfig.cssPaths.build}/${environment}`;

    var commonConfigs = {
        resolve: {
            alias: alias,
            modules: [
                path.join(__dirname, "www"),
                "node_modules"
           ]
        },
        entry: {
            [`${jsPath}/language`]: pathConfig.scriptPaths.language,
            [`${jsPath}/language-zh-CN`]: pathConfig.scriptPaths.languageCN,
            [`${jsPath}/language-zh-TW`]: pathConfig.scriptPaths.languageTW,
            [`${jsPath}/language-zh-Hans`]: pathConfig.scriptPaths.languageHans,
            [`${jsPath}/pages/home/home`]: pathConfig.scriptPaths.home,
            [`${jsPath}/pages/signin/signin`]: pathConfig.scriptPaths.signin,
            [`${jsPath}/pages/reports/livereport`]: [pathConfig.scriptPaths.livereport],
            [`${jsPath}/pages/reports/livereportmatchlist`]: [pathConfig.scriptPaths.livereportmatchlist],
            [`${jsPath}/pages/reports/licenseewinloss`]: [pathConfig.scriptPaths.licenseewinloss],
            [`${jsPath}/pages/betlist/betlist`]: [pathConfig.scriptPaths.betlist],
            [`${jsPath}/pages/betlist/betlistsimple`]: [pathConfig.scriptPaths.betlistsimple],
            [`${jsPath}/pages/betlist/betlistrunning`]: [pathConfig.scriptPaths.betlistrunning],
            [`${jsPath}/pages/betlist/betlistrunningmultiplebettypes`]: [pathConfig.scriptPaths.betlistrunningmultiplebettypes],
            [`${jsPath}/pages/betlist/betlistcorrectscore`]: [pathConfig.scriptPaths.betlistcorrectscore],
            [`${jsPath}/pages/totalbet/handicapoverunder`]: [pathConfig.scriptPaths.handicapoverunder],
            [`${jsPath}/pages/forecast/ahforecast`]: [pathConfig.scriptPaths.ahforecast],
            [`${jsPath}/pages/totalbet/moneyline`]: [pathConfig.scriptPaths.moneyline],
            [`${jsPath}/pages/totalbet/oddevendrawnodraw`]: [pathConfig.scriptPaths.oddevendrawnodraw],
            [`${jsPath}/pages/totalbet/totalgoal`]: [pathConfig.scriptPaths.totalgoal],
            [`${jsPath}/pages/totalbet/outright`]: [pathConfig.scriptPaths.outright],
            [`${jsPath}/pages/totalbet/halftimefulltime`]: [pathConfig.scriptPaths.halftimefulltime],
            [`${jsPath}/pages/totalbet/firstgoallastgoal`]: [pathConfig.scriptPaths.firstgoallastgoal],
            [`${jsPath}/pages/totalbet/homedrawawaynobet`]: [pathConfig.scriptPaths.homedrawawaynobet],
            [`${jsPath}/pages/forecast/forecastonextwo`]: [pathConfig.scriptPaths.forecastonextwo],
            [`${jsPath}/pages/forecast/forecasthdpou`]: [pathConfig.scriptPaths.forecasthdpou],
            [`${jsPath}/pages/forecast/newforecasthdpou`]: [pathConfig.scriptPaths.newforecasthdpou],
            [`${jsPath}/pages/reports/settledmatchcount`]: [pathConfig.scriptPaths.settledmatchcount],
            [`${jsPath}/pages/reports/weeklylivematch`]: [pathConfig.scriptPaths.weeklylivematch],
            [`${jsPath}/pages/reports/turnover`]: [pathConfig.scriptPaths.turnover],
            [`${jsPath}/pages/reports/result`]: [pathConfig.scriptPaths.result],
            [`${jsPath}/pages/reports/cashoutwinloss`]: [pathConfig.scriptPaths.cashoutwinloss],
            [`${jsPath}/pages/reports/winlossbyproduct`]: [pathConfig.scriptPaths.winlossbyproduct],
            [`${jsPath}/pages/reports/winlossbyleague`]: [pathConfig.scriptPaths.winlossbyleague],
            [`${jsPath}/pages/reports/matchwinloss`]: [pathConfig.scriptPaths.matchwinloss],
            [`${jsPath}/pages/reports/platformwinloss`]: [pathConfig.scriptPaths.platformwinloss],
            [`${jsPath}/pages/reports/winlossbybettype`]: [pathConfig.scriptPaths.winlossbybettype],
            [`${jsPath}/pages/betlist/lastbetmonitoring`]: [pathConfig.scriptPaths.lastbetmonitoring],
            [`${jsPath}/pages/customer/commgrouplist`]: [pathConfig.scriptPaths.customercommgrouplist],
            [`${jsPath}/pages/customer/commgroupadd`]: [pathConfig.scriptPaths.customercommgroupadd],
            [`${jsPath}/pages/customer/commgroupedit`]: [pathConfig.scriptPaths.customercommgroupedit],
            [`${jsPath}/pages/customer/loginlog`]: [pathConfig.scriptPaths.loginlog],
            [`${jsPath}/pages/customer/customerlist`]: [pathConfig.scriptPaths.customerlist],
            [`${jsPath}/pages/customer/customersetting`]: [pathConfig.scriptPaths.customersetting],
            [`${jsPath}/pages/customer/groupcommission`]: [pathConfig.scriptPaths.groupcommission],
            [`${jsPath}/pages/betlist/customeroutstanding`]: [pathConfig.scriptPaths.customeroutstanding],
            [`${jsPath}/pages/customer/rngcasinobetsetting`]: [pathConfig.scriptPaths.rngcasinobetsetting],
            [`${jsPath}/pages/customer/betsettingmain`]: [pathConfig.scriptPaths.betsettingmain],
            [`${jsPath}/pages/customer/betsettingbygroup`]: [pathConfig.scriptPaths.betsettingbygroup],
            [`${jsPath}/pages/customer/dcsbetsetting`]: [pathConfig.scriptPaths.dcsbetsetting],
            [`${jsPath}/pages/customer/thirdpartybetsetting`]: [pathConfig.scriptPaths.thirdpartybetsetting],
            [`${jsPath}/pages/customer/kenobetsetting`]: [pathConfig.scriptPaths.kenobetsetting],
            [`${jsPath}/pages/customer/numbergamebetsetting`]: [pathConfig.scriptPaths.numbergamebetsetting],
            [`${jsPath}/pages/customer/exchangebetsetting`]: [pathConfig.scriptPaths.exchangebetsetting],

            [`${jsPath}/pages/reports/activecustomersummary`]: [pathConfig.scriptPaths.activecustomersummary],
            [`${jsPath}/pages/reports/agcasinowinloss`]: [pathConfig.scriptPaths.agcasinowinloss],
            [`${jsPath}/pages/reports/customerbalance`]: [pathConfig.scriptPaths.customerbalance],
            [`${jsPath}/pages/reports/golddeluxewinloss`]: [pathConfig.scriptPaths.golddeluxewinloss],
            [`${jsPath}/pages/reports/colossusbetswinloss`]: [pathConfig.scriptPaths.colossusbetswinloss],
            [`${jsPath}/pages/reports/customerpendingfunds`]: [pathConfig.scriptPaths.customerpendingfunds],
            [`${jsPath}/pages/reports/customerturnover`]: [pathConfig.scriptPaths.customerturnover],
            [`${jsPath}/pages/reports/customerwinloss`]: [pathConfig.scriptPaths.customerwinloss],

            [`${cssPath}/pages/reports/reportjqgridlayout`]: pathConfig.cssPaths.reportjqgridlayout,
            [`${cssPath}/pages/reports/livereport`]: pathConfig.cssPaths.livereport,
            [`${cssPath}/main`]: pathConfig.cssPaths.main,
            [`${cssPath}/pages/utility/error`]: pathConfig.cssPaths.error,
            [`${cssPath}/home`]: pathConfig.cssPaths.home,
            [`${cssPath}/um`]: pathConfig.cssPaths.um,
            [`${cssPath}/pages/login/login`]: pathConfig.cssPaths.login,
            [`${cssPath}/pages/reports/licenseewinloss`]: pathConfig.cssPaths.licenseewinloss,

            [`${cssPath}/pages/betlist/betlistLayout`]: pathConfig.cssPaths.betlistLayout,
            [`${cssPath}/pages/betlist/betlistSimpleLayout`]: pathConfig.cssPaths.betlistSimpleLayout,
            [`${cssPath}/pages/betlist/betlistResult`]: pathConfig.cssPaths.betlistResult,
            [`${cssPath}/pages/betlist/colossusbetdetail`]: pathConfig.cssPaths.colossusbetdetail,
            [`${cssPath}/pages/betlist/systemparlaydetail`]: pathConfig.cssPaths.systemparlaydetail,

            [`${cssPath}/pages/totalbet/totalbetlayout`]: pathConfig.cssPaths.totalbetlayout,
            [`${cssPath}/pages/forecast/ahforecast`]: pathConfig.cssPaths.ahforecast,
            [`${cssPath}/pages/forecast/forecastonextwo`]: pathConfig.cssPaths.forecastonextwo,
            [`${cssPath}/pages/totalbet/mixparlay`]: pathConfig.cssPaths.mixparlay,
            [`${cssPath}/pages/forecast/newforecast`]: pathConfig.cssPaths.newforecast,
            [`${cssPath}/pages/reports/settledmatchcount`]: pathConfig.cssPaths.settledmatchcount,
            [`${cssPath}/pages/reports/weeklylivematch`]: pathConfig.cssPaths.weeklylivematch,
            [`${cssPath}/pages/reports/turnover`]: pathConfig.cssPaths.turnover,
            [`${cssPath}/pages/reports/result`]: pathConfig.cssPaths.result,
            [`${cssPath}/pages/reports/cashoutwinloss`]: pathConfig.cssPaths.cashoutwinloss,
            [`${cssPath}/pages/betlist/cashouthistory`]: pathConfig.cssPaths.cashouthistory,
            [`${cssPath}/pages/reports/winlossbyproduct`]: pathConfig.cssPaths.winlossbyproduct,
            [`${cssPath}/pages/reports/winlossbyleague`]: pathConfig.cssPaths.winlossbyleague,
            [`${cssPath}/pages/reports/matchwinloss`]: pathConfig.cssPaths.matchwinloss,
            [`${cssPath}/pages/reports/platformwinloss`]: pathConfig.cssPaths.platformwinloss,
            [`${cssPath}/pages/reports/winlossbybettype`]: pathConfig.cssPaths.winlossbybettype,
            [`${cssPath}/pages/betlist/lastbetmonitoring`]: pathConfig.cssPaths.lastbetmonitoring,
            [`${cssPath}/pages/customer/commgrouplist`]: pathConfig.cssPaths.customercommgrouplist,
            [`${cssPath}/pages/customer/commgroupdetail`]: pathConfig.cssPaths.customercommgroupdetail,
            [`${cssPath}/pages/customer/customerlog`]: pathConfig.cssPaths.customerlog,
            [`${cssPath}/pages/customer/customerlist`]: pathConfig.cssPaths.customerlist,
            [`${cssPath}/pages/betlist/customeroutstanding`]: pathConfig.cssPaths.customeroutstanding,
            [`${cssPath}/pages/customer/betsetting`]: pathConfig.cssPaths.betsetting,
            [`${cssPath}/pages/utility/licenseelist`]: pathConfig.cssPaths.licenseelist,
            [`${cssPath}/pages/reports/activecustomersummary`]: pathConfig.cssPaths.activecustomersummary,
            [`${cssPath}/pages/reports/agcasinowinloss`]: pathConfig.cssPaths.agcasinowinloss,
            [`${cssPath}/pages/reports/customerbalance`]: pathConfig.cssPaths.customerbalance,
            [`${cssPath}/pages/reports/golddeluxewinloss`]: pathConfig.cssPaths.golddeluxewinloss,
            [`${cssPath}/pages/reports/colossusbetswinloss`]: pathConfig.cssPaths.colossusbetswinloss,
            [`${cssPath}/pages/reports/customerpendingfunds`]: pathConfig.cssPaths.customerpendingfunds,
            [`${cssPath}/pages/reports/customerturnover`]: pathConfig.cssPaths.customerturnover,
            [`${cssPath}/pages/reports/customerwinloss`]: pathConfig.cssPaths.customerwinloss
        },
        output: {
            path: pathConfig.projectRoot,
            filename: "[name].chunk.js"
        },
        module: {
            rules: rules.commonRules
        },
        plugins: pluginGenerator(environment),
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            children: false
        },
        optimization: {
            minimizer: [
             new UglifyJsPlugin({
                    sourceMap: true
                })
            ],
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 0,
                minChunks: 2,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    // disable default cache group
                    default: false,
                    vendors: false,
                    common: {
                       name: `${jsPath}/pages/lib/common`,
                       test: /(node_modules|www[\\/]js[\\/]source[\\/]vendors|www[\\/]js[\\/]source[\\/]common)/,
                       minChunks: 2,
                       priority: -10
                    },
                    jqgrid: {
                        name: `${jsPath}/pages/lib/jqgrid`,
                        test: /(www[\\/]js[\\/]source[\\/]lib[\\/]jqgrid)/,
                        minChunks: 2,
                        priority: -15
                    }
                }
            }
        }
    };

    return commonConfigs;
}

module.exports = generateConfig;