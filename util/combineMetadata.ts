import * as fs from 'fs';
import { green, blue } from 'chalk';
import { sync as glob } from 'glob';

const metaFiles = glob('./presences/*/*/metadata.json', {
  ignore: ['**/node_modules/**', '**/@types/**'],
  absolute: true
});

const loadMetadata = (path: string): unknown =>
    JSON.parse(fs.readFileSync(path, 'utf-8'));

console.log(blue(`Combining metadata... (${metaFiles.length})`));
const multiMetadata = metaFiles.map(mf => loadMetadata(mf));
fs.writeFileSync('./multi_metadata.json', JSON.stringify(multiMetadata));
console.log(green(`✔ Wrote ${metaFiles.length} files into multi_metadata.json`));
