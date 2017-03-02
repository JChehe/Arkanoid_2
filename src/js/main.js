require('../index.html')
require('../css/main.scss')

require('./utils/requestAnimationFrame')
require('./utils/windowToCanvas')
var Background = require('./game/background')
var Racket = require('./game/racket')
var Brick = require('./game/brick.js')
var Ball = require('./game/ball')
var getFps = require('./utils/fps')
var detect2RectCollision = require('./utils/detect2RectCollision')

require('../img/thumb1.png')
require('../img/thumb2.png')
require('../img/thumb3.png')
require('../img/thumb4.png')
require('../img/thumb5.png')
require('../img/thumb6.png')
require('../img/thumb7.png')
require('../img/thumb8.png')
require('../img/thumb9.png')
require('../img/thumb10.png')
require('../img/thumb11.png')
require('../img/thumb12.png')
require('../img/thumb13.png')
require('../img/thumb14.png')
require('../img/thumb15.png')
require('../img/thumb16.png')
require('../img/thumb17.png')
require('../img/thumb18.png')
require('../img/thumb19.png')
require('../img/thumb20.png')
require('../img/thumb21.png')
require('../img/thumb22.png')
require('../img/thumb23.png')
require('../img/thumb24.png')
require('../img/thumb25.png')

var Preloader = require('preloader.js')

/**
 * init
 */
function init() {
	console.log('init ok')
}


var imgArr = []

for (var i = 0; i < 25; i++) {
	var imgPath = '../img/thumb' + (i + 1) + '.png'
	imgArr.push(imgPath)
}



/**
 * preloader && start
 */
var preloader = new Preloader({
	resources: imgArr,
	concurrency: 6
})
preloader.addProgressListener(function(loaded, length) {
	console.log('loaded', loaded, length, loaded / length)
})
preloader.addCompletionListener(function() {
	// $('#o2_loading').remove()
	$('#o2_main').removeClass('hide')

	// init()
	game.init()
	game.start()

})
preloader.start()



var canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d'),
	bbox = canvas.getBoundingClientRect();






window.ratio = canvas.width / bbox.width


function Game() {
	this.elements = []
	this.bricks = []
	this.racket
	this.ball
}


Game.prototype = {
	init: function() {
		var background = new Background(canvas)
		var racket = new Racket(canvas)
		var ball = new Ball(canvas)
		this.racket = racket
		this.ball = ball
		this.elements.push(background)
		this.elements.push(ball)
		this.elements.push(racket)

		for(var i = 0; i < 25; i++) {
			var left = (i % 5) * (canvas.width / 5),
				top = Math.floor(i / 5) * 100
			var brick = new Brick({
				index: i,
				left: left,
				top: top,
				imageObj: preloader.get('../img/thumb' + (i + 1) + '.png')
			}, canvas)
			this.bricks.push(brick)
		}

		console.log(this.bricks)

			// 事件绑定
			// 资源预加载
	},

	start: function() {


		window.requestAnimationFrame(loop)
	},

	restart: function() {

	},

	clearScreen: function(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	},

	drawBrick() {

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
	displayFps = 0,
	game = new Game()
	// tick is requestAnimateFrame 第一次启动是的时间刻。
function loop(tick) {
	// ctx.clearRect(0, 0, canvas.width, canvas.height)
	game.clearScreen(ctx)

	if (detect2RectCollision(game.racket, game.ball)) {
		// game.ball.velocityX = -game.ball.velocityX
		game.ball.velocityY = -game.ball.velocityY
	}

	game.elements.forEach(function(ele, index) {
		ele.draw()
	})

	game.bricks.forEach(function(ele, index) {
		ele.draw()
	})
	
	// getFps
	fps = getFps(tick, lastGameTime)

	// update display fps per second
	if (tick - lastFpsTime >= fpsDur) {
		displayFps = fps.toFixed()
		lastFpsTime = tick
	}

	lastGameTime = tick
	drawFPS(ctx, displayFps)
	window.requestAnimationFrame(loop)
}



