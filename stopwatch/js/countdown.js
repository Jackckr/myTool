var digitSegments = [
	[1, 2, 3, 4, 5, 6],
	[2, 3],
	[1, 2, 7, 5, 4],
	[1, 2, 7, 3, 4],
	[6, 7, 2, 3],
	[1, 6, 7, 3, 4],
	[1, 6, 5, 4, 3, 7],
	[1, 2, 3],
	[1, 2, 3, 4, 5, 6, 7],
	[1, 2, 7, 3, 6, 4]

]

document.addEventListener('DOMContentLoaded', function() {
	_minutes = document.querySelectorAll('.minutes');
	_seconds = document.querySelectorAll('.seconds');
	_stop = true;
	timer = null;
	hide = false;
	hide_second = true;
	$(document).keydown(function(event){
		var e = event || window.event;
		var k = e.keyCode || e.which;
		switch(k) {
		case 32:
			clickStop();
			break;
		case 72:
			if (hide) {
				showSelector();
			} else {
				hideSelector();
			}
			break;
		case 83:
			clickStart();
			if (!_stop) {
				hideSelector();	
			}
			break;
		case 77:
			hideOrShowSecond();
		default:
			showSelector();
		}
	})
	reset();
});

var hideOrShowSecond = function() {
	if (hide_second) {
		hide_second = false;
		$('.should_hide').show();	
	} else {
		hide_second = true;
		$('.should_hide').hide();
	}
	
}

var showSelector = function() {
	hide = false;
	$("#time_selector").show();
	$("#warning_selector1").show();
	$("#warning_selector2").show();
	$("#boom").show();
}

var hideSelector = function() {
	hide = true;
	$("#time_selector").hide();
	$("#warning_selector1").hide();
	$("#warning_selector2").hide();
	$("#boom").hide();
}

var clickStart = function() {
	_stop = false;
	$("#stop_")[0].innerHTML = "暂停"
	var m_ = $("#_minute").val();
	var s_ = $("#_second").val();
	if (typeof(s_) == "undefined") {
		s_ = 0;
	}
	seconds_ = m_ * 60 + s_ * 1;
	var wm_ = $("#_warning_minute1").val();
	var ws_ = $("#_warning_second1").val();
	if (typeof(ws_) == "undefined") {
		ws_ = 0;
	}
	warning_seconds_1 = wm_ * 60 + ws_ * 1;
	wm_ = $("#_warning_minute2").val();
	ws_ = $("#_warning_second2").val();
	if (typeof(ws_) == "undefined") {
		ws_ = 0;
	}
	warning_seconds_2 = wm_ * 60 + ws_ * 1;
	if (warning_seconds_1 == 0) {
		warning_seconds_1 = warning_seconds_2;
	}
	if (warning_seconds_1 < warning_seconds_2) {
		alert("提醒时间1必须大于提醒时间2");
		_stop = true;
		return;
	}
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
	timer = setInterval(run, 1000);
}

var clickStop = function() {
	if (!_stop) {
		_stop = true;
		clearInterval(timer);
		timer = null;
		$("#stop_")[0].innerHTML = "继续"
		showSelector();
	} else {
		_stop = false;
		if (timer != null) {
			clearInterval(timer);
			timer = null;
		}
		timer = setInterval(run, 1000);
		$("#stop_")[0].innerHTML = "暂停"
		hideSelector();
	}
}

var clickReset = function() {
	_stop = true;
	$("#stop_")[0].innerHTML = "暂停"
	$("#_minute").val("00");
	$("#_second").val("00");
	$("#_warning_minute1").val("00")
	$("#_warning_second1").val("00")
	$("#_warning_minute2").val("00")
	$("#_warning_second2").val("00")
	seconds_ = undefined;
	clearInterval(timer)
	reset();
}

var reset = function() {
	setNumber(_minutes[0], 0, 1);
	setNumber(_minutes[1], 0, 1);
	setNumber(_seconds[0], 0, 1);
	setNumber(_seconds[1], 0, 1);
	$(".segment").css("background","#00FF00");
	$(".separator").css("background","#00FF00");
}

var run = function() {
		if (seconds_ >= 0) {
			minutes = Math.floor(seconds_ / 60);
			seconds = Math.floor(seconds_ % 60);
			minutes < 10 ? minutes = "0" + minutes : minutes = "" + minutes;
			seconds < 10 ? seconds = "0" + seconds : seconds = "" + seconds;
			setNumber(_minutes[0], Math.floor(minutes / 10), 1);
			setNumber(_minutes[1], minutes % 10, 1);
			setNumber(_seconds[0], Math.floor(seconds / 10), 1);
			setNumber(_seconds[1], seconds % 10, 1);


			if (seconds_ <= warning_seconds_1 || seconds_ == 0){
				//先判断warning_seconds_2，这样当1和2时间一样时，就只有2有效
				if (seconds_ == warning_seconds_2) {
				    $("#remind2")[0].play();	
				} else if (seconds_ == warning_seconds_1) {
			        $("#remind1")[0].play();
				} else if (seconds_ == 0) {
					$("#end")[0].play();
				}
				// 提示1变黄色，2变红色
				if (seconds_ <= warning_seconds_1 && seconds_ > warning_seconds_2) {
					$(".segment").css("background","yellow");
					$(".separator").css("background","yellow");
				} else {
					$(".segment").css("background","red");
					$(".separator").css("background","red");	
				}
			}else{
				$(".segment").css("background","#00FF00");
				$(".separator").css("background","#00FF00");
			}
			--seconds_;
		} else {
			if (typeof(timer) != 'undefined') {
			clearInterval(timer);
			}
		}
}

var setNumber = function(digit, number, on) {
	var segments = digit.querySelectorAll('.segment');
	var current = parseInt(digit.getAttribute('data-value'));

	if (!isNaN(current) && current != number) {
		digitSegments[current].forEach(function(digitSegment, index) {
			setTimeout(function() {
				segments[digitSegment - 1].classList.remove('on');
			}, index * 45)
		});
	}

	if (isNaN(current) || current != number) {
		setTimeout(function() {
			digitSegments[number].forEach(function(digitSegment, index) {
				setTimeout(function() {
					segments[digitSegment - 1].classList.add('on');
				}, index * 45)
			});
		}, 250);
		digit.setAttribute('data-value', number);
	}
}
