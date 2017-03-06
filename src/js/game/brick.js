// 砖块

function Brick(options, canvas) {
	if(canvas === undefined) throw 'Brick 参数有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left || 0
	this.top = options.top || 0
	this.width = options.width || 150 / 2
	this.height = options.height || 100 / 2
	this.fillStyle = options.fillStyle || 'red'
	this.imageObj = options.imageObj
	this.index = options.index
	this.isVisible = true

}

Brick.prototype = {
	draw: function() {
		if(this.isVisible) {
			var ctx = this.ctx,
				canvas = this.canvas

			ctx.save()
			ctx.rect(this.left, this.top, this.width, this.height)
			ctx.clip()
			ctx.globalAlpha = 0.6
			ctx.drawImage(this.imageObj, this.left, this.top, this.width, this.height)
			ctx.restore()
		}
	}
}

module.exports = Brick