ButtonHelper = {
	addPlayPause: function(video){
		var playButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("ll");       // Create a text node
        playButton.appendChild(t);                
        playButton.class = "btn btn-default";
        playButton.id = "play-pause"+ Template.parentData(0)._id;
        playButton.addEventListener("click", function() {
          if (video.paused == true) {
            // Play the video
            video.play();

            // Update the button text to 'Pause'
            playButton.innerHTML = "ll";
          } else {
            // Pause the video
            video.pause();

            // Update the button text to 'Play'
            playButton.innerHTML = "►";
          }
        });
       	return playButton;


	},
	addRewindButton: function(video){
		var rewindButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("<<");       // Create a text node
        rewindButton.appendChild(t);                
        rewindButton.class = "btn btn-default";
        rewindButton.id = "rewind"+ Template.parentData(0)._id;
		var rwinterval;
		rewindButton.addEventListener('mousedown',function(e) {
			rwinterval = setInterval(function() {
				if(video.currentTime == 0){
					clearInterval(rwinterval);
					video.pause();
				}
				else{
					video.currentTime += -1.2;
				}
			},360);
		});
		rewindButton.addEventListener('mouseup',function(e) {
			clearInterval(rwinterval);
		});
		rewindButton.addEventListener('mouseout',function(e) {
			clearInterval(rwinterval);
		});
		return rewindButton;
	},
	addSkipBackButton: function(video){
		var skipBackButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("|<");       // Create a text node
        skipBackButton.appendChild(t);                
        skipBackButton.class = "btn btn-default";
        skipBackButton.id = "skipBack"+ Template.parentData(0)._id;
        skipBackButton.addEventListener("click", function() {
          video.currentTime -= .25;
        });
        return skipBackButton;
	},
	addSkipForwardButton: function(video){
		var skipForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">|");       // Create a text node
        skipForwardButton.appendChild(t);                
        skipForwardButton.class = "btn btn-default";
        skipForwardButton.id = "skipForward"+ Template.parentData(0)._id;
        skipForwardButton.addEventListener("click", function() {
          video.currentTime += .25;
        });

        return skipForwardButton;
	},
	addFastForwardButton: function(video){
		var fastForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">>");       // Create a text node
        fastForwardButton.appendChild(t);                
        fastForwardButton.class = "btn btn-default";
        fastForwardButton.id = "fastForward"+ Template.parentData(0)._id;
		var ffinterval;
		fastForwardButton.addEventListener('mousedown',function(e) {
			ffinterval = setInterval(function() {
				video.currentTime += 1.2;
			},360);
		});
		fastForwardButton.addEventListener('mouseup',function(e) {
			clearInterval(ffinterval);
		});
		fastForwardButton.addEventListener('mouseout',function(e) {
			clearInterval(ffinterval);
		});

    	return fastForwardButton;
	},
	addFullScreenButton: function(video){
		var fullScreenButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("Full Screen");       // Create a text node
        fullScreenButton.appendChild(t);                
        fullScreenButton.class = "btn btn-default";
        fullScreenButton.id = "fullScreen"+ Template.parentData(0)._id;
        fullScreenButton.addEventListener("click", function() {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
          }
        });

        return fullScreenButton;
	},
	addSeekBar:function(video){
		var seekBar = document.createElement("INPUT");
        seekBar.style.width = "300px";
        seekBar.id = "seekbar"+Template.parentData(0)._id;
        seekBar.type = "range";
        seekBar.value =0;
        seekBar.style.display="inline-block";
        // $("#seekbar"+Template.parentData(0)._id).css({"max-width": "360px"});
        // Event listener for the seek bar
        seekBar.addEventListener("change", function() {
          // Calculate the new time
          var time = video.duration * (seekBar.value / 100);

          // Update the video time
          video.currentTime = time;
        });

        
        // Update the seek bar as the video plays
        video.addEventListener("timeupdate", function() {
          // Calculate the slider value
          var value = (100 / video.duration) * video.currentTime;

          // Update the slider value
          seekBar.value = value;
        });

        // Pause the video when the seek handle is being dragged
        seekBar.addEventListener("mousedown", function() {
          video.pause();
        });

        // Play the video when the seek handle is dropped
        seekBar.addEventListener("mouseup", function() {
          video.play();
        });

        return seekBar;
	},
	addVolumeBar: function(video){
		var volumeBar = document.createElement("INPUT");
        volumeBar.style.width = "60px";
        volumeBar.id = "volumeBar"+Template.parentData(0)._id;
        volumeBar.type = "range";
        volumeBar.min = 0;
        volumeBar.value = 1;
        volumeBar.max =1;
        volumeBar.step = 0.1;
        volumeBar.style.display = "inline-block";
        // $("#volumeBar"+Template.parentData(0)._id).css({"max-width": "60px"});
        // Event listener for the volume bar
        volumeBar.addEventListener("change", function() {
          // Update the video volume
          video.volume = volumeBar.value;
        });
        return volumeBar;
	},
	addButtonHover: function(id){
		 $("#playerButtons"+id).css({
          "position": "absolute",
          "bottom": 0,
          "left": 0,
          "right": 0,
          "padding": "5px",
          "opacity": 0,
          "-webkit-transition": "opacity .3s",
          "-moz-transition": "opacity .3s",
          "-o-transition": "opacity .3s",
          "-ms-transition": "opacity .3s",
          "transition": "opacity .3s",
          "background-image": "linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-o-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-moz-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-webkit-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-ms-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-webkit-gradient(linear,left bottom, left top,color-stop(0.13, rgb(3,113,168)),color-stop(1, rgb(0,136,204)))"
        });
	},
	addTitleHover: function(id){
		$("#videoHeader"+id).css({
          "position": "absolute",
          "top": 0,
          "left": 0,
          "right": 0,
          "padding": "5px",
          "opacity": 0,
          "-webkit-transition": "opacity .3s",
          "-moz-transition": "opacity .3s",
          "-o-transition": "opacity .3s",
          "-ms-transition": "opacity .3s",
          "transition": "opacity .3s",
          "background-image": "linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-o-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-moz-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-webkit-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-ms-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-webkit-gradient(linear,left bottom, left top,color-stop(0.13, rgb(3,113,168)),color-stop(1, rgb(0,136,204)))"
        });
	}
}
VideoPlayBackHelper = {
	createVideo: function(video,hostName){
		var context = new Dash.di.DashContext();
   	   	var player = new MediaPlayer(context);
   		player.startup();
	   	player.attachView(video);
	   	player.attachSource(hostName);
	}, 
	videoStartup: function(video){
		//Used as a sleep for the video starting up
		//the playback rate is originally set at 0, which is paused.
		window.setTimeout(function(){
			video.playbackRate = 1;
			video.play();
		}, 500 );
		
	}
}