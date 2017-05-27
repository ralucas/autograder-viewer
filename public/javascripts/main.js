$(function() {

  function buildHtml(json) {
    var compiled = _.template(
      '<h3>Title: <%= json.name %></h3>' +
      '<p class="date">Date: <%= new Date(json.date) %></p>' +
      '<h5>Character count: <%= json.charCount %></h5>' +
      '<p>File Stats:</p><ul>' +
      '<% _.forEach(json.stats, function(s, k) { %> ' +
        '<li><%= k %> : <span class="stat"><code><%= s %></code></span></li>' +
      '<% }) %></ul>' +
      '<% _.forEach(json.tests, function(test, k) { %>' +
        '<div class="test <% if (test.output.passfail == \'failed\') { %> fail <% } %>">' +
          '<h4 class="desc"><%= test.description %></h4>' +
          '<p class="trace">Traceback: <div class="trace-out">' +
             '<% _.forEach(test.traceback, function(t) { %>' +
             '<p><code><%= t %></code></p>' + 
              '<% }) %></div></p>' +
          '<h5>Results:</h5>' +
          '<ul>' +
          '<% _.forEach(test.output, function(output, key) { %>' +
            '<li><span class="key"><%= _.startCase(key) %></span> : ' +
              '<div class="results-out"><% _.forEach(output, function(o) { %>' +
                 '<p><code><%= o %></code></p>' + 
              '<% }) %><div></li>' +
          '<% }); %>' +
          '</ul>' +
        '</div>' +
     '<% }); %>');
     return compiled({json: json});
  }
  $('input[type="file"]').on('change', function(e) {
    var dir = e.target.files[0].webkitRelativePath.split("/").shift();
    $.post('/basedir', {basedir: dir});
  });

  $('select').on('change', function() {
    var file = $(this).val();
    console.log('rq', requestUrl);
    $.get(requestUrl, function(json) {
      console.log(json);
      var fails = _.find(json.tests.output, function(o, k) {
        return o == 'failure';
      }).length;
      var passes = json.tests.length - fails;
      _.extend(json, {fails: fails, passes: passes});
      var html = buildHtml(json);
      $('.output').append(html);
    });
  });

  $('.show').on('click', function() {
    var file = $('select').val();
    var requestUrl = '/api/json' + window.location.pathname + '?file=' + file;
    $.get(requestUrl, function(json) {
      console.log(json);
      var html = buildHtml(json);
      $('.output').append(html);
    });
  });
});

