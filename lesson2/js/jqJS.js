var dbSql;

function searchDB(valueSearch){	
	//alert(valueSearch);
	
	getStorageSql(function(res){
		alert("1");
		if (res.rows.length == 0){
			alert("2");
			getFeedWebSql();
			alert("3");
		}
				
			
		for (i = 0; i < res.rows.length; i++){
			var title = res.rows.item(i)['title'];
			var url_img = res.rows.item(i)['image'];
			var description = res.rows.item(i)['description'];
			
		
			
			$("#rssContentDB").append('<div class="feed">	<div class="images">'+
					'<img src=' + url_img +' width=' + width + 'px /></div>'+
					'<div class="title">'+ title +'</div>'+
					'<div class="description">'+ description +'</div></div>');
					if (i==0){
						alert(title + url_img + description);
					}
		}
		
	});
}


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
			error: null,
			success: xmlParser			
		});
		
	});
	
	
	function xmlParser(xml){
		clearStorageSql();
		alert("s");
		//getStorageSql(function(res){alert(""+ res.rows.lenght);});
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
function connectWebSQL(){
	dbSql = openDatabase("Example", "0.1", "items", 200000);
	if(!dbSql){alert("Failed to connect to database.");}
	
}


function getStorageSql(f){
	connectWebSQL();
	dbSql.transaction(function (tx) {
		   tx.executeSql('SELECT * FROM RSSNEWS', [], 
				   function (tx, results) {f(results);}, 
				   function(tx){tx.executeSql("CREATE TABLE RSSNEWS (title TEXT, description TEXT, image TEXT)", [], null, 
						   function(){alert("Create error");});
				   getFeedWebSql();
				   });
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

















function changeTheme(theme){
	
	
	
	var selectedTheme = theme.toLowerCase()[theme.length - 1];
	var currentTheme = $('#settings').attr('data-theme');
	
    //var selectedTheme = $(this).val();
	
	$('.ui-body-' + currentTheme).each(function(){
        $(this).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme);    
    });

    $('.ui-btn-up-' + currentTheme).each(function(){
        $(this).removeClass('ui-btn-up-' + currentTheme).addClass('ui-btn-up-' + selectedTheme);    
    });

    $('.ui-btn-down-' + currentTheme).each(function(){
        $(this).removeClass('ui-btn-down-' + currentTheme).addClass('ui-btn-down-' + selectedTheme);    
    });
    
    //====== Settings
    $('#settings').find('*[data-theme]').each(function(index){
        $(this).attr('data-theme',selectedTheme);
    });

    $('#settings').attr('data-theme', selectedTheme).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme).trigger('create');
    //====== Settings
    
    
    
    
    //====== main_page
    $('#main_page').find('*[data-theme]').each(function(index){
        $(this).attr('data-theme',selectedTheme);
    });

    $('#main_page').attr('data-theme', selectedTheme).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme).trigger('create');
    //====== main_page
    
    
    
    
    
    
    //====== contact
    $('#contact').find('*[data-theme]').each(function(index){
        $(this).attr('data-theme',selectedTheme);
    });

    $('#contact').attr('data-theme', selectedTheme).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme).trigger('create');
    //====== contact
    
    
    
    
    //====== search
    $('#search').find('*[data-theme]').each(function(index){
        $(this).attr('data-theme',selectedTheme);
    });

    $('#search').attr('data-theme', selectedTheme).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme).trigger('create');
    //====== search
        
}