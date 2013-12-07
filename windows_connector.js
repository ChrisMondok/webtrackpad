var q = require('q');

module.exports = {
	initialize: function(){
		var deferred = q.defer();
		
		deferred.resolve(this);

		return deferred.promise;	
	},
	doMouseMove: function(){ console.log(arguments)},
	doMouseDown: function(){ console.log(arguments)},
	doMouseUp: function(){ console.log(arguments)},
	doKeyDown: function(){ console.log(arguments)},
	doKeyUp: function(){ console.log(arguments)}
}