module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        // "prettier/@typescript-eslint",
        // "plugin:prettier/recommended",
    ],
    env: {
        browser: true,
        es6: true,
        amd: true,
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
        ecmaVersion: 2020,
        ecmaFeatures: {
            impliedStrict: true,
        },
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    settings: {},
    rules: {
        "array-callback-return": ["error"],
        "arrow-spacing": ["error", { before: true, after: true }],
        "consistent-return": ["error"],
        curly: ["error", "all"],
        "default-case": ["error"],
        "default-param-last": ["error"],
        "dot-location": ["error", "property"],
        "dot-notation": ["error"],
        eqeqeq: ["error"],
        "guard-for-in": ["error"],
        "no-console": ["warn"],
        "no-constant-condition": ["warn"],
        "no-constructor-return": ["error"],
        "no-duplicate-imports": ["error"],
        "no-else-return": ["error"],
        "no-eq-null": ["error"],
        "no-eval": ["error"],
        "no-extend-native": ["error"],
        "no-extra-bind": ["error"],
        "no-extra-label": ["error"],
        "no-floating-decimal": ["error"],
        "no-invalid-this": ["error"],
        "no-label-var": ["error"],
        "no-lone-blocks": ["off"],
        "no-magic-numbers": ["off", { ignoreArrayIndexes: true, ignore: [0, 1, -1], detectObjects: false }],
        "no-multi-spaces": ["error"],
        "no-multi-str": ["error"],
        "no-new-func": ["error"],
        "no-new-wrappers": ["error"],
        "no-new": ["error"],
        "no-param-reassign": ["error"],
        "no-return-assign": ["error"],
        "no-return-await": ["error"],
        "no-self-compare": ["error"],
        "no-shadow": ["error"],
        "no-template-curly-in-string": ["warn"],
        "no-throw-literal": ["error"],
        "no-useless-computed-key": ["error", { enforceForClassMembers: true }],
        "no-useless-concat": ["error"],
        "no-useless-escape": ["error"],
        "no-useless-rename": ["error"],
        "no-useless-return": ["error"],
        "no-var": ["error"],
        "no-void": ["error", { allowAsStatement: true }],
        "object-shorthand": ["error"],
        "prefer-arrow-callback": ["error"],
        "prefer-const": ["error"],
        "prefer-rest-params": ["error"],
        "prefer-spread": ["error"],
        "prefer-template": ["error"],
        radix: ["error"],
        "rest-spread-spacing": ["error", "never"],
        "template-curly-spacing": ["error", "never"],
        "getter-return": ["error"],
        "new-parens": ["error"],
        "no-array-constructor": ["error"],
        "no-caller": ["error"],
        "no-cond-assign": ["error", "except-parens"],
        "no-const-assign": ["error"],
        "no-control-regex": ["error"],
        "no-delete-var": ["error"],
        "no-dupe-args": ["error"],
        "no-dupe-class-members": ["error"],
        "no-dupe-keys": ["error"],
        "no-duplicate-case": ["error"],
        "no-empty-character-class": ["error"],
        "no-empty-pattern": ["error"],
        "no-ex-assign": ["error"],
        "no-fallthrough": ["error"],
        "no-func-assign": ["error"],
        "no-implied-eval": ["error"],
        "no-invalid-regexp": ["error"],
        "no-iterator": ["error"],
        "no-labels": ["error", { allowLoop: false, allowSwitch: false }],
        "no-loop-func": ["error"],
        "no-mixed-operators": [
            "error",
            {
                groups: [
                    ["&", "|", "^", "~", "<<", ">>", ">>>"],
                    ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                    ["&&", "||"],
                    ["in", "instanceof"],
                ],
                allowSamePrecedence: false,
            },
        ],
        "no-native-reassign": ["error"],
        "no-negated-in-lhs": ["error"],
        "no-new-object": ["error"],
        "no-new-symbol": ["error"],
        "no-obj-calls": ["error"],
        "no-octal-escape": ["error"],
        "no-octal": ["error"],
        "no-redeclare": ["error", { builtinGlobals: true }],
        "no-regex-spaces": ["error"],
        "no-restricted-properties": ["error"],
        "no-restricted-syntax": ["error", "WithStatement"],
        "no-script-url": ["error"],
        "no-self-assign": ["error"],
        "no-sequences": ["error"],
        "no-shadow-restricted-names": ["error"],
        "no-sparse-arrays": ["error"],
        "no-this-before-super": ["error"],
        "no-undef": ["error"],
        "no-unreachable": ["error"],
        "no-unused-expressions": [
            "error",
            {
                allowShortCircuit: true,
                allowTernary: true,
                allowTaggedTemplates: true,
            },
        ],
        "no-unused-labels": ["error"],
        "no-use-before-define": [
            "error",
            {
                functions: true,
                classes: true,
                variables: true,
            },
        ],
        "no-useless-constructor": ["error"],
        "no-whitespace-before-property": ["error"],
        "no-with": ["error"],
        "require-yield": ["error"],
        strict: ["error", "safe"],
        "unicode-bom": ["error", "never"],
        "use-isnan": ["error"],
        "valid-typeof": ["error"],

        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: true,
                argsIgnorePattern: "^_",
            },
        ],
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
        "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
        "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true, allowBoolean: true }],
    },
};
