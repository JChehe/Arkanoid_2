// 游戏背景

function Background(canvas, options) {
	if(canvas === undefined)  throw 'Background 参数有问题'
	if(options === undefined) options = {} 

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.fillStyle = options.fillStyle || "#5C5EDC"
}

Background.prototype = {
	draw: function() {
		var ctx = this.ctx,
			canvas = this.canvas

		ctx.save()
		ctx.fillStyle = this.fillStyle
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		ctx.restore()
	}
}

module.exports = Background