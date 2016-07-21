var documentsDir;

function onsuccess(files) {
	   for (var i = 0; i < files.length; i++) {
	     console.log("File Name is " + files[i].name); // displays file name
	   }

	   var testFile = documentsDir.createFile("test.txt");
	   if (testFile !== null) {
	     testFile.openStream(
	         "w",
	         function(fs) {
	           fs.write("HelloWorld");
	           fs.close();
	         }, function(e) {
	           console.log("Error " + e.message);
	         }, "UTF-8"
	     );
	   }
}

 function onerror(error) {
   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
 }

 
 function WriteFile(){
	 tizen.filesystem.resolve(
		     'documents',
		     function(dir) {
		       documentsDir = dir; dir.listFiles(onsuccess,onerror);
		     }, function(e) {
		       console.log("Error" + e.message);
		     }, "rw"
		 ); 
 }
 
 
 var textToWrite;
 
 function writeLog(inf){
	 textToWrite = inf;
	 tizen.filesystem.resolve('documents',
			 function(dir){
			 documentsDir = dir; dir.listFiles(successWriteLog, errorWriteFile);
			 },	function(e){alert("Error log");}, "rw");
 }
 
 
 function writeMess(){
	 var nameUser = $("#name").val();
	 var textUser = $("#textareaBetter").val();
	 if (nameUser === "" || textUser === ""){
		 alert("Fill text!");
		 return;
	 }
	 if ((nameUser.indexOf("*") > -1) || (textUser.indexOf("*") > -1)){
		 alert('Don\'t use "*"!');
		 return;
	 }
	 textToWrite = nameUser + "****" + textUser + "****";
	 tizen.filesystem.resolve('documents',
			 function(dir){
			 documentsDir = dir; dir.listFiles(successWriteMess, errorWriteFile);
			 },	function(e){alert("Error log");}, "rw");
	 $("#name").val("");
	 $("#textareaBetter").val("");
	 alert("Thank you!");
 }
 
 
 
 function getDateNow(){
	 var today = new Date();
	 var dd = today.getDate();
	 var mm = today.getMonth()+1; //January is 0!
	 var yyyy = today.getFullYear();

	 if(dd<10) {
	     dd='0'+dd;
	 } 

	 if(mm<10) {
	     mm='0'+mm;
	 } 

	 today = mm+'-'+dd+'-'+yyyy;
	 return today;
 }
 
 function getTimeNow(){
	 var currentdate = new Date(); 
	 var hour = currentdate.getHours();
	 if (hour < 10){
		 hour = '0' + hour;
	 }
	 var min = currentdate.getMinutes();
	 if (min < 10){
		 min = '0' + min;
	 }
	 var sec = currentdate.getSeconds();
	 if(sec < 10){
		 sec = '0' + sec;
	 }
	 
	 var time = "" + hour + ":" + min + ":" + sec;
	 return time;
 }
 
 function successWriteMess(files){
	 var item = -1;
	 var nowDate = getDateNow();
	 for (var i = 0; i < files.length; i++) {
	     if (files[i].name === ("mess-" + nowDate + ".txt")){
	    	 item = i;
	     } 
	 }
	 
	 var testFile;
	 if (item === -1){
		 testFile = documentsDir.createFile("mess-"+ nowDate +".txt");
	 }
	 else{
		 testFile = files[item];
	 }
	 
	 
	   if (testFile !== null) {
	     testFile.openStream(
	         "a",
	         function(fs) {
	           fs.write(""+ textToWrite + "" + getTimeNow() + "\n");
	           fs.close();
	         }, function(e) {
	           console.log("Error " + e.message);
	         }, "UTF-8"
	     );
	   }
	 }
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
function successWriteLog(files){
	 var item = -1;
	 for (var i = 0; i < files.length; i++) {
	     if (files[i].name === ("log.txt")){
	    	 item = i;
	     } 
	 }
	 
	 var testFile;
	 if (item === -1){
		 testFile = documentsDir.createFile("log.txt");
	 }
	 else{
		 testFile = files[item];
	 }
	 
	 
	   if (testFile !== null) {
	     testFile.openStream(
	         "a",
	         function(fs) {
	           fs.write(""+ textToWrite + "---" + getDateNow() + "  " + getTimeNow() +"\n");
	           fs.close();
	         }, function(e) {
	           console.log("Error " + e.message);
	         }, "UTF-8"
	     );
	   }
	 }


function errorWriteFile(error) {
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 
 }
 

function getAllMess(){
	 tizen.filesystem.resolve('documents',
			 function(dir){
			 documentsDir = dir; dir.listFiles(successWriteListMess, errorWriteFile);
			 },	function(e){alert("Error log");}, "rw");
}
 

function successWriteListMess(files){
	
	$("#listMess").empty();
	$("#listMess").append('<ul data-role="listview" data-inset="true" data-theme="a">');
	
	for (var i = 0; i < files.length; i++) {
	     if (files[i].name !== ("log.txt")){
	    	 $("#listMess").append('<li><a href="#showFeedback" onclick=' +'\'fillShowMessage("' + files[i].name + '");\'>' + files[i].name + '</a></li>');
	     } 
	 }
	$("#listMess").append('</ul>');
	
}

var fileNameMess;
function fillShowMessage(fileName){;
	fileNameMess = fileName;
	tizen.filesystem.resolve('documents',
			 function(dir){
			 documentsDir = dir; dir.listFiles(successWriteMessText, errorWriteFile);
			 },	function(e){alert("Error log");}, "rw");

}


function successWriteMessText(files){
	$("#textMess").empty();
	var openFile;
	for (var i = 0; i < files.length; i++) {
	     if (files[i].name === fileNameMess){
	    	 openFile = files[i];
	     } 
	}
	
	openFile.readAsText(
	           function(str) {
	        	   var arrayInf = str.split("\n");
	        	   $("#textMess").append('<p>---------------------------------</p>');
	        	   for (j = 0; j < arrayInf.length; j++){
	        		   var arrayInfOne = arrayInf[j].split("****");
	        		   
	        		   $("#textMess").append('<p>Name: ' + arrayInfOne[0] + '</p>');
		        	   $("#textMess").append('<p>Date: ' + arrayInfOne[2] + '</p>');
		        	   $("#textMess").append('<p>Message: ' + arrayInfOne[1] + '</p>');
		        	   $("#textMess").append('<p>---------------------------------</p>');
	        	   }
	        	  
	        	   
	        	   
	             //var arrayInf = str.split('****');
	             //for (i = 0; i < arrayInf.length; i++){
	            	 
	             //}
	           }, function(e) {
	             console.log("Error " + e.message);
	           }, "UTF-8"
	       );
	
	
}