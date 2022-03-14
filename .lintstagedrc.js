module.exports = {
    'src/**/*.{js,vue}': [
        'npm run eslint:quiet'
    ],
    'src/**/*.{css, scss, vue}': [
        'npm run stylelint:quiet'
    ]
}
