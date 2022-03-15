/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const readline = require('readline');
const Webpack = require('webpack');
const address = require('address');
const chalk = require('chalk');
const portfinder = require('portfinder');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.dev.config');

const clear = () => {
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }
};

const IP = address.ip();
portfinder.getPort({
    port: 8080, // minimum port
    stopPort: 9000, // maximum port
}, (err, port) => {
    if (err) {
        console.log('没有获取到可用的端口！');
        return;
    }
    const compiler = Webpack(webpackConfig);
    const devServerOptions = {
        ...webpackConfig.devServer, host: IP, port, stats: 'errors-warnings',
    };
    const server = new WebpackDevServer(compiler, devServerOptions);
    clear();
    server.listen(port, IP, () => {
        console.log();
        console.log('  App running at:');
        const local = `localhost:${port}`;
        const net = `${IP}:${port}`;
        console.log(`  - Local:   ${chalk.cyan(local)}`);
        console.log(`  - Network: ${chalk.cyan(net)}`);
        console.log();
    });
});
