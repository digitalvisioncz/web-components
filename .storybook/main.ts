import {dirname, join} from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import atomico from '@atomico/vite';

export default {
    stories: [
        '../components/**/*.docs.mdx',
        '../components/*.docs.mdx',
        '../components/**/*.stories.@(js|jsx|ts|tsx)',
        '../components/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-coverage'),
        getAbsolutePath('@storybook/addon-docs'),
    ],
    core: {
        builder: '@storybook/builder-vite',
    },
    framework: {
        name: getAbsolutePath('@storybook/web-components-vite') as string,
        options: {},
    },
    async viteFinal(config) {
        const {mergeConfig} = await import('vite');

        return mergeConfig(config, {
            define: {
                global: 'window',
            },
            plugins: [
                tsconfigPaths(), atomico({
                    storybook: {
                        include: ['components/**/*'],
                        fullReload: true,
                    },
                    customElements: {
                        define: ['components/**/*'],
                    },
                }),
            ],
            server: {
                host: true,
                open: false,
            },
        });
    },
    docs: {
        autodocs: 'tag',
    },
};

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}
