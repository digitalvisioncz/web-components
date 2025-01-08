import {StorybookConfig} from '@storybook/web-components-vite';
import {dirname, join} from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import atomico from '@atomico/vite';

const config: StorybookConfig = {
    stories: [
        '../components/**/*.docs.mdx',
        '../components/**/*.stories.@(js|jsx|ts|tsx)',
        '../components/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-coverage',
        '@storybook/addon-docs',
    ],
    docs: {
        autodocs: 'tag',
    },
    core: {
        builder: '@storybook/builder-vite',
    },
    framework: {
        name: '@storybook/web-components-vite', // getAbsolutePath('@storybook/web-components-vite'),
        options: {},
    },
    async viteFinal(config: any) {
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
};

function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')));
}

export default config;