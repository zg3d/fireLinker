#!/usr/bin/env node
const yargs = require("yargs");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const chalk = require("chalk");
const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const StatusEnum = Object.freeze({
  good: "GOOD",
  bad: "BAD",
  unknown: "UNKNOWN",
}); // create a status enumeration

class Link {
  // class for Link with 2 propties Url and status
  constructor(url, status) {
    this.url = url;
    this.status = status;
  }
  toString() {
    return `Link: ${this.url} status : ${this.status}`;
  }
}

const linkchecker = async (link) => {
  //processes Links
  let status = 200;
  try {
    let res = await fetch(link.url);

    status = res.status;
  } catch (e) {
    status = 999;
  }

  switch (status) {
    case 200:
      link.status = StatusEnum.good;
      console.log(chalk.green(link.toString()));
      break;
    case 400:
    case 404:
      link.status = StatusEnum.bad;
      console.log(chalk.red(link.toString()));
      break;
    default:
      console.log(chalk.grey(link.toString()));
  }
};

const documentProccessing = async (doc) => {
  //processDocument
  try {
    let data = await fs.readFile(process.cwd() + "/" + doc, "utf8"); // gets the data in the document
    doc = data.toString(); // converts it to a string

    //LINK PROCESSING
    let links = [];

    new Set(doc.match(link_reg)).forEach((e) => {
      // gets all http/https linnks in the document and create a Link and checks it

      let checkThis = new Link(e, StatusEnum.unknown);
      linkchecker(checkThis);
      links.push(checkThis);
    });
  } catch (e) {
    console.log(e);
  }
};

const argv = yargs
  .usage(
    "To use this tool type :\n$flink <file> -- where file is the name of the file"
  )
  .alias("v", "version")
  .help("h")
  .alias("h", "help")
  .demandCommand(1, "").argv;
let document = "";

if (argv._.length > 0) {
  //file procccesing
  document = argv._[0];
  console.log(document);
  documentProccessing(document);
}
