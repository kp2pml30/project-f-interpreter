module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": [
        "standard-with-typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "ignorePatterns": ["**/*.js", "test/**/*.ts"],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "switch-exhaustiveness-check": "error"
    }
}
