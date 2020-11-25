const fetch = require('node-fetch');
const dataProccessing = require('./dataProccessing');

const apiProccessing = async (api) => {
  try {
    const urlparse = new URL(api);
    const base = urlparse.protocol + '//' + urlparse.host;
    const data = await (await fetch(api)).json();

    const arrayObj = data;
    const urlsToCheck = [];

    arrayObj.forEach((e) => {
      if (e.url) {
        const pat = /^https?:\/\//i;
        if (pat.test(e.url)) {
          urlsToCheck.push(e.url);
        } else {
          urlsToCheck.push(base + e.url);
        }
      }
    });

    urlsToCheck.forEach(async (e) => {
      const data = await (await fetch(e)).text();

      await dataProccessing(data);
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = apiProccessing;
