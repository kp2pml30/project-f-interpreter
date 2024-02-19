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
            },
        }
    ],
    "ignorePatterns": ["**/*.js", "test/**/*.ts", "src/parser.ts", "src/index.ts"],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/indent": ["error", "tab"],
        "no-tabs": "off",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-extraneous-class": "off",
    }
}
