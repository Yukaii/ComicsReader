console.log("reader starts");
// var comics=comics || { };
document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		comics.setImages=function(doc){
			var scriptURL=doc.evaluate("/html/head/script[2]",doc,null,XPathResult.ANY_TYPE,null).iterateNext().getAttribute('src');
			var chapternum=/http\:\/\/comic\.sfacg\.com\/HTML\/.*\/(\w*)\/$/.exec(doc.URL)[1];
			comics.chapterId=chapternum;
			var req = new XMLHttpRequest;
			req.open("GET",scriptURL);
			req.onload=function(){
				eval(req.response);
				comics.titleInfor=comicName+" / 第"+comics.chapterId+"話 ";		
				comics.nextURL_tmp=nextVolume;
				comics.preURL_tmp=preVolume;	
				if(nextVolume=="javascript:alert('已经是当前连载的最后一回!');"){
					comics.nextURL_tmp="";
					comics.maxChapter=comics.chapterId;	
				}
				if(preVolume=="javascript:alert('已经是当前连载的最初回!');"){
					comics.preURL_tmp="";	
				}

				var name = "picHost=";
				var picHost="";
    			var ca = document.cookie.split(';');
    			for(var i=0; i<ca.length; i++) {
        			var c = ca[i];
        			while (c.charAt(0)==' ') c = c.substring(1);
        			if (c.indexOf(name) == 0) picHost= c.substring(name.length,c.length);
    			}
    			picHost = picHost==null?0:picHost;
				picHost = hosts[picHost];
    			var img =[]; 
				comics.pageMax=picCount;
				for(var i=0;i<comics.pageMax;i++){
					img[i]=picHost+picAy[i];
				}
				comics.images=img;
				comics.appendImage();
			};
			req.send(); 
		}		
		comics.maxChapter=9999;
		comics.createItem();
		comics.setImages(document);	
		echo.init({
	    	offset: 2500,
	    	throttle: 100,
	    	unload: false,
	    	update: function () {
	    		if(comics.nextURL!==""){
		        	var req=new XMLHttpRequest();
				    // console.log("http://manhua.ali213.net"+comics.nextURL);
				    req.open("GET",comics.nextURL,true);
				    req.responseType="document";
				    req.onload=function(){
				      console.log(req.response);
				      var doc=req.response;
				      comics.setImages(doc);
				      // comics.appendImage();
				    };
				    req.send();
				}
	    	}
		});
	}
}