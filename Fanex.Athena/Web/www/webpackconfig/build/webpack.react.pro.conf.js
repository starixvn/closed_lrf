var merge = require('webpack-merge');
var utils = require('./utils');
var baseWebpackConfigGenerator = require('./webpack.react.base.conf');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var pathConfig = require('../config/pathReact');
var environment = "pro";
var baseConfigs = baseWebpackConfigGenerator(environment);

var cssRootPath = `${pathConfig.cssPaths.build}/${environment}/reactpages`;
var jsRootPath = `${pathConfig.scriptPaths.build}/${environment}/reactpages`;
module.exports = merge(baseConfigs,
    utils.setDefinePlugin('process.env.NODE_ENV', 'production'),
    {
        mode: 'production',
        watch: false,
        plugins: [
            new CleanWebpackPlugin([`${jsRootPath}/`], {
                root: process.cwd()               
            }),
            new CleanWebpackPlugin([`${cssRootPath}/*.css`, `${cssRootPath}/*.map`, `${cssRootPath}/*.js`], {
                root: process.cwd()               
            }),
            new CleanWebpackPlugin([`${cssRootPath}/pages/*/*.css`, `${cssRootPath}/pages/*/*.js`, `${cssRootPath}/pages/*/*.map`], {
                root: process.cwd()             
            })
        ]
    },
    utils.extractCSS(true)
);