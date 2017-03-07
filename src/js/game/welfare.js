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
	this.isVisible = true
	this.increaseLevel = options.increaseLevel || 1 / 25
}

Welfare.prototype = {
	draw: function() {
		if(this.isVisible) {
			var ctx = this.ctx,
				canvas = this.canvas

			ctx.save()
			ctx.rect(this.left, this.top, this.width, this.height)
			ctx.clip()
			ctx.globalAlpha = this.opacity
			ctx.drawImage(this.imageObj, this.left, this.top, this.width, this.height)
			ctx.restore()
		}
	},

	increaseOpacity: function() {
		// this.opacity += this.increaseLevel
	}
}


module.exports = Welfare