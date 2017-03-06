var getRandomNumber = require('../utils/getRandomNumber')

var Ball = function(canvas, options) {
	if(canvas === undefined) throw 'Ball 的传参有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left
	this.top = options.top
	this.width = options.width
	this.height = options.height
	this.velocityX = options.velocityX || getRandomNumber(-2, -5)
	this.velocityY = options.velocityY || getRandomNumber(2, 5)
	this.fillStyle = options.fillStyle || 'orange'
	this.isRunning = false
	this.on_imageObj = options.on_imageObj
	this.off_imageObj = options.off_imageObj
	this.isAbleCollisionWithRacket = true
	this.isGameOverUp = true
	this.isGameOverDown = false
	this.gameOverMoveDistance = 0
	this.gameOverMoveVelocity = 4 * window.ratio
	this.gameOverTargetDistance = 80 * window.ratio
	// 碰撞到触板时，球的横向速度的改变基数
	this.velocityChangeBase = 1

	this.init()
}

Ball.prototype = {
	init: function() {
		var canvas = this.canvas
		this.isRunning = true
	},

	draw: function() {
		var ctx = this.ctx,
			canvas = this.canvas;

		this._run()

		ctx.save()
		ctx.rect(this.left, this.top, this.width, this.height)
		ctx.clip()
		if(!window.game.isGameOver) {
			ctx.drawImage(this.on_imageObj, this.left, this.top, this.width, this.height)
		} else {
			ctx.drawImage(this.off_imageObj, this.left, this.top, this.width, this.height)
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
		} else if(left + width >= canvas.width) {
			this.velocityX = -this.velocityX
			this.left = canvas.width - width
			game.ball.isAbleCollisionWithRacket = true
		}
		if(top < 0) {
			this.velocityY = -this.velocityY
			this.top = 0
			game.ball.isAbleCollisionWithRacket = true
		}

		if(top + height > canvas.height) {
			console.log('game over')
			this.isRunning = false
			window.game.isGameOver = true
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