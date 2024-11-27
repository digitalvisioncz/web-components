import {defineConfig} from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'DVDEV Components',
    description: 'A collection of web components for building modern web applications.',
    themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'}, {text: 'Components', link: '/components/'},
            // {text: 'Examples', link: '/examples'},
        ],

        sidebar: {

            '/components/': [
                {
                    text: 'Components',
                    items: [{text: 'Overview', link: '/components/'}, {text: 'WorldMap', link: '/components/world-map'}],
                },
            ],
            /*
             * '/examples/': [
             *     {
             *         text: 'Examples',
             *         items: [{text: 'WorldMap', link: '/examples/world-map'}],
             *     },
             * ],
             */
        },

        socialLinks: [{icon: 'github', link: 'https://github.com/digitalvisioncz/web-components'}],
    },

    head: [],
});
