require('dotenv').config()
var express = require('express');
var router = express.Router();
const path = require('path')
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { test: 'something' })
})

router.get('/image', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/images/icon-location.svg'))
})

router.post('/api', function (req, res, next) {
  var ip = req.body.query
  const IPRegex = /\d+\.\d+\.\d+\.\d+/gi
  const IPRegexResult = ip.match(IPRegex)
  if (IPRegexResult == null) {
    // To find IP of domain
    const dns = require('dns')
    const lookupPromise = new Promise((resolve, reject) => {
      dns.lookup(ip, (err, address, family) => {
        if (err) reject(err);
        resolve(address);
      });
    });
    lookupPromise.then(address => {
      ip = address;
      console.log(ip)
      const LOCATION_API = `https://geo.ipify.org/api/v1?apiKey=${process.env.API_KEY}&ipAddress=${ip}`;
      axios.get(LOCATION_API).then((resp) => {
        res.send(resp.data)
      }).catch((err) => {
        console.log(err)
        res.status(500).send('Error while fetching.')
      })
    }).catch(err => console.error(err));
  } else {
    console.log(ip)
    const LOCATION_API = `https://geo.ipify.org/api/v1?apiKey=${process.env.API_KEY}&ipAddress=${ip}`;
    axios.get(LOCATION_API).then((resp) => {
      res.send(resp.data)
    }).catch((err) => {
      console.log(err)
      res.status(500).send('Error while fetching.')
    })
  }
});


module.exports = router;