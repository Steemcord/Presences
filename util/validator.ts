import * as fs from 'fs';
import { validate } from 'jsonschema';
import { green, yellow, red, blue } from 'chalk';
import { transpileModule } from 'typescript';
import fetch from 'node-fetch';
import { NodeVM } from 'vm2';
import { uniq } from 'lodash';
import { sync as glob } from 'glob';

// Create a mock Presence to validate criteria
class MockPresence {
  clientIDCheck = false;
  eventCountCheck = false;

  constructor(opts: { clientID: string; module: NodeModule; }) {
    if (opts.clientID)
      this.clientIDCheck = true;
    if(opts.module)
      opts.module.exports = this;
  }

  on() {
    this.eventCountCheck = true;
  }
}

const METADATA_SCHEMA = 'https://snazzah.com/steemcord-schema/1.json';
const metaFiles = fs.existsSync('./file_changes.txt')
  ? uniq(fs.readFileSync('./file_changes.txt', 'utf-8')
    .trim().split('\n')
    .filter((f: string) => f.endsWith('metadata.json') || f.endsWith('index.ts'))
    .map(f => {
      // Includes changed index.ts files into the mix
      if (f.endsWith('index.ts')) f = f.replace('/metadata.json', '/index.ts');
      return f;
    }))
  : glob('./presences/*/*/metadata.json', {
    ignore: ['**/node_modules/**', '**/@types/**'],
    absolute: true
  });
const vm = new NodeVM({
    console: 'inherit',
    sandbox: { Presence: MockPresence },
    require: {
      external: false
    }
  });

vm.freeze('1.0.0-schemaValidation', 'STEEMCORD_VERSION');

let validated = 0,
  validatedWithWarnings = 0,
  failedToValidate = 0;
const good = (meta: MinimalMetadata): void => {
    console.log(green(`✔ ${meta.name} v${meta.version} (${meta.app_id})`));
    validated++;
  },
  warn = (meta: MinimalMetadata, warning: string): void => {
    console.log(yellow(`✔ ${meta.name} v${meta.version} (${meta.app_id}) - ${warning}`));
    validatedWithWarnings++;
  },
  fail = (meta: MinimalMetadata, errors: string[]): void => {
    console.log(
      red(`✘ ${meta.name} v${meta.version} (${meta.app_id})\n${errors.map((e) => `  -> ${e}`).join('\n')}`)
    );
    failedToValidate++;
  },
  loadMetadata = (path: string): MinimalMetadata =>
    JSON.parse(fs.readFileSync(path, 'utf-8'));

(async (): Promise<void> => {
  console.log(blue('Getting latest schema...'));

  const schema = await fetch(METADATA_SCHEMA).then(r => r.json());

  for (const metaFile of metaFiles) {
    const meta = loadMetadata(metaFile),
      result = validate(meta, schema),
      errors: string[] = [],
      warnings: string[] = [];

    // Check metadata
    if (!result.valid) {
      for (const error of result.errors)
        errors.push(`Metadata: ${error.message} @ ${error.property}`);
    } else if (meta.$schema && meta.$schema !== METADATA_SCHEMA)
      warnings.push('Schema out of date');
  
    // Check module
    const moduleFile = metaFile.replace('/metadata.json', '/index.ts');
    if (fs.existsSync(moduleFile)) {
      const presence: MockPresence = vm.run(transpileModule(fs.readFileSync(metaFile.replace('/metadata.json', '/index.ts'), 'utf8'), {}).outputText);
      
      if (!presence || presence.constructor.name !== 'MockPresence')
        errors.push('Module: Export is not a Presence.');
      else {
        if (!presence.clientIDCheck)
          errors.push('Module: Presence has no Client ID.');
        if (!presence.eventCountCheck)
          errors.push('Module: Presence has no listeners.');
      }
    } else errors.push('Module: File index.ts does not exist.');

    if (errors.length)
      fail(meta, errors);
    else if (warnings.length)
      warn(meta, warnings.join(', '));
    else good(meta);
  }

  // Print stats
  console.log();
  console.log(
    green(`${validated} fully validated\n`) +
      yellow(`${validatedWithWarnings} validated, but with warnings\n`) +
      red(`${failedToValidate} failed to validate`)
  );
  console.log();

  if (failedToValidate > 0) {
    console.log(red('One or more services failed to validate.'));
    process.exit(-1);
  }

  if (validatedWithWarnings > 0)
    console.log(yellow('One or more services validated, but with warnings.'));
})();

interface MinimalMetadata {
  app_id: number;
  version: string;
  name: string;
  $schema: string;
}