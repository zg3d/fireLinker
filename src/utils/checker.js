const URLS = require('../classes/Url');
const StatusEnum = require('../classes/Status');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');

const linkchecker = (link) => {
  // needed to make it async in order to implement node-fetch signal
  // processes Links

  return new Promise((resolve) =>
    fetch(link.url, {
      method: 'HEAD',
      signal: new AbortController().signal,
    })
      .then((res) => {
        link.code = res.status + '';
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

module.exports = linkchecker;
