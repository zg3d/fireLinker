const linkReg = require('./linkParser');
const Link = require('../classes/Link');
const StatusEnum = require('../classes/Status');
const linkchecker = require('./checker');
const URLS = require('../classes/Url');

const dataProccessing = async (data, ignoreData = null, json = false) => {
  // processDocument
  if (data == null) {
    return;
  }

  try {
    if (ignoreData != null) {
      ignoreData = ignoreData.replace(/^#.*(\r?\n|\r)/gim, '');

      const ignorePatterns = [];

      // loops through all 'linkReg' matches and pushes to an array of regexes
      ignoreData.match(linkReg).forEach((url) => {
        const retainDotsUrl = url.replace(/\./gim, '\\.');
        ignorePatterns.push(new RegExp(retainDotsUrl + '.*(\r?\n|\r)?', 'gim'));
      });

      ignorePatterns.forEach((regex) => (data = data.replace(regex, '')));
    }

    const links = [...new Set(data.match(linkReg))].map((e) => new Link(e, StatusEnum.unknown)); // maps all url into a Link class
    await Promise.all(links.map(linkchecker)); // waits for all the promises to return

    if (json) {
      console.log(JSON.stringify(URLS));
    } else {
      URLS.forEach((e) => e.log());
    }
  } catch (e) {
    `${e}`;
  }
};
module.exports = dataProccessing;
