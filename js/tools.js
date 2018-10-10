// var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //文档顶部到浏览器顶部的距离;
// var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;//文档左边到浏览器左边的距离;
// var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;//获取浏览器高度;


//事件对象兼容
// document.onclick = function(event){
// 	var e = event || window.event;
// }

function stopEvent(event){          //阻止事件冒泡兼容
	var e = event || window.event;
	if(e.stopPropagation){
		e.stopPropagation();
	}else{
		e.cancelBuble = true;
	}
}



function $(selector){                         // 选择器封装
	var all = document.querySelectorAll(selector);
	if(all.length > 1){
		return all;
	}
	if(all.length == 0){
		return null;
	}else{
		return all[0];
	}
}


function positionAbs(dom){     //绝对定位坐标值封装
	if(dom.offsetParent == document.body){
		var left = dom.offsetLeft;
		var top = dom.offsetTop;
		return [left,top];
	}
	var border = parsInt(getComputedStyle(dom,false).borderWidth);
	left =  dom.offsetLeft + positionAbs(dom.offsetParent)+border;
	top = dom.offsetTop+positionAbs(dom.offsetParent)+border;
	return [left ,top];
}


function addEvent(dom,eventType,callback){      //事件监听兼容封装
	if(dom.addEventListener){
		dom.addEventListener(eventType,callback);
	}else if(dom.attachEvent){
		dom.attachEvent('on' + eventType,callback);
	}else{
		dom['on'+eventType] = callback;
	}
}

function randomColor(){             //随机颜色16位
	var str = '1234567890abcdef';
	var col = '';
	for(var i = 0;i<6;i++){
		var num = parseInt(Math.random()*str.length);
		col+=str[num];
	}
	return '#'+col;
}

function randomColorRGB(){        //随机颜色rgb
	var r = Math.round(Math.random()*255);
	var g = Math.round(Math.random()*255);
	var b = Math.round(Math.random()*255);
	return 'rgb('+r+','+g+','+b+')';
}


function setCookie(name,value,options){    //设置cookie函数封装
    var cookieStr = name + "=" + value;
        if(typeof options != "object"){
           return  document.cookie = cookieStr;
        }
        if(typeof options.path === "string"){
            cookieStr += ";path=" + options.path;
        }
        if(typeof options.expires === "number" || typeof options.expires === "string"){
            var d = new Date();
            d.setDate(d.getDate() + options.expires);
            cookieStr += ";expires=" + d;
        } 
        document.cookie = cookieStr;
}


function removeCookie(name,path){       //删除cookie函数封装
    setCookie(name,"",{
        path:path ? path : "",
        expires : -1
    })
}


function getCookie(name){          //获取cookie函数封装
    var cookieArray = document.cookie.split("; ");  
    for(var i = 0 ; i < cookieArray.length ; i ++){
        var cookieItem = cookieArray[i];
        var cookieName = cookieItem.split("=")[0];
        var cookieValue = cookieItem.split("=")[1];
        if(cookieName == name){
            return cookieValue;
        }
    }
    return "";
}


function getStyle(dom,attr){           //获取元素属性兼容
	if(getComputedStyle){
		return getComputedStyle(dom)[attr];
	}else{
		return dom.currentStyle[attr];
	}
}


function Move(dom,attr,target){       //元素运动封装（可改变属性）(缺点：只能一次改变一个属性的运动)_
	if(attr == 'opacity'){
		target = parseInt(target * 100);
	}
	//1.清除开始计时器
	clearInterval(dom.timer);
	//2.开启定时器
	dom.timer = setInterval(function(){
	//3.计算速度
		if(attr=='opacity'){
			var iNow = parseInt(getStyle(dom,attr)*100);
		}else{
			var iNow = parseInt(getStyle(dom,attr));
		}
		speed = (target - iNow) / 5;
		if(speed>0){
			speed = Math.ceil(speed);
		}else{
			speed = Math.floor(speed);
		}
	//4.终止条件
		if(target == iNow){
			clearInterval(dom.timer);
			return 0;
		}
	//5.效果
		if(attr =='opacity'){
			dom.style[attr] = (iNow + speed) / 100;
		}else{
			dom.style[attr] = iNow + speed + 'px';
		}
	},50);
}


function move(dom,json,callback){       	  //运动封装最终版（可以同时使元素多个属性同时变化的运动函数）      
	clearInterval(dom.timer);                 //1.清除已开启定时器;
	dom.timer = setInterval(function(){
		var flag = 0;//设置表示
		for(var attr in json){                //2.遍历需要变化的元素属性; 
			flag ++;
			var iNow = parseInt(getStyle(dom,attr));
			var speed = (json[attr] - iNow) / 10;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			if(iNow == json[attr]){	          //3.判断结束条件;
				delete json[attr];//这里因为每个属性目标点在不同的时候，当目标点最短的那个运动结束，那么整个定时器会被清除，导致目标点比较大的属性会中途停止运动;
			}					  //因此这里将每个到达目标点的元素的属性值删除掉;那么在循环体外面的flag是零的时候，也就是所有的属性变化都已经执行完毕的时候，再清除定时器;
			dom.style[attr] = iNow + speed + 'px';
		}
		if(flag == 0){//当flag为0,也就是属性变化被执行并且删除完后，清除定时器;
			clearInterval(dom.timer);
			if(callback){//如果回调函数存在那么让他执行;
				callback();
			}
		}
	},50);
}

