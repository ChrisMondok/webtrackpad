var q = require('q'),
	exec = require('child_process').exec;
var callClickandMouseControl = function(arguments){

var child = exec('ClickAndMouseControl.exe ' + arguments, function( error, stdout, stderr) 
   {
       if ( error != null ) {
            console.log(stderr);
       }	
       console.log(stdout);
   });
}

module.exports = {
	initialize: function(){
		var deferred = q.defer();
		
		deferred.resolve(this);

		return deferred.promise;	
	},
	doMouseMove: function(x,y){
		var scaleFactor = 10; 
		callClickandMouseControl(x * scaleFactor+' '+y * scaleFactor)
	},
	doMouseDown: function(){ console.log(arguments)},
	doMouseUp: function(){ console.log(arguments)},
	doKeyDown: function(){ console.log(arguments)},
	doKeyUp: function(){ console.log(arguments)}
}