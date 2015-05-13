app.controller('SnakeController', ['$scope', '$localStorage', '$interval', 'levels', function($scope, $localStorage, $interval, levels) {
	var direction = 'up';
	var stopTime;
	$scope.isPlaying = false;
	$scope.levelNumber = 0;
	$scope.$storage = $localStorage.$default({
		'bestResult': {
			'username' : 'eresyyl',
			'levelNumber' : 0,
			'score': 0
		}
	});
	
	//get levels
	levels.success(function(data) {
		$scope.levels = data;
		
		$scope.renderLevel();
	});
	
	$scope.levelStart = function(){
		if(!$scope.isPlaying){
			$scope.isPlaying = true;		
			
			$scope.score = 0;
			//placefood
			placeFood();
			//starting game
			stopTime = $interval(move, 500);
		}
	}
	
	//render current level by number
	$scope.renderLevel = function(){
		var level = $scope.levels[$scope.levelNumber];//get current level info
		$scope.snake = level['snake'];//get snake info
		direction = level['direction'];//set start direction
		
		//creating a game field
		var field = [];
		for(var i = 0; i < level.height; i++){
			field[i] = [];
			for(var j = 0; j < level.width; j++){
				field[i][j] = '';
			}
		}
		
		//insert borders
		for(var i in level['border']){
			field[level['border'][i][0]][level['border'][i][1]] = 'border';
		}
		
		//insert start snake position
		for(var i in level['snake']){
			field[level['snake'][i][0]][level['snake'][i][1]] = 'snake';
		}
		//render field
		$scope.field = field;
	}
	
	//get direction
	$scope.key = function($event){
		if ($event.keyCode == 38 && direction != "down")
			direction = "up";
		else if ($event.keyCode == 39 && direction != "left")
			direction = "right";
		else if ($event.keyCode == 40 && direction != "up")
			direction = "down";
		else if ($event.keyCode == 37 && direction != "right")
			direction = "left";
	}
	
	//move snake
	var move = function(){
		var nextElement = getNextElement();
		var snakeLength = $scope.snake.length;
		var tempSnake = [];
		
		//if nextElement has class food, than snake grows and we place new food
		if( $scope.field[nextElement[0]][nextElement[1]] != 'food'){
			$scope.field[$scope.snake[snakeLength - 1][0]][$scope.snake[snakeLength - 1][1]] = '';
		}
		else{
			tempSnake[snakeLength] = $scope.snake[snakeLength - 1];
			$scope.score++;
			placeFood();
		}
		
		//if nextElement doesn't has class border, than snake move
		if( $scope.field[nextElement[0]][nextElement[1]] != 'border' && $scope.field[nextElement[0]][nextElement[1]] != 'snake'){
			$scope.field[nextElement[0]][nextElement[1]] = 'snake';
			
			for(var i = 1; i < snakeLength; i++){
				tempSnake[i] = $scope.snake[i - 1];
			}
			
			$scope.snake = tempSnake;
			$scope.snake[0] = nextElement;
		}
		else{//BOOM!
			$scope.field[nextElement[0]][nextElement[1]] = 'crash';
			
			$interval.cancel(stopTime);
			//save score
			saveResult();
		
			$scope.isPlaying = false;
			$scope.renderLevel();
		}
		
	}
	
	var saveResult = function(){		
		if($scope.$storage.bestResult['score'] < $scope.score){
			username = prompt("New best is " + $scope.score + "!\nAnd what is yor name, sir?");
		
			$scope.$storage.bestResult = {
				'username' : username,
				'levelNumber' : $scope.levelNumber,
				'score' : $scope.score
			};
		}
		else{
			alert("FRUTALITY!\n Your score is " + $scope.score);
		}
	}
	
	//get next element by direction
	var getNextElement = function(){
		switch( direction ){
			case 'down':
				return [$scope.snake[0][0] + 1, $scope.snake[0][1]];
				break;
			case 'up':
				return [$scope.snake[0][0] - 1, $scope.snake[0][1]];
				break;
			case 'left':
				return [$scope.snake[0][0], $scope.snake[0][1] - 1];
				break;
			case 'right':
				return [$scope.snake[0][0], $scope.snake[0][1] + 1];
				break;
		}
	}
	
	//place food
	var placeFood = function(){
		//get empty places on field
		var emptyPlaces = [];
		
		for(var i in $scope.field){
			for(var j in $scope.field[i]){
				if($scope.field[i][j] == ''){
					emptyPlaces.push([i, j]);
				}
			}
		}
		
		//get random empty place
		var foodPlace = emptyPlaces[Math.floor(Math.random()*emptyPlaces.length)];
		//place a food
		$scope.field[foodPlace[0]][foodPlace[1]] = 'food';
	}
}]);