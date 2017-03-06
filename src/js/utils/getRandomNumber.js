function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min
}

module.exports = getRandomNumber