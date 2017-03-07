// 砖块

function Brick(options, canvas) {
	if(canvas === undefined) throw 'Brick 参数有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left || 0
	this.top = options.top || 0
	this.width = options.width
	this.height = options.height
	this.fillStyle = options.fillStyle || 'red'
	this.index = options.index
	this.isVisible = true
	this.isCache = options.isCache || false
	this.row = options.row || 5
	this.col = options.col || 5

	this.sourceWidth = options.sourceWidth
	this.sourceHeight = options.sourceHeight
	this.sourceSliceWidth = options.sourceSliceWidth
	this.sourceSliceHeight = options.sourceSliceHeight
	this.sourceSliceLeft = options.sourceSliceLeft
	this.sourceSliceTop = options.sourceSliceTop
}

Brick.prototype = {
	init: function(imageObj) {
		var cacheCanvas = document.createElement('canvas')
		Brick.prototype.imageObj = imageObj
		Brick.prototype.cacheCanvas = cacheCanvas
		Brick.prototype.cacheCtx = cacheCanvas.getContext('2d')
		Brick.prototype.cacheCanvas.width = imageObj.width
		Brick.prototype.cacheCanvas.height = imageObj.height

		this._cache()
	},

	draw: function() {
		if(this.isVisible) {
			var ctx = this.ctx
			ctx.save()
			if(this.isCache) {
				ctx.drawImage(this.cacheCanvas, this.sourceSliceLeft, this.sourceSliceTop, this.sourceWidth / this.col, this.sourceHeight / this.row,
				 																this.left, this.top, this.width, this.height)
			} else {
				ctx.drawImage(this.imageObj, this.sourceSliceLeft, this.sourceSliceTop, this.sourceWidth / this.col, this.sourceHeight / this.row,
				 																this.left, this.top, this.width, this.height)
			}
			ctx.restore()
			
		}
	},

	_cache: function() {
		var cacheCtx = this.cacheCtx
		cacheCtx.save()
		cacheCtx.drawImage(this.imageObj, 0, 0)
		cacheCtx.restore()
	}
}

module.exports = Brick