function isFunction(fn) {
	return Object.prototype.toString.call(fn)=== '[object Function]';
}

module.exports = isFunction