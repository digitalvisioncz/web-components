import atomico from '@atomico/vite';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vite';
import path from 'node:path';
import {globSync} from 'glob';

export default defineConfig({
    build: {
        target: 'modules',
        cssMinify: 'lightningcss',
        minify: true,
        outDir: '../dist',
        rollupOptions: {
            input: Object.fromEntries(
                globSync('src/components/**/index.ts').map(file => [
                    path
                        .relative('src/components', path.dirname(file))
                        .replace(/\\/g, '/'), path.resolve(file),
                ]),
            ),
            output: {
                format: 'es',
                dir: '../dist',
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
                chunkFileNames: 'chunks/[name].js',
            },
            preserveEntrySignatures: 'strict',
        },
        lib: {
            entry: globSync('src/components/**/index.ts'),
            formats: ['es'],
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
    customElements: {
        define: ['src/components/**/*'],
    },
    plugins: [atomico({}), svgr()],
});
