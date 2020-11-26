const dataProccessing = require('../src/utils/dataProccessing');

//const data = '';
//const ignorelist = '';

test('testing dataproccesing with data as an empty string', async () => {
  expect(await dataProccessing('')).toBe(true);
});

test('testing dataproccesing with data as an integer', async () => {
  expect(await dataProccessing(2)).toBe(false);
});

test('testing dataproccesing with data as null', async () => {
  expect(await dataProccessing(null)).toBe(false);
});

test('testing dataproccesing with  data and ignorelist as a valid string ', async () => {
  const data = `
    https://www.google.com/index.html
    https://www.google.com/
    https://www.google.ca
    www.google.com
    https://youtube.com
    https://github.com
    http://github.com`;

  const ignorelist = `# 2. File with a comment and single URL that matches any URL
# that starts with https://www.google.com, for example:
#
# https://www.google.com/index.html would match
# https://www.google.com/ would match
# https://www.google.ca would NOT match
https://www.google.com
# This is invalid.  It doesn't use http:// or https://
# www.google.com
http://github.com
https://youtube.com
 invalid.ca
# another invalid line

`;
  expect(await dataProccessing(data, ignorelist)).toBe(true);
});

test('testing dataproccesing with  data and ignorelist as a invalid string ', async () => {
  const data = `
    https://www.google.com/index.html
    https://www.google.com/
    https://www.google.ca
    www.google.com
    https://youtube.com
    https://github.com
    http://github.com`;

  const ignorelist = `#2. File with a comment and single URL that matches any URL
invalid.ca
# another invalid line

`;
  expect(await dataProccessing(data, ignorelist)).toBe(false);
});

test('testing dataproccesing with  data and ignorelist as a integer ', async () => {
  const data = `
    https://www.google.com/index.html
    https://www.google.com/
    https://www.google.ca
    www.google.com
    https://youtube.com
    https://github.com
    http://github.com`;

  const ignorelist = 2;
  expect(await dataProccessing(data, ignorelist)).toBe(false);
});

test('testing dataproccesing with  data and json as a boolean true', async () => {
  const data = `
    https://www.google.com/index.html
    https://www.google.com/
    https://www.google.ca
    www.google.com
    https://youtube.com
    https://github.com
    http://github.com`;

  const json = true;
  expect(await dataProccessing(data, null, json)).toBe(true);
});

test('testing dataproccesing with an empty object', async () => {
  expect(await dataProccessing({})).toBe(false);
});

test('testing dataproccesing with an array', async () => {
  expect(await dataProccessing([])).toBe(false);
});

