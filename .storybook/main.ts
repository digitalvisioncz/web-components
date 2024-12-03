import {dirname, join} from 'path';
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
    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-coverage'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/web-components-vite') as string,
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
            server: {
                host: true,
                open: false,
            },
        });
    },
    docs: {},
};

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}
