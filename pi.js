$(document).ready(function() {
	
	var groupBy = 10;
	var minDecimalPlaces = 2;
	var piDecimalPlaces;
	$.ajax({
		url: "pi_digits.txt",
		async: false
	}).done(function(data) {
		piDecimalPlaces = data;
	});
	var maxDecimalPlaces = piDecimalPlaces.length;
	var failAudio;
	var decimalPlaces;
	var incorrectDigit;
	
	if ((new Audio()).canPlayType("audio/ogg; codecs=vorbis")) {
		failAudio = new Audio("fail_buzzer.ogg");
	} else {
		failAudio = new Audio("fail_buzzer.mp3");
	}
	
	var updateValue = function() {
		$("#value").empty();
		for (var i = 0; i < decimalPlaces; i += groupBy) {
			var text = piDecimalPlaces.slice(i, Math.min(i + groupBy, decimalPlaces));
			$("#value").append("<span class=\"group\">" + text + "</span>");
		}
		if (incorrectDigit != null) {
			failAudio.currentTime = 0;
			failAudio.play();
			var text = "<span class=\"incorrect\">" + incorrectDigit + "</span>";
			if (decimalPlaces % groupBy == 0) {
				$("#value").append("<span class=\"group\">" + text + "</span>");
			} else {
				$("#value :last-child").append(text);
			}
			incorrectDigit = null;
		}
		$("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 400);
	}
	var updateCounter = function() {
		$("#decimalPlaces").val(decimalPlaces);
	}
	var updateValueAndCounter = function() {
		updateValue();
		updateCounter();
	};
	
	var resetDecimalPlaces = function() {
		if (decimalPlaces != minDecimalPlaces) {
			decimalPlaces = minDecimalPlaces;
			updateValueAndCounter();
		} else {
			updateValue();
		}
	};
	var nearestDecimalPlacesNoUpdate = function() {
		var p = $("#decimalPlaces").val();
		decimalPlaces = Math.max(minDecimalPlaces, Math.min(maxDecimalPlaces, p));
	}
	var nearestDecimalPlacesUpdateOnlyValue = function() {
		nearestDecimalPlacesNoUpdate();
		updateValue();
	}
	var nearestDecimalPlaces = function() {
		nearestDecimalPlacesNoUpdate();
		updateValueAndCounter();
	}
	var incrementDecimalPlaces = function() {
		if (decimalPlaces < maxDecimalPlaces) {
			decimalPlaces++;
			updateValueAndCounter();
		}
	}
	var decrementDecimalPlaces = function() {
		if (decimalPlaces > minDecimalPlaces) {
			decimalPlaces--;
			updateValueAndCounter();
		}
	}
	var parseNewDigit = function(digit) {
		if (digit == piDecimalPlaces[decimalPlaces]) {
			incrementDecimalPlaces();
		} else {
			incorrectDigit = digit;
			updateValue();
		}
	}
	
	var forceInputFocus = function() {
		$("#input")[0].focus();
	}
	
	resetDecimalPlaces();
	forceInputFocus();
	
	$(window).click(function(e) {
		if ($(e.target).is("#decimalPlaces")) {
			return;
		}
		forceInputFocus();
		e.preventDefault();
	});
	
	$("#input").keypress(function(e) {
		if (e.which >= 48 && e.which <= 57) {
			parseNewDigit(String.fromCharCode(e.which));
		} else if (e.which == 72 || e.which == 104) {
			incrementDecimalPlaces();
		} else if (e.which == 8) {
			decrementDecimalPlaces();
		} else if (e.which == 82 || e.which == 114) {
			resetDecimalPlaces();
		} else {
			return;
		}
		e.preventDefault();
	});
	
	$("#decimalPlaces").on("input", nearestDecimalPlacesUpdateOnlyValue);
	$("#decimalPlaces").change(nearestDecimalPlaces);
	$("#hint").click(incrementDecimalPlaces);
	$("#delete").click(decrementDecimalPlaces);
	$("#reset").click(resetDecimalPlaces);
	
});