#!/usr/bin/env node
const yargs = require("yargs");
const fs = require("fs");
const fetch = require("node-fetch");
const chalk = require('chalk');
const linkchecker = async (link) => {
  let status = 200;
  try {
    let res = await fetch(link);

    status = res.status;
  } catch (e) {
    status = 999;
  }

  switch (status) {
    case 200:
      console.log(chalk.green(`Link: ${link} status : GOOD`));
      break;
    case 400:
      console.log(chalk.red(`Link: ${link} status : BAD`));
      break;
    case 404:
        console.log(chalk.red(`Link: ${link} status : BAD`));
      break;
    default:
        console.log(chalk.yellow(`Link: ${link} status : Unkown`));
  }

};

const argv = yargs
  .usage(
    "To use this tool type :\n$flink <file> -- where file is the name of the file"
  )
  .demandCommand(1, "").argv;
let document = "";
const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

if (argv._.length > 0) {
  //file procccesing
  document = argv._[0];
  let urls = [];
  fs.readFile(process.cwd() + "/" + document, "utf8", function (err, data) {
    if (err) throw err;
    document = data.toString();
    document.match(link_reg).forEach((e) => {
      linkchecker(e);
    });
  });

  //LINK PROCESSING
}
