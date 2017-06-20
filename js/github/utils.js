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

function request_simple(method, url, done) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onload = function () {
    //console.log('request_simple: ', xhr.response);
    done(null, xhr.response);
  };
  xhr.onerror = function () {
    done(xhr.response);
  };
  xhr.send(null);
}

//https://stackoverflow.com/questions/16748813/mydiv-style-display-returns-blank-when-set-in-master-stylesheet
function getStyle(id, name){
  var element = document.querySelector(id);
  return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
}

function toggle_element(location){
  var displayStyle = getStyle(location, 'display');
  var displayValue = document.querySelector(location).style.display;
  console.log('displayStyle: ', displayStyle);
  console.log('displayValue: ', displayValue);

  if(displayStyle == "none"){
    document.querySelector(location).style.display = "initial";
  } else {
    document.querySelector(location).style.display = "none";
  }
}

