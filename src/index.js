#!/usr/bin/env node
"use strict";
const yargs = require("yargs");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const chalk = require("chalk");
const path = require("path");
const ora = require("ora");
const AbortController = require("abort-controller");



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
let exitCode = 0;
class Link {
  // class for Link with 2 propties Url and status
  constructor(url, status) {
    this.url = url;
    this.status = status;
    this.code = "";
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
      signal: (new AbortController()).signal,
    })
      .then((res) => {
        link.code = res.status + "";
        switch (res.status) {
          case 200:
            link.status = StatusEnum.good;
            break;
          case 400:
          case 410:
          case 404:
            exitCode++;
            link.status = StatusEnum.bad;
            break;
          default:
            exitCode++;
        }
        URLS.push(link);
        resolve(res.status);
      })
      .catch((e) => {
        exitCode++;
        link.status = StatusEnum.bad;
        URLS.push(link);
        resolve(e);
      })
  );

  // status = res.status;
};

const documentProccessing = async (doc, ignoreDoc = null, json) => {
  //processDocument

  try {
    let data = await fs.readFile(path.normalize(doc), "utf8"); // gets the data in the document
    // converts it to a string

    if (ignoreDoc != null) {
      let ignoreData = await fs.readFile(path.normalize(ignoreDoc), "utf8"); // gets the data from the ignored patterns document
      ignoreData = ignoreData.replace(/^#.*(\r?\n|\r)/gim, "");

      let ignorePatterns = [];

      // loops through all 'link_reg' matches and pushes to an array of regexes
      ignoreData.match(link_reg).forEach((url) => {
        let retainDotsUrl = url.replace(/\./gim, "\\.");
        ignorePatterns.push(new RegExp(retainDotsUrl + ".*(\r?\n|\r)?", "gim"));
      });

      ignorePatterns.forEach((regex) => (data = data.replace(regex, "")));
    }

    
    let time = new Date();
    let links = [...new Set(data.match(link_reg))].map(
      (e) => new Link(e, StatusEnum.unknown)
    ); // maps all url into a Link class
    await Promise.all(links.map(linkchecker)); // waits for all the promises to return
    
    if (json) {
      console.log(JSON.stringify(URLS));
    } else {
      URLS.forEach((e) => e.log());
      time = (new Date() - time) / 1000;
      console.log(
        `Fire Linker took ${Math.round(time)} secs to check ${
          URLS.length
        } links.`
      );
    }
  } catch (e) {
    exitCode++;
    console.log(e);
    console.log(chalk.red("The <FILE> is not found"));
  }
  process.exit(exitCode);
};
const apiProccessing = async (api) =>{

  try{
   
    const urlparse =  require('url').parse(api);
    let base = urlparse.protocol + "//" + urlparse.host;
    let data = await (await fetch(api)).json();
  
    let arrayObj = data;
    let urlsToCheck = [];
    
      arrayObj.forEach(e=>{
       
          if(e.url)
          {
            let pat = /^https?:\/\//i;
            if(pat.test(e.url))
            {
              urlsToCheck.push(e.url);
            }
            else{
               urlsToCheck.push(base+e.url);
            }
          }
      });
      let time = new Date();
      let links = [...new Set(urlsToCheck)].map(
        (e) => new Link(e, StatusEnum.unknown)
      ); // maps all url into a Link class
      await Promise.all(links.map(linkchecker)); // waits for all the promises to return
     
   
        URLS.forEach((e) => e.log());
        time = (new Date() - time) / 1000;
        console.log(
          `Fire Linker took ${Math.round(time)} secs to check ${
            URLS.length
          } links.`
        );
    
    
     

  }catch(e){
    console.log(e);
  }
}

function start() {
  const argv = yargs
    .usage(
      "To use this tool type :\n$flink <file> -- where file is the name of the file"
    )
    .nargs("j", 1)
    .describe("j", "output to json")
    .nargs("a", 1)
    .describe("a", "Check all links in API")
    .alias("a","api")
    .alias("j", "json")
    .alias("v", "version")
    .alias("i", "ignore")
    .string("ignore")
    .help("h")
    .alias("h", "help")
    .demandCommand(0, "").argv;
    const spin = ora({
      text: `Fire Linker - checking all links in `,
      spinner: {
        interval: 80, // Optional
        frames: [".", "-", "–", "—", "–", "-"],
      },
    }).start();
  

  if (argv.j || argv._[0] != undefined || argv.a) {
    if(argv.a)
  {
    
    let apiUrl = argv.a;
    apiProccessing(apiUrl);
    spin.stop();
  } else{
    //file procccesing
    let document = "";

    let ignoreFile = "";

    document = argv.j || argv._[0];
    ignoreFile = argv.i != undefined || argv.i == "" ? argv.i : null;
    documentProccessing(document, ignoreFile, argv.j);
    spin.stop();
  }
  } else {
    //console.log(yargs.help());
    spin.stop();
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
//LINK PROCESSING
