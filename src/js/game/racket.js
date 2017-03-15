// 挡板

var rotatePoint = require('../utils/rotatePoint').rotatePoint
var degToRad = require('../utils/rotatePoint').degToRad

function Racket(canvas, options) {
	if(canvas === undefined)  throw 'racket 参数有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.width = options.width
	this.height = options.height
	this.centerX = canvas.width / 2
	this.centerY = canvas.height * (4 / 5)
	this.fillStyle = '#fff'
	this.angleOfDeg = 30
	this.vertexs = []
	this.isChangeAngle = true
	this.MTDShapes = null
	this.MAX_LEFT_ANGLE = -180
	this.MAX_RIGHT_ANGLE = 180

	this.$controlLeft = document.querySelector('.control_racket .left')
	this.$controlRight = document.querySelector('.control_racket .right')
	this.clickControlLeftHandlePack
	this.clickControlRightHandlePack

	this.initVertexs()
	this.init()

}

Racket.prototype = {
	init: function() {
		this.clickControlLeftHandlePack = this.clickControlLeftHandle.bind(this)
		this.clickControlRightHandlePack = this.clickControlRightHandle.bind(this)

		this.$controlLeft.addEventListener('touchstart', this.clickControlLeftHandlePack, false)
		this.$controlRight.addEventListener('touchstart', this.clickControlRightHandlePack, false)
	},

	clickControlLeftHandle: function(e) {
		e.preventDefault()
		if(!game.isPaused) {
			this.angleOfDeg -= 20
			if(this.angleOfDeg < this.MAX_LEFT_ANGLE) {
				this.angleOfDeg = this.MAX_LEFT_ANGLE
			}
			this.isChangeAngle = true
		}
	},
	clickControlRightHandle: function(e) {
		e.preventDefault()
		if(!game.isPaused) {
			this.angleOfDeg += 20
			if(this.angleOfDeg > this.MAX_RIGHT_ANGLE) {
				this.angleOfDeg = this.MAX_RIGHT_ANGLE
			}
			this.isChangeAngle = true
		}
	},

	draw: function() {
		var ctx = this.ctx

		this.getPathOfShape()
		ctx.save()
		ctx.fillStyle = this.fillStyle
		ctx.fill()
		ctx.restore()
	},

	initVertexs: function() {
		var angleOfDeg = this.angleOfDeg,
			centerX = this.centerX,
			centerY = this.centerY,
			width = this.width,
			height = this.height,
			angleOfRad = degToRad(this.angleOfDeg)
		var leftTop = [centerX - width / 2,
									centerY - height / 2],
				rightTop = [centerX + width / 2,
										centerY - height / 2],
				rightBottom = [centerX + width / 2,
											centerY + height /2],
				leftBottom = [centerX - width / 2,
											centerY + height / 2];
		this.vertexs.length = 0

		var rotateLeftTop = rotatePoint([centerX, centerY],
										leftTop, angleOfRad),
				rotateRightTop = rotatePoint([centerX, centerY],
										rightTop, angleOfRad),
				rotateRightBottom = rotatePoint([centerX, centerY],
										rightBottom, angleOfRad),
				rotateLeftBottom = rotatePoint([centerX, centerY],
										leftBottom, angleOfRad);

		this.vertexs.length = 0
		this.vertexs.push(rotateLeftTop)
		this.vertexs.push(rotateRightTop)
		this.vertexs.push(rotateRightBottom)
		this.vertexs.push(rotateLeftBottom)
	},

	getPathOfShape: function() {
		var ctx = this.ctx

		if(this.isChangeAngle) {
			var angleOfDeg = this.angleOfDeg,
				centerX = this.centerX,
				centerY = this.centerY,
				width = this.width,
				height = this.height,
				angleOfRad = degToRad(this.angleOfDeg)

			var leftTop = [centerX - width / 2,
										centerY - height / 2],
					rightTop = [centerX + width / 2,
											centerY - height / 2],
					rightBottom = [centerX + width / 2,
												centerY + height /2],
					leftBottom = [centerX - width / 2,
												centerY + height / 2];



			var rotateLeftTop = rotatePoint([centerX, centerY],
											leftTop, angleOfRad),
					rotateRightTop = rotatePoint([centerX, centerY],
											rightTop, angleOfRad),
					rotateRightBottom = rotatePoint([centerX, centerY],
											rightBottom, angleOfRad),
					rotateLeftBottom = rotatePoint([centerX, centerY],
											leftBottom, angleOfRad);

			this.vertexs.length = 0
			this.vertexs.push(rotateLeftTop)
			this.vertexs.push(rotateRightTop)
			this.vertexs.push(rotateRightBottom)
			this.vertexs.push(rotateLeftBottom)

			ctx.beginPath()
			ctx.moveTo(rotateLeftTop.x, rotateLeftTop.y)
			ctx.lineTo(rotateRightTop.x, rotateRightTop.y)
			ctx.lineTo(rotateRightBottom.x, rotateRightBottom.y)
			ctx.lineTo(rotateLeftBottom.x, rotateLeftBottom.y)
			ctx.closePath()


			this.MTDShapes.points.length = 0
			this.MTDShapes.addPoint(rotateLeftTop.x, rotateLeftTop.y)
			this.MTDShapes.addPoint(rotateRightTop.x, rotateRightTop.y)
			this.MTDShapes.addPoint(rotateRightBottom.x, rotateRightBottom.y)
			this.MTDShapes.addPoint(rotateLeftBottom.x, rotateLeftBottom.y)


			this.isChangeAngle = false
		} else {
			var vertexs = this.vertexs
			var rotateLeftTop = [vertexs[0].x, vertexs[0].y],
					rotateRightTop = [vertexs[1].x, vertexs[1].y],
					rotateRightBottom = [vertexs[2].x, vertexs[2].y],
					rotateLeftBottom = [vertexs[3].x, vertexs[3].y]
			
			// console.log(vertexs[0].x, vertexs[0].y)
			// console.log(this.MTDShapes.points[0])
			ctx.beginPath()
			ctx.moveTo(rotateLeftTop[0], rotateLeftTop[1])
			ctx.lineTo(rotateRightTop[0], rotateRightTop[1])
			ctx.lineTo(rotateRightBottom[0], rotateRightBottom[1])
			ctx.lineTo(rotateLeftBottom[0], rotateLeftBottom[1])
			ctx.closePath()
		}
	},

	destroy: function() {
		this.$controlLeft.removeEventListener('touchstart', this.clickControlLeftHandlePack, false)
		this.$controlRight.removeEventListener('touchstart', this.clickControlRightHandlePack, false)
	}
}

module.exports = Racket

















/*// 挡板
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



*/