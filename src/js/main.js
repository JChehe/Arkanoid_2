require('../index.html')
require('../css/main.scss')

require('./utils/requestAnimationFrame')
require('./utils/windowToCanvas')
var Background = require('./game/background')
var Racket = require('./game/racket')
var Brick = require('./game/brick.js')
var Ball = require('./game/ball')
var Welfare = require('./game/Welfare')
var getFps = require('./utils/fps')
var isFunction = require('./utils/isfunction')
var detect2RectCollision = require('./utils/detect2RectCollision').detect2RectCollision
var afterCollised = require('./utils/detect2RectCollision').afterCollised
var isOnTopHalfZone = require('./utils/detect2RectCollision').isOnTopHalfZone
var isOneLeftRightZone = require('./utils/detect2RectCollision').isOneLeftRightZone
var preloader = require('./game/preload')




window.ratio = window.devicePixelRatio || 1;

var canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d'),
	bbox = canvas.getBoundingClientRect();

canvas.width = 375 * ratio
canvas.height = (1334 - 96) / 2 * ratio


function Game() {
	this.elements = []
	this.bricks = []
	this.racket
	this.ball
	this.isPaused = true
	this.isGameOver = false
	this.score = 0
	this.runningTime = 0
	this.brickRow = 5
	this.brickCol = 5
	this.hp = this.brickRow * this.brickCol
	this.isFpsVisible = true
	this.lastGameTime = 0
	this.lastFpsTime = 0
	this.fpsDur = 1000
	this.displayFps = 60
	this.restartCount = 0
}

Game.prototype = {
	init: function() {
		var background = new Background(canvas)
		var racket = new Racket(canvas, {
			width: 120 * ratio,
			height: 30 * ratio,
			top: 467 * ratio,
			left: (canvas.width - 120 * ratio) / 2
		})
		var ball = new Ball(canvas, {
			on_imageObj: preloader.get('../../img/player_on.png'),
			off_imageObj: preloader.get('../../img/player_off.png'),
			width: 32 * ratio,
			height: 29 * ratio,
			left: 300 * ratio,
			top: 300 * ratio
		})

		var welfareImageObj = preloader.get('../../img/welfare.png'),
			welfareWidth = canvas.width * (160 / 375) // 约为 0.42 倍 canvas 宽

		var welfare = new Welfare(canvas, {
			left: (canvas.width - welfareWidth) / 2,
			top: 13 * ratio,
			width: welfareWidth,
			height: welfareWidth * (welfareImageObj.height / welfareImageObj.width),
			increaseLevel: 1 / (this.brickRow * this.brickCol),
			imageObj: welfareImageObj
		})

		this.racket = racket
		this.ball = ball
		this.welfare = welfare
		this.elements.push(background)
		this.elements.push(welfare)
		this.elements.push(racket)
		this.elements.push(ball)
		this._initBricks()

	},

	start: function() {
		this.isPaused = false
		this.runningTime = +new Date()
		window.requestAnimationFrame(this._loop.bind(this))
	},

	restart: function() {
		this.elements.concat(this.bricks).forEach(function(ele) {
			if(isFunction(ele.destroy)) {
				ele.destroy()
			}
		})

		this.restartCount++
		this.hp = this.brickRow * this.brickCol
		this.isGameOver = false
		this.runningTime = 0
		this.isPaused = false
		this.score = 0
		this.bricks.length = 0
		this.elements.length = 0
		this.ball = null
		this.racket = null

		this.init()
	},

	pause: function(isPaused) {
		if(isPaused === undefined) 
			this.isPaused = true
		else 
			this.isPaused = isPaused
	},

	_clearScreen: function(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	},

	_drawElements: function(ctx) {
		this.elements.concat(this.bricks).forEach(function(ele, index) {
			if(isFunction(ele.draw)) {
				ele.draw()
			}
		})
	},

	_drawFPS: function(ctx, fps) {
		if(this.isFpsVisible) {
			ctx.save()
			ctx.font = 15 * window.ratio + 'px Microsoft YaHei'
			ctx.fillStyle = 'cornflowerblue'
			ctx.fillText(fps + ' fps', 10 * window.ratio, 30 * window.ratio)
			ctx.restore()
		}
	},

	_initBricks: function() {
		var index = 0
		for(var i = 0; i < this.brickRow; i++) {
			for(var j = 0; j < this.brickCol; j++) {
				var left = j * canvas.width / this.brickCol,
					top = i * 50 * ratio;

				var brick = new Brick({
					index: index,
					left: left,
					top: top,
					width: canvas.width / this.brickCol,
					height: 50 * ratio,
					imageObj: preloader.get('../../img/thumb' + (index + 1) + '.png')
				}, canvas)

				this.bricks.push(brick)
				index++
			}
		}
		this.detectBrickCollideBoundary = (this.brickRow + 1) * this.bricks[0].height
	},

	// Game Over 含两种情况：① 中途挂了 ② 通过
	_detectGameOver: function() {
		if(!game.ball.isGameOverUp && !game.ball.isGameOverDown) {
			game.isPaused = true
			game.isGameOver = true

			$gameComplete.show().addClass('fail')
			console.log('结束动画完毕')
			game.runningTime = +new Date() - game.runningTime
			console.log('游戏持续时间：' + game.runningTime / 1000 + '秒')
		}
		if(game.score === game.hp) {
			game.isGameOver = true
			game.isPaused = true
			$gameComplete.show().addClass('success')
			game.runningTime = +new Date() - game.runningTime
			console.log('游戏持续时间：' + game.runningTime / 1000 + '秒')
		}
	},

	_loop: function(tick) {
		if(!this.isPaused) {
			this._detectGameOver()
			this._clearScreen(ctx)

			if(this.ball.isAbleCollisionWithRacket) {
				detectRacketAndBallCollide()
			}

			if(this.ball.top < this.detectBrickCollideBoundary) {
				detectBricksAndBallCollide()
			}

			this._drawElements()
			
			// getFps
			var fps = getFps(tick, this.lastGameTime)
			// update display fps per second
			if (tick - this.lastFpsTime >= this.fpsDur) {
				this.displayFps = fps.toFixed()
				this.lastFpsTime = tick
			}
			this.lastGameTime = tick
			this._drawFPS(ctx, this.displayFps)
		}
		
		window.requestAnimationFrame(this._loop.bind(this))
	}
}




window.game = new Game();


function detectRacketAndBallCollide() {
	var ballAndRacketAngle = detect2RectCollision(game.ball, game.racket)
	
	if(ballAndRacketAngle !== null) {
		game.ball.isAbleCollisionWithRacket = false
		var ballBottom = game.ball.top + game.ball.height,
			racketBottom = game.racket.top + game.racket.height,
			ball = game.ball,
			racket = game.racket;

		if(ball.left + ball.width / 2 <= racket.left) {
			console.log('非正常碰撞')

			if(ball.velocityX >= 0) {
				ball.velocityX = -ball.velocityX
			} else {
				ball.velocityX -= 1
			}
		} else if (ball.left + 5 > racket.left + racket.width) {
			console.log('非正常碰撞')

			if(ball.velocityX <= 0) {
				ball.velocityX = -ball.velocityX
			} else {
				ball.velocityX += 1
			}
		} else {
			console.log('正常碰撞')
			var ballCenterX = game.ball.left + game.ball.width / 2,
				racketCenterX = game.racket.left + game.racket.width / 2,
				distanceOfcenterX = ballCenterX - racketCenterX;

			game.ball.changeVelocityX(distanceOfcenterX)
			game.ball.velocityY = -game.ball.velocityY
		}
	}
}

function detectBricksAndBallCollide() {
	for(var i = 0, len = game.bricks.length; i < len; i++) {
		var curBrick = game.bricks[i]
		if(curBrick.isVisible) {
			var ballAndBrickAngle = detect2RectCollision(curBrick, game.ball)
			if(ballAndBrickAngle !== null) {
				afterCollised(curBrick, game.ball, ballAndBrickAngle)
				game.ball.isAbleCollisionWithRacket = true
				game.score++
				game.welfare.increaseOpacity()
				curBrick.isVisible = false
			}
		}
	}
}


// DOM 与游戏交互部分

var $gameComplete = $('.game_complete'),
	$gameSuccessText = $gameComplete.find('.game_success'),
	$gameFailText = $gameComplete.find('.game_fail'),
	$playAgainBtn = $('.play_again'),
	$startBtn = $('.start_btn'),
	$pauseBtn = $('.pause_btn');

$pauseBtn.on('click', function(e) {
	gamePauseHandle(!game.isPaused)
})

$startBtn.on('click', function(e) {
	$('.game_start').hide()
	$('#stage').show()
	$('.fixed_bottom').show()
	game.start()
	gamePauseHandle(game.isPaused)
})

function gamePauseHandle(isPaused) {
	$('.pause_btn').text(isPaused ? '开始' : '暂停')
	game.pause(isPaused)
}

$playAgainBtn.on('click', function(e) {
	$gameComplete.hide()
	game.restart()
})