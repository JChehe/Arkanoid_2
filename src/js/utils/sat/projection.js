var Projection = function(min, max) {
	this.min = min
	this.max = max
}


Projection.prototype = {
 overlaps: function (projection) {
  return this.max > projection.min && projection.max > this.min;
 },

 getOverlap: function (projection) {
  var overlap;

  if (!this.overlaps(projection))
     return 0;
  
  if (this.max > projection.max) {
     overlap = projection.max - this.min;
  }
  else {
    overlap = this.max - projection.min;
  }
  return overlap;
 }
}


module.exports = Projection