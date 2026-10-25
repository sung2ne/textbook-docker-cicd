// 파일: src/calculator.test.js
const { add, subtract } = require('./calculator');

test('1 + 2는 3이어야 한다', () => {
  expect(add(1, 2)).toBe(3);
});

test('5 - 3은 2여야 한다', () => {
  expect(subtract(5, 3)).toBe(2);
});
