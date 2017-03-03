var Ball = function(canvas, options) {
	if(canvas === undefined) throw 'Ball 的传参有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left || 0
	this.top = options.top || 600
	this.width = options.width || 32
	this.height = options.height || 29
	this.velocityX = options.velocityX || 2
	this.velocityY = options.velocityY || 2
	this.fillStyle = options.fillStyle || 'orange'
	this.isRunning = false

	// this.gameOverUpDistance = 50
	this.isGameOver = false
	this.isGameOverUp = true
	this.isGameOverDown = false
	this.gameOverMoveDistance = 0
	this.gameOverMoveVelocity = 4

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
		ctx.fillStyle = this.fillStyle
		ctx.fillRect(this.left, this.top, this.width, this.height)
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