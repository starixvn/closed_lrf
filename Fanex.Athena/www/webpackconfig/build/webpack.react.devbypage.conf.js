const devConfig = require('./webpack.react.dev.conf.js');
var pathConfig = require('../config/pathReact');

var environment = "dev";
var jsPath = `${pathConfig.scriptPaths.build}/${environment}/reactpages`;
var cssPath = `${pathConfig.cssPaths.build}/${environment}/reactpages`;
const entry = {
    [`${jsPath}/playeradmin/playeradmin`]: pathConfig.scriptPaths.playeradmin,
}

const devByPageConfig = {...devConfig, plugins: [], entry};

module.exports = devByPageConfig;