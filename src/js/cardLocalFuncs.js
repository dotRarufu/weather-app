const countryTimezone = require('country-timezone');

function inputOrCoord(inputValue, choice, coordTz) {
  // returns which is used, country name or coordinates
  let res;
  if (choice === 'input') {
    res = countryTimezone.getTimezones(inputValue)[Number(0)]; // It is necessary to convert index to number so eslint will not throw destructuring error
  } else if (choice === 'map') {
    res = coordTz;
  }
  console.log(res);

  return res;
}
function getLastLetterNum(string) {
  let res;
  for (let i = -1; i > -Math.abs(string.length); i += -1) {
    // Starts in last character toward beginning of the string
    if (string.slice(i)[0].match(/[a-zA-Z0-9]/)) {
      if (i === -1) {
        // if string has no non-letter or num in the end
        break;
      } else {
        res = i + 1;
        break;
      }
    }
  }
  return res;
}

module.exports.inputOrCoord = inputOrCoord;
module.exports.getLastLetterNum = getLastLetterNum;
