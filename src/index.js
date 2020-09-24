#!/usr/bin/env node
const yargs = require("yargs");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const chalk = require("chalk");
const path = require("path");
const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const StatusEnum = Object.freeze({
  good: "GOOD",
  bad: "BAD",
  unknown: "UNKNOWN",
}); // create a status enumeration

class Link {
  // class for Link with 2 properties Url and status
  status = "s";
  constructor(url) {
    this.url = url;
  }
  toString() {
    return `Link: ${this.url} status : ${this.status}`;
  }
}

const linkchecker = (link) => {
  //processes Links
  let status = 999;

  fetch(link.url,{method:'HEAD', timeout: 1500})
    .then((res) => {
      switch (res.status) {
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
          link.status = StatusEnum.unknown;
          console.log(chalk.grey(link.toString()));
      }
    })
    .catch((e) => {
      link.status = StatusEnum.bad;
      console.log(chalk.red(link.toString()));
    });

  // status = res.status;
};

const documentProccessing = async (doc) => {
  //processDocument
  try {
    let data = await fs.readFile(path.normalize(doc), "utf8"); // gets the data in the document
    // converts it to a string
    //LINK PROCESSING
    let links = [...new Set(data.match(link_reg))];
    for (link of links) {
      let checkThis = new Link(link);
      linkchecker(checkThis);

    }
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
