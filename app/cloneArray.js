const { array } = require("yargs");

function cloneArray (array) {
  return [...array]
}

module.exports = cloneArray