chrome.storage.local.get("accounts",function(items) {
  console.log(items.accounts);
  var st = makelist(items.accounts)
    document.getElementById('users').innerHTML = st;
  });


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("Tweet").addEventListener("click", function(){
 	 var acsToken = '';
 	 var acsSecret = '';
   var text ="";
   text =document.getElementById("contents").value;
 	 var Info = document.getElementById("users").value;
   if(Info==""||Info==undefined){
     document.getElementById("ERLOG").innerHTML="アカウントを選べ"
     return;
   }
   chrome.storage.local.get("accounts",function(items) {
    console.log(items.accounts[Info]);
    acsToken =items.accounts[Info].AT;
    console.log(acsToken);
    acsSecret =items.accounts[Info].AS;
    console.log(acsSecret);

    if(acsToken==""||acsSecret==""){
      document.getElementById("ERLOG").innerHTML="なんかエラー起きた"
      return;
    }
    if(text==""){
      document.getElementById("ERLOG").innerHTML="なんか書け"
      return;
    }
    document.getElementById('Tweet').value="送信中";
    SendRequest({"action":"Tweet",AT:acsToken,AS:acsSecret,"text":text},function(res){
      console.log(res);
      if(res.created_at){
        document.getElementById("ERLOG").innerHTML="成功したっぽい";
        document.getElementById("contents").value="";
      }else if(res.status==431){
      document.getElementById("ERLOG").innerHTML="文字が長過ぎる";
    }else if(res.status==403){
      document.getElementById("ERLOG").innerHTML="連投してない？";
    }else{
    document.getElementById("ERLOG").innerHTML="文字数と連投以外の要因でエラーが起きてる。code:"+res.status;
    }
    document.getElementById("Tweet").value="ついっと"
    });
  });

  });
});



function makelist (accounts){
  var an="<option value =''>選んで</option>";
  for(var id in accounts){
    an +="<option value='"+id+"'>"+accounts[id].scr+"</option>"
  }
  return an;
 ;
}
