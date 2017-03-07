var getRandomNumber = require('../utils/getRandomNumber')
var sound = require('./sound')

var Ball = function(canvas, options) {
	if(canvas === undefined) throw 'Ball 的传参有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left
	this.top = options.top
	this.width = options.width
	this.height = options.height
	this.velocityX = options.velocityX || getRandomNumber(-1, -3) * window.ratio
	this.velocityY = options.velocityY || getRandomNumber(1, 3) * window.ratio
	this.fillStyle = options.fillStyle || 'orange'
	this.isRunning = false
	this.imageObj = options.imageObj
	// this.off_imageObj = options.off_imageObj
	this.isAbleCollisionWithRacket = true
	this.isGameOverUp = true
	this.isGameOverDown = false
	this.gameOverMoveDistance = 0
	this.gameOverMoveVelocity = 4 * window.ratio
	this.gameOverTargetDistance = 80 * window.ratio
	// 碰撞到触板时，球的横向速度的改变基数
	this.velocityChangeBase = 1


	this.isCache = options.isCache || false
	this.cacheCanvas = document.createElement('canvas')
	this.cacheCtx = this.cacheCanvas.getContext('2d')
	this.cacheCanvas.width = this.imageObj.width
	this.cacheCanvas.height = this.imageObj.height

	if(this.isCache) {
		this._cache()
	}

	this.init()
}

Ball.prototype = {
	init: function() {
		var canvas = this.canvas
		this.isRunning = true
	},

	_cache: function() {
		var cacheCtx = this.cacheCtx
		cacheCtx.save()
		cacheCtx.drawImage(this.imageObj, 0, 0)
		cacheCtx.restore()
	},

	draw: function() {
		var ctx = this.ctx

		this._run()

		if(this.isCache) {
			this._gameFailMove(this.cacheCanvas)
		} else {
			this._gameFailMove(this.imageObj)
		}
	},

	_gameFailMove: function(canvas) {
		var ctx = this.ctx
		ctx.save()
		if(!window.game.isGameOver) {
			ctx.drawImage(canvas, 0, 0, this.imageObj.width / 2, this.imageObj.height, 
										this.left, this.top, this.width, this.height)
		} else {
			ctx.drawImage(canvas, this.imageObj.width / 2, 0, this.imageObj.width / 2, this.imageObj.height, 
										this.left, this.top, this.width, this.height)
		}
		ctx.restore()
	},

	_setPosition: function(left, top) {
		this.left = left
		this.top = top
	},

	_run: function() {
		if(this.isRunning) {
			var x = this.left + this.velocityX
			var y = this.top + this.velocityY

			this._setPosition(x, y)
			this._detectCollideEdge()
		} 

		if(window.game.isGameOver) {

			this._gameOverMotion()
		}
	},

	changeVelocityX: function(distanceOfcenterX) {
		var velocityXIncrement = this.velocityChangeBase * (distanceOfcenterX / (game.racket.width / 2))

		if(this.velocityX >= 0) {
			this.velocityX += velocityXIncrement
		} else {
			this.velocityX -= velocityXIncrement
		}
	},

	_detectCollideEdge: function() {
		var left = this.left,
			top = this.top,
			width = this.width,
			height = this.height,
			canvas = this.canvas;

		if(left < 0) {
			this.velocityX = -this.velocityX
			this.left = 0
			game.ball.isAbleCollisionWithRacket = true
			sound.wall()
		} else if(left + width >= canvas.width) {
			this.velocityX = -this.velocityX
			this.left = canvas.width - width
			game.ball.isAbleCollisionWithRacket = true
			sound.wall()
		}
		if(top < 0) {
			this.velocityY = -this.velocityY
			this.top = 0
			game.ball.isAbleCollisionWithRacket = true
			sound.wall()
		}

		if(top + height > canvas.height) {
			console.log('game over')
			this.isRunning = false
			window.game.isGameOver = true
			sound.game_fail()

		}
	},

	_gameOverMotion: function() {
		if(this.isGameOverUp) {
			this.gameOverMoveDistance -= this.gameOverMoveVelocity
			if(this.gameOverMoveDistance < -this.gameOverTargetDistance) {
				this.isGameOverUp = false
				this.isGameOverDown = true
			} else {
				this._setPosition(this.left, this.top - this.gameOverMoveVelocity)
			}
		}
		if(this.isGameOverDown) {
			this.gameOverMoveDistance += this.gameOverMoveVelocity
			if(this.gameOverMoveDistance > this.gameOverTargetDistance) {
				this.isGameOverUp = false
				this.isGameOverDown = false
			} else {
				this._setPosition(this.left, this.top + this.gameOverMoveVelocity)
			}
		}
	}
}

module.exports = Ball