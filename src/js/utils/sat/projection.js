var Projection = function(min, max) {
  this.min = min
  this.max = max
}

Projection.prototype = {
  overlaps: function(projection) {
    return this.max > projection.min && projection.max > this.min
  }
}

module.exports = Projection