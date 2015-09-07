define(function(require) {

	var Adapt = require('coreJS/adapt');

});

var theme = "EU";
var interval;
var save_enabled = false;
var need_email = false;
$(document).ready(function() {
	setTimeout(function() {updateLanguageSwitcher(); },1000);
	setTimeout(function() {$(".dropdown dt a").show();$('#country-select').show();},2000);
	interval = setInterval(function() { checkState(); },5000);
	setTimeout(function() {addListeners();},1000);	
});
$(document).keypress(function(e) {
        if (e.which == 115) {
                $(".save-section-outer").fadeIn();
        	$("#country-select").removeClass('normal');
        	if (need_email) {
			$("#country-select").addClass('save-shown');
		} else {
			$("#country-select").addClass('status-shown');
		}
		save_enabled = true;
	}
});

var moduleId = "";
$.getJSON("course/config.json",function(data) {
        moduleId = data._moduleId;
});

function addListeners() {
	$('.save-section-outer').click(function() {
		$('#cloud-status').slideToggle();
	});
}

function emailSave(email) {
	localStorage.setItem("email",email);
	$('#save-section').fadeOut( function() {
		$('#save-section').html("");
		checkState();
		interval = setInterval(function() { checkState(); },5000);
        	$("#country-select").removeClass('save-shown');
        	$("#country-select").addClass('status-shown');
	});
}

function showSave() {
	var email=prompt("Please enter your email...");
	emailSave(email);
}

function checkState() {
	var sessionEmail = localStorage.getItem("email");
	var sessionID = localStorage.getItem("_id");
	var lastSave = localStorage.getItem(moduleId + "_lastSave");

	if (!sessionEmail && sessionID) {
		$('#save-section').html("<button onClick='showSave();' class='slbutton' id='saveSession'>Save Progress</button>");
		$('#save-section').fadeIn();
		need_email = true;
        	if (save_enabled) {
			$("#country-select").removeClass('status-shown');
        		$("#country-select").addClass('save-shown');
		}
		clearInterval(interval);
	} else if (sessionID) {
		if (!lastSave) { lastSave = "Unknown"; }
		$('#save-status').html("Module ID: " + moduleId + "<br/>Session ID: " + sessionID + "<br/>Last Save: " + lastSave);
		$('#save-section').addClass('saving');
    		var ss = document.getElementById('cloud-status-text');
		var toClass = "cloud_saving";
		$(ss).html(config["_phrases"][toClass]);
		var ssi = document.getElementById('cloud-status-img');
		$(ssi).attr('src','adapt/css/assets/' + toClass + '.gif');
		$('#save-section').fadeIn();
	} else {
    		var sl = document.getElementById('save-section');
		var ss = document.getElementById('cloud-status-text');
		$(sl).addClass('saving');
		var toClass = "cloud_failed";
		$(sl).css('background-image','url(adapt/css/assets/' + toClass + '.gif)');
		$(ss).html(config["_phrases"][toClass]);
		var ssi = document.getElementById('cloud-status-img');
		$(ssi).attr('src','adapt/css/assets/' + toClass + '.gif');
		$('#save-section').fadeIn();
	}	
}

function updateLanguageSwitcher() {
	createDropDown();

        var $dropTrigger = $(".dropdown dt a");
        var $languageList = $(".dropdown dd ul");

	$(".dropdown dt a").click(function() {
		$dropTrigger.addClass("active");
		$languageList.slideDown(200);
	});
        // open and close list when button is clicked
        $dropTrigger.toggle(function() {
                $languageList.slideDown(200);
                $dropTrigger.addClass("active");
        }, function() {
                $languageList.slideUp(200);
                $(this).removeAttr("class");
        });

        // close list when anywhere else on the screen is clicked
        $(document).bind('click', function(e) {
                var $clicked = $(e.target);
                if (! $clicked.parents().hasClass("dropdown"))
                       $languageList.slideUp(200);
                       $dropTrigger.removeAttr("class");
       });

        // when a language is clicked, make the selection and then hide the list
        $(".dropdown dd ul li a").click(function() {
                var clickedValue = $(this).parent().attr("class");
                var clickedTitle = $(this).find("em").html();
                $("#target dt").removeClass().addClass(clickedValue);
                $("#target dt em").html(clickedTitle);
                $languageList.hide();
                $dropTrigger.removeAttr("class");
		if (lang != clickedValue) {
			current = window.location.href;
			newLocation = current.replace("/" + lang + "/","/" + clickedValue + "/");
			window.location.href = newLocation;
		}
        });
}

function createDropDown(){	
	var $form = $("div#country-select form");
	$form.hide();
	var source = $("#country-options");
	source.removeAttr("autocomplete");
	var selected = source.find('[title="'+lang+'"]');
	var options = $("option", source);
	$("#country-select").append('<dl id="target" class="dropdown"></dl>')
		$("#target").append('<dt class="' + selected.val() + '"><a href="#" style="display: inline;"><span class="flag"></span><em>' + selected.text() + '</em></a></dt>')
		$("#target").append('<dd><ul></ul></dd>')
		options.each(function(){
				$("#target dd ul").append('<li class="' + $(this).val() + '"><a href="' + $(this).attr("title") + '"><span class="flag"></span><em>' + $(this).text() + '</em></a></li>');
				});
}
