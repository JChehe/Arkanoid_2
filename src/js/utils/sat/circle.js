var Vector = require('./vector')
var Projection = require('./projection')

var Shape = require('./shape').Shape
var ShapeConstructor = Shape.ShapeConstructor
var polygonCollidesWithPolygon = Shape.polygonCollidesWithPolygon
var polygonCollidesWithCircle = Shape.polygonCollidesWithPolygon
var circleCollidesWithCircle = Shape.circleCollidesWithCircle




var Circle = function(x, y, radius) {
  this.x = x
  this.y = y
  this.radius = radius
  this.strokeStyle = 'rgba(255, 253, 208, .9)'
  this.fillStyle = 'rgba(147, 197, 114, .8)'
}

Circle.prototype = new ShapeConstructor()

Circle.prototype.collidesWith = function(shape, displacement) {
  /*var point, length, min = 10000, v1, v2,
    edge, perpendicular, normal,
    axes = shape.getAxes(), distance

  if(axes === undefined) {
    distance = Math.sqrt(Math.pow(shape.x - this.x, 2) +
                         Math.pow(shape.y - this.y, 2))

    return distance < Math.abs(this.radius + shape.radius)
  } else {
    return polygonCollidesWithCircle(shape, this)
  }*/
  if(shape.radius === undefined) {
    return polygonCollidesWithCircle(shape, this, displacement)
  } else {
    return circleCollidesWithCircle(this, shape, displacement)
  }
}

Circle.prototype.getAxes = function() {
  return undefined
}

Circle.prototype.centroid = function () {
   return new Point(this.x,this.y);
}

Circle.prototype.boundingBox = function (dx, dy) {
   return new BoundingBox(this.x - this.radius,
                          this.y - this.radius,
                          2*this.radius,
                          2*this.radius);
}

Circle.prototype.project = function(axis) {
  var scalars = [],
    point = new Point(this.x, this.y),
    dotProduct = new Vector(point).dotProduct(axis)

  scalars.push(dotProduct)
  scalars.push(dotProduct + this.radius)
  scalars.push(dotProduct - this.radius)

  return new Projection(Math.min.apply(Math, scalars),
                        Math.max.apply(Math, scalars))
}

Circle.prototype.move = function(dx, dy) {
  this.x += dx
  this.y += dy
}

Circle.prototype.createPath = function(context) {
  context.beginPath()
  context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
}

function getPolygonPointClosestToCircle(polygon, circle) {
  var min = 10000,
    length, testPoint, closestPoint

  for(var i = 0, len = polygon.points.length; i < len; i++) {
    testPoint = polygon.points[i]
    length = Math.sqrt(Math.pow(testPoint.x - circle.x, 2),
                       Math.pow(testPoint.y - circle.y, 2))

    if(length < min) {
      min = length
      closestPoint = testPoint
    }
  }

  return closestPoint
}

function getCircleAxis(circle, polygon, closestPoint) {
   var v1 = new Vector(new Point(circle.x, circle.y)),
       v2 = new Vector(new Point(closestPoint.x, closestPoint.y)),
       surfaceVector = v1.subtract(v2);

   return surfaceVector.normalize();
};


/*function polygonCollidesWithCircle(polygon, circle, displacement) {
  var axes = polygon.getAxes(),
       closestPoint = getPolygonPointClosestToCircle(polygon, circle);

   axes.push(getCircleAxis(circle, polygon, closestPoint));

   return polygon.minimumTranslationVector(axes, circle, displacement);
}*/