var getRandomNumber = require('../utils/getRandomNumber')

var Ball = function(canvas, options) {
	if(canvas === undefined) throw 'Ball 的传参有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left || 0
	this.top = options.top || 600 / 2
	this.width = options.width || 32
	this.height = options.height || 29
	this.velocityX = options.velocityX || getRandomNumber(2, 5)
	this.velocityY = options.velocityY || getRandomNumber(2, 5)
	this.fillStyle = options.fillStyle || 'orange'
	this.isRunning = false
	this.on_imageObj = options.on_imageObj
	this.off_imageObj = options.off_imageObj

	// this.gameOverUpDistance = 50
	this.isGameOver = false
	this.isGameOverUp = true
	this.isGameOverDown = false
	this.gameOverMoveDistance = 0
	this.gameOverMoveVelocity = 4

	// 碰撞到触板时，球的横向速度的改变基数
	this.velocityChangeBase = 2

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
		// ctx.fillStyle = this.fillStyle
		// ctx.fillRect(this.left, this.top, this.width, this.height)

		ctx.rect(this.left, this.top, this.width, this.height)
		ctx.clip()
		if(!this.isGameOver) {
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

		if(this.isGameOver) {
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
		} else if(left + width >= canvas.width) {
			this.velocityX = -this.velocityX
			this.left = canvas.width - width
		}
		if(top < 0) {
			this.velocityY = -this.velocityY
			this.top = 0
		}

		if(top + height > canvas.height) {
			console.log('game over')
			this.isRunning = false
			this.isGameOver = true
		}
	},

	_gameOverMotion: function() {
		if(this.isGameOverUp) {
			this.gameOverMoveDistance -= this.gameOverMoveVelocity
			if(this.gameOverMoveDistance < -100) {
				this.isGameOverUp = false
				this.isGameOverDown = true
			} else {
				this._setPosition(this.left, this.top - this.gameOverMoveVelocity)
			}
		}
		if(this.isGameOverDown) {
			this.gameOverMoveDistance += this.gameOverMoveVelocity
			if(this.gameOverMoveDistance > 100) {
				this.isGameOverUp = false
				this.isGameOverDown = false
			} else {
				this._setPosition(this.left, this.top + this.gameOverMoveVelocity)
			}
		}
		// console.log(this.gameOverMoveDistance)
		// if(this.isGameOverUp || this.isGameOverDown) {
		// 	this._setPosition(this.left, this.top + this.gameOverMoveDistance)
		// }

		
	}
}

module.exports = Ball