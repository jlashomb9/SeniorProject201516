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

TilingHelper = {

  //finds the largest video that hasnt been used yet (marked true in array) under a maximum width (or no max indicated by -1)
  indexOfLargestVideo: function(videoArray, booleanArray, maximum_width, maximum_height) {
	//height vs width to keep track of doesnt matter because all aspect ratios are the same
	var largest_width = 0;
	var indexOfMax = -1;
	for(var i = 0; i < videoArray.length; i ++ ) {
		if (booleanArray[i]) {
		console.log("booleanarray");
			var currentWidth = parseInt($(videoArray[i]).css("width"), 10);
			var currentHeight = parseInt($(videoArray[i]).css("height"), 10);
			if(maximum_width == -1 && currentWidth > largest_width) {
			console.log("first");
				if(maximum_height == -1 || maximum_height > currentHeight) {
					largest_width = currentWidth;
					indexOfMax = i;
					console.log("made it " + indexOfMax);
				}
				
			}
			else if(maximum_width > currentWidth && currentWidth > largest_width) {
			console.log("second");
				if(maximum_height == -1 || maximum_height > currentHeight) {
					largest_width = currentWidth;
					indexOfMax = i;
					console.log("made it " + indexOfMax);
				}
			}
			
		}
	}
	return indexOfMax;
  },
  //stores parent data for dashplayer
  addingParentData: function(parentData,url){  
    var player = Dashplayers.findOne({_id: parentData});
    Dashplayers.update({_id: parentData},
    {
      host: url,
      parentData: parentData
    });
    console.log(player);
  }

}

CanvasHelper = {
	createCanvas: function(){
		var canvas = document.createElement('canvas');
      	canvas.width = 640;
      	canvas.height = 365;
      	return canvas;
	},
	downloadCanvas: function(link, dataURL, filename){
		link.href = dataURL;
		link.download = filename;
		link.click();
		console.log(link);
	},
	getDataURL: function(video){
		var canvas = CanvasHelper.createCanvas();
	     var ctx = canvas.getContext('2d');
	      var w = video.width;
	      var h = video.height;

	      ctx.drawImage(video, 0, 0, w,h);
	      var idata = ctx.getImageData(0,0,w,h);
	      var data = idata.data;
	       //Background
	      ctx.fillStyle = '#ffffaa';
	      ctx.fillRect(0, 0, w, h);
	      //Box
	      ctx.strokeStyle = '#000000';
	      // w = w - 10;
	      // h = h - 10;
	      ctx.strokeRect(5,  5, w, h);
	      // Text
	      
	     
	      idata.data = data;

	      ctx.putImageData(idata,0,0);

	      ctx.fillStyle = "#000000";
	      ctx.fillText  ("Duration:" + video.duration,  10 ,280);
	      ctx.fillText  ("Current time:" + video.currentTime,  260 ,280);

	      return canvas.toDataURL();
	}
}
//Helper class for rendering the custom buttons on the videos
ButtonHelper = {
	//adds the play pause functionality
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
	//allows for the rewwind functionality
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
					//here is where you can increase the speed of the the rewind
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
	//Allows us to forward back a frame.
	addSkipBackButton: function(video){
		var skipBackButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("|<");       // Create a text node
        skipBackButton.appendChild(t);                
        skipBackButton.class = "btn btn-default";
        skipBackButton.id = "skipBack"+ Template.parentData(0)._id;
        skipBackButton.addEventListener("click", function() {
        	//how many frames are skipped through are based on here
          video.currentTime -= .25;
        });
        return skipBackButton;
	},
	//Allows us to skip back a frame.
	addSkipForwardButton: function(video){
		var skipForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">|");       // Create a text node
        skipForwardButton.appendChild(t);                
        skipForwardButton.class = "btn btn-default";
        skipForwardButton.id = "skipForward"+ Template.parentData(0)._id;
        skipForwardButton.addEventListener("click", function() {
        	//how many frames are skipped through are based on here
          video.currentTime += .25;
        });

        return skipForwardButton;
	},
	//Allows us to fastforward
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
	//Adds the seekbar in the video
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
	//CSS the mouse hovering over the buttons list at the bottom of the video
	addButtonHover: function(id){
		 $("#playerButtons"+id).css({
      "position": "absolute",
      "z-index": 1,
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
	//CSS for the mouse hovering over the title at the top of the video
	addTitleHover: function(id){
		$("#videoHeader"+id).css({
	      "position": "absolute",
	      "z-index": 1,
	      "top": 0,
	      "left": 0,
	      "right": 0,
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
	addResizeable: function(id){
		 $("#resizer"+id).css({
	      "position": "absolute",
	      "z-index": 2,
	      "bottom": 0,
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
	addPlayerButtonCSS: function(id, jqueryVideo){
		
        var jqueryPlayerButtons = $("#playerButtons"+id);
        jqueryVideo.hover(
          function() {
            jqueryPlayerButtons.css({"opacity": .9});
          },function() {
            jqueryPlayerButtons.css({"opacity": 0});
          });

	},
	addVideoHeaderCSS: function(id, jqueryVideo){
		var jqueryVideoHeader = $("#videoHeader"+Template.parentData(0)._id);
        jqueryVideo.hover(
          function() {
            jqueryVideoHeader.css({"opacity": .9});
          },function() {
            jqueryVideoHeader.css({"opacity": 0});
          });

	},
	addResizingCSS: function(id,jqueryVideo){
		var jqueryresizer = $("#resizer"+Template.parentData(0)._id);
        jqueryresizer.hover(
          function() {
            jqueryresizer.css({"opacity": .9});
          },function() {
            jqueryresizer.css({"opacity": 0});
          });
	},
	setUpVideo: function(id){
		var span_id = "span"+id;
  		var video_id = "videoPlayer"+id;
    	var url = document.getElementById(span_id).innerText;  //$( span_id + ' span').text();
   		var download_id = "download"+id;
   		var video = document.getElementById(video_id);
    
		//play-pause
        var playButton = ButtonHelper.addPlayPause(video);
        //rewind
        var rewindButton = ButtonHelper.addRewindButton(video);
        //skip backwards
        var skipBackButton = ButtonHelper.addSkipBackButton(video);
        //skip forward
        var skipForwardButton = ButtonHelper.addSkipForwardButton(video);
        //fast forward
        var fastForwardButton = ButtonHelper.addFastForwardButton(video);
        //full screen
        var fullScreenButton = ButtonHelper.addFullScreenButton(video);
        //seekbar
        var seekBar = ButtonHelper.addSeekBar(video);
        //volume bar
        var volumeBar = ButtonHelper.addVolumeBar(video);

        document.getElementById(download_id).addEventListener('click', function() {
            var dataURL = CanvasHelper.getDataURL(video);
            CanvasHelper.downloadCanvas(this, dataURL, "image.png");
        }, false);       

        var buttonList = document.getElementById("playerButtons"+id);
        //Appending all buttons
        buttonList.appendChild(skipBackButton);
        buttonList.appendChild(rewindButton);
        buttonList.appendChild(playButton);
        buttonList.appendChild(fastForwardButton);
        buttonList.appendChild(skipForwardButton);
        buttonList.appendChild(seekBar);
        buttonList.appendChild(fullScreenButton);
        buttonList.appendChild(volumeBar);
        
	     	//adding something visible to the resizer
    		var resizeId = "resizer"+id;
    		var resizerBox = document.getElementById(resizeId);
            
        ButtonHelper.addButtonHover(id);
    		ButtonHelper.addTitleHover(id);
        ButtonHelper.addResizeable(id);

        var jqueryVideo = $("#draggable"+id);
        ButtonHelper.addPlayerButtonCSS(id, jqueryVideo);
        ButtonHelper.addVideoHeaderCSS(id, jqueryVideo);
        ButtonHelper.addResizingCSS(id,jqueryVideo);
        

        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);
	}
}