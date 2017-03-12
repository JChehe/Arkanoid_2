// 旋转点

function rotatePoint(pivot, point, angle) {
  // Rotate clockwise, angle in radians
  var x = Math.round((Math.cos(angle) * (point[0] - pivot[0])) -
                     (Math.sin(angle) * (point[1] - pivot[1])) +
                     pivot[0]),
      y = Math.round((Math.sin(angle) * (point[0] - pivot[0])) +
                     (Math.cos(angle) * (point[1] - pivot[1])) +
                     pivot[1]);
  return {x: x, y: y};
}

function degToRad(deg) {
	return deg * Math.PI / 180;
}


exports.rotatePoint = rotatePoint
exports.degToRad = degToRad