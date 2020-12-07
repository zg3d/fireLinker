const checker = require('../src/utils/checker');

const URLS = require('../src/classes/Url');
const Link = require('../src/classes/Link');
const Status = require('../src/classes/Status');
jest.mock('node-fetch');
const fetch = require('node-fetch');
//const {Response} = jest.requireActual('node-fetch');

test('checking a 200 code link', async () => {
  const linkToCheck = new Link('https://www.google.com/');
  fetch.mockReturnValue(Promise.resolve({status: 200}));

  await checker(linkToCheck);
  expect(URLS[0].status).toBe(Status.good);
  URLS.pop();
});

test('checking a 404 code link', async () => {
  const linkToCheck = new Link('https://www.google.com/');
  fetch.mockReturnValue(Promise.resolve({status: 404}));

  await checker(linkToCheck);
  expect(URLS[0].status).toBe(Status.bad);
  URLS.pop();
});
