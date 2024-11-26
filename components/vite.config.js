import atomico from '@atomico/vite';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vite';
import {
    extname,
    relative,
} from 'path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';

export default defineConfig({
    build: {
        target: 'modules',
        cssMinify: 'lightningcss',
        minify: true,
        outDir: '../dist',
        rollupOptions: {
            input: Object.fromEntries(
                glob.sync('src/components/**/*.{ts,tsx}', {
                    ignore: ['src/components/**/*.d.ts'],
                }).map(file => [
                    relative(
                        'src/components',
                        file.slice(0, file.length - extname(file).length),
                    ), fileURLToPath(new URL(file, import.meta.url)),
                ]),
            ),
            output: {
                assetFileNames: 'assets/[name][extname]',
                entryFileNames: '[name].js',
            },
        },
    },
    css: {
        transformer: 'lightningcss',
        lightningcss: {
            drafts: {
                customMedia: true,
            },
        },
    },
    plugins: [atomico({}), svgr()],
});
