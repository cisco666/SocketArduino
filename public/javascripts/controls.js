$(document).ready(function() {
	var socket = io.connect();
	$("#on").click(function(){
		socket.emit("led-on");
	});
	$("#off").click(function(){
		socket.emit("led-off");
	});
});