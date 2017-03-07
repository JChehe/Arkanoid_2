var Preloader = require('preloader.js')


require('../../img/player_sprite.png')
// require('../../img/player_off.png')
require('../../img/welfare.png')
require('../../img/bricks.png')




var resources = []

resources.push('../../img/bricks.png')
resources.push('../../img/player_sprite.png')
// resources.push('../../img/player_off.png')
resources.push('../../img/welfare.png')


/**
 * preloader && start
 */
var preloader = new Preloader({
	resources: resources,
	concurrency: 6,
	perMinTime: 200
})
preloader.addProgressListener(function(loaded, length) {
	// console.log('loaded', loaded, length, loaded / length)
})
preloader.addCompletionListener(function() {
	$('#o2_loading').remove()
	$('#o2_main').removeClass('hide')
	game.init()
})
preloader.start()


module.exports = preloader