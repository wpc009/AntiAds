// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Sample extension to replace all JPEG images (but no PNG/GIF/... images) with
// lolcat images from http://icanhascheezburger.com/ - except for images on
// Google.


var noAdsLoader = {
  youku: {
  	reg: /^http[s]?:\/\/static\.youku\.com\/[^?]*[?]?(.*)$/,
  	url:'https://gitcafe.com/kawaiiushio/antiads/raw/master/loader.swf'
  },
  tudou: {
  	url:'https:\//gitcafe.com\/kawaiiushio\/antiads\/raw\/master\/tudou.swf',
  	reg:/^http[s]?:\/\/js\.tudouui\.com\/[^?]*[?]?(.*)$/
  }
  //,
  // iqiyi : {
  // 	url:'http://wysablog.innoxyz.com/iqiyi.swf',
  // 	reg:/^http[s]?:\/\/www\.iqiyi\.com\/[^?]*[?]?(.*)$/
  // }
}

chrome.webRequest.onBeforeRequest.addListener(
	function(details){
		for(var i in noAdsLoader){
			var vendor = noAdsLoader[i];
			var matches = vendor.reg.exec(details.url);
			if(matches){
				console.log("hijack "+i+" player");
				return {redirectUrl:vendor.url};
			}
		}
	},
	{types:['object'],urls:["*://static.youku.com/**/*.swf","*://js.tudouui.com/**/*.swf"]},
	["blocking"]
	);