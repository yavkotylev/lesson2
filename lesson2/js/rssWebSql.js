function getFeedWebSql(){
	var FEED_URL = "http://www.3dnews.ru/news/rss/";
	var width = screen.width;
	var i = 0;
	var arr = [];
	
	$(document).ready(function(){
		$.ajax({
			type: "GET",
			url: FEED_URL,
			dataType: "xml",
			error: getStorageSql(function(res){
				for (i = 0; i < res.rows.length; i++){
					var title = res.rows.item(i)['title'];
					var url_img = res.rows.item(i)['image'];
					var description = res.rows.item(i)['description'];
				
					
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
		clearStorageSql();
		alert("s");
		getStorageSql(function(res){alert(""+ res.rows.lenght);});
		alert("e");
		$(xml).find("item").each(function(){

			var url_img = $(this).find("enclosure").attr('url');
			
			$("#rssContent").append('<div class="feed">	<div class="images">'+
					'<img src=' + url_img +' width=' + width + 'px /></div>'+
					'<div class="title">'+ $(this).find("title").text() +'</div>'+
					'<div class="description">'+ $(this).find("description").text() +'</div></div>');
			
			arr[i]= {title:$(this).find("title").text(), description:$(this).find("description").text(), url_img:$(this).find("enclosure").attr('url')};
			setDataWebSql(arr[i]);
			i++;
		});
		
	}
	
	
	
}


var dbSql;



function connectWebSQL(){
	dbSql = openDatabase('DBWebSQL', '1.0', 'Test DB', 1024 * 1024);
	if(!dbSql){alert("Failed to connect to database.");}
}


function getDataWebSql(key){
	connectWebSQL();
	dbSql.transaction(function(tx) {
		tx.executeSql("SELECT * FROM RSSNEWS", [], function (tx, result) {}, function (tx, error) {
			tx.executeSql("CREATE TABLE RSSNEWS (id REAL UNIQUE, title TEXT, description TEXT, image TEXT)", [], null,
					function(){alert("Error creating");});
			});});
}

function getStorageSql(f){
	alert("0");
	connectWebSQL();
	alert("1");
	dbSql.transaction(function (tx) {
		alert("2");
		   tx.executeSql('SELECT * FROM RSSNEWS', [], 
				   function (tx, results) {alert("5");f(results);alert("6");}, 
				   function(tx){tx.executeSql("CREATE TABLE RSSNEWS (title TEXT, description TEXT, image TEXT)", [], null, 
						   function(){alert("Create error");});});alert("3");
		});
}




function setDataWebSql(obj){
	connectWebSQL();
	dbSql.transaction(function(tx) {
		tx.executeSql("INSERT INTO RSSNEWS (title, description, image) values(?, ?, ?)", [obj['title'], obj['description'], obj['url_img']], 
				null,
				function(tx){
					tx.executeSql("CREATE TABLE RSSNEWS (title TEXT, description TEXT, image TEXT)", [], null, 
					   function(){alert("Create error");});
					setDataWebSql(obj);
					
				}
			);
		});
	
	
}

function clearStorageSql(){
	connectWebSQL();
	dbSql.transaction(function (tx) {
		  tx.executeSql('DROP TABLE RSSNEWS', [], 
		  null,
		  function(){alert("clear error");});
		});
	

}



