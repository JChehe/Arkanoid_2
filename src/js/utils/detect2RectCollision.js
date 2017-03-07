function detect2RectCollision(r1, r2) {

  var hit = !(r1.left + r1.width < r2.left ||
    r2.left + r2.width < r1.left ||
    r1.top + r1.height < r2.top ||
    r2.top + r2.height < r1.top);

  if (hit) {
    /// calc angle
    var dx = r2.left - r1.left;
    var dy = r2.top - r1.top;
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    return angle;

  } else
    return null;
}

// 
// var hit = false
function afterCollised(rect1, rect2, angle) {
  if (angle !== null) {
    // if (!hit) {
      // hit = true;
      /// zone 1 - right
      if ((angle >= 0 && angle < 45) || (angle > 315 && angle < 360)) {
        if (rect1.velocityX > 0) rect1.velocityX = -rect1.velocityX;
        if (rect2.velocityX < 0) rect2.velocityX = -rect2.velocityX;
      } else if (angle >= 45 && angle < 135) { /// zone 2 - bottom
        if (rect1.velocityY > 0) rect1.velocityY = -rect1.velocityY;
        if (rect2.velocityY < 0) rect2.velocityY = -rect2.velocityY;
      } else if (angle >= 135 && angle < 225) { /// zone 3 - left
        if (rect1.velocityX < 0) rect1.velocityX = -rect1.velocityX;
        if (rect2.velocityX > 0) rect2.velocityX = -rect2.velocityX;
      } else { /// zone 4 - top
        if (rect1.velocityY < 0) rect1.velocityY = -rect1.velocityY;
        if (rect2.velocityY > 0) rect2.velocityY = -rect2.velocityY;
      }
    // }
  } else {
    // hit = false;
  }
}

exports.afterCollised = afterCollised
exports.detect2RectCollision = detect2RectCollision