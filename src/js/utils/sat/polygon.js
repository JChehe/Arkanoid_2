var Vector = require('./vector')
var Projection = require('./projection')
var Shape = require('./shape')
var ShapeConstructor = Shape.ShapeConstructor
var polygonCollidesWithPolygon = Shape.polygonCollidesWithPolygon
var polygonCollidesWithCircle = Shape.polygonCollidesWithPolygon

var Point = function(x, y) {
  this.x = x
  this.y = y
}

var Polygon = function() {
  this.points = []
  this.strokeStyle = 'blue'
  this.fillStyle = 'white'
}

Polygon.prototype = new ShapeConstructor()

Polygon.prototype.getAxes = function() {
  var v1 = new Vector(),
    v2 = new Vector(),
    axes = []

  for (var i = 0, len = this.points.length - 1; i < len; i++) {
    v1.x = this.points[i].x
    v1.y = this.points[i].y

    v2.x = this.points[i + 1].x
    v2.y = this.points[i + 1].y

    axes.push(v1.edge(v2).normal())
  }

  v1.x = this.points[this.points.length - 1].x
  v1.y = this.points[this.points.length - 1].y

  v2.x = this.points[0].x
  v2.y = this.points[0].y

  axes.push(v1.edge(v2).normal())

  return axes
}

Polygon.prototype.project = function(axis) {
  var scalars = [],
    v = new Vector()

  this.points.forEach(function(point) {
    v.x = point.x
    v.y = point.y
    scalars.push(v.dotProduct(axis))
  })

  return new Projection(Math.min.apply(Math, scalars),
    Math.max.apply(Math, scalars))
}

Polygon.prototype.addPoint = function(x, y) {
  this.points.push(new Point(x, y))
}
Polygon.prototype.centroid = function() {
  var pointSum = new Point(0, 0);

  for (var i = 0, point; i < this.points.length; ++i) {
    point = this.points[i];
    pointSum.x += point.x;
    pointSum.y += point.y;
  }
  return new Point(pointSum.x / this.points.length,
    pointSum.y / this.points.length);
}

Polygon.prototype.boundingBox = function(dx, dy) {
  var minx = BIG_NUMBER,
    miny = BIG_NUMBER,
    maxx = -BIG_NUMBER,
    maxy = -BIG_NUMBER,
    point;

  for (var i = 0; i < this.points.length; ++i) {
    point = this.points[i];
    minx = Math.min(minx, point.x);
    miny = Math.min(miny, point.y);
    maxx = Math.max(maxx, point.x);
    maxy = Math.max(maxy, point.y);
  }

  return new BoundingBox(minx, miny,
    parseFloat(maxx - minx),
    parseFloat(maxy - miny));
};

Polygon.prototype.createPath = function(context) {
  if (this.points.length === 0) {
    return
  }

  context.beginPath()
  context.moveTo(this.points[0].x,
    this.points[0].y)

  for (var i = 0, len = this.points.length; i < len; i++) {
    context.lineTo(this.points[i].x,
      this.points[i].y)
  }

  context.closePath()
}

Polygon.prototype.move = function(dx, dy) {
  for (var i = 0, point, len = this.points.length; i < len; i++) {
    point = this.points[i]
    point.x += dx
    point.y += dy
  }
}

/*Polygon.prototype.collidesWith = function(shape) {
  var axes = shape.getAxes()
  if(axes === undefined) {
    return polygonCollidesWithCircle(this, shape)
  } else {
    axes = axes.concat(this.getAxes())
    return !this.separationOnAxes(axes, shape)
  }
}
*/

Polygon.prototype.collidesWith = function(shape, displacement) {
  if (shape.radius !== undefined) {
    return polygonCollidesWithCircle(this, shape, displacement)
  } else {
    return polygonCollidesWithPolygon(this, shape, displacement)
  }
}

exports.Point = Point
exports.Polygon = Polygon
