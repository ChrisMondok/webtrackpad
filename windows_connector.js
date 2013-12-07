var q = require('q');

module.exports = {
	initialize: function(){
		var deferred = q.defer();
		
		deferred.resolve("HOORAY PROMISES");

		return deferred.promise;	
	},
	handleMouseMove: function(){ console.log(arguments)},
	handleMouseDown: function(){ console.log(arguments)},
	handleMouseUp: function(){ console.log(arguments)},
	handleKeyDown: function(){ console.log(arguments)},
	handleKeyUp: function(){ console.log(arguments)}
}