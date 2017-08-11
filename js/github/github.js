//https://developer.github.com/v3/#rate-limiting

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

//window.addEventListener("load", function(){
// window.onload = function(){
//   console.log('[Document] Document was loaded');
//   get_orgs();
//   get_repos();
// };

var interval = setInterval(function() {
  if(document.readyState === 'complete') {
      clearInterval(interval);
      console.log('[Document] Document was loaded');
      get_orgs();
      get_repos();
      //get_lang();
      //document.getElementById("complete-dialog").click();
      if(window.location.hostname != "localhost"){
        $("#open-modal").click();
      }
  }
}, 100);


// on every click, the remaining calls are displayed
document.addEventListener("click", function(event){
  setTimeout(function(){
    check_remaining_calls();
  }, 1000); //wait for most xhr to occur, such that the github counter is decremented
});

function check_remaining_calls(){
  get_request_simple('https://api.github.com/rate_limit', function (err, xhrResp) {
    if (err) { throw err; }

    var parsedXhrResp = JSON.parse(xhrResp);

    console.log('/*check_remaining_calls==');
    console.log('xhrResp["rate"]: ', parsedXhrResp["rate"]);
    console.log('xhrResp["rate"]["remaining"]: ', parsedXhrResp["rate"]["remaining"]);
    document.querySelector('#gitApiCalls').innerText = parsedXhrResp["rate"]["remaining"];
    // document.querySelector('#gitApiCallsAdd').innerHTML += '<br/>';
    // show_remaining(unix_to_js(parsedXhrResp["rate"]["reset"])["date"]);

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
    elem = []
    for (var i = 0; i < response.length; i++){
      console.log(response[i].login);
      proc.push(response[i].login);

      var elemM = '<div class=\"col-md-3\">' + 
        '<a href=\"' + 'https://github.com/' + response[i].login + '\">' + 
        '<img src=\"' + response[i].avatar_url + '\" class=\"img-thumbnail\"></a></div>';
      elem.push(elemM);
    }
    console.log(response);
    document.querySelector('#responseOrgs').value = proc;
    //document.querySelector('#orgs-container').appendChild = elem;
    //elem.forEach(callback.bind(thisArg));
    document.querySelector('#orgs-count').textContent = elem.length;
    elem.forEach( function(item){
      //console.log('item: ', item);
      //document.querySelector('#orgs-container').appendChild = item;
      document.querySelector('#orgs-container').insertAdjacentHTML( 'beforeend', item );
    });
  });
}


function get_repos(){
  get_request_simple('https://api.github.com/users/xR86/repos', function (err, xhrResp) {
    if (err) { throw err; }

    var response = JSON.parse(xhrResp);

    proc = []
    elem = []
    proc_str = ''
    for (var i = 0; i < response.length; i++){
      //console.log(response[i].full_name);
      //proc.push(response[i].full_name);
      proc_str += response[i].full_name
      proc_str += '\n' //CR LF... //'<br>' not working

      var elemM = '<div class=\"' + (response[i].fork ? 'fork-link':'') + '\">' + 
        '<a href=\"' + response[i].html_url + '\">' + response[i].full_name + '&nbsp;' +
        (response[i].fork ? '<i class=\"fa fa-code-fork\" aria-hidden=\"true\"></i>':'') +
        '</a></div>';
      elem.push(elemM);
    }
    console.log(response);
    document.querySelector('#responseRepos').value = proc_str;

    document.querySelector('#repos-count').textContent = elem.length;
    elem.forEach( function(item){
      document.querySelector('#repos-container').insertAdjacentHTML( 'beforeend', item );
    });
  });
}

//too many API calls, start to cache responses
function get_lang(){
  reposNames = [];

  get_request_simple('https://api.github.com/users/xR86/repos', function (err, xhrResp) {
    if (err) { throw err; }

    var response = JSON.parse(xhrResp);
    for (var i = 0; i < response.length; i++){
      if(!response[i].fork){
        reposNames.push(response[i].name);
      }
    }

    console.log('reposNames: ', reposNames);
    console.log('reposNames.length: ', reposNames.length);

    langs = {}
    inProgressSum = 0; //starts as 0, and evolves based on promises
    for(var i = 0; i < reposNames.length; i++){
      console.log('###');
      console.log(reposNames);
      console.log(reposNames[i]);
      console.log('###');

      get_request_simple('https://api.github.com/repos/xR86/' + reposNames[i] + '/languages', function (err, xhrResp) {
        if (err) { throw err; }
        inProgressSum += 1;

        var response = JSON.parse(xhrResp);
        
        for (var key in response){
          console.log('langs.hasOwnProperty(key): ', langs.hasOwnProperty(key));
          console.log('response[key]: ', response[key]);
          if(!langs.hasOwnProperty(key)){
            langs[key] = 1;
          } else {
            langs[key]++;
          }
        }

        inProgressSum -= 1;
      });

      if(inProgressSum == 0){
        elem = [];
        proc_str = '';
        console.log('langs: ', langs);
        for (var key in langs) {
          var elemM = '<div><span>' + key + ': ' + String(langs[key]) + '</span></div>';
          elem.push(elemM);

          proc_str += key
          proc_str += '\n' //CR LF... //'<br>' not working
        }

        console.log(response);
        document.querySelector('#responseLang').value = proc_str;

        document.querySelector('#lang-count').textContent = elem.length;
        elem.forEach( function(item){
          document.querySelector('#lang-container').insertAdjacentHTML( 'beforeend', item );
        });
      }
    }
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