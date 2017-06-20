/*
api links
https://developer.github.com/v3/repos/commits/


http://www.unixtimestamp.com/index.php
*/

/**
 * harness function - collects all relevant onclick calls from the html, and calls them
 * - can be used to call all the endpoints such that the page is populated onLoad (window.onload = harness;)
 * @return {[type]} [description]
 */
function harness(){
  get_request_old('#address-1', '#response-1');
  get_request_old('#address-2', '#response-2');
  get_orgs();
  get_repos();
  get_pulls();
  //get_projects();
}

// on every click, the remaining calls are displayed
document.addEventListener("click", function(event){
  setTimeout(function(){
    check_remaining_calls();
  }, 1000);
});

function check_remaining_calls(){
  get_request_simple('https://api.github.com/rate_limit', function (err, xhrResp) {
    if (err) { throw err; }

    var parsedXhrResp = JSON.parse(xhrResp);

    console.log('/*check_remaining_calls==');
    console.log('xhrResp["rate"]: ', parsedXhrResp["rate"]);
    console.log('xhrResp["rate"]["remaining"]: ', parsedXhrResp["rate"]["remaining"]);
    document.querySelector('#gitApiCalls').innerText = parsedXhrResp["rate"]["remaining"];
    console.log('==end check_remaining_calls*/');
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


function get_orgs(){
  get_request_simple('https://api.github.com/users/xR86/orgs', function (err, xhrResp) {
    if (err) { throw err; }

    var response = JSON.parse(xhrResp);

    proc = []
    for (var i = 0; i < response.length; i++){
      console.log(response[i].login);
      proc.push(response[i].login);
    }
    console.log(response);
    document.querySelector('#responseOrgs').value = proc;
  });
}


function get_repos(){
  get_request_simple('https://api.github.com/users/xR86/repos', function (err, xhrResp) {
    if (err) { throw err; }

    var response = JSON.parse(xhrResp);

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
  });
}

function get_pulls(){
  var params = 'state=all'

  // var params = JSON.stringify({ state: 'all' });
  // xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  // // xhr.setRequestHeader("Content-length", params.length);
  // xhr.send(params);

  get_request_simple('https://api.github.com/repos/2B5/ia-3B5/pulls' + '?' + params, function (err, xhrResp) {
    if (err) { throw err; }

    response = JSON.parse(xhrResp);
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
  });
}

/****EXPERIMENTAL API FEATURES*****/

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