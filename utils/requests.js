const data = require('../data')

const territory = function(req, res) {
  data.requests.addRequest(
    "TERRITORY", (req.body && req.body.areas)
    ? req.body.areas
    : []).then(result => {
    if (result !== null) {
      return res.json({id: result})
    }
    return res.status(500).send('Internal error.');
  })
}


exports.newRequest = function(req, res, type) {
  data.requests.getRequests().then(result => {
    if (result === null) {
      return result.status(500).send('Internal error.');
    }
    if (result.length > 20) {
      return res.status(403).send('We cannot handle more requests.');
    }
    switch (type) {
      case 'territory':
        return territory(req, res)
        break;
      default:
        return res.status(404).send('Sorry, what ?');
    }
  })
}
