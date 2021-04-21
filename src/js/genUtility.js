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

module.exports.find = find;
module.exports.selClass = selClass;
module.exports.crElem = crElem;
