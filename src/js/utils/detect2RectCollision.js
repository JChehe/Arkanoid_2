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

function isOnTopHalfZone(angle) {
   if(angle > 0 && angle < 180) {
    return true
   } else {
    return false
   }
}

function isOneLeftRightZone(angle) {
  if(((angle >= 0 && angle < 45) || (angle > 315 && angle < 360)) || (angle >= 135 && angle < 225)) {
    return true
  } else {
    return false
  }
}


// function afterCollised(r1, r2, angle) {
//   var w = 0.5 * (r1.width + r2.width);
//   var h = 0.5 * (r1.height + r2.height);
//   var r1CenterX = r1.left + r1.width / 2
//   var r1CenterY = r1.top + r1.height / 2
//   var r2CenterX = r2.left + r2.width / 2
//   var r2CenterY = r2.left + r2.width / 2
//   var dx = r1CenterX - r2CenterX;
//   var dy = r1CenterY - r2CenterY;

//   if (Math.abs(dx) <= w && Math.abs(dy) <= h){
//       /* collision! */
//       var wy = w * dy;
//       var hx = h * dx;

//       if (wy > hx)
//           if (wy > -hx) {
//             /* collision at the top */
//             r1.velocityY = -r1.velocityY;
//             r2.velocityY = -r2.velocityY;
//           }

//           else {
//             /* on the left */
//             r1.velocityX = -r1.velocityX;
//             r2.velocityX = -r2.velocityX;
//           }
//       else
//           if (wy > -hx) {
//             /* on the right */
//             r1.velocityX = -r1.velocityX;
//             r2.velocityX = -r2.velocityX;
//           }
//           else {
//             /* at the bottom */
//             r1.velocityY = -r1.velocityY;
//             r2.velocityY = -r2.velocityY;
//           }
//   }
// }

exports.isOnTopHalfZone = isOnTopHalfZone
exports.isOneLeftRightZone = isOneLeftRightZone
exports.afterCollised = afterCollised
exports.detect2RectCollision = detect2RectCollision