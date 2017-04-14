// 通过福利：此处是公举


function Welfare(canvas, options) {
	if(canvas === undefined) throw 'Welfare 参数有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left
	this.top = options.top
	this.width = options.width
	this.height = options.height
	this.imageObj = options.imageObj
	this.opacity = options.opacity || 0
	this.increaseLevel = options.increaseLevel || 1 / 25
	this.isCache = options.isCache || true

	this.cacheCanvas = document.createElement('canvas')
	this.cacheCtx = this.cacheCanvas.getContext('2d')
	this.cacheCanvas.width = this.imageObj.width
	this.cacheCanvas.height = this.imageObj.height

	if(this.isCache) {
		this._cache()
	}
}

Welfare.prototype = {
	draw: function() {
		var ctx = this.ctx

		if(this.isCache) {
			ctx.save()
			ctx.globalAlpha = this.opacity
			ctx.drawImage(this.cacheCanvas, this.left, this.top)
			ctx.restore()
		} else {
			ctx.save()
			ctx.rect(this.left, this.top, this.width, this.height)
			ctx.clip()
			ctx.globalAlpha = this.opacity
			ctx.drawImage(this.imageObj, this.left, this.top, this.width, this.height)
			ctx.restore()
		}
	},

	increaseOpacity: function() {
		this.opacity += this.increaseLevel
	},

	_cache: function() {
		var cacheCtx = this.cacheCtx
		cacheCtx.save()
		cacheCtx.drawImage(this.imageObj, 0, 0)
		cacheCtx.restore()
	}
}


module.exports = Welfare