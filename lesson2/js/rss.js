function getFeed(){
	var FEED_URL = "http://www.3dnews.ru/news/rss/";
	var width = screen.width;
	var i = 0;
	var arr = [];
	
	$(document).ready(function(){
		$.ajax({
			type: "GET",
			url: FEED_URL,
			dataType: "xml",
			error: getStorage(function(res){
				for(var field in res){
					for (var fieldValue in (value = res[field])){
						
						switch (fieldValue){
						case 'title':
							var title = value[fieldValue];
							break;
						case 'description':
							var description = value[fieldValue];
							break;
						case 'url_img':
							var url_img = value[fieldValue];
							break;					
						}
					}
					
					$("#rssContent").append('<div class="feed">	<div class="images">'+
							'<img src=' + url_img +' width=' + width + 'px /></div>'+
							'<div class="title">'+ title +'</div>'+
							'<div class="description">'+ description +'</div></div>');
					
				}
			}),
			success: xmlParser			
		});
		
	});
	
	
	function xmlParser(xml){
		
		clearStorage();
		
		$(xml).find("item").each(function(){

			var url_img = $(this).find("enclosure").attr('url');
			
			$("#rssContent").append('<div class="feed">	<div class="images">'+
					'<img src=' + url_img +' width=' + width + 'px /></div>'+
					'<div class="title">'+ $(this).find("title").text() +'</div>'+
					'<div class="description">'+ $(this).find("description").text() +'</div></div>');
			
			arr[i]= {url_img:$(this).find("enclosure").attr('url'), title:$(this).find("title").text(), description:$(this).find("description").text()};
			setData(arr[i]);
			i++;
		});
		
	}
	
	
}



var indexedDB 	  = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
baseName 	  = "filesBase",
storeName 	  = "filesStore";




function logerr(err){
	console.log(err);
}

function connectDB(f){
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function(){
		f(request.result);
	}
	request.onupgradeneeded = function(e){
		var objectStore = e.currentTarget.result.createObjectStore(storeName, { autoIncrement: true });
		connectDB(f);
	}
}

function getData(key, f){
	connectDB(function(db){
		var request = db.transaction([storeName], "readonly").objectStore(storeName).get(key);
		request.onerror = logerr;
		request.onsuccess = function(){
			f(request.result ? request.result : -1);
		}
	});
}

function getStorage(f){
	connectDB(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}

function setData(obj){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).add(obj);
		request.onerror = logerr;
		request.onsuccess = function(){
			return request.result;
		}
	});
}

function delData(key){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("File delete from DB:", file);
		}
	});
}

function clearStorage(){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).clear();
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("Clear");
		}
	});
}




