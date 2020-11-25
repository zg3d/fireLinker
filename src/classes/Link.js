const StatusEnum = require('./Status.js');
const chalk = require('chalk');

/** This is a Link Class */
class Link {
  constructor(url, status) {
    this.url = url;
    this.status = status;
    this.code = '';
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
module.exports = Link;
