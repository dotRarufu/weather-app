const geoTz = require('geo-tz'); // converts lat lang to timezone

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
            res[
                `${Object.keys(elems[`${Object.keys(elems)[i]}`])[j]}`
            ] = crElem(`${Object.keys(elems)[i]}`);
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
module.exports.find = find;
module.exports.selClass = selClass;
module.exports.crElem = crElem;
module.exports.getTz = getTz;
module.exports.AllOccurIndex = AllOccurIndex;
module.exports.random = random;
module.exports.createElems = createElems;
