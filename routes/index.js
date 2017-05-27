var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');

const BASE_DIR = '/Users/richardlucas/gatech_class_material/cse6220/oms-hpc-labs/';

function getFiles(dir, type) {
  var typeRe = new RegExp(type);
  return fs.readdirSync(BASE_DIR + dir)
    .filter(function(file) {
      return /\.json/.test(file) && typeRe.test(file);
    });
}

function readFile(file, subdir) {
  return fs.readFileSync(BASE_DIR + subdir + '/' + file, {encoding: 'utf-8'});
}

function getResults(dir) {
  return getFiles(dir, 'result').map(function(file) {
    var read = readFile(file, dir);
    var json = JSON.parse(read);
    var charCount = read.length;
    var tests = _.forEach(json.tests, function(j) {
      j.traceback = j.traceback.split('\n');
      _.forEach(j.output, function(out, k) {
        j.output[k] =  _.toString(out).split('\n');
      }); 
    });
    var fileLoc = BASE_DIR + dir + '/' + file;
    var o = {
      name: file,
      date: parseDate(file), 
      tests: tests,
      charCount: charCount,
      stats: fs.statSync(fileLoc) 
    };
    return o;
  }).sort(function(a, b) {
    return b.date - a.date;
  });
}

function parseDate(str) {
  var timedateSplit = str.split('.json').shift().split('-').filter((ea) => { return !isNaN(Number(ea)); });
  var time = timedateSplit.slice(3).join(':');
  var date = timedateSplit.slice(1, 3).join('-');
  var datetime = date + ' ' + time;
  return new Date(datetime);
}

router.get('/', function(req, res) {
  res.render('index', { 
    title: 'Autograder Viewer'
  });
});

/* GET home page. */
router.get('/:dir', function(req, res) {
  var dir = req.params.dir || 'gflib';
  res.render('dir', { 
    title: 'Autograder Viewer',
    files: getResults(dir) 
  });
});

router.get('/:dir/:filename', function(req, res) {
  var dir = req.params.dir; 
  var fileName = req.params.file;
  if (!dir || !fileName) {
    return res.status(404).send('Not Found.');
  }
  var file = getResults(dir).find(function(file) {
    return file.name == fileName;
  });
  res.render('file', {
    file: file
  });
});

router.get('/api/json/:dir', function(req, res) {
  var dir = req.params.dir || 'gflib';
  var fileName = req.query.file;
  var file = getResults(dir).find(function(file) {
    return file.name == fileName;
  });
  res.json(file);
});

router.get('/reset', function(req, res) {
  res.send('Reset: ' + new Date());
  process.exit(1);
});

module.exports = router;
