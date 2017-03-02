function detect2RectCollision(rect1, rect2) {
  if (rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.height + rect1.top > rect2.top) {
    // console.log('撞了')
    return true
  } else {
    // console.log('没撞')
    return false
  }
}

module.exports = detect2RectCollision
