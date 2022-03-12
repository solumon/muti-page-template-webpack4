const fs = require('fs');
const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ZipPlugin = require('zip-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');
const { name: BookName, version: Version } = require('../package.json');
const base = require('../webpack.config');

const {
    NODE_ENV,
} = process.env;
const isProduction = NODE_ENV !== 'development'; // 最终生成
const devtool = isProduction ? 'none' : 'cheap-module-source-map';
const mode = isProduction ? 'production' : 'development';

// 获取commitId
const getCommitId = () => {
    const path = resolve(process.cwd(), '.git/HEAD');
    if (!fs.existsSync(path)) {
        return '';
    }
    const gitHEAD = fs.readFileSync(path, 'utf-8').trim();
    const ref = gitHEAD.split(': ')[1];
    console.log('ref',ref);
    let commitId = '';
    if (ref) {
        commitId = fs.readFileSync(resolve(process.cwd(), `.git/${ref}`), 'utf-8').trim().substr(0, 8);
    } else {
        commitId = gitHEAD.length > 8 ? gitHEAD.substr(0, 8) : '';
    }
    return commitId;
};

const result = merge(base, {
    mode,
    devtool,
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
        new webpack.DefinePlugin({
            IS_SERVICE: false,
        }),
        new TerserJSPlugin({
            parallel: true,
            cache: true,
        }),
        new ZipPlugin({
            filename: `${BookName}_${Version}_${getCommitId()}.zip`,
        }),
        new MiniCssExtractPlugin(),
    ],
    stats: {
        assets: false,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        warnings: false,
    },
});
module.exports = result;
