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

function unix_to_js(unix_timestamp){
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp*1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  //var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return {
    "date": date,
    "hr": hours,
    "min": minutes,
    "s": seconds
  }
}

function show_remaining(end) {
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;
  
  console.log('show_remaining');
  var now = new Date();
  var distance = end - now;
  if (distance < 0) {
      clearInterval(timer);
      document.querySelector('#gitApiCallsAdd').innerText += 'EXPIRED!';

      //on reset time reached, reset no of calls available
      check_remaining_calls();

      return;
  }
  var days = Math.floor(distance / _day);
  var hours = Math.floor((distance % _day) / _hour);
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);

  //document.querySelector('#gitApiCallsAdd').innerText += days + 'days ';
  //document.querySelector('#gitApiCallsAdd').innerText += hours + 'hrs ';
  document.querySelector('#gitApiCallsAdd').innerText += minutes + ' min ';
  document.querySelector('#gitApiCallsAdd').innerText += seconds + ' s';
}
