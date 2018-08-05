(function(window, undefined) {
	var Music = function() {

	};
	Music.prototype = {
		constructor: Music,
		init: function() {
			this.createProduct();
			this.getChannel();

		},
		createProduct: function() {
			var This = this;
			this.musicAudio = document.getElementById('music'); // audio标签
			this.song = {}; // 获取的歌曲对象
			this.songArr = []; // 用于保存歌曲，可以读取上一首
			this.songTitle = _.g('.songTitle'); // 歌名标签节点
			this.singer = _.g('.singer'); // 歌手标签节点
			this.main = _.g('.g-main');
			this.cdWrap = _.g('.m-cdWrap');
			this.needle = _.g('.g-main .needle'); // needle
			this.cdBg = _.g('.g-main .cdBg'); // 黑胶碟
			this.cdPic = _.g('.g-main .cdPic'); // 专辑图片			
			this.recordWrap = _.g('.record-wrapper'); // 专辑区域
			this.lyricWrap = _.g('.m-lyricWrap');
			this.islyricShow = false;
			this.lyricTimeArr = []; //用于保存每句歌词对应的秒数
			this.lyrics = _.g('.lyrics'); // 歌词父节点
			this.lyricsLiArr = [];

			this.mode = _.g('.mode'); // 模式选择
			this.prevBtn = _.g('.prev'); // 上一首按钮
			this.playBtn = _.g('.play'); // 播放按钮
			this.nextBtn = _.g('.next'); // 下一首按钮
			this.channelShow = false;
			this.channel = _.g('.channel'); // 频道标签节点
			this.channelList = _.g('.channelList'); // 频道列表
			this.channelArr = [];
			this.current = _.g('.currentTime'); // 播放时间
			this.full = _.g('.songTime'); // 歌曲总时间
			this.handleBox = _.g('.progressLine');
			this.currentLine = _.g('.currentProgress'); // 当前进度条进度
			this.progressHandle = _.g('.progressHandle'); // 进度条指针
			this.glassBg = _.g('.glassBg'); // 背景毛玻璃效果

			this.lyricsShow();

			this.prevBtn.addEventListener('click', this.prev.bind(this));
			this.playBtn.addEventListener('click', this.player.bind(this));
			this.nextBtn.addEventListener('click', this.next.bind(this));
			//黑胶碟旋转与指针旋转
			this.musicAudio.onplay = function() {
				_.addClassName(This.needle, 'needlePlay');
				_.addClassName(This.playBtn, 'onplay');
				This.cdBg.style.animationPlayState = 'running';
				//This.full.innerHTML = _.timeFormate(This.musicAudio.duration);
			};
			this.musicAudio.onpause = function() {
				_.delClassName(This.needle, 'needlePlay');
				_.delClassName(This.playBtn, 'onplay');
				This.cdBg.style.animationPlayState = 'paused';
			};
			this.currentProgress();
			_.drag(this.progressHandle,this.currentLine,function(){
				This.musicAudio.pause();
			},function(){
				var linePercent = parseInt(This.progressHandle.style.left)/390;
				This.musicAudio.currentTime = linePercent* This.musicAudio.duration;
				This.musicAudio.play();
			});

			this.mode.addEventListener('click', function() {
				if(!This.musicAudio.loop) {
					This.mode.style.backgroundPositionY = 0;
					This.musicAudio.loop = true;
				} else {
					This.mode.style.backgroundPositionY = -40 + 'px';
					This.musicAudio.loop = false;
				}
			});
			
			this.channel.addEventListener('click',function(){
				if(!This.channelShow){
					This.channelList.style.display = 'block';
					This.channelShow = true;
				}else{
					This.channelList.style.display = 'none';
					This.channelShow = false;
				}
			});

		},
		prev: function() {
			if(this.songArr.length > 1) {
				this.songArr.pop();
				this.songReset(this.songArr[this.songArr.length - 1]);
			};
		},
		player: function() {
			if(this.musicAudio.paused) {
				this.musicAudio.play();
				_.addClassName(this.playBtn, 'onplay');
			} else {
				this.musicAudio.pause();
				_.delClassName(this.playBtn, 'onplay');
			};
		},
		next: function() {
			this.getMusic();
		},
		getChannel: function() {
			var This = this;
			_.ajax({
				url: 'http://api.jirengu.com/fm/getChannels.php',
				method: 'GET',
				async: false,
				success: function(response) {
					console.log(1);
					var jsonObj = JSON.parse(response);
					var channelArr = jsonObj['channels'];
					console.log(channelArr);
					for(var i = 0; i < channelArr.length; i++) {
						var channelName = channelArr[i].name;
						var channelCover = channelArr[i].cover_middle;
						var channelID = channelArr[i].channel_id;
						This.channelId = channelArr[0].channel_id;
						var html = '<li channel-id="' + channelID + '">\
										<img src = "' + channelCover + '">\
										'+ channelName + '</li>';
						This.channelList.innerHTML += html;
					}
					_.addClassName(This.cdBg, 'z-active');
					This.cdBg.style.animationPlayState = 'paused';
					This.getRandomChannel(channelArr);
					This.getMusic();
				}
			});
		},
		getRandomChannel: function(channelArr) {
			var randomNum = Math.floor(channelArr.length * Math.random());
			var randomChannel = channelArr[randomNum];

			//this.channel.innerHTML = randomChannel.name;
			this.channel.setAttribute('data-channel-id', randomChannel.channel_id);
		},
		getMusic: function() {
			var This = this;
			_.ajax({
				url: 'http://api.jirengu.com/fm/getSong.php',
				method: 'GET',
				data: {
					"channel": This.channel.getAttribute("data-channel-id")
				},
				success: function(response) {
					var jsonObj = JSON.parse(response);
					var songObj = jsonObj['song'][0];
					//console.log(songObj);

					This.songTitle.innerHTML = songObj.title;
					This.singer.innerHTML = songObj.artist;
					This.cdPic.style.background = 'url(' + songObj.picture + ')  no-repeat center center';
					This.glassBg.src = songObj.picture;
					This.musicAudio.src = songObj.url;
					This.songArr.push(songObj); //将播放的歌曲保存在一个数组中，上一曲可以取到
					console.log(This.songArr);
					This.musicAudio.setAttribute('data-sid', songObj.sid);
					This.musicAudio.play();
					This.musicAudio.loop = false;
					This.getLyric();
				}
			});

		},
		songReset: function(songInfo) {
			var This = this;
			this.musicAudio.src = songInfo.url;
			this.songTitle.innerHTML = songInfo.title;
			this.singer.innerHTML = songInfo.artist;
			this.cdPic.style.background = 'url(' + songInfo.picture + ')  no-repeat center center';
			this.glassBg.src = songInfo.picture;
			this.musicAudio.setAttribute('data-sid', songInfo.sid);
			This.getLyric();
		},
		getLyric: function() {
			var This = this;
			var sid = this.musicAudio.dataset.sid;
			_.ajax({
				url: 'https://jirenguapi.applinzi.com/fm/getLyric.php',
				method: 'GET',
				data: {
					sid: sid
				},
				success: function(response) {
					var lyricsObj = JSON.parse(response);
					if(lyricsObj.lyric) {
						This.lyrics.innerHTML = ''; // 清空歌词
						var lineArr = lyricsObj.lyric.split('\n'); // 歌词以排为界数组
						var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
						var result = [];

						for(var i in lineArr) {
							var time = lineArr[i].match(timeReg);
							if(!time) continue;
							var curStr = lineArr[i].replace(timeReg, '');
							for(var j in time) {
								var t = time[j].slice(1, -1).split(':'); // 时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
								var curSecond = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
								result.push([curSecond, curStr]);
							}
						}

						result.sort(function(a, b) {
							return a[0] - b[0];
						});

						// 渲染歌词到界面
						This.renderLyrics(result);
					}
				}
			})
		},
		renderLyrics: function(lyricArr) {
			var str = '';
			console.log(lyricArr);
			if(lyricArr.length == 1) {
				str = '<li data-time="0.01">抱歉，这首歌暂时还没有上传歌词</li>';
			} else {
				for(var i = 0; i < lyricArr.length; i++) {
					if(lyricArr[i][0] == 0.01) {
						str += '<li data-time="0.01">音乐来自百度FM</li>';
					} else {
						str += '<li data-time="' + _.timeFormate(lyricArr[i][0]) + '">' + lyricArr[i][1] + '</li>';
					};

				}
			}

			this.lyrics.innerHTML = str;
			this.lyricsLiArr = this.lyrics.getElementsByTagName('li');

		},
		lyricsShow: function() {
			var This = this;
			this.main.addEventListener('click', function() {
				if(!This.islyricShow) {
					_.delClassName(This.cdWrap, 'z-active');
					_.addClassName(This.lyricWrap, 'z-active');
					This.islyricShow = true;
				} else {
					_.addClassName(This.cdWrap, 'z-active');
					_.delClassName(This.lyricWrap, 'z-active');
					This.islyricShow = false;
				}
			})
		},
		lyricMove: function(ele) {
			this.lis = _.ga('.lyrics li');
			var This = this;
			for(var i = 1; i < this.lis.length; i++) {
				this.lyrics.style.height = 56 * i + 'px';
				if(ele === this.lis[i].dataset.time) {
					var Top = 340 - i * 56 + 'px'; //盒子原来top值，抽动 行高*i，就是最终的top值
					_.addClassName(This.lis[i], 'light-lyric');
					_.delClassName(This.lis[i].previousElementSibling, 'light-lyric');
					This.lyrics.style.top = Top;
				}
			}
		},
		currentProgress: function() {
			var This = this;
			this.musicAudio.ontimeupdate = function() {
				This.curTime = _.timeFormate(This.musicAudio.currentTime);
				This.currentWidth = parseInt(This.musicAudio.currentTime / This.musicAudio.duration * 390) + 'px';
				This.full.innerHTML = _.timeFormate(This.musicAudio.duration);
				This.current.innerHTML = This.curTime
				This.currentLine.style.width = This.currentWidth;
				This.progressHandle.style.left = This.currentWidth;
				This.lyricMove(This.curTime);
				if(!This.musicAudio.loop) {
					This.musicAudio.onended = function() {
						This.next();
					}
				}
			}
		}

	}

	//商品数据

	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Music;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Music;
		});
	} else {
		// 直接暴露到全局
		window.Music = Music;
	}
})(window, undefined);