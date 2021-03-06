//点击选择学校按钮的事件
function clickSchool () {
	var schoolButton=document.getElementById('school');
	var schoolDiv=document.getElementById('sc');
	schoolButton.onclick=function () {
		this.getElementsByTagName('input')[0].disabled="disabled"
		view (schoolDiv,schoolButton);
	}
}
//点击选择姓名按钮的函数
function clickName () {
	var nameButton=document.getElementById('name');
	var nameDiv=document.getElementById('na');
	var schoolDiv=document.getElementById('sc');
	nameButton.onclick =function () {
		this.getElementsByTagName('input')[0].disabled="disabled;"
		view(nameDiv,nameButton);
	}
};
//弹出选框的函数
function view (div,button) {
	div.style.display="block";
	var over=document.createElement('div');
	document.getElementsByTagName('body')[0].appendChild(over);	
	over.style.cssText = 'width:100%;height:100%;background:#333;opacity:0.6;z-index:2;position:fixed;top:0;left:0;';
	over.id="over";
	chooseLi (div,button);
}

//选择学校或姓名，如果选择学校则发送请求
function chooseLi (div,button) {
	var oLi=div.getElementsByTagName('li');
	var over=document.getElementById('over');
	var backS=document.getElementById('sc').getElementsByTagName('span')[0];
	var backN=document.getElementById('na').getElementsByTagName('span')[0];
	var subButton =document.getElementById('sub');
	var osubButton=document.getElementById('osub');
	var mylength=oLi.length;
	for (var i = 0; i < mylength; i++) {
		oLi[i].onclick=function () {
			var that=this;
			this.parentNode.parentNode.style.display="none";
			button.getElementsByTagName('input')[0].value=this.firstChild.nodeValue;
			button.getElementsByTagName('input')[0].removeAttribute('disabled');
			document.getElementsByTagName('body')[0].removeChild(over);
			//判断如果选择了学校，则清空姓名输入并发送请求加载列表
			if (div.id==="sc") {
				chooseSchool(that,subButton,osubButton);
			}
			//判断如果选择了姓名，提交按钮可点击。
			if (div.id==="na") {
				chooseName(that,subButton,osubButton);
			};
		}
	};

	backN.onclick=function () {
		goBack (div,button)
	}
	backS.onclick=function () {
		goBack (div,button)
	}
	over.onclick=function () {
		goBack (div,button)
	}
}
function chooseSchool (choosenLi,subButton,osubButton) {
	//改变选框的样式
	var schoolButton=document.getElementById('school');
	if (!schoolButton.class){
		schoolButton.className="active"
	};
	if (!schoolButton.getElementsByTagName('i')[0].class){
		schoolButton.getElementsByTagName('i')[0].className="active"
	};

	//初始化选择姓名的栏目
	document.getElementById('name').getElementsByTagName('input')[0].value="请选择姓名";
	document.getElementById('name').getElementsByTagName('span')[0].style.display="none";
	//对各个按钮的操作
	subButton.className=" ";
	subButton.innerHTML="签到";
	subButton.setAttribute('disabled','disabled');
	osubButton.className=" ";
	osubButton.innerHTML="代签";
	osubButton.setAttribute('disabled','disabled');
	document.getElementById('name').className="";
	document.getElementById('name').getElementsByTagName('i')[0].className="";

	ajax( rootURL + "/index.php/Index/Index/match","school="+choosenLi.innerHTML,loadName);
}
//添加标志性按钮的函数
function creatSignButton(string,clickfun) {
	var signButton=document.createElement('button');
	var parentDiv=document.getElementsByClassName('sub')[0];
	signButton.innerHTML=string;
	signButton.setAttribute('id',"s");
	signButton.style.width="100%";
	signButton.onclick=clickfun;
	signButton.className="active";
	if (parentDiv.contains(document.getElementById('s'))) {
		parentDiv.removeChild(document.getElementById('s'));
	}
	parentDiv.appendChild(signButton);
}

function chooseName (choosenLi,subButton,osubButton) {
	//对选框样式的处理
	var nameButton=document.getElementById('name');
	if (!nameButton.class){
		nameButton.className="active"
	};
	if (!nameButton.getElementsByTagName('i')[0].class){
		nameButton.getElementsByTagName('i')[0].className="active"
	};
	//对按钮样式的处理
	subButton.className="active";
	subButton.removeAttribute('disabled');
	osubButton.className="active";
	osubButton.removeAttribute('disabled');
	//如果用户已签到，则添加SPAN提示，更改提交按钮的innerHTML
	//重发ajax请求方法
	ajax( rootURL + "/index.php/Index/Index/name","name="+choosenLi.firstChild.nodeValue,function (data) {
			var data=JSON.parse(data);
			if (data[0].lock==="0") {
				if (data[0].time>0) {
				document.getElementById('name').getElementsByTagName('span')[0].style.display="inline";
				subButton.style.display="none";
				osubButton.style.display="none";//取消原签到按钮的显示
				creatSignButton("您已签到");
				}else{
					document.getElementById('name').getElementsByTagName('span')[0].style.display="none";
					document.getElementById('sub').innerHTML="签到";
					subButton.style.display="inline-block";
					osubButton.style.display="inline-block";
					if (document.getElementById('s')) {
						document.getElementsByClassName('sub')[0].removeChild(document.getElementById('s'));
					};
				}
			}else{
				creatSignButton("查看签到信息",function() {
					window.location.href=rootURL+"/index.php/Index/Index/view.html";
				});
				subButton.style.display="none";
				osubButton.style.display="none";//取消原签到按钮的显示
			};
	});
}
//出弹框后返回的函数
function goBack (div,button) {
	div.style.display="none";
	var over=document.getElementById('over')
	document.getElementsByTagName('body')[0].removeChild(over);

}
//选择学校之后加载出姓名
function loadName (data) {
	var data=JSON.parse(data);
	var nameUl=document.getElementById('na').getElementsByTagName('ul')[0];
	nameUl.innerHTML=" ";
	if (data) {
		for (var i = 0; i < data.length; i++) {
		var lis=document.createElement('li');
		var time=data[i].time;
		var sign=document.createElement('span');
		sign.style.color="#d5d5d5";
		sign.style.fontSize="0.9em";
		sign.style.position="relative";
		sign.style.left="43%";
			if (time>0) {
			sign.innerHTML="已签到";
			};
		lis.innerHTML=data[i].username;
		lis.appendChild(sign);
		nameUl.appendChild(lis);
		};
	};
	//加载以后执行点击事件
	clickName();
}

//搜索学校功能
function search (){
	var searchButton=document.getElementById('search');
	searchButton.oninput=function (event) {
		
		ajax( rootURL + "/index.php/Index/Index/search","word="+this.value,loadResult);
	}
}
//输入搜索关键词后加载出相关的学校
function loadResult (data) {
	var data=JSON.parse(data);
	var schoolUl=document.getElementById('sc').getElementsByTagName('ul')[0];
	schoolUl.innerHTML="";
	if (data) {
		
		for (var i = 0; i < data.length; i++) {
			var lis=document.createElement('li');
			lis.innerHTML=data[i].school;
			schoolUl.appendChild(lis)
			}
		}
		//未找到的话显示字符
	else{
		var erro=document.createElement('li');
		erro.innerHTML="未找到相关内容，请重新输入";
		erro.style.fontSize="0.8em";
		erro.style.color="#df2428";
		schoolUl.appendChild(erro);
	};
	chooseLi (document.getElementById('sc'),document.getElementById('school'))
}

//点击提交，若是代签则发送参数为0，不是则发送1
function clickSub () {
	document.getElementById('sub').onclick=function(){
		subFun("1");
	};
	document.getElementById('osub').onclick=function(){
		subFun("0");
	}
}

//提交表单的函数
function subFun (self) {
	var school=document.getElementById('school').getElementsByTagName('input')[0].value;
	var name=document.getElementById('name').getElementsByTagName('input')[0].value;
	var xhr= new XMLHttpRequest();
	ajax(rootURL+"/index.php/Index/Index/view_post","school="+school+"&joiner="+name+"&self="+self,function () {
	var over=document.createElement('div');
	over.style.cssText = 'width:100%;height:100%;background:#333;opacity:0.6;z-index:2;position:fixed;top:0;left:0;';
	document.getElementsByTagName('body')[0].appendChild(over);	
	var sginDiv=document.getElementsByClassName('success')[0];
	sginDiv.style.display="block";
	document.getElementById('sub').style.display="none";
	document.getElementById('osub').style.display="none";
	creatSignButton("您已成功签到");
	sginDiv.getElementsByTagName('button')[0].onclick=function () {
		sginDiv.style.display="none";
		document.getElementsByTagName('body')[0].removeChild(over);
		}
	});
}

//页面加载后执行函数
addLoadEvent(clickSchool);
addLoadEvent(clickSub);
addLoadEvent(search);