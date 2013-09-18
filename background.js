//Copyright wpc009@gmail.chrome

var parseQueryStr = function(query){
var parts = query.split('&');
var obj={};
for(var i in parts){

	var part = parts[i].split('=');
	if(part.length ==2){
		obj[part[0]]=part[1];
	}
}
return obj;
};

var queryObjToString = function (obj){
	var sep = "";
	var query="";
	for(var i in obj){
		query+=sep;
		query+=i+'='+obj[i];
		sep="&";
	}
	return query;
};
var magicToken = 'ohahaha=1';
var noAdsLoader = {
  youku: {
  	reg: /^http[s]?:\/\/valf\.atm\.youku\.com\/vf\?vip=0(\&.*)$/,
  	handler:function(p){
	
		var obj = parseQueryStr(p);
		//obj.vl=100;
		obj.paid=1;
		console.debug(p);
		console.debug(obj);
  		return {redirectUrl:'http://valf.atm.youku.com/vf?'+magicToken+'&vip=1&_t='+ new Date().getTime()+'&'+queryObjToString(obj)};
  	}
  },
  sohu :{
  	reg:/^http[s]?:\/\/v\.aty\.sohu\.com\/v(\?.*)$/,
  	handler:function(parameters){
  		return {redirectUrl:'http://wysablog.innoxyz.com/sohu/v'};
  	}
  }
  //,
  // iqiyi : {
  // 	url:'http://wysablog.innoxyz.com/iqiyi.swf',
  // 	reg:/^http[s]?:\/\/www\.iqiyi\.com\/[^?]*[?]?(.*)$/
  // }
}
chrome.webRequest.onBeforeRequest.addListener(
	function(details){
		console.log("request: "+details.url+" frameId:"+details.frameId);
		for(var i in noAdsLoader){
			var vendor = noAdsLoader[i];
			var matches = vendor.reg.exec(details.url);
			if(matches){
				console.log("hijack "+i+" ads ");
				return vendor.handler(matches[1]);
			}
		}
	},
	{urls:["*://valf.atm.youku.com/vf*","*://v.aty.sohu.com/v*"]},
	["blocking"]
	);