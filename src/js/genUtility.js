const geoTz = require('geo-tz');

function find(needle, haystack) {
  const results = [];
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    results.push(idx);
    idx = haystack.indexOf(needle, idx + 1);
  }
  return results;
}
function selClass(className) {
  return document.querySelector(`.${className}`);
}
function selId(idName) {
  return document.querySelector(`#${idName}`);
}
function crElem(element) {
  return document.createElement(`${element}`);
}
function getTz(lat, lang) {
  return geoTz(lat, lang)[0];
}
function AllOccurIndex(string, char) {
  const indices = [];
  let idx = string.indexOf(char);
  while (idx !== -1) {
    indices.push(idx);
    idx = string.indexOf(char, idx + 1);
  }
  return indices;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createElems(config) {
  const elems = config;
  const res = {};
  for (let i = 0; i < Object.keys(elems).length; i += 1) {
    for (
      let j = 0;
      j < Object.keys(elems[`${Object.keys(elems)[i]}`]).length;
      j += 1
    ) {
      res[`${Object.keys(elems[`${Object.keys(elems)[i]}`])[j]}`] = crElem(
        `${Object.keys(elems)[i]}`
      );
      res[
        `${Object.keys(elems[`${Object.keys(elems)[i]}`])[j]}`
      ].className = `${
        elems[`${Object.keys(elems)[i]}`][
          `${Object.keys(elems[`${Object.keys(elems)[i]}`])[j]}`
        ]
      }`;
    }
  }
  return res;
}
function appendElems(config, elems) {
  for (let i = 0; i < Object.keys(config).length; i += 1) {
    // const parent = [`${Object.keys(config)[i]}`];
    const parent =
      elems[i][
        `${Object.keys(config)[i].slice(
          0,
          Object.keys(config)[i].indexOf('$')
        )}`
      ];

    for (let j = 0; j < config[`${Object.keys(config)[i]}`].length; j += 1) {
      const child = config[`${Object.keys(config)[i]}`][j];

      parent.appendChild(child);
    }
  }
}
function selElems(config) {
  const elems = config;
  const res = {};
  for (let i = 0; i < Object.keys(elems).length; i += 1) {
    res[`${Object.keys(elems)[i]}`] = selClass(
      `${elems[`${Object.keys(elems)[i]}`]}`
    );
  }
  return res;
}
function setAnim(action, timeout) {
  setTimeout(() => {
    action();
  }, timeout);
}
function start(time, action) {
  let timeRemaining = time;
  function count() {
    setTimeout(() => {
      timeRemaining -= 1;
      if (timeRemaining === 0) {
        action();
      } else {
        count();
      }
    }, 1000);
  }
  count();
}
module.exports.find = find;
module.exports.selClass = selClass;
module.exports.crElem = crElem;
module.exports.getTz = getTz;
module.exports.AllOccurIndex = AllOccurIndex;
module.exports.random = random;
module.exports.createElems = createElems;
module.exports.appendElems = appendElems;
module.exports.selElems = selElems;
module.exports.setAnim = setAnim;
module.exports.start = start;
module.exports.selId = selId;
