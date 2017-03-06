var Preloader = require('preloader.js')


require('../../img/player_on.png')
require('../../img/player_off.png')
require('../../img/welfare.png')
require('../../img/thumb1.png')
require('../../img/thumb2.png')
require('../../img/thumb3.png')
require('../../img/thumb4.png')
require('../../img/thumb5.png')
require('../../img/thumb6.png')
require('../../img/thumb7.png')
require('../../img/thumb8.png')
require('../../img/thumb9.png')
require('../../img/thumb10.png')
require('../../img/thumb11.png')
require('../../img/thumb12.png')
require('../../img/thumb13.png')
require('../../img/thumb14.png')
require('../../img/thumb15.png')
require('../../img/thumb16.png')
require('../../img/thumb17.png')
require('../../img/thumb18.png')
require('../../img/thumb19.png')
require('../../img/thumb20.png')
require('../../img/thumb21.png')
require('../../img/thumb22.png')
require('../../img/thumb23.png')
require('../../img/thumb24.png')
require('../../img/thumb25.png')



var imgArr = []

for (var i = 0; i < 25; i++) {
	var imgPath = '../../img/thumb' + (i + 1) + '.png'
	imgArr.push(imgPath)
}

imgArr.push('../../img/player_on.png')
imgArr.push('../../img/player_off.png')
imgArr.push('../../img/welfare.png')


/**
 * preloader && start
 */
var preloader = new Preloader({
	resources: imgArr,
	concurrency: 10,
	perMinTime: 500
})
preloader.addProgressListener(function(loaded, length) {
	console.log('loaded', loaded, length, loaded / length)
})
preloader.addCompletionListener(function() {
	$('#o2_loading').remove()
	$('#o2_main').removeClass('hide')
	game.init()
})
preloader.start()


module.exports = preloader