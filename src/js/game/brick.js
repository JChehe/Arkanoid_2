function Brick(options, canvas) {
	if(canvas === undefined) throw 'Brick 参数有问题'
	if(options === undefined) options = {}

	this.canvas = canvas
	this.ctx = canvas.getContext('2d')
	this.left = options.left || 0
	this.top = options.top || 0
	this.width = options.width || 150
	this.height = options.height || 100
	this.fillStyle = options.fillStyle || 'red'
	this.imageObj = options.imageObj
	this.index = options.index

}

Brick.prototype = {
	draw: function() {
		var ctx = this.ctx,
			canvas = this.canvas

		ctx.save()
		ctx.rect(this.left, this.top, this.width, this.height)
		ctx.clip()
		ctx.drawImage(this.imageObj, this.left, this.top, this.width, this.height)
		ctx.restore()
	}
}

module.exports = Brick