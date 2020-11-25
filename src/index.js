#!/usr/bin/env node
'use strict';
const yargs = require('yargs');
const ora = require('ora');
const dataProccessing = require('./utils/dataProccessing');
const apiProccessing = require('./utils/apiProccesing');
const documentProccessing = require('./utils/documentProccesing');

/* const timeout = setTimeout(() => {
  controller.abort();
}, 150); */

//const URLS = [];

async function start() {
  const argv = yargs
    .usage('To use this tool type :\n$flink <file> -- where file is the name of the file')
    .nargs('j', 1)
    .describe('j', 'output to json')
    .nargs('a', 1)
    .describe('a', 'Check all links in API')
    .alias('a', 'api')
    .alias('j', 'json')
    .alias('v', 'version')
    .alias('i', 'ignore')
    .string('ignore')
    .help('h')
    .alias('h', 'help')
    .demandCommand(0, '').argv;

  if (argv.j || argv._[0] !== undefined || argv.a) {
    const spin = ora({
      text: 'Fire Linker - checking all links',
      spinner: {
        interval: 80, // Optional
        frames: ['.', '-', '–', '—', '–', '-'],
      },
    }).start();
    if (argv.a) {
      const apiUrl = argv.a;
      apiProccessing(apiUrl);
    } else {
      // file procccesing
      let document = '';

      let ignoreFile = '';

      document = argv.j || argv._[0];
      ignoreFile = argv.i !== undefined || argv.i === '' ? argv.i : null;

      dataProccessing(await documentProccessing(document), await documentProccessing(ignoreFile), argv.j);
    }
    spin.stop();
  } else {
    // console.log(yargs.help());

    console.log(`To use this tool type :
    $flink <file> -- where file is the name of the file
    
    Options:
      -j, --json     output to json
      -a, --api      Check all links in API
      -h, --help     Show help                                             [boolean]
      -v, --version  Show version number                                   [boolean]`);
  }
}

start();
// LINK PROCESSING
