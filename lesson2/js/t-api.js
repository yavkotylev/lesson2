/**
 * 
 */


function SingleVibro(){
	navigator.vibrate(2000);
}

function MultiVibro(){
	navigator.vibrate([2000, 100, 2000, 100, 2000]);
	
}

function StopVibro(){
	navigator.vibrate(0);
}


var adapter;

(function(){
	try{
		if(tizen.bluetooth === undefined){
			alert("Bluetooth doesn't work");
		}
		adapter = tizen.bluetooth.getDefaultAdapter();
		window.setInterval(UIsliderBT(), 500);
	}
	catch(e){
		alert(e);
	}
	
}());


function BTpowerOff(){
	if(adapter.powered){
		adapter.setPowered(false, function(){}, function(){});
	}
}

function BTpowerOn(){
	if(!adapter.powered){
		adapter.setPowered(false, function(){}, function(){});
	}
	
}

function OnOffBT(){
	if ($("#BTslider").val() === "on"){
		BTpowerOn();
	}
	else{
		BTpowerOff();
	}
	
}

function UIsliderBT(){
	if(adapter.powered){
		$("#BTslider").val("on").slider("refresh");
	}
	else{
		$("#BTslider").val("off").slider("refresh");
	}
}