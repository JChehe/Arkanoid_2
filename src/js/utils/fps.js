function getFps(now, lastTime) {
  var fps = 1000 / (now - lastTime)

  return fps
}

module.exports = getFps