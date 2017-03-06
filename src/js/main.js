require('../index.html')
require('../css/main.scss')

require('./utils/requestAnimationFrame')
require('./utils/windowToCanvas')
var Background = require('./game/background')
var Racket = require('./game/racket')
var Brick = require('./game/brick.js')
var Ball = require('./game/ball')
var getFps = require('./utils/fps')
var detect2RectCollision = require('./utils/detect2RectCollision').detect2RectCollision
var afterCollised = require('./utils/detect2RectCollision').afterCollised

require('../img/player_on.png')
require('../img/player_off.png')
require('../img/thumb1.png')
require('../img/thumb2.png')
require('../img/thumb3.png')
require('../img/thumb4.png')
require('../img/thumb5.png')
require('../img/thumb6.png')
require('../img/thumb7.png')
require('../img/thumb8.png')
require('../img/thumb9.png')
require('../img/thumb10.png')
require('../img/thumb11.png')
require('../img/thumb12.png')
require('../img/thumb13.png')
require('../img/thumb14.png')
require('../img/thumb15.png')
require('../img/thumb16.png')
require('../img/thumb17.png')
require('../img/thumb18.png')
require('../img/thumb19.png')
require('../img/thumb20.png')
require('../img/thumb21.png')
require('../img/thumb22.png')
require('../img/thumb23.png')
require('../img/thumb24.png')
require('../img/thumb25.png')

var Preloader = require('preloader.js')



var imgArr = []

for (var i = 0; i < 25; i++) {
	var imgPath = '../img/thumb' + (i + 1) + '.png'
	imgArr.push(imgPath)
}

imgArr.push('../img/player_on.png')
imgArr.push('../img/player_off.png')


/**
 * preloader && start
 */
var preloader = new Preloader({
	resources: imgArr,
	concurrency: 6
})
preloader.addProgressListener(function(loaded, length) {
	// console.log('loaded', loaded, length, loaded / length)
})
preloader.addCompletionListener(function() {
	// $('#o2_loading').remove()
	$('#o2_main').removeClass('hide')

	game.init()
	// game.start()

})
preloader.start()



var canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d'),
	bbox = canvas.getBoundingClientRect(),
	$gameComplete = $('.game_complete'),
	$gameSuccessText = $gameComplete.find('.game_success'),
	$gameFailText = $gameComplete.find('.game_fail');






window.ratio = 1// canvas.width / bbox.width


function Game() {
	this.elements = []
	this.bricks = []
	this.racket
	this.ball
	this.isPaused = true
	this.isGameOver = false
	this.hp = 25
	this.score = 0
	this.runingTime = 0
}


Game.prototype = {
	init: function() {
		var background = new Background(canvas)
		var racket = new Racket(canvas)
		var ball = new Ball(canvas, {
			on_imageObj: preloader.get('../img/player_on.png'),
			off_imageObj: preloader.get('../img/player_off.png')
		})
		this.racket = racket
		this.ball = ball
		this.elements.push(background)
		this.elements.push(ball)
		this.elements.push(racket)
		
		for(var i = 0; i < this.hp; i++) {
			var left = (i % 5) * (canvas.width / 5),
				top = Math.floor(i / 5) * 100 / 2
			var brick = new Brick({
				index: i,
				left: left,
				top: top,
				imageObj: preloader.get('../img/thumb' + (i + 1) + '.png')
			}, canvas)
			this.bricks.push(brick)
		}

		// console.log(this.bricks)

			// 事件绑定
			// 资源预加载
	},

	start: function() {

		this.isPaused = false
		this.runingTime = +new Date()
		window.requestAnimationFrame(loop)
	},

	restart: function() {
		this.bricks.length = 0
		this.elements.length = 0
		this.ball = null
		this.racket = null
	},

	pause: function(isPaused) {
		if(isPaused === undefined) 
			this.isPaused = true
		else 
			this.isPaused = isPaused
	},

	clearScreen: function(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	},

	drawBrick() {

	}
}

function drawFPS(ctx, fps) {
	ctx.save()
	ctx.font = '30px Microsoft YaHei'
	ctx.fillStyle = 'cornflowerblue'
	ctx.fillText(fps + ' fps', 20, 60)
	ctx.restore()
}


var lastGameTime = 0,
	lastFpsTime = 0,
	fpsDur = 1000,
	curFps = getFps().toFixed(),
	displayFps = 0;

	window.game = new Game()
	// tick is requestAnimateFrame 第一次启动是的时间刻。
function loop(tick) {
	// console.log(game.isPaused)
	if(!game.isPaused) {

		
		if(!game.ball.isGameOverUp && !game.ball.isGameOverDown) {
			game.isPaused = true
			game.isGameOver = true

			$gameComplete.show().addClass('fail')
			console.log('结束动画完毕')
			game.runingTime = +new Date() - game.runingTime
		}
		if(game.score === game.hp) {
			game.isGameOver = true
			game.isPaused = true
			$gameComplete.show().addClass('success')
			game.runingTime = +new Date() - game.runingTime
		}

		// console.log(game.runingTime)

		game.clearScreen(ctx)

		var ballAndRacketAngle = detect2RectCollision(game.ball, game.racket)
		// afterCollised(game.ball, game.racket, ballAndRacketAngle)
		if(ballAndRacketAngle !== null) {
			// console.log(ballAndRacketAngle)

			var ballCenterX = game.ball.left + game.ball.width / 2,
				racketCenterX = game.racket.left + game.racket.width / 2,
				distanceOfcenterX = ballCenterX - racketCenterX;

			game.ball.changeVelocityX(distanceOfcenterX)

			// game.ball.velocityX = -game.ball.velocityX
			game.ball.velocityY = -game.ball.velocityY
		}

		for(var i = 0, len = game.bricks.length; i < len; i++) {
			var curBrick = game.bricks[i]
			if(curBrick.isVisible) {

				var ballAndBrickAngle = detect2RectCollision(curBrick, game.ball)
				// console.log(ballAndBrickAngle)
				if(ballAndBrickAngle !== null) {
					afterCollised(curBrick, game.ball, ballAndBrickAngle)
					game.score++
					curBrick.isVisible = false
				}
			}
		}


		game.elements.forEach(function(ele, index) {
			ele.draw()
		})

		game.bricks.forEach(function(ele, index) {
			ele.draw()
		})
		
		// getFps
		fps = getFps(tick, lastGameTime)

		// update display fps per second
		if (tick - lastFpsTime >= fpsDur) {
			displayFps = fps.toFixed()
			lastFpsTime = tick
		}

		lastGameTime = tick
		drawFPS(ctx, displayFps)
	}
	
	window.requestAnimationFrame(loop)
}

$('.pause_btn').on('click', function(e) {
	gamePauseHandle(!game.isPaused)
})

function gamePauseHandle(isPaused) {
	$('.pause_btn').text(isPaused ? '开始' : '暂停')
	// console.log(isPaused)
	game.pause(isPaused)
}


$('.start_btn').on('click', function(e) {
	$('.game_start').hide()
	$('#stage').show()
	$('.fixed_bottom').show()
	// window.requestAnimationFrame(loop)

	game.start()
	gamePauseHandle(game.isPaused)
})

$('.play_again').on('click', function(e) {
	game.ball.isGameOver = false
	game.ball.isGameOverUp = true
	game.ball.isGameOverDown = false
	game.runingTime = 0
	game.isGameOver = false
	game.isPaused = false
	game.score = 0
	$gameComplete.hide()

	game.restart()
	game.init()
})
