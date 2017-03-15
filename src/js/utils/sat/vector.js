// Vector 向量

var Vector = function(point) {
  if (point === undefined) {
      this.x = 0;
      this.y = 0;
   }
   else {
      this.x = point.x;
      this.y = point.y;
   }
}

Vector.prototype = {
  // 获取向量大小
  getMagnitude: function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  },

  add: function(vector) {
    var v = new Vector()
    v.x = this.x + vector.x
    v.y = this.y + vector.y
    return v
  },

  subtract: function(vector) {
    var v = new Vector()
    v.x = this.x - vector.x
    v.y = this.y - vector.y
    return v
  },

  dotProduct: function(vector) {
    return this.x * vector.x + this.y * vector.y
  },
  
  // 由两点生成边
  edge: function(vector) {
    return this.subtract(vector)
  },

  // 垂直，即投影轴
  perpendicular: function() {
    var v = new Vector()
    v.x = this.y
    v.y = 0 - this.x
    return v
  },

  normalize: function() {
    var v = new Vector(0, 0),
      m = this.getMagnitude()

    if(m !== 0) {
      v.x = this.x / m
      v.y = this.y /m
    }
    return v
  },

  // 投影轴的单位向量
  normal: function() {
    var p = this.perpendicular()
    return p.normalize()
  }
}

module.exports = Vector
