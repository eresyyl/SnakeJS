app.factory('levels', ['$http', function($http) {
	return $http.get('api/levels.json');
}]);