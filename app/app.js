(function(){
	// Declare our app
	var app = angular.module('magicMirror', []);
	
	// The MirrorClock controller
	app.controller('MirrorClock', function($scope, $interval) {
		var tick = function() {
			$scope.clock = Date.now();
		}
		tick();
		$interval(tick, 1000);
	});
	
	// The Random Welcome Message Factory
	app.factory('WelcomeMessageFactory', function($http) {
		var quoteList = {};
		
		quoteList.getQuoteList = function() {
			return $http.get('/assets/js/quotes.json');
		}
		
		return quoteList;
	});
	
	// The Random Welcome Message Controller
	app.controller('WelcomeMessage', ['$scope', '$interval', 'WelcomeMessageFactory', function($scope, $interval, WelcomeMessageFactory) {
		var interval = 1000 * 30;
		var newQuote = function() {	
			WelcomeMessageFactory.getQuoteList().success(function(data) {
				$scope.quote = data[Math.floor(Math.random()*data.length)];
			});
		}
		newQuote();
		$interval(newQuote, interval);
	}]);
		
	// The Weather Factory
	app.factory('WeatherFactory', function($http, $interval) {
		var apiKey = '998d0913e97301f02e9ff58b8f97dc2f';
		// Geocoded from Google Geocode API based on the ZIP Code - stored in sgf_geolocation.json so that we do not have to poll the geocode API repeatedly
		var lat = 37.178649;
		var lng = -93.270713;
		var interval = 1000 * 60 * 15;  // 15 Minutes
		var cachedForecast;
		
		// Poll forecast.io for data.  If successful store data and run callback function.  On error, log error in console and pass error to callback.  DECLARATION ONLY.  Not run automatically.
		function pollForecastIO(callback) {
			var url = ['https://api.forecast.io/forecast/', apiKey, '/', lat, ',', lng, '?callback=JSON_CALLBACK'].join('');
			
			$http.jsonp(url)
				.success(function(data) {
					callback(null, data);
				})
				.error(function(error) {
					console.log(err);
					callback(error);
				});
		}
		
		// Get current forecast.  DECLARATION ONLY.  Not run automatically.
		function currentForecast(callback) {
			//check if we already have cached forecast data
			if(!cachedForecast) {
				pollForecastIO(function(err, data) {
					cachedForecast = data;
					callback(null, cachedForecast);
				})
			} else {
				callback(null, cachedForecatst);
			}
		}
		
		// Actually call our functions to get weather data.  Use $interval to update weather at our defined local var interval.
		$interval(function() {
			pollForecastIO(function(err, data) {
				cachedForecast = data;
			});
		}, interval);
		
		// Return our weather info as an Object literal for use via controllers in the DOM
		return {
			currentForecast: currentForecast
		};
	});
	
	// The MirrorWeather controller
	app.controller('MirrorWeather', ['$scope', 'WeatherFactory', function($scope, WeatherFactory) {
		$scope.init = function() {
			WeatherFactory.currentForecast(function(err, data) {
				if(err) {
					$scope.forecastError = err;
				} else {
					$scope.forecast = data;
				}
			});
		};
		$scope.limit = 5;
	}]);
	
	// Filter for temperature numbers to round off decimals and add "degree symbol" (\u00B0)
	app.filter('temp', function($filter) {
		return function(input, precision) {
			if(precision === undefined) {
				precision = 1;
			}
			var numberFilter = $filter('number');
			return numberFilter(input, precision) + '\u00B0F';
		};
	});
	
	// Filter for percentages to round decimals and add the % to the end
	app.filter('percent', function($filter) {
		return function(input, decimals) {
			return $filter('number')(input * 100, decimals) + '%';
		};
	});
	
})();
/*
https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
https://maps.googleapis.com/maps/api/geocode/json?address=1945+Pickwick,+Springfield,+MO&key=AIzaSyA6KJc_ZN8oa1mMXRDMMmgZV6NcKtJbp5Y
*/