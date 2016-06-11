$(function() {

  function buildHtml(tests) {
    var compiled = _.template('<% _.forEach(tests, function(test, k) { %>' +
      '<div class="test">' +
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
     return compiled({tests: tests});
  }

  $('select').on('change', function() {
    var file = $(this).val();
    var requestUrl = '/json?file=' + file;
    $.get(requestUrl, function(json) {
      console.log(json);
      var html = buildHtml(json);
      $('.output').append(html);
    });
  });
});

