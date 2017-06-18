/*
api links
https://developer.github.com/v3/repos/commits/


http://www.unixtimestamp.com/index.php

 */

//useful: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

//https://gist.github.com/niallo/3109252#gistcomment-1474669
function parse_link_header(header) {
    if (header.length === 0) {
        throw new Error("input must not be of zero length");
    }

    // Split parts by comma
    var parts = header.split(',');
    var links = {};
    // Parse each part into a named link
    for(var i=0; i<parts.length; i++) {
        var section = parts[i].split(';');
        if (section.length !== 2) {
            throw new Error("section could not be split on ';'");
        }
        var url = section[0].replace(/<(.*)>/, '$1').trim();
        var name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    }
    return links;
}

// on every click, the remaining calls are displayed
document.addEventListener("click", function(event){
  check_remaining_calls();
});

function check_remaining_calls(){
  get_request_simple('https://api.github.com/rate_limit', function (err, xhrResp) {
    if (err) { throw err; }

    var parsedXhrResp = JSON.parse(xhrResp);

    //console.log('xhrResp: ', xhrResp);
    console.log('xhrResp["rate"]: ', parsedXhrResp["rate"]);
    console.log('xhrResp["rate"]["remaining"]: ', parsedXhrResp["rate"]["remaining"]);
    document.querySelector('#gitApiCalls').innerText = parsedXhrResp["rate"]["remaining"];
  });
}
check_remaining_calls();

//
// get_request with recursive
//
function get_request_recursive(siteLocation, responseLocation){
  var returnObj = get_request();

  if(returnObj["next"] != 0){
    get_request_special(siteLocation, responseLocation);
  } else {

    document.querySelector(responseLocation).value = xhr.responseText;
  }

}

function get_request_special(siteLocation){
  var site = document.querySelector(siteLocation).value;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          //alert(xhr.responseText);
          //document.querySelector(responseLocation).value = xhr.responseText;

          //console.log('xhr.responseText:', xhr.responseText);
          //console.log('xhr.getAllResponseHeaders(): ', xhr.getAllResponseHeaders());

          var linkHeader = xhr.getResponseHeader('Link');
          console.log('xhr.getResponseHeader(\'Link\'): ', linkHeader);

          var parsedLinkHeader = parse_link_header(linkHeader);
          console.log('parse_link_header(linkHeader): ', parsedLinkHeader);
          console.log('parsedLinkHeader["next"]: ', parsedLinkHeader["next"]);
          console.log('---');
      }
  }
  xhr.open('GET', site, true);
  xhr.send(null);
}

// plain get_request with some metadata
function get_request_old(siteLocation, responseLocation){
  var site = document.querySelector(siteLocation).value;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          //alert(xhr.responseText);
          document.querySelector(responseLocation).value = xhr.responseText;
          //console.log('xhr.responseText:', xhr.responseText);
          //console.log('xhr.getAllResponseHeaders(): ', xhr.getAllResponseHeaders());
          var linkHeader = xhr.getResponseHeader('Link');
          console.log('xhr.getResponseHeader(\'Link\'): ', linkHeader);
          
          var parsedLinkHeader = parse_link_header(linkHeader);
          console.log('parse_link_header(linkHeader): ', parsedLinkHeader);
          console.log('parsedLinkHeader["next"]: ', parsedLinkHeader["next"]);
          console.log('---');
      }
  }
  xhr.open('GET', site, true);
  xhr.send(null);
}

// function get_request_simple(site){
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//       if (xhr.readyState == XMLHttpRequest.DONE) {
//           console.log('get_request_simple: ', xhr.responseText)
//           return xhr.responseText;
//       }
//   }
//   xhr.open('GET', site, true);
//   xhr.send(null);
// }

//https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
function get_request_simple(url, done) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function () {
    //console.log('get_request_simple: ', xhr.response);
    done(null, xhr.response);
  };
  xhr.onerror = function () {
    done(xhr.response);
  };
  xhr.send(null);
}


function get_orgs(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          //console.log(xhr.responseText);
          
          response = JSON.parse(xhr.responseText);
          console.log(response);

          proc = []
          for (var i = 0; i < response.length; i++){
            console.log(response[i].login);
            proc.push(response[i].login);
          }
          console.log(response);
          document.querySelector('#responseOrgs').value = proc;
          
      }
  }
  xhr.open('GET', 'https://api.github.com/users/xR86/orgs', true);
  xhr.send(null);
}


function get_repos(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          //console.log(xhr.responseText);
          
          response = JSON.parse(xhr.responseText);
          console.log(response);

          proc = []
          proc_str = ''
          for (var i = 0; i < response.length; i++){
            console.log(response[i].full_name);
            //proc.push(response[i].full_name);
            proc_str += response[i].full_name
            proc_str += '\n' //CR LF... //'<br>' not working
          }
          console.log(response);
          document.querySelector('#responseRepos').value = proc_str;
          
      }
  }
  xhr.open('GET', 'https://api.github.com/users/xR86/repos', true);
  xhr.send(null);
}


function get_projects(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          //console.log(xhr.responseText);
          
          response = JSON.parse(xhr.responseText);
          console.log(response);

          proc = []
          proc_str = ''
          for (var i = 0; i < response.length; i++){
            console.log(response[i].name);
            //proc.push(response[i].name);
            proc_str += response[i].name
            proc_str += '\n'
          }
          console.log(response);
          document.querySelector('#responseProjects').value = proc_str;
          
      }
  }
  xhr.open('GET', 'https://api.github.com/repos/xR86/ml-stuff/projects', true); 
  /*also requires auth*/
  xhr.setRequestHeader('Accept', 'application/vnd.github.inertia-preview+json'); /*still in preview, this is needed*/
  xhr.send(null);
}


function get_pulls(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          
          response = JSON.parse(xhr.responseText);
          console.log(response);

          proc = []
          proc_str = ''
          for (var i = 0; i < response.length; i++){
            //console.log(response[i].title);
            //proc.push(response[i].title);
            proc_str += response[i].title
            proc_str += '\n'
          }
          //console.log(response);
          document.querySelector('#responsePulls').value = proc_str;
          
      }
  }
  var params = 'state=all'
  xhr.open('GET', 'https://api.github.com/repos/2B5/ia-3B5/pulls' + '?' + params, true);
  // var params = JSON.stringify({ state: 'all' });

  // xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  // // xhr.setRequestHeader("Content-length", params.length);

  // xhr.send(params);
  xhr.send(null);
}
