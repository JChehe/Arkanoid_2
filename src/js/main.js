require('../index.html')
require('../css/main.scss')

require('./utils/requestAnimationFrame')
require('./utils/windowToCanvas')
var getFps = require('./utils/fps')

// function racket(options) {
// 	this.left = options.
// 	this.top  = 
// }
// 
// 



var canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d');


function Game() {

}


Game.prototype = {
	init: function() {
		// 事件绑定
    // 资源预加载
	},

	start: function() {


		window.requestAnimationFrame(loop)
	},

	restart: function() {

	}
}

function drawFPS(ctx, fps) {
	ctx.save()
	ctx.font = '30px Microsoft YaHei'
	ctx.fillStyle = 'cornflowerblue'
	ctx.fillText(fps + ' fps', 20, 60)
	ctx.restore()
}


var lastGameTime = 0,
	lastFpsTime = 0,
	fpsDur = 1000,
	curFps = getFps().toFixed(),
	displayFps = 0;

// tick is requestAnimateFrame 第一次启动是的时间刻。
function loop(tick) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// getFps
	fps = getFps(tick, lastGameTime)

	// update display fps per second
	if(tick - lastFpsTime >= fpsDur) {
		displayFps = fps.toFixed()
		lastFpsTime = tick
	}

	lastGameTime = tick
	drawFPS(ctx, displayFps)
	window.requestAnimationFrame(loop)
}


var game = new Game()

game.init()
game.start()