window._ = {
	//快速选择器
	g: function(name) {
		return document.querySelector(name);
	},

	ga: function(name) {
		return document.querySelectorAll(name);
	},

	// 事件绑定兼容性写法
	addEvent: function(obj, ev, fn) {
		obj.addEventListener ? obj.addEventListener(ev, fn) : obj.attachEvent('on' + ev, fn);
	},

	removeEvent: function(obj, ev, fn) {
		obj.removeEventListener ? obj.removeEventListener(ev, fn) : obj.detachEvent('on' + ev, fn);
	},

	// 增加classname
	addClassName: function(node, className) {
		var current = node.className || "";
		if((" " + current + " ").indexOf(" " + className + " ") === -1) {
			node.className = current ? (current + " " + className) : className;
		}
	},

	// 删除classname
	delClassName: function(node, className) {
		var current = node.className || "";
		node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
	},

	// 判断是否有某个classname
	hasClassName: function(node, className) {
		var current = node.className || "",
			flag;
		if((" " + current + " ").indexOf(" " + className + " ") === -1) {
			flag = false;
		} else {
			flag = true;
		}
		return flag;
	},
	timeFormate:function(num){
		var fullSeconds = parseInt(num);
	    var minutes = parseInt(fullSeconds / 60);
	    var seconds = fullSeconds % 60;
	    if(minutes < 10){
	    		minutes = '0' + minutes;
	    }else{
	    		minutes = minutes +'';
	    };
	    if (seconds < 10) {
	        seconds = '0' + seconds;
	    } else {
	        seconds = seconds + '';
	    };
	    var timeStr = minutes + ':' + seconds;
	    return timeStr;
	},
	 //ajax请求
    ajax: function (opt) {
//      var xhr = (function () {
//          if (window.XMLHttpRequest) {
//              return new XMLHttpRequest();
//          } else {
//              return new ActiveXobject('Microft.XMLHttp');
//          }
//      })(), data;
//
//
//      if (obj.method.toUpperCase() === 'GET') {
//          obj.url += obj.data ? ('?'+ _.serialize(obj.data)) : '';
//      }
//
//
//      if (obj.method.toUpperCase()  === 'POST' || obj.method.toUpperCase()  === 'PATCH') {
//          data = obj.data ? JSON.stringify(obj.data) : null;
//          console.log(obj.data, obj.url, obj.method)
//      }
//
//      xhr.open(obj.method, obj.url, true);
//
//      // 请求头 设置需要放在open方法后面执行，否则会报错
//      xhr.setRequestHeader('Content-Type','application/json');
//
//
//      xhr.onreadystatechange = function(){
//          if(xhr.readyState === 4){
//              if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
//                  obj.success(xhr.responseText);
//              }else{
////                  obj.fail(xhr);
//                  console.log('The error code：' + xhr.status + ' and msg is ：' + xhr.statusText);
//              }
//          }
//      };
//      xhr.send(data);

	opt = opt || {};
        opt.method = opt.method.toUpperCase() || 'POST';
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () {};
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        var params = [];
        for (var key in opt.data){
            params.push(key + '=' + opt.data[key]);
        }
        var postData = params.join('&');
        if (opt.method.toUpperCase() === 'POST') {
            xmlHttp.open(opt.method, opt.url, opt.async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xmlHttp.send(postData);
        }
        else if (opt.method.toUpperCase() === 'GET') {
            xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
            xmlHttp.send(null);
        } 
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                 opt.success(xmlHttp.responseText);
            }
        };
    },
    
    // 序列化参数
    serialize: function (data) {
        if (!data) return '';
        var pairs = [];
        for (var name in data) {
            if (!data.hasOwnProperty(name)) continue;
            if (typeof data[name] === 'function') continue;
            var value  = data[name].toString();
            name  = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name + '=' + value);
        }
        return pairs.join('&');
    },
    drag: function(obj,line,callbackFir,callbackSec) {
			obj.onmousedown = function(event) {
				var l = event.clientX - obj.offsetLeft;
				callbackFir();
				document.onmousemove = function(event) {
					var newL = event.clientX - l;
					if(newL < 0){
						newL = 0;
					}else if(newL >= 390){
						newL = 390;
					}
					line.style.width = obj.style.left = newL + 'px';	
				};
				obj.onmouseup = function(music) {
					document.onmousemove = null;
					callbackSec();
				};
				return false;
			};
	}
	
}