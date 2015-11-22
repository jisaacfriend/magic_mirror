(function(){
	// Declare our app
	var app = angular.module('magicMirror', []);
	
	// The MirrorClock controller
	app.controller('MirrorClock', function($scope, $interval){
		var tick = function() {
			$scope.clock = Date.now();
		}
		tick();
		$interval(tick, 1000);
	});
	
	// The Weather factory
	app.factory('weatherService', ['$http', '$q', function($http, $q){
		var zip = 64109;
		var lat = 37.178649;
		var lng = -93.270713;
		var forecastApiKey = '998d0913e97301f02e9ff58b8f97dc2f';
		var gmapsApiKey = AIzaSyClw7Ga1DA3wmeKe-k2_PhsKkYgX6fqSYE;
		function getWeather(lat, lng, forecastApiKey) {
			var deferred = $q.defer();
			$http.get('https://api.forecast.io/forecast/' + forecastApiKey + '/' + lat + ',' + lng)
				.success(function(data){
					deferred.resolve(data.query.results.channel);
				})
				.error(function(err){
					console.log('Error retrieving weather.');
					deferred.reject(err);
				});
			return deferred.promise;
		}
		return {
			getWeather: getWeather
		};
	}]);
})();
/*
https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
https://maps.googleapis.com/maps/api/geocode/json?address=1945+Pickwick,+Springfield,+MO&key=AIzaSyA6KJc_ZN8oa1mMXRDMMmgZV6NcKtJbp5Y
*/