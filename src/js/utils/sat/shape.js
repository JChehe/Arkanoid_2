var BIG_NUMBER = 1000000;

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

  minimumTranslationVector: function(axes, shape) {
    var minimumOverlap = 100000,
      overlap,
      axisWithSmallestOverlap;

    for (var i = 0, len = axes.length; i < len; i++) {
      axis = axes[i]
      projection1 = shape.project(axis)
      projection2 = shape.project(axis)
      overlap = projection1.overlaps(projection2)

      if (overlap === 0) {
        return {
          axis: undefined,
          overlap: 0
        }
      } else {
        if (overlap < minimumOverlap) {
          minimumOverlap = overlap
          axisWithSmallestOverlap = axis
        }
      }
    }
    console.log('minimumOverlap', minimumOverlap)
    return {
      axis: axisWithSmallestOverlap,
      overlap: minimumOverlap
    }
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

  boundingBox: function() {
    throw 'boundingBox() not implemented';
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
  },

  minimumTranslationVector: function(axes, shape, displacement) {
    return getMTV(this, shape, displacement, axes);
  }
}



var MinimumTranslationVector = function(axis, overlap) {
  this.axis = axis
  this.overlap = overlap
}


function getMTV(shape1, shape2, displacement, axes) {
  var minimumOverlap = BIG_NUMBER,
    overlap,
    axisWithSmallestOverlap,
    mtv;

  for (var i = 0; i < axes.length; ++i) {
    axis = axes[i];
    projection1 = shape1.project(axis);
    projection2 = shape2.project(axis);
    overlap = projection1.getOverlap(projection2);

    if (overlap === 0) {
      return new MinimumTranslationVector(undefined, 0);
    } else {
      if (overlap < minimumOverlap) {
        minimumOverlap = overlap;
        axisWithSmallestOverlap = axis;
      }
    }
  }
  mtv = new MinimumTranslationVector(axisWithSmallestOverlap,
    minimumOverlap);
  return mtv;
};


function polygonCollidesWithPolygon(p1, p2, displacement) {
  var mtv1 = p1.minimumTranslationVector(p1.getAxes(), p2),
    mtv2 = p1.minimumTranslationVector(p2.getAxes(), p2)

  if (mtv1.overlap === 0 && mtv2.overlap === 0) {
    return {
      axis: undefined,
      overlap: 0
    }
  } else {
    return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2
  }
}


function circleCollidesWithCircle(c1, c2) {
  var distance = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2)),
    overlap = Math.abs(c1.radius + c2.radius) - distance;

  return overlap < 0 ? new MinimumTranslationVector(undefined, 0) :
    new MinimumTranslationVector(undefined, overlap)
}

function polygonCollidesWithCircle(polygon, circle, displacement) {
  var axes = polygon.getAxes(),
    closestPoint = getPolygonPointClosestToCircle(polygon, circle)


  axes.push(getCircleAxis(circle, polygon, closestPoint))
  return polygon.minimumTranslationVector(axes, circle, displacement)
}




var BoundingBox = function(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
};

module.exports = {
  ShapeConstructor: Shape,
  polygonCollidesWithPolygon: polygonCollidesWithPolygon,
  circleCollidesWithCircle: circleCollidesWithCircle,
  polygonCollidesWithCircle: polygonCollidesWithCircle
}
