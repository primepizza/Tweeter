var reqTokenG = '';
var reqSecretG = '';
AA();
function AA(){
  chrome.storage.local.get("accounts",function(items) {
  var accounts=items.accounts
  var an="<option value =''>登録済みのアカウント</option>";
  for(var id in accounts){
    an +="<option value='"+id+"'>"+accounts[id].scr+"</option>"
  }
    document.getElementById('users').innerHTML = an;
  });
}
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("deluser").addEventListener("click", function(){
      var delid =document.getElementById("users").value;
      if(delid==""){
        return;
      }
      if(window.confirm('本当に？')){
        chrome.storage.local.get("accounts",function(items) {
          var accounts=items.accounts;
          delete accounts[delid];
          chrome.storage.local.set({"accounts":accounts},function(res){
            AA()
          });
        });
      }else{

      }
  });
  document.getElementById("GET").addEventListener("click", function(){
		//トークンの発行をする
		SendRequest(
				{
					action: 'request_token',
				},
		function( res )
			{

				if ( res.search( /oauth_token=([\w\-]+)\&/ ) != -1 ){
					reqTokenG = RegExp.$1;
				}else{

						alert("error");
						return;

				}
				if ( res.search( /oauth_token_secret=([\w\-]+)\&/ ) != -1 ){
					reqSecretG = RegExp.$1;
				}else{

						alert("error");
						return;

				}

				SendRequest(
					{
						action: 'window',
						reqToken: reqTokenG,
						reqSecret: reqSecretG,
					},
					function( res )
					{
						console.log(res);
						chrome.tabs.create( { url: res });
				});
			}
		);
	});
  document.getElementById("PIN").addEventListener("click", function(){
  var acsToken = '';
  var acsSecret = '';
  var user_id = '';
  var screen_name = '';
  var PIN =document.getElementById("textb").value;
  if(PIN==""){
    alert("PINを入力して");
  }else{
    if(reqTokenG!=""&&reqSecretG!=""){
      SendRequest(
        {
          action: 'access_token',
          reqToken:reqTokenG,
          reqSecret:reqSecretG,
          pin:PIN,
        }	,
        function(res){
          if(typeof res !="string"){
            alert("何か(主にPINの値)がおかしいのでもう一度やり直して");
            reqTokenG = '';
            reqSecretG = '';
          }
          console.log(res.search( /oauth_token=([\w\-]+)\&/ ));
          if ( res.search( /oauth_token=([\w\-]+)\&/ ) != -1 )
          {
            acsToken = RegExp.$1;
          }
          if ( res.search( /oauth_token_secret=([\w\-]+)\&/ ) != -1 )
          {
            acsSecret = RegExp.$1;
          }
          if ( res.search( /user_id=([\w\-]+)\&/ ) != -1 )
          {
            user_id = RegExp.$1;
          }
          if ( res.search( /screen_name=([\w\-]+)/ ) != -1 )
          {
            screen_name = RegExp.$1;
          }
          if(acsToken==""||acsSecret==""||user_id==""||screen_name==""){
            alert("error! please try again.")
          }else{
            alert("追加に成功しました。");
            chrome.storage.local.get("accounts",function(items) {

              if(items.accounts==undefined){
                var accounts={
                  [user_id]:{
                    scr:screen_name,
                    AT:acsToken,
                    AS:acsSecret
                  }
                }
                chrome.storage.local.set({"accounts":accounts},function(res){

                });
              }else{
                var accounts=items.accounts;

                accounts[user_id]=
                {
                  scr:screen_name,
                  AT:acsToken,
                  AS:acsSecret
                };

                chrome.storage.local.set({"accounts":accounts});

              }
            });
          }
          }
        );

      }else{
        alert("GETを押して");
        }
      }
    });
});
