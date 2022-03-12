module.exports = {
    extends: [
        'stylelint-config-recess-order',
        "stylelint-config-standard-scss",
        "stylelint-config-standard-vue/scss"
    ],
    rules: {
        "indentation": 4,
        'scss/at-import-partial-extension': null
    }
};
