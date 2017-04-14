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
var preloader = require('./game/preload')
var sound = require('./game/sound')
var Polygon = require('./utils/sat/polygon').Polygon
var Point = require('./utils/sat/polygon').Point
var Vector = require('./utils/sat/vector')



window.ratio = window.devicePixelRatio || 1;
if(window.ratio > 2) window.ratio = 2


var canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d'),
	bbox = canvas.getBoundingClientRect(),
	bg_canvas = document.getElementById('stage_bg');


var WX_TOPBAR_HEIGHT = 48, // ratio:2时
	IPHONE6_WIDTH = 375,
	IPHONE6_HEIGHT = 667;

canvas.width = bg_canvas.width = IPHONE6_WIDTH * ratio
canvas.height = bg_canvas.height = (IPHONE6_HEIGHT - WX_TOPBAR_HEIGHT) * ratio


function Game() {
	this.elements = []
	this.bricks = []
	this.racket
	this.ball
	this.isPaused = true
	this.isGameOver = false
	this.score = 0
	this.runningTime = 0
	
	this.isFpsVisible = true
	this.lastGameTime = 0
	this.lastFpsTime = 0
	this.FPS_DUR = 1000
	this.displayFps = 60
	this.restartCount = 0

	// 以下参数以 ratio = 1 时
	this.RACKET_WIDTH = IPHONE6_WIDTH + 10
	this.RACKET_HEIGHT = 30
	this.RACKET_TOP = 500

	this.BALL_WIDTH = 32
	this.BALL_HEIGHT = 29
	this.BALL_INIT_LEFT = 100
	this.BALL_INIT_TOP = 350

	this.WELFARE_WIDTH = canvas.width * (160 / 375) // 约为 0.42 倍 canvas 宽
	this.WELFARE_TOP = 13
	this.WELFARE_LEFT = (canvas.width - this.WELFARE_WIDTH) / 2

	this.BRICK_ROW = 5
	this.BRICK_COL = 5
	this.BRICK_WIDTH = canvas.width / this.BRICK_COL
	this.BRICK_HEIGHT = 50  * ratio

	this.HP = this.BRICK_ROW * this.BRICK_COL
}

Game.prototype = {
	init: function() {
		var background = new Background(bg_canvas)
		background.draw()
		var racket = new Racket(canvas, {
			width: this.RACKET_WIDTH * ratio,
			height: this.RACKET_HEIGHT * ratio,
			top: this.RACKET_TOP * ratio,
			left: (canvas.width - this.RACKET_WIDTH * ratio) / 2
		})
		var ball = new Ball(canvas, {
			imageObj: preloader.get('../../img/player_sprite.png'),
			// off_imageObj: preloader.get('../../img/player_off.png'),
			width: this.BALL_WIDTH * ratio,
			height: this.BALL_HEIGHT * ratio,
			left: this.BALL_INIT_LEFT * ratio,
			top: this.BALL_INIT_TOP * ratio
		})

		var welfareImageObj = preloader.get('../../img/welfare.png'),
			welfareHeight = this.WELFARE_WIDTH * (welfareImageObj.height / welfareImageObj.width)

		var welfare = new Welfare(canvas, {
			left: this.WELFARE_LEFT,
			top: this.WELFARE_TOP * ratio,
			width: this.WELFARE_WIDTH,
			height: welfareHeight,
			increaseLevel: 1 / (this.BRICK_ROW * this.BRICK_COL),
			imageObj: welfareImageObj
		})

		this.racket = racket
		this.ball = ball
		this.welfare = welfare
		// this.elements.push(background)
		this.elements.push(welfare)
		this.elements.push(racket)
		this.elements.push(ball)
		this._initBricks()



		this._initMTDShapes(ball)
		this._initMTDShapes(racket)
	},

	_initMTDShapes: function(shape) {
		var polygon = new Polygon(),
			points = shape.vertexs

		// console.log(points)
		points.forEach(function(point) {
			polygon.addPoint(point.x, point.y)
		})

		shape.MTDShapes = polygon
	},


	drawFirstFrame: function() {
		this._clearScreen(ctx)
		this._drawElements()
	},

	start: function() {
		this.isPaused = false
		this.runningTime = +new Date()
		window.requestAnimationFrame(this._loop.bind(this))
	},

	restart: function() {
		var self = this
		this.elements.concat(this.bricks).forEach(function(ele) {
			if(isFunction(ele.destroy)) {
				ele.destroy()
			}
		})

		this.restartCount++
		this.HP = this.BRICK_ROW * this.BRICK_COL
		this.isGameOver = false
		this.isPaused = true
		this.runningTime = 0
		this.score = 0
		this.bricks.length = 0
		this.elements.length = 0
		this.ball = null
		this.racket = null

		this.init()
		this.drawFirstFrame()

		setTimeout(function() {
			self.isPaused = false
		}, 1880)
		
		sound.ready_go()
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
		var source = preloader.get('../../img/bricks.png')
		for(var i = 0, iLen = this.BRICK_ROW; i < iLen; i++) {
			for(var j = 0, jLen = this.BRICK_COL; j < jLen; j++) {
				var left = j * this.BRICK_WIDTH,
					top = i * this.BRICK_HEIGHT;

				var brick = new Brick({
					index: index,
					left: left,
					top: top,
					width: this.BRICK_WIDTH,
					height: this.BRICK_HEIGHT,
					sourceWidth: source.width,
					sourceHeight: source.height,
					sourceSliceTop: (i / this.BRICK_COL) * source.height,
					sourceSliceLeft: (j / this.BRICK_ROW) * source.width,
					sourceSliceWidth: source.width / this.BRICK_COL,
					sourceSliceHeight: source.height / this.BRICK_ROW,
				}, canvas)

				this.bricks.push(brick)
				index++
			}
		}

		this.bricks[0].init(source)
		this.detectBrickCollideBoundary = (this.BRICK_ROW + 1) * this.bricks[0].height
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
		if(game.score === game.HP) {
			game.isGameOver = true
			game.isPaused = true
			$gameComplete.show().addClass('success')
			game.runningTime = +new Date() - game.runningTime
			console.log('游戏持续时间：' + game.runningTime / 1000 + '秒')

			sound.game_success()
		}
	},

	_loop: function(tick) {
		if(!this.isPaused) {
			this._detectGameOver()
			this._clearScreen(ctx)

			if(this.ball.isAbleCollisionWithRacket) {
				// detectCollisions(this.ball.MTDShapes, this.racket.MTDShapes)
				detectCollisions(this.ball.MTDShapes, this.racket.MTDShapes)

			}

			if(this.ball.top < this.detectBrickCollideBoundary) {
				detectBricksAndBallCollide()
			}

			this._drawElements()
			
			// getFps
			var fps = getFps(tick, this.lastGameTime)
			// update display fps per second
			if (tick - this.lastFpsTime >= this.FPS_DUR) {
				this.displayFps = fps.toFixed()
				this.lastFpsTime = tick
			}
			this.lastGameTime = tick
			this._drawFPS(ctx, this.displayFps)
		}
		
		window.requestAnimationFrame(this._loop.bind(this))
	}
}


function detectCollisions(shape1, shape2) {
	var mtv = shape1.collidesWith(shape2)
  if(collisionDetected(mtv)) {
    // console.log(mtv)
    bounce(mtv, shape1, shape2)
		game.ball.isAbleCollisionWithRacket = false
		sound.wall()
  }
}
function collisionDetected(mtv) {
  return mtv.axis != undefined || mtv.overlap !== 0
}
window.game = new Game();


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

				sound.brick()
			}
		}
	}
}

function separate(mtv) {
  var dx, dy, velocityMagnitude, point
  var velocityX = game.ball.velocityX,
  		velocityY = game.ball.velocityY

  if (mtv.axis === undefined) { // circle
    point = new Point()
    velocityMagnitude = Math.sqrt(Math.pow(velocityX, 2) +
      Math.pow(velocityY, 2))
    point.x = velocityX / velocityMagnitude
    point.y = velocityY / velocityMagnitude

    mtv.axis = new Vector(point);
  }

  dy = mtv.axis.y * mtv.overlap
  dx = mtv.axis.x * mtv.overlap

  if ((dx < 0 && velocityX < 0) || (dx > 0 && velocityX > 0)) {
    dx = -dx
  }

  if ((dy < 0 && velocityY < 0) || (dy > 0 && velocityY > 0)) {
    dy = -dy
  }

  game.ball.MTDShapes.move(dx, dy)
  game.ball.left += dx
  game.ball.top += dy
}

function checkMTVAxisDirection(mtv, collider, collidee) {
  var centroid1, centroid2, centroidVector, centroidUnitVector

  if(mtv.axis === undefined) return

  centroid1 = new Vector(collider.centroid())
  centroid2 = new Vector(collidee.centroid())
  centroidUnitVector = centroid2.subtract(centroid1)
  centroidVector = (new Vector(centroidVector)).normalize()

  if(centroidUnitVector.dotProduct(mtv.axis) > 0) {
    mtv.axis.x = -mtv.axis.x
    mtv.axis.y = -mtv.axis.y
  }
}
function bounce(mtv, collider, collidee) {
	var velocityX = game.ball.velocityX,
			velocityY = game.ball.velocityY

  var dotProductRatio, vdotl, ldotl, point,
    velocityVector = new Vector(new Point(velocityX, velocityY)),
    velocityUnitVector = velocityVector.normalize(),
    velocityVectorMagnitude = velocityVector.getMagnitude(),
    perpendicular;

  checkMTVAxisDirection(mtv, collider, collidee)

  point = new Point()

  if(mtv.axis !== undefined) {
    perpendicular = mtv.axis.perpendicular()
  } else {
    perpendicular = new Vector(new Point(-velocityUnitVector.y, 
                                         velocityUnitVector.x))
  }

  vdotl = velocityUnitVector.dotProduct(perpendicular)
  ldotl = perpendicular.dotProduct(perpendicular)

  dotProductRatio = vdotl / ldotl

  point.x = 2 * dotProductRatio * perpendicular.x - velocityUnitVector.x
  point.y = 2 * dotProductRatio * perpendicular.y - velocityUnitVector.y

  separate(mtv)

  game.ball.velocityX = point.x * velocityVectorMagnitude
  game.ball.velocityY = point.y * velocityVectorMagnitude
}






// DOM 与游戏交互部分

var $gameComplete = $('.game_complete'),
	$gameSuccessText = $gameComplete.find('.game_success'),
	$gameFailText = $gameComplete.find('.game_fail'),
	$playAgainBtn = $('.play_again'),
	$startBtn = $('.start_btn'),
	$pauseBtn = $('.pause_btn'),
	$gameStartPage = $('.game_start'),
	$stage = $('#stage'),
	$gameInfo = $('.game_info');

$pauseBtn.on('click', function(e) {
	gamePauseHandle(!game.isPaused)
})

$startBtn.on('click', function(e) {
	$gameStartPage.hide()
	$stage.show()
	

	game.drawFirstFrame()
	setTimeout(function() {
		game.start()
		gamePauseHandle(game.isPaused)
		// $gameInfo.show()
	}, 1880)
	

	sound.ready_go()
})

function gamePauseHandle(isPaused) {
	$pauseBtn.text(isPaused ? '开始' : '暂停')
	game.pause(isPaused)
}

$playAgainBtn.on('click', function(e) {
	$gameComplete.hide()
	game.restart()
})