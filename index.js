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
      console.log("?");
      console.log(tabs);
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
    var lesser = []
    tabs.forEach(function(v) {
      lesser.push({ title: v.title, url: v.url });
    })
    string += JSON.stringify(lesser);
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
  console.log(tab.url + " is deactivated");
}

function logClose(tab) {
	send('tab-closed',tab);
  console.log(tab.url + " is closed");
}

function onOpen(tab) {
	send('tab-created',tab);
  tab.on("ready", logShow);
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
