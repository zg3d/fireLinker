const documentProccessing = require('../src/utils/documentProccesing');

test('testing documentProccessing with data as an empty string', async () => {
  expect(await documentProccessing(null)).toBe(null);
});

test('testing documentProccessing the url.txt file given', async () => {
  const expected = await documentProccessing('url.txt');
  expect(typeof expected).toBe('string');
});

test('testing documentProccessing an incorrect file given', async () => {
  expect(await documentProccessing('i_do_not_exist.txt')).toBe(null);
});

