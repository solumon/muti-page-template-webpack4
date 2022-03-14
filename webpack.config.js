const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const data = (() => {
    const files = glob.sync('src/pages/*/main.{js|ts}');
    const entry = {};
    const pages = [];
    files.forEach((item) => {
        const name = item.split('/')[2];
        entry[name] = resolve(process.cwd(), item);
        const page = new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: resolve(process.cwd(), `public/pages/${name}.html`),
            chunks: ['vue', 'u3sdk', 'u3flipui', 'vendor', `${name}`],
        });
        pages.push(page);
    });
    return { entry, pages };
})();

module.exports = {
    entry: data.entry,
    output: {
        path: resolve('dist'),
        filename: './js/[name].js',
        chunkFilename: './js/[name].js',
    },
    module: {
        rules: [
            // js
            {
                test: /\.(jsx?)$/,
                use: ['babel-loader'],
                include: /[\\/]src[\\/]/, // 不检查node_modules下的js文件
            },
            {
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [
                                '\\.vue$',
                            ],
                        },
                    },
                ],
            },
            // image
            {
                test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024, // 小于这个时将会已base64位图片打包处理
                        name: './[name].[hash:5].[ext]',
                        outputPath: 'images', // 图片文件输出的文件夹
                    },
                }],
            },
            // fonts
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        outputPath: 'fonts', // 字体文件输出的文件夹
                    },
                }],
            },
            // vue
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
        ],
    },
    plugins: [
        ...data.pages,
        new CleanWebpackPlugin(),
        new ProgressBarPlugin({
            format: '  build [:bar] :percent (:elapsed seconds) ',
        }),
        new VueLoaderPlugin(),
        // 静态资源输出
        new CopyWebpackPlugin([
            {
                from: resolve(process.cwd(), 'src/assets'),
                to: './assets',
                ignore: ['.*', 'scss/**/*'],
            },
            {
                from: resolve(process.cwd(), 'public/config.json'),
                to: './',
                ignore: ['.*'],
            },
            {
                from: resolve(process.cwd(), 'public/favicon.ico'),
                to: './',
                ignore: ['.*'],
            },
        ]),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    minChunks: 1,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                vue: {
                    test: /[\\/]node_modules[\\/]vue/,
                    chunks: 'all',
                    name: 'vue',
                    minChunks: 1,
                    priority: 100,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                u3sdk: {
                    test: /[\\/]node_modules[\\/]@up366[\\/]u3-flip-sdk/,
                    chunks: 'all',
                    name: 'u3sdk',
                    minSize: 0,
                    minChunks: 1,
                    priority: 99,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                u3flipui: {
                    test: /[\\/]node_modules[\\/]@up366[\\/]u3-flip-ui/,
                    chunks: 'all',
                    name: 'u3flipui',
                    minChunks: 2,
                    priority: 99,
                    reuseExistingChunk: true,
                },
                swiper: {
                    test: /[\\/]node_modules[\\/]swiper/,
                    chunks: 'all',
                    name: 'swiper',
                    minChunks: 1,
                    priority: 99,
                    reuseExistingChunk: true,
                },
                echarts: {
                    test: /[\\/]node_modules[\\/]echarts/,
                    chunks: 'all',
                    name: 'echarts',
                    minChunks: 1,
                    priority: 99,
                    reuseExistingChunk: true,
                },
                videojs: {
                    test: /[\\/]node_modules[\\/]video\.js/,
                    chunks: 'all',
                    name: 'videojs',
                    minChunks: 1,
                    priority: 99,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(process.cwd(), 'src'),
            vue$: 'vue/dist/vue.esm.js',
        },
        extensions: ['.js', '.vue', '.json'],
    },
    stats: {
        assets: false,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        warnings: false,
    },
};
