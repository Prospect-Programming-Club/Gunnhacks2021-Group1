var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/', function(req, res, next) {
    uuid = {"uuid" : uuidv4()}
    res.send(uuid);
});

module.exports = router;