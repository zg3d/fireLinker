#!/usr/bin/env node
const yargs = require("yargs");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const chalk = require("chalk");
const path = require("path");
const ora = require('ora');
const AbortController = require("abort-controller");
const { link } = require("fs");

const controller = new AbortController();
/* const timeout = setTimeout(() => {
  controller.abort();
}, 150); */
const link_reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const URLS = [];
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

  log() {
    switch (this.status) {
      case StatusEnum.good:
        console.log(chalk.green(this.toString()));
        break;
      case StatusEnum.bad:
        console.log(chalk.red(this.toString()));
        break;
      case StatusEnum.unknown:
        console.log(chalk.grey(this.toString()));
        break;
      default:
    }
  }
}

const linkchecker = (link) => {
  // needed to make it async in order to implement node-fetch signal
  //processes Links

  return new Promise((resolve, reject) =>
    fetch(link.url, {
      method: "HEAD",
      signal: controller.signal,
    })
      .then((res) => {
        switch (res.status) {
          case 200:
            link.status = StatusEnum.good;
            break;
          case 400:
          case 410:
          case 404:
            link.status = StatusEnum.bad;
            break;
          default:
        }
        URLS.push(link);
        resolve(res.status);
      })
      .catch((e) => {
        
        link.status = StatusEnum.bad;
        URLS.push(link);
        resolve(e);
      })
  );

  // status = res.status;
};

const documentProccessing = async (doc) => {
  //processDocument
  
  try {
    let data = await fs.readFile(path.normalize(doc), "utf8"); // gets the data in the document
    // converts it to a string
    //LINK PROCESSING
    const spin = ora({text:`Fire Linker - checking all links in ${doc}`, spinner:{
      interval: 80, // Optional
      frames: [
        ".",
        "-",
        "–",
        "—",
        "–",
        "-"
      ]
     }}).start();
    let time = new Date();
    let links = [...new Set(data.match(link_reg))].map(
      (e) => new Link(e, StatusEnum.unknown)
    ); // maps all url into a Link class
    await Promise.all(links.map(linkchecker)); // waits for all the promises to return
    spin.stop();
    URLS.forEach(e => e.log());
    time = ((new Date()) - time)/1000;

    console.log(`Fire Linker took ${Math.round(time)} secs to check ${URLS.length} links.`);
   


  } catch (e) {
    console.log(e);
    console.log(chalk.red("The <FILE> is not found"));
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
  documentProccessing(document);
}
