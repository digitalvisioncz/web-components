import dvdevEslint from '@dvdevcz/eslint';

export default [
    ...dvdevEslint.configs.base,
    ...dvdevEslint.configs.react,
    {
        files: ['**/*.tsx'],
        rules: {
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            'react/no-unknown-property': ['error', {ignore: ['shadowDom']}],

        },
    },
];
