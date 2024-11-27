import {writeFileSync} from 'fs';
import {globSync} from 'glob';
import path from 'path';

const output = '../dist/index.d.ts';
const componentsPath = '../dist';
const components = globSync(`${componentsPath}/*.js`).map(file => path.basename(file, '.js'));

const declarations = components
    .map(
        component => `
declare module '@dvdevcz/components/${component}' {
    export * from './dist/${component}';
}
`,
    )
    .join('\n');

writeFileSync(output, declarations);
console.log(`Generated ${output} with ${components.length} components.`);
