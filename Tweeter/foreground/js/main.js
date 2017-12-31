

function SendRequest( req, callback ){
	var ck="1tU2ppXt0fa1GxKeZrMm5Wc64"
	var cs='4Kpe5mmgg1blef6btHAaDqrQB8h3Avkt97C84WbICJ60R6MZbp'
	if(req.action=='request_token'){
		var accessor = {
			consumerSecret: cs,
			tokenSecret: ''
		};
		var message = {
			method: 'GET',
			action: 'https://api.twitter.com/oauth/request_token',
			parameters: {
				oauth_signature_method: 'HMAC-SHA1',
				oauth_consumer_key: ck,
				oauth_version: '1.0',
			}
		}
		OAuth.setTimestampAndNonce( message );
		OAuth.SignatureMethod.sign( message, accessor );
		var target = OAuth.addToURL( message.action, message.parameters );
		$.ajax( {
			url: target,
			dataType: 'text',
			type: 'GET',
		} ).done( function( data ) {
			callback( data );
		} ).fail( function( data ) {

			callback( data );
		} );

	}else if (req.action=="window") {
		var accessor = {
			consumerSecret: cs,
			tokenSecret: req.reqSecret
		};
		var message = {
			method: 'GET',
			action: 'https://api.twitter.com/oauth/authenticate',
			parameters: {
				oauth_signature_method: 'HMAC-SHA1',
				oauth_consumer_key:ck,
				oauth_token: req.reqToken,
				oauth_version: '1.0',
			}
		};
		OAuth.setTimestampAndNonce( message );
		OAuth.SignatureMethod.sign( message, accessor );
		var target = OAuth.addToURL( message.action, message.parameters );
		callback(target);
	}else if(req.action=="access_token"){
		var accessor = {
			consumerSecret: cs,
			tokenSecret: req.reqSecret
		};

		var message = {
			method: 'POST',
			action: 'https://api.twitter.com/oauth/access_token',
			parameters: {
				oauth_signature_method: 'HMAC-SHA1',
				oauth_consumer_key: ck,
				oauth_token: req.reqToken,
				oauth_verifier: req.pin,
				oauth_version: '1.0',
			}
		};

		OAuth.setTimestampAndNonce( message );
		OAuth.SignatureMethod.sign( message, accessor );
		var target = OAuth.addToURL( message.action, message.parameters );
		$.ajax( {
			url: target,
			dataType: 'text',
			type: 'POST',
		} ).done( function( data ) {
			callback( data );
		} ).fail( function( data ) {
			callback( data );
		} );
	}else if(req.action=="Tweet"){
		var accessor = {
			consumerSecret:cs,
			tokenSecret: req.AS
		};
		var message = {
			method: 'POST',
			action: "https://api.twitter.com/1.1/statuses/update.json",
			parameters: {
				oauth_signature_method: 'HMAC-SHA1',
				oauth_consumer_key: ck,
				oauth_token: req.AT,
				oauth_version: '1.0',
				status:req.text,
				type:"POST",
				url:"https://api.twitter.com/1.1/statuses/update.json",
				}
		};
		OAuth.setTimestampAndNonce( message );
		OAuth.SignatureMethod.sign( message, accessor );
		var target = OAuth.addToURL( message.action, message.parameters );

		$.ajax( {
			url: target,
			dataType: 'json',
			type: 'POST',
		} ).done( function( data ) {
			callback( data );
		} ).fail( function( data ) {
			callback( data );
		} );
	}
}

function savetoken(at,as, callback){
		chrome.storage.local.get("accounts",function(res){
			var account={
				"test":{
					id:"hoge",
					AT:at,
					AS:as
				}
			}
			if(res.accounts!=undefined){

			}else{

			}
		});
}

function getscr(req,callback){
	var ck="1tU2ppXt0fa1GxKeZrMm5Wc64"
	var cs='4Kpe5mmgg1blef6btHAaDqrQB8h3Avkt97C84WbICJ60R6MZbp'
	console.log("ASEC:"+req.as);
	console.log("AT:"+req.at);
	var accessor = {
				consumerSecret: cs,
				tokenSecret: req.as
			}
	var message = {
				method: 'GET',
				action: 'https://api.twitter.com/1.1/account/settings.json',
				parameters: {
					oauth_signature_method: 'HMAC-SHA1',
					oauth_consumer_key: ck,
					oauth_token: req.at,
					oauth_version: '1.0',
				}
			}
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign( message, accessor );
	var target = OAuth.addToURL( message.action, message.parameters );
	$.ajax( {
		url: target,
		dataType: 'text',
		type: 'GET',
	} ).done( function( data ) {
		callback( data );
	} ).fail( function( data ) {
		callback( data );
	} );
}
