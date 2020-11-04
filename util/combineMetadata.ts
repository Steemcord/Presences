import * as fs from 'fs';
import { green, blue } from 'chalk';
import { sync as glob } from 'glob';
import { posix } from 'path';

const metaFiles = glob('./presences/*/*/metadata.json', {
  ignore: ['**/node_modules/**', '**/@types/**'],
  absolute: true
});

const loadMetadata = (path: string): { script_url?: string; update_url?: string; } =>
    JSON.parse(fs.readFileSync(path, 'utf-8'));

console.log(blue(`Combining metadata... (${metaFiles.length})`));
const multiMetadata = metaFiles.map(mf => {
  const metadata = loadMetadata(mf);
  const relativeDir = posix.relative(posix.join(__dirname, '..'), posix.join(mf, '..'));
  return {
    ...metadata,
    script_url: encodeURI(`https://raw.githack.com/Steemcord/Presences/master/${relativeDir}/index.ts`),
    update_url: encodeURI(`https://raw.githack.com/Steemcord/Presences/master/${relativeDir}/metadata.json`)
  };
});
fs.writeFileSync('./multi_metadata_result.json', JSON.stringify(multiMetadata));
console.log(green(`✔ Wrote ${metaFiles.length} files into multi_metadata_result.json`));
