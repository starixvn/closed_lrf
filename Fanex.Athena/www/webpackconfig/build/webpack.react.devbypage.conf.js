var merge = require('webpack-merge');
var utils = require('./utils');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devConfig = require('./webpack.react.dev.conf.js');
var pathConfig = require('../config/pathReact');

var environment = "dev";
var jsPath = `${pathConfig.scriptPaths.build}/${environment}/reactpages`;
var cssPath = `${pathConfig.cssPaths.build}/${environment}/reactpages`;
const entry = {
    [`${jsPath}/playeradmin/playeradmin`]: pathConfig.scriptPaths.playeradmin,
    [`${cssPath}/playeradmin/index`]: pathConfig.cssPaths.playeradmin,
    [`${jsPath}/playeradmin/playeraccountinfo`]: pathConfig.scriptPaths.playeraccountinfo,
}

const devByPageConfig = {...devConfig, entry, plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: '[id].css'})
]};
console.log(devByPageConfig.entry);

module.exports = devByPageConfig;