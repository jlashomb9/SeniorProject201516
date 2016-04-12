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