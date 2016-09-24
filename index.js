var self = require("sdk/self");
var tabs = require('sdk/tabs');
var pageWorker = require("sdk/page-worker");

if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
}

function isArray(obj) {
  return Array.isArray(obj);
}

var pw = pageWorker.Page({
		contentScriptWhen: "ready",
    contentURL: self.data.url('websocket.html'),
});

pw.port.on('message', function(message) {
    data = JSON.parse(message);

		if(data.state == 'get-tabs') {
			var tabs = require('sdk/tabs');
			send('all-tabs',tabs);
		}
});

function tabDataToJson(tab) {
  title = tab.title;
  url = tab.url;
  obj = { title: title, url: url }

  return JSON.stringify(obj);
}
function tabMessageBody(state,tab) {
  return state + " " + tabDataToJson(tab);
}

function send(state,tabs) {
  var string = state + " ";
  if(isArray(tabs)) {
    string += "["
    tabs.forEach(function(v) {
      string += tabDataToJson(v);
    })
    string += "]"
  }
  else {
    string += tabDataToJson(tabs);
  }
	pw.port.emit('send',string);
}


function logShow(tab) {
		send('tab-updated',tab);
  	console.log(tab.url + " is loaded");
}

function logActivate(tab) {
	send('tab-activated',tab);
  console.log(tab.url + " is activated");
}

function logDeactivate(tab) {
	//send('tab-deactivate',tab);
  console.log(tab.url + " is deactivated");
}

function logClose(tab) {
	//send('tab-close',tab);
  console.log(tab.url + " is closed");
}

function onOpen(tab) {
	send('tab-created',tab);
  console.log(tab.url + " is open");
  tab.on("pageshow", logShow);
  tab.on("activate", logActivate);
  tab.on("deactivate", logDeactivate);
  tab.on("close", logClose);
}

tabs.on('open', onOpen);

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Chiika",
  icon: {
    "16": "./chiika.png",
    "32": "./chiika.png",
    "64": "./chiika.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("http://github.com/arkenthera/Chiika");
}
