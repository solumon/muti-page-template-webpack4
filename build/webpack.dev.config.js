const { resolve } = require('path');
const merge = require('webpack-merge');
const sass = require('sass');
const { DefinePlugin } = require('webpack');
const address = require('address');
const base = require('../webpack.config');

const devtool = 'cheap-module-source-map';
const mode = 'development';
const IP = address.ip();
const PORT = 3000;

const result = merge(base, {
    mode,
    devtool,
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: sass,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            IS_SERVICE: true,
        }),
    ],
    devServer: {
        contentBase: resolve(process.cwd(), './src'),
        publicPath: '/',
        host: IP,
        port: PORT,
        overlay: true, // 浏览器页面上显示错误
        open: false, // 开启浏览器
        hot: true, // 开启热更新
    },
});
module.exports = result;
