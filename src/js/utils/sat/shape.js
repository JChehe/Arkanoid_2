var Shape = function() {
  this.x = undefined
  this.y = undefined
  this.strokeStyle = 'rgba(255, 253, 208, 0.9)'
  this.fillStyle = 'rgba(147, 147, 147, .8)'
}

Shape.prototype = {
  collidesWith: function(shape) {
    var axes = this.getAxes().concat(shape.getAxes())
    return !this.separationOnAxes(axes, shape)
  },

  separationOnAxes: function(axes, shape) {
    for (var i = 0, len = axes.length; i < len; i++) {
      axis = axes[i]
      projection1 = shape.project(axis)
      projection2 = this.project(axis)

      if (!projection1.overlaps(projection2)) {
        return true
      }
    }
    return false
  },

  project: function(axis) {
    throw 'project(axis) not implemented'
  },

  getAxes: function() {
    throw 'getAxes() not implemented'
  },

  move: function(dx, dy) {
    throw 'move(dx, dy) not implemented'
  },

  // Drawing methods................................

  createPath: function(context) {
    throw 'createPath(context) not implemented'
  },

  fill: function(context) {
    context.save()
    context.fillStyle = this.fillStyle
    this.createPath(context)
    context.fill()
    context.restore()
  },

  stroke: function(context) {
    context.save()
    context.strokeStyle = this.strokeStyle
    this.createPath(context)
    context.stroke()
    context.restore()
  },

  isPointInPath: function(context, x, y) {
    this.createPath(context)
    return context.isPointInPath(x, y)
  }
}

module.exports = Shape
