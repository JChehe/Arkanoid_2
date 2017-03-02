

function Racket(canvas, options) {
	if(canvas === undefined)  throw 'racket 参数有问题'
	if(options === undefined) options = {}
	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.width = 240
	this.height = 120 / 2
	this.left = options.left || (canvas.width - this.width) / 2
	this.top  = options.top || 467 * 2
	this.fillStyle = options.fillStyle || '#fff'
	this.isDragging = false

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
		canvas.addEventListener('touchstart', self._mouseDownHandler.bind(self), false)
		canvas.addEventListener('touchmove',  self._mouseMoveHandler.bind(self), false)
		canvas.addEventListener('touchend',   self._mouseUpHandler.bind(self),   false)

	},

	_setPosition: function(left, top) {
		this.left = left
		// this.top  = top
	},

	_mouseDownHandler: function(e) {
		var canvas = this.canvas,
			firstFinger = e.touches[0]
		// mouse need to times ratio
		var canvasMouse = window.windowToCanvas(canvas, firstFinger.clientX * window.ratio, firstFinger.clientY * window.ratio)

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
		console.log('move')
		if(this.isDragging) {
			var canvas = this.canvas,
				firstFinger = e.touches[0],
				offset = this._mouseMoveHandler.offset,
				canvasMouse = window.windowToCanvas(canvas, firstFinger.clientX * window.ratio, firstFinger.clientY * window.ratio)

			var left = canvasMouse.x - offset.x,
				top = canvasMouse.y - offset.y

			if(left < 0) left = 0
			if(left > canvas.width - this.width) left = canvas.width - this.width
			this._setPosition(left, top)
		}
	},

	_mouseUpHandler: function(e) {
		var canvas = this.canvas

		this.isDragging = false
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
		ctx.shadowOffsetX = 3
		ctx.shadowOffsetY = 3
		ctx.shadowBlur = 4
		ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'

		// bottom semicircle
		this._getPathOfShape()

		// fill shape
		ctx.fillStyle = this.fillStyle

		ctx.fill()
		ctx.restore()
	}
}

module.exports = Racket



