const _en = require("./_en.json");
const _fr = require("./_fr.json")

exports.en = word => _en[word] || word;
exports.fr = word => _fr[word] || word;