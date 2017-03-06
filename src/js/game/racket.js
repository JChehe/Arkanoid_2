// 挡板
function Racket(canvas, options) {
	if(canvas === undefined)  throw 'racket 参数有问题'
	if(options === undefined) options = {}
	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.width = options.width
	this.height = options.height
	this.shadowOffsetX = 1.5 * window.ratio
	this.shadowOffsetY = 1.5 * window.ratio
	this.shadowBlur = 2 * window.ratio
	this.shadowColor = 'rgba(0,0,0, .5)'
	this.velocityX = 0
	this.velocityY = 0
	this.left = options.left
	this.top  = options.top
	this.fillStyle = options.fillStyle || '#fff'
	this.isDragging = false

	this._mouseDownHandlerPack
	this._mouseMoveHandlerPack
	this._mouseUpHandlerPack
	// init
	this.init()
}


Racket.prototype = {
	init: function() {
		var canvas = this.canvas,
			ctx = this.ctx,
			self = this
		// draw first frame
		this.draw()
		// bind touch event
		this._mouseDownHandlerPack = this._mouseDownHandler.bind(this)
		this._mouseMoveHandlerPack = this._mouseMoveHandler.bind(this)
		this._mouseUpHandlerPack = this._mouseUpHandler.bind(this)

		canvas.addEventListener('touchstart', this._mouseDownHandlerPack, false)
		canvas.addEventListener('touchmove',  this._mouseMoveHandlerPack, false)
		canvas.addEventListener('touchend',   this._mouseUpHandlerPack,   false)
	},

	_setPosition: function(left, top) {
		this.left = left
		// this.top  = top
	},

	_mouseDownHandler: function(e) {
		e.preventDefault()
		var canvas = this.canvas,
			firstFinger = e.touches[0]
		// mouse need to times ratio
		var canvasMouse = window.windowToCanvas(canvas, 
			firstFinger.clientX * window.ratio, 
			firstFinger.clientY * window.ratio)

		if(this._isPointInShape(canvasMouse)) {
			this.isDragging = true
			console.log('mouse in shape')

			if(this.isDragging) {
				var bbox = canvas.getBoundingClientRect(),
					offset = {
						x: firstFinger.clientX * window.ratio - this.left,
						y: firstFinger.clientY * window.ratio - this.top
					};
				this._mouseMoveHandler.offset = offset

			}
		} else {
			this.isDragging = false
			console.log('mouse do not in shape')
		}
	},

	_mouseMoveHandler: function(e) {
		e.preventDefault()

		if(this.isDragging && !game.isPaused) {
			var canvas = this.canvas,
				firstFinger = e.touches[0],
				offset = this._mouseMoveHandler.offset,
				canvasMouse = window.windowToCanvas(canvas, firstFinger.clientX * window.ratio, 
																						firstFinger.clientY * window.ratio)

			var left = canvasMouse.x - offset.x,
				top = canvasMouse.y - offset.y

			if(left < -this.width / 2) {
				left = -this.width / 2
			} else if (left > canvas.width - this.width / 2){
				left = canvas.width - this.width / 2
			}
			this._setPosition(left, top)
		}
	},

	_mouseUpHandler: function(e) {
		e.preventDefault()
		
		var canvas = this.canvas
		this.isDragging = false
	},

	destroy: function() {
		this.canvas.removeEventListener('touchstart', this._mouseDownHandlerPack, false)
		this.canvas.removeEventListener('touchmove',  this._mouseMoveHandlerPack, false)
		this.canvas.removeEventListener('touchend',   this._mouseUpHandlerPack,   false)
	},

	_isPointInShape: function(point) {
		this._getPathOfShape()
		return this.ctx.isPointInPath(point.x, point.y)

	},
	
	_getPathOfShape: function() {
		this.ctx.beginPath()
		this.ctx.arc(this.left + this.width / 2, this.top, this.width / 2, 0, Math.PI, false)
		this.ctx.closePath()
	},

	draw: function() {
		var ctx = this.ctx
		ctx.save()

		// set shadow
		ctx.shadowOffsetX = this.shadowOffsetX
		ctx.shadowOffsetY = this.shadowOffsetY
		ctx.shadowBlur = this.shadowBlur
		ctx.shadowColor = this.shadowColor

		// bottom semicircle
		this._getPathOfShape()


		// fill shape
		ctx.fillStyle = this.fillStyle

		ctx.fill()
		ctx.restore()
	}
}

module.exports = Racket



