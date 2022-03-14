// babel config blog https://my.oschina.net/u/4125329/blog/4916583
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: 3,
            },
        ],
        [
            'syntax-dynamic-import',
        ],
    ],
};
