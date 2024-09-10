const sum = require('./sum')

test('Add two numbers' , () => {
  expect(sum(4,5)).toBe(9);
}) 