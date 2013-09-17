// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Sample extension to replace all JPEG images (but no PNG/GIF/... images) with
// lolcat images from http://icanhascheezburger.com/ - except for images on
// Google.

var RequestMatcher = chrome.declarativeWebRequest.RequestMatcher;
var IgnoreRules = chrome.declarativeWebRequest.IgnoreRules;
var RedirectRequest = chrome.declarativeWebRequest.RedirectRequest;
var RedirectByRegEx = chrome.declarativeWebRequest.RedirectByRegEx;
var noAdsLoader = {
  youku: 'https://gitcafe.com/kawaiiushio/antiads/raw/master/loader.swf',
  tudou: 'https://gitcafe.com/kawaiiushio/antiads/raw/master/tudou.swf',
  iqiyi : 'http://wysablog.innoxyz.com/iqiyi.swf',
  letv : 'http://my-offline-player.googlecode.com/files/letv.swf'
}

// Registers redirect rules assuming that currently no rules are registered by
// this extension, yet.
function registerRules() {
  var redirectRule = {
    priority: 100,
    conditions: [
      // If any of these conditions is fulfilled, the actions are executed.
      new RequestMatcher({
        // Both, the url and the resourceType must match.
        url: {pathSuffix:'swf'}
      })
    ],
    actions: [
     // new RedirectRequest({redirectUrl: noAdsLoader})
     	new RedirectByRegEx({from:"^http[s]?://static.youku.com/[^?]*[?]?(.*)$",to:noAdsLoader["youku"]+"?$1"}),
      new RedirectByRegEx({from:"^http[s]?://js.tudouui.com/[^?]*[?]?(.*)$",to:noAdsLoader["tudou"]+"?$1"}),
      new RedirectByRegEx({from:"^http[s]?://www.iqiyi.com/[^?]*[?]?(.*)$",to:noAdsLoader['iqiyi']+"?$1"})
     // new RedirectByRegEx({from:"^http[s]?://player.letvcdn.com/[^?]*[?]?(.*)$",to:noAdsLoader['letv']+"?$1"})
    ]
  };

  var exceptionRule = {
    priority: 1000,
    conditions: [
      // We use hostContains to compensate for various top-level domains.
      new RequestMatcher({url: {hostContains: '.google.'}})
    ],
    actions: [
      new IgnoreRules({lowerPriorityThan: 1000})
    ]
  };

  var callback = function() {
    if (chrome.runtime.lastError) {
      console.error('Error adding rules: ' + chrome.runtime.lastError);
    } else {
      console.info('Rules successfully installed');
      chrome.declarativeWebRequest.onRequest.getRules(null,
          function(rules) {
            console.info('Now the following rules are registered: ' +
                         JSON.stringify(rules, null, 2));
          });
    }
  };

  chrome.declarativeWebRequest.onRequest.addRules(
      [redirectRule, exceptionRule], callback);
}

function setup() {
  // This function is also called when the extension has been updated.  Because
  // registered rules are persisted beyond browser restarts, we remove
  // previously registered rules before registering new ones.
  chrome.declarativeWebRequest.onRequest.removeRules(
    null,
    function() {
      if (chrome.runtime.lastError) {
        console.error('Error clearing rules: ' + chrome.runtime.lastError);
      } else {
        registerRules();
      }
    });
}
setup();
// This is triggered when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(setup);


/*
chrome.webRequest.onBeforeRequest.addListener(function(details){
	console.log("hijack request:"+details.url);
	var hostCapture=/http(?:s)?:\/\/([^\/]+)\//g;
	var host = hostCapture.exec(details.url)[1];
	if(host == "static.youku.com"){
		return {redirectUrl:"http://lovejiani.cdn.duapp.com/kafan/loader.swf"};
	}else{
		return {cancel : true};
	}
	
},
{urls:["*://static.youku.com/ * ///static.youku.com/ * /player_yknpsv.swf","*://v.aty.sohu.com/v*"],types:["object"]},
["blocking","requestBody"]);
*/