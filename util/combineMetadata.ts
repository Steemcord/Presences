import * as fs from 'fs';
import { green, blue } from 'chalk';
import { sync as glob } from 'glob';
import { posix } from 'path';

const metaFiles = glob('./presences/*/*/metadata.json', {
  ignore: ['**/node_modules/**', '**/@types/**'],
  absolute: true
});

// Create folder if not found
try {
  fs.accessSync('./_metadata', fs.constants.F_OK);
} catch (e) {
  fs.mkdirSync('./_metadata');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadMetadata = (path: string): any =>
    JSON.parse(fs.readFileSync(path, 'utf-8'));

console.log(blue(`Combining metadata... (${metaFiles.length})`));
const multiMetadata = metaFiles.map(mf => {
  const metadata = loadMetadata(mf);
  const relativeDir = posix.relative(posix.join(__dirname, '..'), posix.join(mf, '..'));
  if(metadata.$schema) delete metadata.$schema;
  const parsedMetadata = {
    ...metadata,
    script_url: encodeURI(`https://raw.githack.com/Steemcord/Presences/master/${relativeDir}/index.ts`),
    update_url: encodeURI(`https://raw.githack.com/Steemcord/Presences/master/_metadata/${metadata.app_id}.json`)
  };
  // Write update file
  fs.writeFileSync(`./_metadata/${metadata.app_id}.json`, JSON.stringify(parsedMetadata));
  console.log(green(`✔ Wrote _metadata/${metadata.app_id}.json (${metadata.name})`));
  return parsedMetadata;
});
fs.writeFileSync('./multi_metadata.json', JSON.stringify(multiMetadata));
console.log(green(`\n\n✔ Wrote ${metaFiles.length} files into multi_metadata.json`));
