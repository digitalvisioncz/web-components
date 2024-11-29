import {mergeConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import atomico from '@atomico/vite';

export default {
    stories: [
        '../components/**/*.stories.mdx',
        '../components/**/*.stories.@(js|jsx|ts|tsx)',
        '../components/*.stories.mdx',
        '../components/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    viteFinal(config) {
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
        });
    },
    docs: {},
};
