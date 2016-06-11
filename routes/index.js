var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');

const BASE_DIR = '/Users/richardlucas/gatech_class_material/cs8803/pr1/';

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

var files = getFiles('gflib', 'result').map(function(file) {
  var json = JSON.parse(readFile(file, 'gflib'));
  var tests = _.forEach(json.tests, function(j) {
    j.traceback = j.traceback.split('\n');
    _.forEach(j.output, function(out, k) {
      j.output[k] =  _.toString(out).split('\n');
    }); 
  });
  var o = {
    name: file,
    json: tests 
  };
  return o;
});

/* GET home page. */
router.get('/', function(req, res) {
  console.log(files.length);
  res.render('index', { 
    title: 'Autograder Viewer',
    files: files 
  });
});

router.get('/json', function(req, res) {
  var fileName = req.query.file;
  var file = files.find(function(file) {
    return file.name == fileName;
  });
  res.json(file.json);
});

module.exports = router;
